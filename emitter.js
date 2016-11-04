'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function executeCallback(callback) {
    if (callback.count > 0 || callback.currentFrequency === 0) {
        callback.handler();

        if (callback.count !== -1) {
            callback.count--;
        }
    }

    if (callback.currentFrequency !== -1) {
        callback.currentFrequency++;
        callback.currentFrequency %= callback.frequency;
    }
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        events: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Object} additional
         * @returns {Object}
         */
        on: function (event, context, handler, additional) {
            additional = additional ? additional : {
                frequency: -1,
                count: -1
            };
            var frequency = additional.frequency;
            var count = additional.count;

            if (!(event in this.events)) {
                this.events[event] = [];
            }
            this.events[event].push({
                context: context,
                handler: handler.bind(context),
                count: count,
                frequency: frequency,
                currentFrequency: 0
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            Object.keys(this.events).forEach(function (eventName) {
                if (eventName.startsWith(event)) {
                    this.events[eventName] = this.events[eventName].filter(function (callback) {
                        return callback.context !== context;
                    });
                }
            }.bind(this));

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var targetEvent = event;

            while (targetEvent) {
                if (targetEvent in this.events) {
                    this.events[targetEvent].forEach(executeCallback);
                    this.events[targetEvent].filter(function (callback) {
                        return callback.count !== 0;
                    });
                }
                targetEvent = targetEvent.substring(0, targetEvent.lastIndexOf('.'));
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
            var additional = { count: times > 0 ? times : -1 };

            return this.on(event, context, handler, additional);
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
            var additional = { frequency: frequency > 0 ? frequency : -1 };

            return this.on(event, context, handler, additional);
        }
    };
}
