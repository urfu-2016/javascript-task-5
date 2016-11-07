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
            if (!events[event]) {
                events[event] = [];
            }

            var subscription = {
                student: context,
                callback: handler,
                count: 0
            };

            var params = arguments[3];
            if (params) {
                subscription.totalCount = params.totalCount;
                subscription.frequency = params.frequency;
            }
            events[event].push(subscription);

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
                .filter(function (consideredEvent) {
                    return event === consideredEvent || consideredEvent.indexOf(event + '.') === 0;
                })
                .forEach(function (eventName) {
                    events[eventName] = events[eventName].filter(function (subscription) {
                        return subscription.student !== context;
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
            while (event) {
                if (events[event]) {
                    performEvent(events[event]);
                }

                var outerEventIndex = event.lastIndexOf('.');
                event = event.substring(0, outerEventIndex);
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
            if (times <= 0) {
                times = undefined;
            }

            return this.on(event, context, handler, { totalCount: times });
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

function performEvent(event) {
    event.forEach(function (item) {
        if (item.totalCount !== undefined) {
            if (item.count++ >= item.totalCount) {
                return;
            }
        } else if (item.frequency !== undefined) {
            if (item.count++ % item.frequency !== 0) {
                return;
            }
        }

        item.callback.call(item.student);
    });
}
