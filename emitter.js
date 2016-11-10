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
    var hashMap = {};
    function addEvent(event, subscription) {
        if (event in hashMap) {
            hashMap[event].push(subscription);
        } else {
            hashMap[event] = [subscription];
        }
    }

    return {

        /*
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         */
        on: function (event, context, handler) {
            addEvent(event, createSubscription(context, handler));

            return this;
        },

        /*
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */
        off: function (event, context) {
            var foundEvents = Object.keys(hashMap).filter(function (key) {
                return event === key || key.indexOf(event + '.') === 0;
            });

            foundEvents.forEach(function (foundEvent) {
                hashMap[foundEvent] = (hashMap[foundEvent] || []).filter(function (hashContext) {
                    return hashContext.context !== context;
                });
            });

            return this;
        },

        /*
         * Уведомить о событии
         * @param {String} event
         */
        emit: function (event) {
            var events = [];
            while (event !== '') {
                events.push(event);
                event = sliceEvent(event);
            }
            events.forEach(function (currentEvent) {
                hashMap[currentEvent] = (hashMap[currentEvent] || [])
                    .filter(function (suscription) {
                        suscription.callEvent();

                        return suscription.maxCount > suscription.countCall;
                    });
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
                var subscription = createSubscription(context, handler);
                subscription.maxCount = times;
                addEvent(event, subscription);
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
                var subscription = createSubscription(context, handler);
                subscription.frequency = frequency;
                addEvent(event, subscription);
            }

            return this;
        }
    };
}

function createSubscription(context, handler) {
    return {
        isMatch: function () {
            var isCorrectFrequency = (this.countCall) % this.frequency === 0;
            var isCorrectCount = this.maxCount > this.countCall;

            return isCorrectFrequency && isCorrectCount;
        },

        callEvent: function () {
            if (this.isMatch()) {
                this.handler.call(this.context);
            }
            this.countCall++;
        },

        frequency: 1,
        countCall: 0,
        maxCount: Infinity,
        context: context,
        handler: handler
    };
}

function sliceEvent(event) {
    var splitEvents = event.split('.');

    return splitEvents.slice(0, -1).join('.');
}
