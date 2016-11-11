'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function getParentEvents(event) {
    return event.split('.').reduce(function (parents, subEvent) {
        var nextParent = parents.length ? parents.slice(-1).pop() + '.' + subEvent : subEvent;
        parents.push(nextParent);

        return parents;
    }, [])
        .reverse();
}

function getChildEvents(event, events) {
    return events.filter(function (possibleChildEvent) {
        return possibleChildEvent.startsWith(event) &&
            (!possibleChildEvent[event.length] || possibleChildEvent[event.length] === '.');
    });
}

function isEventImpossibleForHappen(eventInfo, subscription) {
    return subscription.frequency && eventInfo.counter % subscription.frequency ||
        subscription.hasOwnProperty('times') && subscription.times < 1;
}

function tryToHandleEvent(eventInfo, subscription) {
    if (isEventImpossibleForHappen(eventInfo, subscription)) {
        return;
    }
    if (subscription.times) {
        subscription.times--;
    }
    subscription.handler();
}

function emit(event, events) {
    if (events[event]) {
        events[event].subscriptions.forEach(function (subscription) {
            tryToHandleEvent(events[event], subscription);
        });
        events[event].counter++;
    }
}

function off(event, context, events) {
    return events[event].subscriptions.filter(function (subscription) {
        return subscription.student !== context;
    });
}

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
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!this.events[event]) {
                this.events[event] = {
                    counter: 0,
                    subscriptions: []
                };
            }
            this.events[event].subscriptions.push({
                student: context,
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
            var events = this.events;
            getChildEvents(event, Object.keys(events)).forEach(function (childEvent) {
                events[childEvent].subscriptions = off(childEvent, context, events);
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var events = this.events;
            getParentEvents(event).forEach(function (parent) {
                emit(parent, events);
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
            this.on(event, context, handler);
            if (times > 0) {
                this.events[event].subscriptions.slice(-1).pop().times = times;
            }

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
            this.on(event, context, handler);
            if (frequency > 0) {
                this.events[event].subscriptions.slice(-1).pop().frequency = frequency;
            }

            return this;
        }
    };
}
