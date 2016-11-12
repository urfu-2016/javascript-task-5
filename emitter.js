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
    var eventsCollection = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            eventsCollection.push({ event: event, context: context, action: handler,
            indexOfEvent: 0, countOfEvents: 0, repeatCount: 0 });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            eventsCollection = eventsCollection.filter(function (item) {
                var collectionOfHandlers = pathOfName(item.event);
                var isLeft = collectionOfHandlers.reduce(function (isOff, index) {
                    return isOff || index === event;
                }, false);

                return !isLeft || item.context !== context;
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         * */
        emit: function (event) {
            var collectionOfEvents = pathOfName(event);
            collectionOfEvents = collectionOfEvents.reverse();
            var eventItemList = eventsCollection.filter(function (item) {
                return collectionOfEvents.indexOf(item.event) > -1;
            });
            collectionOfEvents.forEach(function (eventName) {
                eventItemList.forEach(function (item) {
                    if (item.event === eventName) {
                        if (isOn(item) || isSeveralPrevent(item) || isThroughlPrevent(item)) {
                            item.action.call(item.context);
                        }
                        item.indexOfEvent ++;
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
            eventsCollection.push({ event: event, context: context, action: handler,
                indexOfEvent: 0, countOfEvents: (times < 0) ? 0 : times, repeatCount: 0 });

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
            eventsCollection.push({ event: event, context: context, action: handler,
                indexOfEvent: 0, countOfEvents: 0, repeatCount: (frequency < 0) ? 0 : frequency });

            return this;
        }
    };
}

function pathOfName(nameOfEvent) {
    var parts = nameOfEvent.split('.');
    var collectionOfHandlers = [];
    var fullHandler = [];
    parts.forEach(function (index) {
        fullHandler.push(index);
        collectionOfHandlers.push(fullHandler.join('.'));
    });

    return collectionOfHandlers;
}

function isOn(item) {
    return item.countOfEvents === 0 && item.repeatCount === 0;
}

function isSeveralPrevent(item) {
    return (item.indexOfEvent < item.countOfEvents && item.countOfEvents !== 0);
}

function isThroughlPrevent(item) {
    return (item.repeatCount !== 0 && (item.indexOfEvent % item.repeatCount) === 0);
}
