'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function handle(eventList, event) {
    eventList.forEach(function (item) {
        if (item.event.toString() === event.toString()) {
            if (!item.filter || item.filter()) {
                item.handler.call(item.context);
            }
        }
    });
}

function hasSubsting(target, string) {
    var copy = target.slice();
    while (copy.length) {
        if (copy.toString() === string.toString()) {
            return true;
        }
        copy.pop();
    }

    return false;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var eventList = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            console.info(event, context, handler);
            eventList.push({
                event: event.split('.'),
                context: context,
                handler: handler
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            event = event.split('.');
            console.info(event, context);
            eventList = eventList.filter(function (item) {
                return item.context !== context || !hasSubsting(item.event, event);
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            event = event.split('.');
            while (event.length) {
                handle(eventList, event);
                event.pop();
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
            console.info(event, context, handler, times);
            var count = 0;

            eventList.push({
                event: event.split('.'),
                context: context,
                handler: handler,
                filter: function () {
                    return count++ < times;
                }
            });

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
            console.info(event, context, handler, frequency);
            var count = 0;

            eventList.push({
                event: event.split('.'),
                context: context,
                handler: handler,
                filter: function () {
                    return count++ % frequency === 0;
                }
            });

            return this;
        }
    };
}
