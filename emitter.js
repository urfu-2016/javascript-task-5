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
            additional = additional ? additional : {};
            var frequency = additional.frequency;
            var count = additional.count;

            /* -1 значит значение не задано */
            frequency = frequency ? frequency : -1;
            count = count ? count : -1;

            if (!(event in this.events)) {
                this.events[event] = [];
            }
            this.events[event].push({
                context: context,
                handler: handler.bind(context),
                count: count,
                currentCount: 0,
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
            var executeCallback = function (callback, index) {
                if (callback.currentCount < callback.count ||
                    callback.currentFrequency === 0) {
                    callback.handler();

                    if (callback.currentCount !== -1) {
                        callback.currentCount++;
                    }
                }

                if (callback.currentFrequency !== -1) {
                    callback.currentFrequency++;
                    callback.currentFrequency %= callback.frequency;
                }

                if (callback.currentCount === callback.count) {
                    delete this.events[targetEvent][index];
                }
            }.bind(this);

            while (targetEvent) {
                if (targetEvent in this.events) {
                    this.events[targetEvent].forEach(executeCallback);
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
            var additional = { count: times };

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
            var additional = { frequency: frequency };

            return this.on(event, context, handler, additional);
        }
    };
}
