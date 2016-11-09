'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function executeCallback(callback) {
    if (callback.callsLeft > 0 && callback.callsCount === 0) {
        callback.handler();
    }

    callback.callsLeft--;
    callback.callsCount++;
    callback.callsCount %= callback.frequency;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var events = {};

    return {

        createEvent: function (event, context, handler, options) {
            if (!(event in events)) {
                events[event] = [];
            }
            events[event].push({
                context: context,
                handler: handler.bind(context),
                callsLeft: options.count || Infinity,
                frequency: options.frequency || 1,
                callsCount: 0
            });
        },

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Object} options
         * @returns {Object}
         */
        on: function (event, context, handler) {
            this.createEvent(event, context, handler, {});

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            Object.keys(events).forEach(function (eventName) {
                if (eventName === event || eventName.startsWith(event + '.')) {
                    events[eventName] = events[eventName].filter(function (callback) {
                        return callback.context !== context;
                    });
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var targetEvent = event;

            while (targetEvent) {
                if (targetEvent in events) {
                    events[targetEvent].forEach(executeCallback);
                }
                targetEvent = targetEvent.substring(0, targetEvent.lastIndexOf('.'));
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
            var options = { count: times > 0 ? times : Infinity };
            this.createEvent(event, context, handler, options);

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
            var options = { frequency: frequency > 0 ? frequency : 1 };
            this.createEvent(event, context, handler, options);

            return this;
        }
    };
}
