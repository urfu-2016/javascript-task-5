'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function isEmiting(subscriber) {
    if (Object.keys(subscriber)[2] === 'frequency') {
        var currentFrequency = subscriber.frequency[1];
        subscriber.frequency[1]++;

        return currentFrequency % subscriber.frequency[0] === 0;
    }
    if (Object.keys(subscriber)[2] === 'times') {
        subscriber.times--;

        return subscriber.times >= 0;
    }

    return true;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var events = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!(event in events)) {
                events[event] = [];
            }
            events[event].push({
                context: context,
                handler: handler.bind(context)
            });
            if (arguments[3]) {
                var nameParams = Object.keys(arguments[3]);
                var extraParam = arguments[3][nameParams];
                var numberOfLastSubscriber = events[event].length - 1;
                events[event][numberOfLastSubscriber][nameParams] = extraParam;
            }

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            var eventsForDelete = Object.keys(events).filter(function (storedEvent) {
                return storedEvent.indexOf(event + '.') === 0 || event === storedEvent;
            });
            eventsForDelete.forEach(function (eventForDelete) {
                events[eventForDelete] = events[eventForDelete].filter(function (subscriber) {
                    return subscriber.context !== context;
                });
            }, this);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var nameEvents = event.split('.');
            nameEvents[0] = event;
            nameEvents.reduce(function (prev, curr, i) {
                nameEvents[i] = prev.slice(0, prev.lastIndexOf('.'));

                return nameEvents[i];
            });
            var filteredNames = nameEvents.filter(function (eventForCheck) {
                return (eventForCheck in events);
            }, this);
            filteredNames.forEach(function (eventForCall) {
                events[eventForCall].forEach(function (subscriber) {
                    if (isEmiting(subscriber)) {
                        subscriber.handler.call();
                    }
                });
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
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            var option = times > 0 ? { times: times } : Infinity;

            return this.on(event, context, handler, option);
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
            var option = frequency > 0 ? { frequency: [frequency, 0] } : [1, 0];

            return this.on(event, context, handler, option);
        }
    };
}
