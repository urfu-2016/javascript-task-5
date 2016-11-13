'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {

    return {

        getChildrenEvents: function (event) {
            var events = event.split('.');
            for (var i = 1; i < events.length; i++) {
                events[i] = events[i - 1].concat('.').concat(events[i]);
            }

            return events.reverse();
        },

        subscriptions: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {

            if (!this.subscriptions.hasOwnProperty(event)) {
                this.subscriptions[event] = [];
            }

            this.subscriptions[event].push({
                context: context,
                handler: handler.bind(context)
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
            for (var subscription in this.subscriptions) {
                if (this.subscriptions.hasOwnProperty(subscription) && (subscription === event ||
                    subscription.indexOf(event.concat('.') !== -1))) {
                    this.subscriptions[event] = this.subscriptions[event].filter(function (name) {
                        return name.context !== context;
                    });
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var subscriptions = this.subscriptions;
            (this.getChildrenEvents(event)).forEach(function (subscription) {
                if (subscriptions.hasOwnProperty(subscription)) {
                    subscriptions[subscription].forEach(function (element) {
                        element.handler();
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
