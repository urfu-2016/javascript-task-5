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
         * @returns {Object}
         */
        on: function (event, context, handler) {
            var boundHandler = handler.bind(context);
            boundHandler.boundThis = context;
            Object.assign(boundHandler, handler);

            if (!events[event]) {
                events[event] = {
                    handlers: []
                };
            }
            events[event].handlers.push(boundHandler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            Object.keys(events)
                .filter(function (key) {
                    return key.indexOf(event) === 0 &&
                        ['', '.'].indexOf(key.substring(event.length, event.length)) === 0;
                })
                .forEach(function (key) {
                    var handlers = events[key].handlers;
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
                if (events[event]) {
                    events[event].handlers
                        .filter(function (handler) {
                            return (isNaN(handler.maxTimes) || handler.maxTimes > 0) &&
                                (isNaN(handler.frequency) ||
                                handler.frequency === handler.currentFrequency);
                        })
                        .forEach(function (handler) {
                            handler();
                            handler.maxTimes--;
                            handler.currentFrequency = -1;
                        });
                    events[event].handlers
                        .forEach(function (handler) {
                            handler.currentFrequency++;
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
            handler.maxTimes = times <= 0 ? NaN : times;

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
            handler.frequency = (frequency <= 0 ? undefined : frequency) - 1;
            handler.currentFrequency = handler.frequency;

            return this.on(event, context, handler);
        }
    };
}
