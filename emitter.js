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
                times: Infinity,
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
                    var eventContexts = this.eventsArray[eventToUnsign];
                    eventContexts
                        .forEach(function (signedContext, index) {
                            if (signedContext.context === context) {
                                delete eventContexts[index];
                            }
                        }, [], this);
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
                .forEach(function (currentEvent) {
                    if (this.eventsArray.hasOwnProperty(currentEvent)) {
                        this.eventsArray[currentEvent]
                            .forEach(function (signedContext) {
                                if (signedContext.emitCallsCount < signedContext.times) {
                                    tryToCallHandler(signedContext);
                                } else {
                                    this.off(currentEvent, signedContext);
                                }
                            }, this);
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

            return this.callAdditionalFunction(event, times, 'times');
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

            return this.callAdditionalFunction(event, frequency, 'frequency');
        },

        callAdditionalFunction: function (event, fieldValue, fieldName) {
            if (fieldValue > 0) {
                var eventContexts = this.eventsArray[event];
                eventContexts[eventContexts.length - 1][fieldName] = fieldValue;
            }

            return this;
        }
    };
}

function tryToCallHandler(signedContext) {
    var frequency = signedContext.frequency;
    var emitCallsCount = signedContext.emitCallsCount;
    signedContext.emitCallsCount++;

    if (emitCallsCount % frequency === 0 || emitCallsCount === 0) {
        signedContext.handler.call(signedContext.context);
    }
}
