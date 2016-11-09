'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

var NAME_SPACE = {};

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
         * @returns {this}
         */
        on: function (event, context, handler) {
            if (!NAME_SPACE.hasOwnProperty(event)) {
                NAME_SPACE[event] = [];
            }

            NAME_SPACE[event].push ({
                context: context,
                handler: handler
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {this}
         */
        off: function (event, context) {
            Object.keys(NAME_SPACE).forEach(function (keys) {
                if (NAME_SPACE.hasOwnProperty(event)) {
                    NAME_SPACE[event].map(function (record, index) {
                        if (record.context === context) {
                            delete NAME_SPACE[event][index];
                        }

                        return false;
                    });
                }
            }, this);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {this}
         */
        emit: function (event) {
            var arrayEvents = event.split('.');
            var currentEvent;
            for (var i = arrayEvents.length; i !== 0; i--) {
                currentEvent = arrayEvents.slice(0, i).join('.');
                if (NAME_SPACE.hasOwnProperty(currentEvent)) {
                    NAME_SPACE[currentEvent].forEach(function (record) {
                        record.handler.call(record.context);
                    });
                }
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
