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
        events: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (Object.keys(this.events).indexOf(event) === -1) {
                this.events[event] = [];
            }
            this.events[event].push(
                {
                    listener: context,
                    handler: handler.bind(context)
                }
            );

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            var searchString = event + '.';
            Object.keys(this.events).forEach(function (currentEvent) {
                if (currentEvent.lastIndexOf(searchString) === 0 || currentEvent === event) {
                    this.events[currentEvent] = this.events[currentEvent].filter(function (note) {
                        return context !== note.listener;
                    });
                }
            }.bind(this));

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            if (Object.keys(this.events).indexOf(event) !== -1) {
                this.events[event].forEach(function (subscriber) {
                    subscriber.handler();
                });
            }
            while (event.indexOf('.') !== -1) {
                event = event.slice(0, event.lastIndexOf('.'));
                if (Object.keys(this.events).indexOf(event) !== -1) {
                    this.events[event].forEach(function (subscriber) {
                        subscriber.handler();
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
