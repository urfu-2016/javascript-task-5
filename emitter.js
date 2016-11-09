'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function Listener(context, handler, times, frequency) {
    this.context = context;
    this._handler = handler;
    this._times = times;
    this._frequency = frequency;
    this._callCount = 0;
    this.callEvent = function () {
        if (this._callCount < this._times && this._callCount % this._frequency === 0) {
            this._handler.call(this.context);
        }
        this._callCount++;

        return this._callCount !== this._times;
    };
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        _events: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!this._events.hasOwnProperty(event)) {
                this._events[event] = [];
            }
            var times = arguments[3] || Infinity;
            var frequency = arguments[4] || 1;
            this._events[event].push(new Listener(context, handler, times, frequency));

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            Object.keys(this._events).forEach(function (currentEvent) {
                if (currentEvent === event || currentEvent.indexOf(event + '.') === 0) {
                    var listeners = this._events[currentEvent];
                    this._events[currentEvent] = listeners.filter(function (listener) {
                        return listener.context !== context;
                    });
                }
            }, this);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var listeners = this._events[event];
            if (listeners) {
                this._events[event] = listeners.filter(function (listener) {
                    return listener.callEvent();
                });
            }

            return event ? this.emit(event.substring(0, event.lastIndexOf('.'))) : this;

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
