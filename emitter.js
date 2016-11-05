'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function shouldCallHandler(handler) {
    return handler.count < handler.times && handler.count % handler.frequency === 0;
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
            handler.boundThis = context;
            handler.count = 0;
            handler.times = handler.times > 0 ? handler.times : Infinity;
            handler.frequency = handler.frequency > 0 ? handler.frequency : 1;

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
                    return key.indexOf(event) === 0 &&
                        [undefined, '.'].indexOf(key[event.length]) !== -1;
                })
                .forEach(function (key) {
                    var handlers = eventHandlers[key];
                    for (var i = 0; i < handlers.length; i++) {
                        if (handlers[i].boundThis === context) {
                            handlers.splice(i, 1);
                        }
                    }
                });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            while (event) {
                if (eventHandlers[event]) {
                    eventHandlers[event]
                        .filter(shouldCallHandler)
                        .forEach(function (handler) {
                            handler.call(handler.boundThis);
                        });
                    eventHandlers[event]
                        .forEach(function (handler) {
                            handler.count++;
                        });
                }
                event = event.substring(0, event.lastIndexOf('.'));
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
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            handler.times = times;

            return this.on(event, context, handler);
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
            handler.frequency = frequency;

            return this.on(event, context, handler);
        }
    };
}
