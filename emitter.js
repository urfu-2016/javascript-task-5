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

        listeners: [],
        getEventsList: function (event) {
            var events = event.split('.');

            return events.map(function (value, index) {
                return events.slice(0, events.length - index).join('.');
            });
        },

        getStartEvent: function (event, lengthEvent) {
            return event.split('.').slice(0, lengthEvent)
                .join('.');
        },

        isOrder: function (listener) {
            //  console.info(this.listeners.indexOf(listener));
            var currentListener = this.listeners[this.listeners.indexOf(listener)];
            //  console.info(currentListener);
            if (!currentListener.hasOwnProperty('countModule')) {
                return false;
            }
            if (currentListener.countModule === 0) {
                // listener.countModule += listener.module - 1;
                currentListener.countModule += currentListener.module - 1;

                return true;
            }
            currentListener.countModule--;

            return false;
        },
        decrimentCount: function (listener) {
            return listener;
        },

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            this.listeners.push({
                event: event,
                context: context,
                handler: handler
            });

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
            this.listeners = this.listeners.filter(function (listener) {
                return ((this.getStartEvent(listener.event, lengthEvent) !== event) ||
                (listener.context !== context));
            }, this);

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
                this.listeners.forEach(function (listener) {
                    if (listener.event !== currentEvent) {
                        return;
                    }
                    if (listener.hasOwnProperty('countModule') && !this.isOrder(listener)) {

                        return;
                    }
                    if (listener.hasOwnProperty('count')) {
                        listener.count--;
                        if (listener.count === 0) {
                            this.listeners = this.listeners.filter(function (currentListener) {
                                return ((currentListener !== listener));
                            }, this);
                        }
                    }
                    listener.handler.call(listener.context);
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
         * @returns {Object} this
         */
        several: function (event, context, handler, times) {
            if (times > 0) {
                this.listeners.push({
                    event: event,
                    context: context,
                    handler: handler,
                    count: times
                });
            } else {
                this.on(event, context, handler);
            }

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
            if (frequency > 0) {
                this.listeners.push({
                    event: event,
                    context: context,
                    handler: handler,
                    module: frequency,
                    countModule: 0
                });
            } else {
                this.on(event, context, handler);
            }

            return this;
        }
    };
}
