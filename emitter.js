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
            var times = arguments[3] || Infinity;
            var frequency = arguments[4] || 1;
            events[event].push({
                context: context,
                handler: handler,
                times: times,
                frequency: frequency,
                eventNumber: 0
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
                        if (listener.eventNumber < listener.times &&
                            listener.eventNumber % listener.frequency === 0) {
                            listener.handler.call(listener.context);
                        }
                        listener.eventNumber++;
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
         * @returns {Object} this
         */
        several: function (event, context, handler, times) {
            times = (times > 0) ? times : undefined;

            return this.on(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} this
         */
        through: function (event, context, handler, frequency) {
            frequency = (frequency > 0) ? frequency : undefined;

            return this.on(event, context, handler, undefined, frequency);
        }
    };
}
