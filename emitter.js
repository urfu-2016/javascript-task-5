'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы оба дополнительных метода
 */
getEmitter.isStar = true;
module.exports = getEmitter;

/**
 * @param {Funcation} handler
 * @returns {Boolean}
 */
function shouldCallHandler(handler) {
    return handler.callsCount < handler.maxCallsCount &&
        !(handler.callsCount % handler.callFrequency);
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var eventHandlers = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            handler.context = context;
            handler.callsCount = 0;
            handler.maxCallsCount = handler.maxCallsCount > 0 ? handler.maxCallsCount : Infinity;
            handler.callFrequency = handler.callFrequency > 0 ? handler.callFrequency : 1;

            if (!eventHandlers[event]) {
                eventHandlers[event] = [];
            }
            eventHandlers[event].push(handler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            Object.keys(eventHandlers)
                .filter(function (key) {
                    var correctEventPattern = '^' + event + '(?:\\..+)?$';

                    return Boolean(key.match(correctEventPattern));
                })
                .forEach(function (key) {
                    eventHandlers[key] = eventHandlers[key]
                        .filter(function (handler) {
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
            for (; event; event = event.substring(0, event.lastIndexOf('.'))) {
                if (eventHandlers[event]) {
                    eventHandlers[event]
                        .filter(shouldCallHandler)
                        .forEach(function (handler) {
                            handler.call(handler.context);
                        });
                    eventHandlers[event]
                        .forEach(function (handler) {
                            handler.callsCount++;
                        });
                }
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} maxCallsCount – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, maxCallsCount) {
            handler.maxCallsCount = maxCallsCount;

            return this.on(event, context, handler);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} callFrequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, callFrequency) {
            handler.callFrequency = callFrequency;

            return this.on(event, context, handler);
        }
    };
}
