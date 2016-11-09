'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

/**
 * @param {string} prefix
 * @param {string} string
 * @returns {Boolean}
 */
function startsWith(prefix, string) {
    return string.indexOf(prefix) !== -1;
}

/**
 * @param {String} event
 * @returns {Boolean}
 */
function isUpperEvent(event) {
    return event.indexOf('.') !== -1;
}

/**
 * @param {String} event
 * @returns {Array}
 */
function getSubEvents(event) {
    var result = [event];

    while (isUpperEvent(event)) {
        event = event.slice(0, event.lastIndexOf('.'));
        result.push(event);
    }

    return result;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {

    return {
        handlers: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!this.handlers[event]) {
                this.handlers[event] = [];
            }

            this.handlers[event].push(
                {
                    context: context,
                    handler: handler.bind(context)
                }
            );

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} eventToOff
         * @param {Object} context
         * @returns {Object}
         */
        off: function (eventToOff, context) {
            var events = Object.keys(this.handlers);
            var handlers = this.handlers;

            events = events.filter(function (event) {
                var eventPrefix = event + '.';

                return event === eventToOff || startsWith(eventPrefix, event);
            });

            events.forEach(function (event) {
                handlers[event] = handlers[event].filter(function (subscriber) {
                    return subscriber.context !== context;
                });
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var handlers = this.handlers;

            var eventsToEmit = getSubEvents(event);
            eventsToEmit.forEach(function (eventToEmit) {
                if (Object.keys(handlers).indexOf(eventToEmit) !== -1) {
                    handlers[eventToEmit].forEach(function (subscriber) {
                        subscriber.handler();
                    });
                }
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
