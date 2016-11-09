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
    return {

        events: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {

            var countCalls = arguments[3];
            var repetition = arguments[4];
            if (!(event in this.events)) {
                this.events[event] = [];
            }
            this.events[event].push({
                context: context,
                handler: handler.bind(context),
                countCalls: countCalls,
                repetition: repetition
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
            var eventsForDelete = Object.keys(this.events).filter(function (eventForDelete) {
                return eventForDelete.indexOf(event + '.') === 0 || event === eventForDelete;
            });
            eventsForDelete.forEach(function (eventForDelete) {
                this.events[eventForDelete] = this.events[eventForDelete].filter(function (signer) {
                    return signer.context !== context;
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
            var parts = event.split('.');
            var namesEvent = [];
            namesEvent.push(parts[0]);
            parts.reduce(function (prev, curr) {
                prev += '.' + curr;
                namesEvent.push(prev);

                return prev;
            });
            namesEvent.reverse();
            var filteredNames = namesEvent.filter(function (eventForCheck) {
                return (eventForCheck in this.events);
            }, this);
            filteredNames.forEach(function (eventForCall) {
                this.events[eventForCall].forEach(function (executor) {
                    executor.handler.call();
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
            console.info(event, context, handler, times);

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

            return this;
        }
    };
}
