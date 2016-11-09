'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function changeEvent(string) {
    var e = string.lastIndexOf('.');

    return (e !== -1) ? string.slice(0, e) : '';
}

function findIndex(collection, functionI) {
    for (var i = 0; i < collection.length; i++) {
        if (functionI(collection[i])) {
            return i;
        }
    }

    return -1;
}

function find(collection, functionI) {
    var i = findIndex(collection, functionI);

    return (i !== -1) ? collection[i] : undefined;
}

function deleteSubscriber(subscribers, subscriber) {
    var index = findIndex(subscribers, function (item) {
        return item.object === subscriber;
    });

    if (index !== -1) {
        subscribers.splice(index, 1);
    }
}

var SEPARATOR = '.';

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        events: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            if (!this.events.hasOwnProperty(event)) {
                this.events[event] = [];
            }

            var subscribers = this.events[event];

            var subscriber = find(subscribers, function (item) {
                return item.object === context;
            });

            if (subscriber === undefined) {
                subscriber = { object: context, actions: [] };
                subscribers.push(subscriber);
            }

            subscriber.actions.push(handler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            var subscribers = this.events[event];
            if (subscribers === undefined) {
                return this;
            }

            deleteSubscriber(subscribers, context);

            var previousEvent = event + SEPARATOR;

            var previousEvents = Object.keys(this.events).filter(function (eventItem) {
                return eventItem.indexOf(oldEvent) === 0;
            });

            previousEvents.forEach(function (eventItem) {
                deleteSubscriber(this.events[eventItem], context);
            }, this);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            while (event !== '') {
                var subscribers = this.events[event];
                event = changeEvent(event);

                if (subscribers === undefined) {
                    continue;
                }

                subscribers.forEach(function (subscriber) {
                    subscriber.actions.forEach(function (action) {
                        action.call(subscriber.object);
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
                if (countOfCall !== times) {
                    handler.call(this);
                    console.info(54, this);
                    countOfCall++;
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

            var countOfCall = 1;

            /**
            * @this {Object}
            */
            function wrapperOfHandler() {
                if (countOfCall !== frequency) {
                    handler.call(this);
                    countOfCall++;
                } else {
                    countOfCall = 1;
                }
            }

            return this.on(event, context, wrapperOfHandler);
        }
    };
}
