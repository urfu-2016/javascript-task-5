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
        eventsObj: [],

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @return {Object} this
         */

        on: function (event, context, handler) {
            this.eventsObj[event] = this.eventsObj[event] || [];
            this.eventsObj[event].push({ context: context, handler: handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @return {Object} this
         */

        off: function (event, context) {
            if (!this.eventsObj[event]) {
                return this;
            }

            var _eventsObj = this.eventsObj;
            Object.keys(this.eventsObj).filter(function (item) {
                return item.indexOf(event) !== -1;
            })
            .forEach(function (item) {
                _eventsObj[item] = _eventsObj[item].filter(function (personal) {
                    return personal.context !== context;
                });
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @return {Object} this
         */

        emit: function (event) {
            var _eventsObj = this.eventsObj;
            var splitedEvent = event.split('.');
            splitedEvent.map(function (item, index) {
                return splitedEvent.slice(0, splitedEvent.length - index).join('.');
            })
            .forEach(function (item) {
                if (_eventsObj[item]) {
                    _eventsObj[item].forEach(function (personalEvent) {
                        personalEvent.handler.call(personalEvent.context);
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
