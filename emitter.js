'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
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
            var times = arguments[3] || Infinity;
            var frequency = arguments[4] || 1;

            if (!this.events[event]) {
                this.events[event] = [];
            }

            this.events[event].push({
                context: context,
                handler: handler,
                times: times,
                timesCalled: 0,
                frequency: frequency,
                callHandler: function () {
                    if (this.timesCalled % this.frequency === 0 && this.timesCalled < this.times) {
                        this.handler.call(this.context);
                    }
                    this.timesCalled += 1;
                }
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
            Object.keys(this.events)
                .filter(function (evt) {
                    return evt === event || evt.startsWith(event + '.');
                })
                .forEach(function (evt) {
                    this.events[evt] = this.events[evt].filter(function (listener) {
                        return listener.context !== context;
                    });
                }.bind(this));

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var listeners = this.events[event];

            if (listeners) {
                listeners
                    .filter(function (listener) {
                        return listener.timesCalled !== listener.times;
                    })
                    .forEach(function (listener) {
                        listener.callHandler();
                    });
            }

            var subEventPosition = event.lastIndexOf('.');
            if (subEventPosition !== -1) {
                event = event.substring(0, subEventPosition);
                this.emit(event);
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
            return this.on(event, context, handler, times);
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
            return this.on(event, context, handler, undefined, frequency);
        }
    };
}
