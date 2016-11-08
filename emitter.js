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

        /**
         * Список событий на которые подписались
         */
        subscriptions: [],

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            this.subscriptions.push({
                event: event,
                context: context,
                handler: handler,
                several: Infinity,
                through: 1,
                numberOfEmits: 0 });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            this.subscriptions = this.subscriptions.filter(function (subscription) {
                return !(subscription.event.indexOf(event) === 0) ||
                        (subscription.context !== context) ||
                        (subscription.event[event.length] !== '.') &&
                        (subscription.event[event.length] !== undefined);
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var emittingEvents = [event];
            while (event.lastIndexOf('.') !== -1) {
                event = event.slice(0, event.lastIndexOf('.'));
                emittingEvents.push(event);
            }

            emittingEvents.forEach(function (emittedEvent) {
                this.subscriptions.forEach(function (subscription) {
                    if (emittedEvent === subscription.event && subscription.several !== 0) {
                        if (subscription.numberOfEmits % subscription.through === 0) {
                            subscription.handler.call(subscription.context);
                        }
                        subscription.several = subscription.several - 1;
                        subscription.numberOfEmits = subscription.numberOfEmits + 1;
                    }
                });
            }, this);

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
            if (times > 0) {
                this.subscriptions.push({
                    event: event,
                    context: context,
                    handler: handler,
                    several: times,
                    through: 1,
                    numberOfEmits: 0
                });
            } else {
                this.on(event, context, handler);
            }

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
            if (frequency > 0) {
                this.subscriptions.push({
                    event: event,
                    context: context,
                    handler: handler,
                    several: Infinity,
                    through: frequency,
                    numberOfEmits: 0
                });
            } else {
                this.on(event, context, handler);
            }

            return this;
        }
    };
}
