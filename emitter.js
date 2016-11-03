'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;
var events = {};

function executeTheEvent(event) {
    if (events.hasOwnProperty(event)) {
        events[event].forEach(function (student) {
            student.handler.call(student.context);
        });
    }
}

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
            if (events.hasOwnProperty(event)) {
                events[event].push({ context: context, handler: handler });
            } else {
                events[event] = [{ context: context, handler: handler }];
            }

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            var countDotsInEvent = event.split('.').length - 1;
            Object.keys(events).forEach(function (keyEvent) {
                if (keyEvent.split('.').length - 1 < countDotsInEvent ||
                    keyEvent.split('.').slice(0, countDotsInEvent + 1)
                    .join('.') !== event) {
                    return;
                }
                events[keyEvent] = events[keyEvent].filter(function (student) {
                    return student.context !== context;
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
            executeTheEvent(event);
            while (event.indexOf('.') !== -1) {
                event = event.split('.').slice(0, -1);
                executeTheEvent(event);
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
