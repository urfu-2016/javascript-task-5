'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;


function getAllEvents(event) {
    var splitted = event.split('.');
    var events = [splitted[0]];
    for (var i = 1; i < splitted.length; i++) {
        events.push([events[i - 1], splitted[i]].join('.'));
    }

    return events;
}


function initEvent() {
    var args = [].slice.call(arguments, 0);

    return {
        context: args[0],
        handler: args[1],
        count: args[2],
        countExecuted: args[3],
        delta: args[4]
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
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!this._events.hasOwnProperty(event)) {
                this._events[event] = [];
            }
            this._events[event].push(
                initEvent(context, handler.bind(context), -1, 1));

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            var eventsToOff = Object.keys(this._events).filter(
                function (key) {
                    return key === event ||
                        (key.length > event.length &&
                        key.substr(0, event.length + 1) === event + '.');
                }
            );
            for (var i = 0; i < eventsToOff.length; i++) {
                this._events[eventsToOff[i]] = this._events[eventsToOff[i]].filter(
                    function (item) {
                        return item.context !== context;
                    }
                );
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var events = getAllEvents(event).reverse();
            for (var i = 0; i < events.length; i++) {
                var currentEvent = events[i];
                if (!this._events[currentEvent]) {
                    continue;
                }
                this._events[currentEvent].forEach(function (item) {
                    if (item.count === 0) {
                        return;
                    }
                    if (item.countExecuted % item.delta === 0) {
                        item.handler();
                    }
                    item.countExecuted++;
                    item.count--;
                });
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
            if (!this._events.hasOwnProperty(event)) {
                this._events[event] = [];
            }
            this._events[event].push(
                initEvent(context, handler.bind(context), times, 1, 1));

            return this;
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
            if (!this._events.hasOwnProperty(event)) {
                this._events[event] = [];
            }
            this._events[event].push(
                initEvent(context, handler.bind(context), -1, 1, frequency));

            return this;
        }
    };
}
