'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var events = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         */

        on: function (event, context, handler) {
            events.push(
                {
                    event: event,
                    propertyStudent: context,
                    handler: handler
                });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */

        off: function (event, context) {
            events.forEach(function (currentEvent, i) {
                var partsEvent = currentEvent.event.split('.');
                var templates = [];
                partsEvent.forEach(function (currentPart, j) {
                    templates.push(partsEvent.slice(0, partsEvent.length - j).join('.'));
                });
                var checkEvent = (templates.indexOf(event) !== -1);
                if (checkEvent && currentEvent.propertyStudent === context) {
                    delete events[i];
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         */

        emit: function (event) {
            var partsEvent = event.split('.');
            partsEvent.forEach(function (currentPart, i) {
                var template = partsEvent.slice(0, partsEvent.length - i).join('.');
                events.forEach(function (currentEvent) {
                    if (currentEvent.event === template) {
                        currentEvent.handler.call(currentEvent.propertyStudent);
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
