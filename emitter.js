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
    return {
        callbacks: [],

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            var callback = createCallback(event, context, handler);

            this.callbacks.push(callback);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            this.callbacks = this.callbacks.filter(function (callback) {
                return !(callback.context === context && contains(callback.event, event));
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var curEvent = event;

            callCallbacks(curEvent, this.callbacks);

            while (curEvent.lastIndexOf('.') !== -1) {
                curEvent = curEvent.substr(0, curEvent.lastIndexOf('.'));
                callCallbacks(curEvent, this.callbacks);
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
            times = times || 0;

            if (times <= 0) {
                this.on(event, context, handler);
            } else {
                var callback = createCallback(event, context, handler);
                callback.times = times;

                this.callbacks.push(callback);
            }

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
            frequency = frequency || 0;

            if (frequency <= 0) {
                this.on(event, context, handler);
            } else {
                var callback = createCallback(event, context, handler);
                callback.frequency = frequency;
                callback.current = frequency - 1;

                this.callbacks.push(callback);
            }

            return this;
        }
    };
}


function contains(fullScope, scope) {
    return fullScope.match(new RegExp('^' + scope + '(\\.|$)')) !== null;
}

function callCallbacks(event, callbacks) {
    callbacks.forEach(function (callback) {
        if (callback.event === event) {
            callCallback(callback);
        }
    });
}

function callCallback(callback) {
    if (callback.times !== undefined) {
        if (callback.times <= 0) {
            return;
        }
        callback.times -= 1;
    } else if (callback.frequency !== undefined) {
        callback.current += 1;
        if (callback.current !== callback.frequency) {
            return;
        }
        callback.current = 0;
    }

    callback.handler.apply(callback.context);
}

function createCallback(event, context, handler) {
    return {
        event: event,
        context: context,
        handler: handler
    };
}
