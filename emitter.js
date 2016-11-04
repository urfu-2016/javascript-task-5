'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        eventsArray: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!this.eventsArray.hasOwnProperty(event)) {
                this.eventsArray[event] = [];
            }

            // Дефолтное значения для количества вызовов emit = Infinity, т.е. сколько угодно раз
            // Дефолтная частота вызовов emit = 1, т.е. вызывает каждое событие
            // emitCallsCount - сколько раз делали попытку вызова handler у этого объекта
            //      (он мог срабатывать не всегда из-за through)
            this.eventsArray[event].push({
                context: context,
                handler: handler,
                emitCallsCount: 0,
                timesToEmit: Infinity,
                frequency: 1
            });


            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {

            Object
                .keys(this.eventsArray)
                // Получаем список событий, от которых надо отписаться (включая дочерние)
                .filter(function (signedEvent) {
                    // Либо это в точности переданное в функцию событие, либо его дочернее
                    return signedEvent.indexOf(event) === 0 &&
                        (event === signedEvent || signedEvent[event.length] === '.');
                })
                .forEach(function (eventToUnsign) {
                    this.eventsArray[eventToUnsign]
                        .forEach(function (signedContext, index) {
                            if (signedContext.context === context) {
                                this.eventsArray[eventToUnsign].splice(index, 1);
                            }
                        }, this);
                }, this);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var splittedEvents = event.split('.');
            var splittedEventsCount = splittedEvents.length;

            splittedEvents
                // Получаем список событий (исходное + его родители и т.д.)
                .map(function (partOfEvent, index) {
                    return splittedEvents
                        .slice(0, splittedEventsCount - index)
                        .join('.');
                })
                // Вызываем каждое событие
                .forEach(function (splittedEvent) {
                    if (this.eventsArray.hasOwnProperty(splittedEvent)) {
                        this.eventsArray[splittedEvent]
                            .forEach(tryToEmit);
                    }
                }, this);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            this.on(event, context, handler);
            if (times > 0) {
                this.eventsArray[event][this.eventsArray[event].length - 1].timesToEmit = times;
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            this.on(event, context, handler);
            if (frequency > 0) {
                var lastEventIndex = this.eventsArray[event].length;
                this.eventsArray[event][lastEventIndex - 1].frequency = frequency;
            }

            return this;
        }
    };
}

function tryToEmit(signer) {
    if (signer.emitCallsCount < signer.timesToEmit) {
        var frequency = signer.frequency;
        var emitCallsCount = signer.emitCallsCount;
        signer.emitCallsCount++;

        if (emitCallsCount % frequency === 0 || emitCallsCount === 0) {
            signer.handler.call(signer.context);
        }
    }
}
