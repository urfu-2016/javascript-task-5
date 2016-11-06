'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

var callEvent = function (student, event) {
    event = student.events[event];
    event.count++;
    if (event.count <= event.times && event.count % event.frequency === 0) {
        event.handler.call(student);
    }
};

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        students: [],

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {on}
         */
        on: function (event, context, handler) {
            if (this.students.indexOf(context) === -1) {
                this.students.push(context);
            }

            if (!context.hasOwnProperty('events')) {
                context.events = {};
            }

            context.events[event] = {
                handler: handler,
                times: arguments[3] || Infinity,
                frequency: arguments[4] || 1,
                count: 0
            };

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {off}
         */
        off: function (event, context) {
            if (this.students.indexOf(context) !== -1 && context.hasOwnProperty('events')) {
                delete context.events[event];
                Object.keys(context.events).forEach(function (currentEvent) {
                    if (currentEvent.indexOf(event + '.') === 0) {
                        delete context.events[currentEvent];
                    }
                });
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {emit}
         */
        emit: function (event) {
            this.students.forEach(function (student) {
                var studentEvents = Object.keys(student.events);
                var events = event.split('.');
                while (events.length !== 0) {
                    var currentEvent = events.join('.');
                    if (studentEvents.indexOf(currentEvent) !== -1) {
                        callEvent(student, currentEvent);
                    }
                    events.pop();
                }
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
         * @returns {*|on}
         */
        several: function (event, context, handler, times) {
            return this.on(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {*|on}
         */
        through: function (event, context, handler, frequency) {
            return this.on(event, context, handler, undefined, frequency);
        }
    };
}
