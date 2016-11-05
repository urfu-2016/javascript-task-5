'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

var EVENTS = {};

function createEvent(context, handler) {
    handler = handler.bind(context);

    return {
        'context': context,
        'function': handler
    };
}

function getHandlers(event) {
    var result = [];
    var namespaces = event.split('.');
    for (var i = namespaces.length; i > 0; i--) {
        result = result.concat(EVENTS[namespaces.slice(0, i).join('.')] || []);
    }

    return result;
}

function getAllSubNamespaces(prefix) {
    return Object.keys(EVENTS).filter(function (event) {
        return event.startsWith(prefix);
    });
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (EVENTS[event] === undefined) {
                EVENTS[event] = [];
            }
            EVENTS[event].push(createEvent(context, handler));

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} eventPrefix
         * @param {Object} context
         * @returns {Object}
         */
        off: function (eventPrefix, context) {
            getAllSubNamespaces(eventPrefix).forEach(function (event) {
                EVENTS[event] = EVENTS[event].filter(function (handler) {
                    return handler.context !== context;
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
            getHandlers(event).forEach(function (handler) {
                handler.function();
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
