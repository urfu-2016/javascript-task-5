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
    var subscriberEvents = {};
    var count = 0;

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            // console.info(event, context, handler);
            if (!subscriberEvents.hasOwnProperty(event)) {
                subscriberEvents[event] = {
                    subscribers: [],
                    queue: Object.keys(subscriberEvents).length + 1
                };
            }

            subscriberEvents[event].subscribers.push({
                context: context,
                handler: handler
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            // console.info(event, context);

            if (subscriberEvents.hasOwnProperty(event)) {
                var events = Object.keys(subscriberEvents);
                var searchedEvents = [event];
                var subscriberIndex = -1;

                subscriberEvents[event].subscribers.forEach(function (subscriber, index) {
                    if (subscriber.context === context) {
                        subscriberIndex = index;
                    }
                });
                events.forEach(function (searchedEvent) {
                    if (searchedEvent !== event &&
                        searchedEvent.split('.')[0] === event) {
                        searchedEvents.push(searchedEvent);
                    }
                });
                searchedEvents.forEach(function (searchEvent) {
                    subscriberEvents[searchEvent].subscribers.splice(subscriberIndex, 1);
                });
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            // console.info(event);
            var nameEvents = event.split('.');

            for (var i = nameEvents.length; i > -1; i--) {
                var nameEvent = nameEvents.slice(0, i).join('.');

                if (subscriberEvents.hasOwnProperty(nameEvent) &&
                    subscriberEvents[nameEvent].queue - count === 1) {
                    count = subscriberEvents[nameEvent].queue;
                    performEvents(subscriberEvents[nameEvent].subscribers);
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

function performEvents(events) {
    events.forEach(function (subscriber) {
        subscriber.handler.call(subscriber.context);
    });
}
