'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

function Listener(student, handler, times, frequency) {
    this.student = student;
    this._handler = handler;
    this._times = times || Infinity;
    this._frequency = frequency || 1;
    this._callCount = 0;
    this.callEvent = function () {
        if (this._callCount < this._times && this._callCount % this._frequency === 0) {
            this._handler.call(this.student);
        }
        this._callCount++;
    };
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        _events: [],

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {on}
         */
        on: function (event, context, handler) {
            if (!this._events.hasOwnProperty(event)) {
                this._events[event] = [];
            }
            this._events[event].push(new Listener(context, handler, arguments[3], arguments[4]));

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {off}
         */
        off: function (event, context) {
            Object.keys(this._events).forEach(function (currentEvent) {
                if (currentEvent === event || currentEvent.indexOf(event + '.') === 0) {
                    this._events[currentEvent] = this._events[currentEvent]
                        .filter(function (listener) {
                            return listener.student !== context;
                        });
                }
            }, this);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {emit}
         */
        emit: function (event) {
            var listeners = this._events[event];
            if (listeners) {
                listeners.forEach(function (listener) {
                    listener.callEvent();
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
         * @returns {*|on}
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
         * @returns {*|on}
         */
        through: function (event, context, handler, frequency) {
            return this.on(event, context, handler, undefined, frequency);
        }
    };
}
