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
    var studentEvents = [];

    return {

        /*
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         */
        on: function (event, context, handler) {
            studentEvents.push(createSubscription(event, context, handler));

            return this;
        },

        /*
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */
        off: function (event, context) {
            studentEvents = studentEvents.filter(function (element) {
                var isNotEqualEvents = element.nameEvent !== event;
                var isNotEqualEventWithPoint = element.nameEvent.indexOf(event + '.') !== 0;
                var isNotEqualContext = element.context !== context;

                return isNotEqualContext || isNotEqualEvents && isNotEqualEventWithPoint;
            });

            return this;
        },

        /*
         * Уведомить о событии
         * @param {String} event
         */
        emit: function (event) {
            var events = event.split('.');
            var currentEvent = event;
            events.forEach(function () {
                studentEvents.forEach(function (studentEvent) {
                    if (studentEvent.nameEvent === currentEvent) {
                        if (studentEvent.isMatch()) {
                            studentEvent.handler.call(studentEvent.context);
                        }
                        studentEvent.countCall++;
                    }
                });

                currentEvent = sliceEvent(currentEvent);
            });

            return this;
        },

        /*
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            if (times < 1) {
                this.on(event, context, handler);
            } else {
                var subscription = createSubscription(event, context, handler);
                subscription.maxCount = times;
                studentEvents.push(subscription);
            }

            return this;
        },

        /*
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            if (frequency < 1) {
                this.on(event, context, handler);
            } else {
                var subscription = createSubscription(event, context, handler);
                subscription.thisFrequency = frequency;
                studentEvents.push(subscription);
            }

            return this;
        }
    };
}

function createSubscription(event, context, handler) {
    return {
        isMatch: function () {
            var isCorrectFriquency = (this.countCall) % this.thisFrequency === 0;
            var isCorrectCount = this.maxCount > this.countCall;

            return isCorrectFriquency && isCorrectCount;
        },

        thisFrequency: 1,
        countCall: 0,
        maxCount: Infinity,
        nameEvent: event,
        context: context,
        handler: handler
    };
}

function sliceEvent(event) {
    var splitEvents = event.split('.');

    return splitEvents.slice(0, -1).join('.');
}
