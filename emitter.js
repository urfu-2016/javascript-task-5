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
                var notEqualElement = element.nameEvent !== event;
                var notEndPoint = element.nameEvent.indexOf(event + '.') !== 0;
                var notEqualContext = element.context !== context;

                return notEqualContext || notEqualElement && notEndPoint;
            });

            return this;
        },

        /*
         * Уведомить о событии
         * @param {String} event
         */
        emit: function (event) {
            var divideEvents = event.split('.');
            var fullEvent = event;
            divideEvents.forEach(function () {
                studentEvents.forEach(function (studentEvent) {
                    if (studentEvent.nameEvent === fullEvent) {
                        studentEvent.thisCount++;
                        studentEvent.thisFrequency++;
                        if (studentEvent.perform) {
                            studentEvent.handler.call(studentEvent.context);
                        }
                    }
                });

                fullEvent = sliceEvent(fullEvent);
            });

            return this;
        },

        /*
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param { } event
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
                subscription.mustFrequency = frequency;
                studentEvents.push(subscription);
            }

            return this;
        }
    };
}

function createSubscription(event, context, handler) {
    return {
        get perform() {
            var correctFriquency = (this.thisFrequency) % this.mustFrequency === 0;
            var correctCount = this.maxCount >= this.thisCount;

            return correctFriquency && correctCount;
        },

        thisFrequency: 1,
        mustFrequency: 1,
        thisCount: 0,
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
