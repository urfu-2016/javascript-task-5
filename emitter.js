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

        listeners: [],
        getEventsList: function (event) {
            var events = event.split('.');
            events = events.map(function (value, index) {
                return events.slice(0, events.length - index).join('.');
            });

            return events;
        },

        getStartEvent: function (event, lengthEvent) {
            return event.split('.').slice(0, lengthEvent).
                        join('.');
        },

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {

            this.listeners.push({ event: event, context: context, handler: handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            var _this = this;
            var lengthEvent = event.split('.').length;
            this.listeners = this.listeners.filter(function (listener) {
                return ((_this.getStartEvent(listener.event, lengthEvent) !== event) &&
                        (listener.context !== context));
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            var _this = this;
            var events = this.getEventsList(event);
            events.forEach(function (currentEvent) {
                _this.listeners.forEach(function (listener) {
                    if (listener.event === currentEvent) {
                        listener.handler.call(listener.context);
                    }
                });
            });


            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}
