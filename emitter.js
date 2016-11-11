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
    var events = [];

    function addEvent(event, context, handler) {
        var times = arguments[3] > 0 ? arguments[3] : Infinity;
        var frequency = arguments[4] > 0 ? arguments[4] : 1;
        events.push(
            {
                event: event,
                context: context,
                handler: handler,
                eventNumber: 0,
                eventCount: times,
                frequency: frequency
            }
        );
    }

    function challengeEvents(event) {
        if (event.eventNumber === 0 ||
            event.eventNumber % event.frequency === 0 &&
                event.eventCount > event.eventNumber) {
            event.handler.call(event.context);
        }
        event.eventNumber++;
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * returns {Object}
         */

        on: function (event, context, handler) {
            addEvent(event, context, handler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * returns {Object}
         */

        off: function (event, context) {
            events = events.filter(function (currentEvent) {
                return currentEvent.context !== context ||
                    currentEvent.event !== event &&
                        currentEvent.event.indexOf(event + '.') !== 0;
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * returns {Object}
         */

        emit: function (event) {
            var developments = event.split('.')
            .reduce(function (acc, nameFunction) {
                var length = acc.length;
                var newNameFunction = length > 0
                    ? [acc[length - 1], nameFunction].join('.') : nameFunction;
                acc.push(newNameFunction);

                return acc;
            }, [])
            .reverse();
            developments.forEach(function (currentFunction) {
                events.forEach(function (currentEvent) {
                    if (currentEvent.event === currentFunction) {
                        challengeEvents(currentEvent);
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
         * return {Object}
         */

        several: function (event, context, handler, times) {
            addEvent(event, context, handler, times);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * returns {Object}
         */

        through: function (event, context, handler, frequency) {
            addEvent(event, context, handler, null, frequency);

            return this;
        }
    };
}
