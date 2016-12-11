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
        callbacks: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            var callback = createCallback(context, handler);
            saveCallback(event, callback, this.callbacks);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            for (var savedEvent in this.callbacks) {
                if (contains(savedEvent, event)) {
                    this.callbacks[savedEvent] = this.callbacks[savedEvent]
                    .filter(function (callback) {
                        return callback.context !== context;
                    });
                }
            }

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
                var callback = createCallback(context, handler);
                callback.times = times;

                saveCallback(event, callback, this.callbacks);
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
                var callback = createCallback(context, handler);
                callback.frequency = frequency;
                callback.current = frequency - 1;

                saveCallback(event, callback, this.callbacks);
            }

            return this;
        }
    };
}

function contains(fullScope, scope) {
    return fullScope === scope || fullScope.indexOf(scope + '.') === 0;
}

function callCallbacks(event, callbacks) {
    if (callbacks.hasOwnProperty(event)) {
        callbacks[event].forEach(callCallback);
    }
}

function callCallback(callback) {
    if (callback.hasOwnProperty('times')) {
        if (callback.times <= 0) {
            return;
        }
        callback.times -= 1;
    } else if (callback.hasOwnProperty('frequency')) {
        callback.current += 1;
        if (callback.current !== callback.frequency) {
            return;
        }
        callback.current = 0;
    }

    callback.handler.apply(callback.context);
}

function createCallback(context, handler) {
    return {
        context: context,
        handler: handler
    };
}

function saveCallback(event, callback, callbacks) {
    if (!callbacks.hasOwnProperty(event)) {
        callbacks[event] = [];
    }

    callbacks[event].push(callback);
}
