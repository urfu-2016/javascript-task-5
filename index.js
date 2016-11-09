'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function executeEvent(event, events) {
    if (events.hasOwnProperty(event)) {
        events[event].forEach(function (student) {
            if (student.times > 0) {
                student.handler.call(student.context);
                student.times = student.times === undefined ? undefined : student.times - 1;
            } else if (student.frequency !== undefined && student.frequencyCounter %
                    student.frequency === 0) {
                student.handler.call(student.context);
            } else if (student.frequency === undefined && student.times === undefined) {
                student.handler.call(student.context);
            }
            student.frequencyCounter++;
        });
    }
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var events = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (events.hasOwnProperty(event)) {
                events[event].push({
                    context: context,
                    handler: handler,
                    times: undefined,
                    frequency: undefined,
                    frequencyCounter: 0
                });
            } else {
                events[event] = [{
                    context: context,
                    handler: handler,
                    times: undefined,
                    frequency: undefined,
                    frequencyCounter: 0
                }];
            }

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            var countPartsInEvent = event.split('.').length;
            Object.keys(events).forEach(function (keyEvent) {
                if (keyEvent.split('.').length < countPartsInEvent ||
                    keyEvent.split('.').slice(0, countPartsInEvent)
                    .join('.') !== event) {
                    return;
                }
                events[keyEvent] = events[keyEvent].filter(function (student) {
                    return student.context !== context;
                });
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            executeEvent(event, events);
            while (event.indexOf('.') !== -1) {
                event = event.split('.').slice(0, -1)
                .join('.');
                executeEvent(event, events);
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
            return severalOrThrough(event, context, handler, undefined, times, events, this);
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
            return severalOrThrough(event, context, handler, frequency, undefined, events, this);
        }
    };
}

function severalOrThrough() {
    var event = arguments[0];
    var context = arguments[1];
    var handler = arguments[2];
    var frequency = arguments[3];
    var times = arguments[4];
    var events = arguments[5];
    var this_ = arguments[6];
    if (frequency <= 0 || times <= 0) {
        return this_.on(event, context, handler);
    }
    if (events.hasOwnProperty(event)) {
        events[event].push({
            context: context,
            handler: handler,
            times: times,
            frequency: frequency,
            frequencyCounter: 0
        });
    } else {
        events[event] = [{
            context: context,
            handler: handler,
            times: times,
            frequency: frequency,
            frequencyCounter: 0
        }];
    }

    return this_;
}
