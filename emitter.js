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
    var events = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            events[event] = events[event] || [];
            events[event].push({
                context: context,
                handler: handler
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} eventOff
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (eventOff, context) {
            for (var event in events) {
                if (!events.hasOwnProperty(event)) {
                    continue;
                }
                if (event === eventOff || event.split('.')[0] === eventOff) {
                    events[event] = events[event].filter(function (listener) {
                        return listener.context !== context;
                    });
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            var subEvents = event.split('.');
            var end = subEvents.length;
            while (end) {
                var subEvent = subEvents.slice(0, end).join('.');
                if (events[subEvent]) {
                    events[subEvent].forEach(function (listener) {
                        listener.handler.call(listener.context);
                    });
                }
                end--;
            }

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
