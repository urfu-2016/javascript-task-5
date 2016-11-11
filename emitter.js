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
    var eventsStore = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            if (!eventsStore.hasOwnProperty(event)) {
                eventsStore[event] = [];
            }
            eventsStore[event].push({
                context: context,
                handler: handler
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            Object.keys(eventsStore).forEach(function (storedEvent) {
                if (storedEvent === event || storedEvent.indexOf(event + '.') === 0) {
                    eventsStore[storedEvent] = eventsStore[storedEvent]
                    .filter(function (studentHandler) {
                        return context !== studentHandler.context;
                    });
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            var tmpEvent = event.substr(0);
            while (tmpEvent) {
                if (eventsStore.hasOwnProperty(tmpEvent)) {
                    eventsStore[tmpEvent].forEach(function (studentHandler) {
                        studentHandler.handler.call(studentHandler.context);
                    });
                }
                tmpEvent = tmpEvent.substring(0, tmpEvent.lastIndexOf('.'));
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
         * @returns {Object} this
         */
        several: function (event, context, handler, times) {
            if (times <= 0) {
                return this.on(event, context, handler);
            }

            var curTimes = times;
            var severalOn = function () {
                if (curTimes > 0) {
                    handler.call(context);
                    curTimes--;
                }
            };

            this.on(event, context, severalOn);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} this
         */
        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                return this.on(event, context, handler);
            }

            // подписывает на каждое n-ое событие, начиная с первого
            var curTimeToNextAct = 1;
            var throughOn = function () {
                curTimeToNextAct--;
                if (curTimeToNextAct === 0) {
                    handler.call(context);
                    curTimeToNextAct = frequency;
                }
            };

            return this.on(event, context, throughOn);
        }
    };
}
