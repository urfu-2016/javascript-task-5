'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

function Handler(context, handlerFunc) {
    this.context = context;
    this.handler = handlerFunc;
    this.notify = function () {
        handlerFunc.call(context);
    };
}

function filterByPrefix(strings, prefix) {
    return strings.filter(function (string) {
        return string.startsWith(prefix);
    });
}

function getEmittedEvents(eventName) {
    var emmitedEvents = [];
    var eventNameParts = eventName.split('.');
    for (var i = 0; i < eventNameParts.length; i++) {
        emmitedEvents.push(eventNameParts.slice(0, i + 1).join('.'));
    }

    return emmitedEvents.reverse();
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        eventToHandlers: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} emitter
         */
        on: function (event, context, handler) {
            if (!this.eventToHandlers.hasOwnProperty(event)) {
                this.eventToHandlers[event] = [];
            }
            this.eventToHandlers[event].push(new Handler(context, handler));

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} emitter
         */
        off: function (event, context) {
            var eventsNameForOff = filterByPrefix(Object.keys(this.eventToHandlers), event + '.');
            if (this.eventToHandlers.hasOwnProperty(event)) {
                eventsNameForOff.push(event);
            }
            var evetns = this.eventToHandlers;

            eventsNameForOff.forEach(function (eventForOff) {
                evetns[eventForOff] = evetns[eventForOff].filter(function (handler) {
                    return handler.context !== context;
                });
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} emitter
         */
        emit: function (event) {
            var emmitedEvents = getEmittedEvents(event);
            var events = this.eventToHandlers;
            emmitedEvents.forEach(function (emmitedEvent) {
                (events[emmitedEvent] || []).forEach(function (handler) {
                    handler.notify();
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
