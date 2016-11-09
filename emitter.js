'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

function getParentEvents(event) {
    var subEvents = event.split('.');
    var parents = [];
    for (var elements = subEvents.length; elements > 0; elements--) {
        parents.push(subEvents.slice(0, elements).join('.'));
    }

    return parents;
}

function getChildEvents(event, events) {
    return events.filter(function (a) {
        return a.startsWith(event) && (!a[event.length] || a[event.length] === '.');
    });
}

function emit(event, events) {
    if (events[event]) {
        events[event].forEach(function (eventInfo) {
            eventInfo.handler();
        });
    }
}

function off(event, context, events) {
    return events[event].filter(function (eventInfo) {
        return eventInfo.student !== context;
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
                this.events[event] = [];
            }
            this.events[event].push(
                {
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
                events[childEvent] = off(childEvent, context, events);
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
            getParentEvents(event).map(function (parent) {
                return emit(parent, events);
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
