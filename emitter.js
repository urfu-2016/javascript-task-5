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

function getEmittedEvents(eventName) {
    var emmitedEvents = [];
    var eventNameParts = eventName.split('.');
    for (var i = eventNameParts.length; i > 0; i--) {
        emmitedEvents.push(eventNameParts.slice(0, i).join('.'));
    }

    return emmitedEvents;
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
         * @param {String} eventPrefix
         * @param {Object} context
         * @returns {Object} emitter
         */
        off: function (eventPrefix, context) {
            var eventsForOff = Object.keys(this.eventToHandlers).filter(function (event) {
                return getEmittedEvents(event).indexOf(eventPrefix) !== -1;
            });

            eventsForOff.forEach(function (eventForOff) {
                this.eventToHandlers[eventForOff] = this.eventToHandlers[eventForOff]
                .filter(function (handler) {
                    return handler.context !== context;
                });
            }, this);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} emitter
         */
        emit: function (event) {
            getEmittedEvents(event).forEach(function (emmitedEvent) {
                (this.eventToHandlers[emmitedEvent] || []).forEach(function (handler) {
                    handler.notify();
                });
            }, this);

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
