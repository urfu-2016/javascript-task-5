'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function isStudentEquils(student1, student2) {
    return student1 === student2;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {

    var eventStore = {};

    return {


        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            if (!eventStore.hasOwnProperty(event)) {
                eventStore[event] = [];
            }
            eventStore[event].push({
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
            Object.keys(eventStore).forEach(function (storedEvent) {
                if (storedEvent === event || storedEvent.startsWith(event + '.')) {
                    eventStore[storedEvent] = eventStore[storedEvent]
                    .filter(function (studentActivity) {
                        return !isStudentEquils(context, studentActivity.context);
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
            while (event) {
                if (eventStore.hasOwnProperty(event)) {
                    eventStore[event].forEach(function (studentActivity) {
                        studentActivity.handler.call(studentActivity.context);
                    });
                }
                event = event.substring(0, event.lastIndexOf('.'));
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

            var severalOn = function () {
                if (severalOn.currentCount > 0) {
                    handler.call(context);
                    severalOn.currentCount--;
                }
            };
            severalOn.currentCount = times;

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

            var throughOn = function () {
                throughOn.currentCount--;
                if (throughOn.currentCount === 0) {
                    handler.call(context);
                    throughOn.currentCount = frequency;
                }
            };
            // подписывает на каждое n-ое событие, начиная с первого
            throughOn.currentCount = 1;

            return this.on(event, context, throughOn);
        }
    };
}
