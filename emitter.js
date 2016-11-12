'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

var SEPARATOR = '.';

function cutEventName(string) {
    return string.slice(0, string.lastIndexOf(SEPARATOR));
}

/**
 * @param {Array} collection
 * @param {Function} callback
 * @returns {Number} index
 */
function findIndex(collection, callback) {
    for (var i = 0; i < collection.length; i++) {
        if (callback(collection[i])) {
            return i;
        }
    }

    return -1;
}

function deleteSubscriber(subscribers, subscriber) {
    var index = findIndex(subscribers, function (item) {
        return item.context === subscriber;
    });

    if (index !== -1) {
        subscribers.splice(index, 1);
    }
}

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
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            if (!events.hasOwnProperty(event)) {
                events[event] = [];
            }

            var subscribers = events[event];

            var index = findIndex(subscribers, function (item) {
                return item.context === context;
            });

            if (index === -1) {
                subscribers.push({ context: context, actions: [handler] });
            } else {
                subscribers[index].actions.push(handler);
            }

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            var previousEvent = event + SEPARATOR;

            Object.keys(events).forEach(function (eventItem) {
                if (eventItem === event || eventItem.indexOf(previousEvent) === 0) {
                    deleteSubscriber(events[eventItem], context);
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            var currentEvent = event;
            while (currentEvent !== '') {
                var subscribers = events[currentEvent];
                currentEvent = cutEventName(currentEvent);

                if (subscribers === undefined) {
                    continue;
                }

                subscribers.slice().forEach(function (subscriber) {
                    subscriber.actions.forEach(function (action) {
                        action.call(subscriber.context);
                    });
                });
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
         * @returns {Object} this
         */
        several: function (event, context, handler, times) {
            if (times <= 0) {
                return this.on(event, context, handler);
            }

            var countOfCall = 0;

            /**
            * @this {Object}
            */
            function wrapperOfHandler() {
                handler.call(this);
                countOfCall++;

                if (countOfCall === times) {
                    deleteSubscriber(events[event], this);
                }
            }

            return this.on(event, context, wrapperOfHandler);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} this
         */
        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                return this.on(event, context, handler);
            }

            var countOfCall = 0;

            /**
            * @this {Object}
            */
            function wrapperOfHandler() {
                if (countOfCall === 0) {
                    handler.call(this);
                }

                countOfCall++;

                if (countOfCall === frequency) {
                    countOfCall = 0;
                }
            }

            return this.on(event, context, wrapperOfHandler);
        }
    };
}
