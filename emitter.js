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
    function addEvent(event, context, handler) {
        var times = arguments[3] > 0 ? arguments[3] : Infinity;
        var frequency = arguments[4] > 0 ? arguments[4] : 1;
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
            addEvent(event, context, handler, -1, -1);

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
            addEvent(event, context, handler, times);

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
            addEvent(event, context, handler, -1, frequency);

            return this;
        }
    };
}
