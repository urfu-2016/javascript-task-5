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
    var students = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            students.push({ event: event,
                context: context,
                handler: handler }
            );

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            students = students.filter(function (subscriber) {

                return (subscriber.context !== context) || (subscriber.event !== event) &&
                    !(event.indexOf(event + '.') === 0);
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var emitEvent = [];
            var splitEvent = event.split('.');
            var flag = 1;

            for (var i = 0; i < splitEvent.length; i++) {
                var event_ = splitEvent[0];
                for (var j = 1; j < flag; j++) {
                    event_ += '.' + splitEvent[j];
                }
                flag++;
                emitEvent.push(event_);
            }
            emitEvent.reverse();

            emitEvent.forEach(function (eventt) {
                students.forEach(function (subscriber) {
                    if (subscriber.event === eventt) {
                        subscriber.handler.call(subscriber.context);
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
