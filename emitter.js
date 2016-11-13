'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

function subscribersFilter(subscribers, context, i) {
    var events = Object.keys(subscribers);
    for (var j = 0; j < subscribers[events[i]].length; j++) {
        subscribers[events[i]] = subscribers[events[i]].filter(function (listener) {
            return listener.context !== context;
        });
    }

    return subscribers;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var subscribers = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!subscribers[event]) {
                subscribers[event] = [];
            }
            subscribers[event].push({
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
            var events = Object.keys(subscribers);
            for (var k = 0; k < events.length; k++) {
                if (events[k] === event || events[k].slice(0, event.length + 1) === event + '.') {
                    subscribers = subscribersFilter(subscribers, context, k);
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
            var events = [];
            var splittedEvent = event.split('.');
            for (var i = splittedEvent.length; i >= 1; i--) {
                events.push(splittedEvent.slice(0, i)
                    .join('.'));
            }
            for (var j = 0; j < events.length; j++) {
                if (subscribers[events[j]]) {
                    subscribers[events[j]].forEach(function (listener) {
                        listener.handler();
                    });
                }
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
