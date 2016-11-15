'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

var events = {};

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            console.info(event, context, handler);
            events[event] = events[event] || [];
            events[event].push({ context: context, handler: handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            console.info(event, context);
            if (!events[event]) {
                return this;
            }
            var eventNames = Object.keys(events);
            var appropriateEvents = [];
            eventNames.forEach(function (eventName) {
                if (eventName === event || eventName.indexOf(event + '.') === 0) {
                    appropriateEvents.push(eventName);
                }
            });
            appropriateEvents.forEach(function (eventName) {
                events[eventName] = events[eventName].filter(function (studentEvent) {

                    return !(eventNames.indexOf(event) !== -1 &&
                        studentEvent.context === context);
                });
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            console.info(event);
            var eventNames = [];
            var splittedEvent = event.split('.');
            for (var i = splittedEvent.length; i > 0; i--) {
                eventNames.push(splittedEvent.slice(0, i).join('.'));
            }
            eventNames.forEach(function (eventName) {
                if (events[eventName]) {
                    events[eventName].forEach(function (studentEvent) {
                        studentEvent.handler.call(studentEvent.context);
                    });
                }
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
