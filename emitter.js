'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;


function getAllEvents(event) {
    var splitted = event.split('.');
    var events = [splitted[0]];
    for (var i = 1; i < splitted.length; i++) {
        events.push([events[i-1], splitted[i]].join('.'));
    }

    return events;
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
         */
        on: function (event, context, handler) {
            if (!this._events.hasOwnProperty(event)) {
                this._events[event] = [];
            }
            this._events[event].push({
                context: context,
                handler: handler.bind(context)
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */
        off: function (event, context) {
            var eventsToOff = Object.keys(this._events).filter(
                function (key) {
                    return key === event ||
                        (key.length > event.length &&
                        key.substr(0, event.length + 1) === event + '.')
                }
            );
            for (var i = 0; i < eventsToOff.length; i++) {
                this._events[eventsToOff[i]] = this._events[eventsToOff[i]].filter(
                    function (item) {
                        return item.context !== context;
                    }
                )
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         */
        emit: function (event) {
            var events = getAllEvents(event).reverse();
            for (var i = 0; i < events.length; i++) {
                var currEvent = events[i];
                if (!this._events[currEvent]) {
                    continue;
                }
                this._events[currEvent].forEach(function (item) {
                    item.handler();
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
