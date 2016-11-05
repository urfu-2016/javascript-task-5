'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function getHandlers(events, eventName) {
    var namespaces = getAllParrentNamespaces(eventName);
    namespaces.reverse();

    return namespaces.reduce(function (acc, namespace) {
        return acc.concat(events[namespace] || []);
    }, []);
}

function getAllSubNamespaces(events, prefix) {
    return Object.keys(events).filter(function (eventName) {
        return eventName.startsWith(prefix);
    });
}

function getAllParrentNamespaces(fullEventName) {
    var eventNameParts = fullEventName.split('.');

    return eventNameParts.map(function (_, index) {
        return eventNameParts.slice(0, index + 1).join('.');
    });
}

function isNeedToExec(event, countOfExecutions) {
    return (!event.severalParam && !event.throughParam) ||
        event.severalParam > countOfExecutions ||
        countOfExecutions % event.throughParam === 0;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        events: {},
        eventCounters: {},

        createEvent: function (eventName, context, handler) {
            handler = handler.bind(context);
            var event = {
                'eventName': eventName,
                'context': context,
                'function': handler
            };
            if (this.events[eventName] === undefined) {
                this.events[eventName] = [];
            }
            this.events[eventName].push(event);

            return event;
        },

        countEventCall: function (fullEventName) {
            getAllParrentNamespaces(fullEventName).forEach(function (eventName) {
                if (this.eventCounters[eventName] === undefined) {
                    this.eventCounters[eventName] = -1;
                }
                this.eventCounters[eventName]++;
            }, this);
        },

        /**
         * Подписаться на событие
         * @param {String} eventName
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (eventName, context, handler) {
            this.createEvent(eventName, context, handler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} eventPrefix
         * @param {Object} context
         * @returns {Object}
         */
        off: function (eventPrefix, context) {
            getAllSubNamespaces(this.events, eventPrefix).forEach(function (event) {
                this.events[event] = this.events[event].filter(function (handler) {
                    return handler.context !== context;
                });
            }, this);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} eventName
         * @returns {Object}
         */
        emit: function (eventName) {
            this.countEventCall(eventName);
            getHandlers(this.events, eventName)
                .filter(function (event) {
                    return isNeedToExec(event, this.eventCounters[event.eventName]);
                }, this)
                .forEach(function (handler) {
                    handler.function();
                });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} eventName
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (eventName, context, handler, times) {
            var event = this.createEvent(eventName, context, handler);
            event.severalParam = times;

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} eventName
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (eventName, context, handler, frequency) {
            var event = this.createEvent(eventName, context, handler);
            event.throughParam = frequency;

            return this;
        }
    };
}
