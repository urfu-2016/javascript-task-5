'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

function isExistParameters(event, context, student) {
    if (student !== undefined) {
        var regexp = new RegExp(event + '.');
        var isExistElement = student.event === event;
        var eventNames = student.event.match(regexp);
        var isRootEventName = eventNames !== null ? eventNames.index === 0 : false;
        var isExistStudent = student.parameters === context;

        return !isExistStudent || !(isRootEventName && isExistElement);
    }

    return false;
}

function getEmitter() {
    var subscriptions = [];

    return {

        on: function (event, context, handler) {
            subscriptions.push({
                parameters: context,
                event: event,
                func: handler
            });

            return this;
        },


        off: function (event, context) {
            for (var i = subscriptions.length; i >= 0; i--) {
                if (isExistParameters(event, context, subscriptions[i])) {
                    subscriptions.splice(i, 1);
                }
            }

            return this;
        },

        emit: function (event) {
            var namespace = event;
            event.split('.').forEach(function () {
                subscriptions.forEach(function (student) {
                    if (student.event === namespace) {
                        student.func.call(student.parameters);
                    }
                });

                namespace = namespace
                    .split('.')
                    .slice(0, -1)
                    .join('.');
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
