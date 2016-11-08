'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

var NAMESPACE_PATTERN = '^{0}(?:$|\\..*)'; // По аналогии с String.Format в C#

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {

    /**
     * @type {{event: Array.<{context: Object, handler: Function}>} events
     */
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
            if (!events.hasOwnProperty(event)) {
                events[event] = [];
            }
            events[event].push({
                context: context,
                handler: handler.bind(context)
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
            var namespacePattern = new RegExp(NAMESPACE_PATTERN.replace('{0}', event));
            Object.keys(events).forEach(function (eventName) {
                if (namespacePattern.test(eventName)) {
                    events[eventName] = events[eventName].filter(function (handler) {
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
            Object.keys(events)
                .filter(function (eventName) {
                    var namespacePattern = new RegExp(NAMESPACE_PATTERN.replace('{0}', eventName));

                    return namespacePattern.test(event);
                })
                .sort(function (eventName1, eventName2) {
                    return eventName2 > eventName1;
                })
                .forEach(function (eventName) {
                    events[eventName].forEach(function (handler) {
                        handler.handler();
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
