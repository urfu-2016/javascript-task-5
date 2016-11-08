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
    var eventQueues = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            if (!eventQueues.hasOwnProperty(event)) {
                eventQueues[event] = [];
            }
            eventQueues[event].push({
                context: context,
                func: handler.bind(context)
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            Object.keys(eventQueues).forEach(function (queueKey) {
                var regexp = new RegExp('^' + event + '(?:$|\\..*)');
                if (regexp.test(queueKey)) {
                    eventQueues[queueKey] = eventQueues[queueKey].filter(function (handler) {
                        return handler.context !== context;
                    });
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            Object.keys(eventQueues)
                .filter(function (queueKey) {
                    var regexp = new RegExp('^' + queueKey + '(?:$|\\..*)');

                    return regexp.test(event);
                })
                .sort(function (queueKey1, queueKey2) {
                    return queueKey2 > queueKey1;
                })
                .forEach(function (queueKey) {
                    eventQueues[queueKey].forEach(function (handler) {
                        handler.func();
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
         * @returns {Object} this
         */
        several: function (event, context, handler, times) {
            if (times <= 0) {
                return this.on(event, context, handler);
            }
            var i = times;
            var newHandler = function () {
                if (i > 0) {
                    handler.bind(context)();
                    i--;
                }
            };

            return this.on(event, context, newHandler);
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
            if (frequency <= 0) {
                return this.on(event, context, handler);
            }

            var i = 0;
            var newHandler = function () {
                if (i % frequency === 0) {
                    handler.bind(context)();
                    i = 0;
                }
                i++;
            };

            return this.on(event, context, newHandler);
        }
    };
}
