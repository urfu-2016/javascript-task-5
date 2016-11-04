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
            studentEvents = studentEvents.slice().filter(function (element) {
                var equalElement = element.nameEvent.indexOf(event) === -1;
                equalElement = equalElement && element.nameEvent.indexOf(event + '.') === -1;
                var equalContext = element.context !== context;

                return equalElement || equalContext;
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
                        studentEvent.thisFriquency++;
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
                subscription.mustFriquency = frequency;
                studentEvents.push(subscription);
            }

            return this;
        }
    };
}

function createSubscription(event, context, handler) {
    return {
        get perform() {
            var condition = (this.thisFriquency - 1) % this.mustFriquency === 0;
            condition = condition && this.maxCount >= this.thisCount;

            return condition;
        },

        thisFriquency: 0,
        mustFriquency: 1,
        thisCount: 0,
        maxCount: Number.MAX_VALUE,
        nameEvent: event,
        context: context,
        handler: handler
    };
}

function sliceEvent(event) {
    var spliteEvents = event.split('.');

    return spliteEvents.slice(0, spliteEvents.length - 1).join('.');
}
