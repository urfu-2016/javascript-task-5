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
    return {

        NAME_SPACE: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {this}
         */
        on: function (event, context, handler) {
            if (!this.NAME_SPACE.hasOwnProperty(event)) {
                this.NAME_SPACE[event] = [];
            }

            this.NAME_SPACE[event].push ({
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
            Object.keys(this.NAME_SPACE).forEach(function (keys) {
                if (keys.indexOf(event) === 0) {
                    this.NAME_SPACE[keys] = this.NAME_SPACE[keys].filter(function (record) {
                        return record.context !== context;
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
            arrayEvents.map(function (value, index) {
                return arrayEvents.slice(0, arrayEvents.length - index).join('.');
            }).forEach(function (currentEvent) {
                if (this.NAME_SPACE.hasOwnProperty(currentEvent)) {
                    this.NAME_SPACE[currentEvent].forEach(function (record) {
                        record.handler.call(record.context);
                    }, this);
                }
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
