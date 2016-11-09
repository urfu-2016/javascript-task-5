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

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            console.info(event, context, handler);

            var callback = {}

            callback.event = event
            callback.context = context
            callback.handler = handler

            this.callbacks.push(callback)

            return this
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            console.info(event, context);

            for (var i = 0; i < this.callbacks.length; i++) {
                var callback = this.callbacks[i]

                if (callback.context === context && this.contains(callback.event, event)) {
                    this.callbacks.splice(i, 1)
                    i -= 1
                }
            }

            return this
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            console.info(event);

            this.realApply(event)

            while (event.lastIndexOf('.') !== -1) {
                event = event.substr(0, event.lastIndexOf('.'))
                this.realApply(event)
            }

            return this
        },

        realApply: function (event) {
            console.info(event)

            for (var i = 0; i < this.callbacks.length; i++) {
                var callback = this.callbacks[i]

                if (callback.event === event) {
                    callback.handler.apply(callback.context)
                }
            }
        },

        callbacks: [],

        contains: function (fullScope, scope) {
            if (fullScope === scope) {
                return true
            }

            while (fullScope.lastIndexOf('.') !== -1) {
                fullScope = fullScope.substr(0, fullScope.lastIndexOf('.'))

                if (fullScope === scope) {
                    return true
                }
            }

            return false
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
