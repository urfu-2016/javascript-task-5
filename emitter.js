'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

function getEmitter() {
    var subscriptions = {};
    function searchNamespaces(event) {

        return Object.keys(subscriptions).filter(function (currentEvent) {
            return event === currentEvent || currentEvent.indexOf(event + '.') === 0;
        });
    }

    return {

        on: function (event, context, handler) {
            if (!subscriptions.hasOwnProperty(event)) {
                subscriptions[event] = [];
            }
            subscriptions[event].push({
                context: context,
                handler: handler
            });

            return this;
        },

        off: function (event, context) {
            var events = searchNamespaces(event);
            events.forEach(function (currentEvent) {
                subscriptions[currentEvent] = subscriptions[currentEvent]
                .filter(function (handler) {
                    return handler.context !== context;
                });
            });

            return this;
        },

        emit: function (event) {
            var currentEvent = event;
            while (currentEvent) {
                if (subscriptions.hasOwnProperty(currentEvent)) {
                    subscriptions[currentEvent].forEach(function (events) {
                        events.handler.call(events.context);
                    });
                }
                currentEvent = currentEvent.substring(0, currentEvent.lastIndexOf('.'));
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
