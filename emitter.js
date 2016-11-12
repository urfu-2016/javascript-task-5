'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

var eventsForCall = function (events) {
    return events.map(function (value, index) {
        return events.slice(0, events.length - index).join('.');
    });
};

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        EVENTS: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {this}
         */
        on: function (event, context, handler) {
            if (!this.EVENTS.hasOwnProperty(event)) {
                this.EVENTS[event] = [];
            }

            this.EVENTS[event].push({
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
            Object.keys(this.EVENTS).forEach(function (currentEvent) {
                this.EVENTS[currentEvent] = this.EVENTS[currentEvent].filter(function (record) {
                    return record.context !== context || currentEvent !== event &&
                    currentEvent.indexOf(event + '.') !== 0;
                });

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
            eventsForCall(arrayEvents).forEach(function (currentEvent) {
                if (!this.EVENTS.hasOwnProperty(currentEvent)) {
                    return;
                }
                this.EVENTS[currentEvent].forEach(function (record) {
                    record.handler.call(record.context);
                }, this);
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
