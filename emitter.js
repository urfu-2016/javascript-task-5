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
         * @param {Object} options
         * @returns {Object} this
         */
        on: function (event, context, handler, options) {
            events[event] = events[event] || [];
            options = options || {};
            events[event].push({
                context: context,
                handler: handler,
                times: options.times || Infinity,
                frequency: options.frequency || 1,
                emitsCount: 0
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
                if (event === eventOff || event.indexOf(eventOff + '.') === 0) {
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
            var emitsCount = subEvents.length;
            while (emitsCount) {
                var subEvent = subEvents.slice(0, emitsCount).join('.');
                if (events[subEvent]) {
                    events[subEvent].forEach(function (listener) {
                        if (listener.emitsCount < listener.times &&
                            listener.emitsCount % listener.frequency === 0) {
                            listener.handler.call(listener.context);
                        }
                        listener.emitsCount++;
                    });
                }
                emitsCount--;
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

            return this.on(event, context, handler, { times: times });
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

            return this.on(event, context, handler, { frequency: frequency });
        }
    };
}
