'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
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

            this.eventsArray[event].push({
                'context': context,
                'handler': handler
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
            if (this.eventsArray.hasOwnProperty(event)) {
                var signedPeople = this.eventsArray[event];
                signedPeople
                    .forEach(function (signedContext, index) {
                        if (signedContext.context === context) {
                            this.eventsArray[event].splice(index, 1);
                        }
                    }, this);
            }

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
                // Получаем список событий
                .map(function (partOfEvent, index) {
                    var eventsSlice = splittedEvents.slice(0, splittedEventsCount - index);

                    return eventsSlice.join('.');
                })
                // Вызываем каждый событие
                .forEach(function (splittedEvent) {
                    if (this.eventsArray.hasOwnProperty(splittedEvent)) {

                        this.eventsArray[splittedEvent]
                            .forEach(function (contextObject) {
                                contextObject.handler.call(contextObject.context);
                            });
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
            console.info(event, context, handler, times);

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
            console.info(event, context, handler, frequency);

            return this;
        }
    };
}
