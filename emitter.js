'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function emitEvent(events, event) {
    if (Object.keys(events).indexOf(event) !== -1) {
        events[event].forEach(function (subscriber) {
            subscriber.handler();
        });
    }

    return events;
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
            var eventsCopy = this.events;
            Object.keys(this.events).forEach(function (currentEvent) {
                if (currentEvent.lastIndexOf(searchString) === 0 || currentEvent === event) {
                    eventsCopy[currentEvent] = eventsCopy[currentEvent].filter(function (note) {
                        return context !== note.listener;
                    });
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            this.events = emitEvent(this.events, event);
            while (event.indexOf('.') !== -1) {
                event = event.slice(0, event.lastIndexOf('.'));
                this.events = emitEvent(this.events, event);
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
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            if (times < 0) {
                return this.on(event, context, handler);
            }
            var newHandler = function () {

                return function () {
                    if (times > 0) {
                        times--;
                        handler.call(context);
                    }
                };
            };

            return this.on(event, context, newHandler());
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            var timesCount = 0;
            if (frequency <= 0) {
                return this.on(event, context, handler);
            }
            var newHandler = function () {

                return function () {
                    if (timesCount % frequency === 0) {
                        handler.call(context);
                    }
                    timesCount++;
                };
            };

            return this.on(event, context, newHandler());
        }
    };
}
