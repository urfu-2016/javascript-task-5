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
    var events = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * returns {Object}
         */

        on: function (event, context, handler) {
            events.push(
                {
                    event: event,
                    context: context,
                    handler: handler
                }
            );

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
                return currentEvent.event !== event ||
                    currentEvent.context !== context &&
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
                var newNameFunction = acc.length > 0 ? [acc, nameFunction].join('.') : nameFunction;
                acc.push(newNameFunction);

                return acc;
            }, [])
            .reverse();

            developments.forEach(function (currentFunction) {
                events.forEach(function (currentEvent) {
                    if (currentEvent.event === currentFunction) {
                        currentEvent.handler.call(currentEvent.context);
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
