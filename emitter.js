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

    function getEventListener(context, handler, several, through) {
        several = several > 0 ? several : Infinity;
        through = through > 0 ? through : 1;

        return {
            context: context,
            handler: handler,
            count: 0,
            several: several,
            through: through
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
                if (eventSubscribers[key]) {
                    var deleteIndex = eventSubscribers[key].findIndex(function (subscriber) {
                        return subscriber.context === context;
                    });
                    eventSubscribers[key].splice(deleteIndex, 1);
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
            var events = event.split('.').reduce(function (acc, val) {
                return acc ? acc.concat([acc[acc.length - 1] + '.' + val]) : [val];
            }, null);

            events.reverse().forEach(function (e) {
                if (eventSubscribers[e]) {
                    eventSubscribers[e].forEach(function (subscriber) {
                        if (subscriber.count < subscriber.several &&
                            subscriber.count % subscriber.through === 0) {
                            subscriber.handler.bind(subscriber.context)();
                        }
                        subscriber.count++;
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
