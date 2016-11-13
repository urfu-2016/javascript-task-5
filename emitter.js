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

        listeners: {},
        getEventsList: function (event) {
            var events = event.split('.');
            events = events.map(function (value, index) {
                return events.slice(0, events.length - index).join('.');
            });

            return events.filter(function (currentEvent) {
                return this.listeners.hasOwnProperty(currentEvent);
            }, this);
        },

        getStartEvent: function (event, lengthEvent) {
            return event.split('.').slice(0, lengthEvent)
                .join('.');
        },

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            var listener = { context: context,
                    handler: handler,
                    count: Number.POSITIVE_INFINITY,
                    module: 0,
                    countModule: 0 };
            if (this.listeners.hasOwnProperty(event)) {
                this.listeners[event].push(listener);
            } else {
                this.listeners[event] = [listener];
            }

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            var lengthEvent = event.split('.').length;
            for (var thisEvent in this.listeners) {
                if (this.listeners.hasOwnProperty(thisEvent) &&
                this.getStartEvent(thisEvent, lengthEvent) === event) {
                    this.listeners[event] = this.listeners[event].filter(function (eventListener) {
                        return (eventListener.context !== context);
                    }, this);
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            var events = this.getEventsList(event);
            events.forEach(function (currentEvent) {
                this.listeners[currentEvent].forEach(function (listener) {
                    listener.handler.call(listener.context);
                }, this);
            }, this);

                /*
                this.listeners[currentEvent].forEach(function (listener) {
                    if (listener.countModule === 0 && listener.count > 0) {
                        listener.handler.call(listener.context);
                        listener.count--;
                        listener.countModule += listener.module;
                    }
                    if (listener.countModule > 0) {
                        listener.countModule--;
                    }
                }, this);
            }, this);*/

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object} this
         */
        several: function (event, context, handler, times) {
            times = times > 0 ? times : Number.POSITIVE_INFINITY;
            this.listeners.push({ event: event, context: context, handler: handler,
                count: times, module: 0, countModule: 0 });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} this
         */
        through: function (event, context, handler, frequency) {
            frequency = frequency > 0 ? frequency : 0;
            this.listeners.push({ event: event, context: context, handler: handler,
                count: Number.POSITIVE_INFINITY, module: frequency, countModule: 0 });

            return this;
        }
    };
}
