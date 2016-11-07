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

        subscriptions: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Object} advanced - Ограничение и частота уведомлений
         * @returns {Object}
         */
        on: function (event, context, handler, advanced) {
            var times;
            var frequency;
            if (advanced !== undefined) {
                times = advanced.times;
                frequency = advanced.frequency;
            }
            if (!(event in this.subscriptions)) {
                this.subscriptions[event] = [];
            }
            this.subscriptions[event].push({
                context: context,
                handler: handler,
                notificationsCount: times,
                frequency: frequency,
                currentFrequency: frequency
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
            for (var currentEvent in this.subscriptions) {
                if (currentEvent !== undefined && (currentEvent === event ||
                                    currentEvent.indexOf(event + '.') === 0)) {
                    this.offFromCurrentEvent(currentEvent, context);
                }
            }

            return this;
        },

        /**
         * Отписаться от одного события
         * @param {String} currentEvent
         * @param {Object} context
         */
        offFromCurrentEvent: function (currentEvent, context) {
            this.subscriptions[currentEvent] =
                                    this.subscriptions[currentEvent].filter(
                function (subscription) {
                    return subscription.context !== context;
                });
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var events = getEvents(event);
            var self = this;
            events.forEach(function (currentEvent) {
                if (currentEvent in self.subscriptions) {
                    self.subscriptions[currentEvent].forEach(
                        function (subscription) {
                            self.emitObserver(subscription);
                        });
                }
            });

            return this;
        },

        /**
         * Уведомляет данного подписчика о событии
         * @param {Object} subscription
         */
        emitObserver: function (subscription) {
            var notificationsInBorders =
                        subscription.notificationsCount === undefined ||
                        subscription.notificationsCount > 0;
            var isAppropriateFrequency =
                        subscription.frequency === undefined ||
                        subscription.currentFrequency ===
                        subscription.frequency;
            if (notificationsInBorders && isAppropriateFrequency) {
                subscription.handler.call(subscription.context);
                if (subscription.notificationsCount !== undefined) {
                    subscription.notificationsCount--;
                }
            }
            changeFrequency(subscription);
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
            if (times <= 0) {
                times = undefined;
            }

            return this.on(event, context, handler, { times: times });
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
            if (frequency <= 0) {
                frequency = undefined;
            }

            return this.on(event, context, handler, { frequency: frequency });
        }
    };
}

var SEPARATOR = '.';

/**
 * Возвращает всевозможные события в нужном порядке
 * @param {String} event - Исходное событие
 * @returns {Array}
 */
function getEvents(event) {
    var events = [];
    while (event.length > 0) {
        events.push(event);
        event = event.substring(0, event.lastIndexOf(SEPARATOR));
    }

    return events;
}

/**
 * Меняет счётчик частоты уведомлений
 * @param {Object} subscription
 */
function changeFrequency(subscription) {
    if (subscription.frequency !== undefined) {
        subscription.currentFrequency--;
        if (subscription.currentFrequency <= 0) {
            subscription.currentFrequency = subscription.frequency;
        }
    }
}
