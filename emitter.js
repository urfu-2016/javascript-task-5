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
    var subscriptions = [];
    function addEvent(args) {
        var event = args.event;
        var context = args.context;
        var handler = args.handler;
        var times = args.times > 0 ? args.times : Infinity;
        var frequency = args.frequency > 0 ? args.frequency : 1;
        subscriptions.push(
            {
                event: event,
                context: context,
                handler: handler,
                frequency: frequency,
                times: times,
                count: 0
            }
        );
    }
    function isPassedLimits(subscription) {
        return subscription.count % subscription.frequency === 0 &&
            subscription.count < subscription.times;
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            var args = {
                event: event,
                context: context,
                handler: handler
            };
            addEvent(args);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            subscriptions = subscriptions.filter(function (subscription) {
                var isExcludedEvent = subscription.event !== event &&
                    subscription.event.indexOf(event + '.') !== 0;

                return subscription.context !== context || isExcludedEvent;
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var splitedEvent = event.split('.');
            var eventsList = splitedEvent.map(function (item, index) {
                return splitedEvent.slice(0, index + 1)
                    .join('.');
            })
            .reverse();
            eventsList.forEach(function (item) {
                subscriptions.forEach(function (subscription) {
                    if (subscription.event === item) {
                        if (isPassedLimits(subscription)) {
                            subscription.handler.call(subscription.context);
                        }
                        subscription.count++;
                    }
                });
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
            var args = {
                event: event,
                context: context,
                handler: handler,
                times: times
            };
            addEvent(args);

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
            var args = {
                event: event,
                context: context,
                handler: handler,
                frequency: frequency
            };
            addEvent(args);

            return this;
        }
    };
}
