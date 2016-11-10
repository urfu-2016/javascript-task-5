'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function executeEvent(event, events) {
    if (!events.hasOwnProperty(event)) {
        return events;
    }
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

    return events;
}

function toSubscribe(events, event, arrayCharacteristics) {
    var subscriber = {};
    var characteristics = ['context', 'handler', 'times', 'frequency', 'frequencyCounter'];
    characteristics.forEach(function (characteristic) {
        subscriber[characteristic] = arrayCharacteristics[characteristics.indexOf(characteristic)];
    });
    if (events.hasOwnProperty(event)) {
        events[event].push(subscriber);
    } else {
        events[event] = [subscriber];
    }

    return events;
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
            events = toSubscribe(events, event, [context, handler, undefined, undefined, 0]);

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
            events = executeEvent(event, events);
            while (event.indexOf('.') !== -1) {
                event = event.split('.').slice(0, -1)
                .join('.');
                events = executeEvent(event, events);
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
            if (times <= 0) {
                return this.on(event, context, handler);
            }
            events = toSubscribe(events, event, [context, handler, times, undefined, 0]);

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
            if (frequency <= 0) {
                return this.on(event, context, handler);
            }
            events = toSubscribe(events, event, [context, handler, undefined, frequency, 0]);

            return this;
        }
    };
}
