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
    var eventSubscribers = {};

    function getEventListener(context, handler, times, frequency) {
        times = times > 0 ? times : Infinity;
        frequency = frequency > 0 ? frequency : 1;

        return {
            context: context,
            handler: handler,
            count: 0,
            times: times,
            frequency: frequency
        };
    }

    function addEventListener(event, listener) {
        if (!eventSubscribers[event]) {
            eventSubscribers[event] = [];
        }
        eventSubscribers[event].push(listener);
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
            addEventListener(event, getEventListener(context, handler));

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            Object.keys(eventSubscribers).filter(function (key) {
                return key === event || key.indexOf(event + '.') === 0;
            })
            .forEach(function (key) {
                eventSubscribers[key] = eventSubscribers[key].filter(function (subscriber) {
                    return subscriber.context !== context;
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
            var events = event.split('.').reduce(function (acc, value) {
                var eventWithNamespace = acc.length ? acc[acc.length - 1] + '.' + value : value;
                acc.push(eventWithNamespace);

                return acc;
            }, []);

            events.reverse().filter(function (e) {
                return eventSubscribers[e];
            })
            .forEach(function (e) {
                eventSubscribers[e].forEach(function (subscriber) {
                    if (subscriber.count < subscriber.times &&
                        subscriber.count % subscriber.frequency === 0) {
                        subscriber.handler.call(subscriber.context);
                    }
                    subscriber.count++;
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
            addEventListener(event, getEventListener(context, handler, times));

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
            addEventListener(event, getEventListener(context, handler, 0, frequency));

            return this;
        }
    };
}
