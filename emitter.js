'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function isEmitting(subscriber) {
    if ('frequency' in subscriber) {
        var currentFrequency = subscriber.frequency.currentFrequency;
        subscriber.frequency.currentFrequency++;

        return currentFrequency % subscriber.frequency.frequency === 0;
    }
    if ('times' in subscriber) {
        subscriber.times.times--;

        return subscriber.times.times >= 0;
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
         * @param {Object} extraParam
         * @returns {Object}
         */
        on: function (event, context, handler, extraParam) {
            if (!(event in events)) {
                events[event] = [];
            }
            events[event].push({
                context: context,
                handler: handler.bind(context)
            });
            if (extraParam) {
                var nameParam = Object.keys(extraParam)[0];
                var numberOfLastSubscriber = events[event].length - 1;
                events[event][numberOfLastSubscriber][nameParam] = extraParam;
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
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var filteredNames = [];
            var countDots = 0;
            if (event.match(/\./g)) {
                countDots = event.match(/\./g).length;
            }
            for (var i = 0; i < countDots + 1; i++) {
                if (event in events) {
                    filteredNames.push(event);
                }
                event = event.slice(0, event.lastIndexOf('.'));
            }
            filteredNames.forEach(function (eventForCall) {
                events[eventForCall].forEach(function (subscriber) {
                    if (isEmitting(subscriber)) {
                        subscriber.handler();
                    }
                });
            });

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
            var option = times > 0 ? { times: times } : { times: Infinity };

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
            var option = frequency > 0
            ? { frequency: frequency, currentFrequency: 0 }
            : { frequency: 1, currentFrequency: 0 };

            return this.on(event, context, handler, option);
        }
    };
}
