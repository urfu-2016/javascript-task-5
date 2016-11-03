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
    var events = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         */
        on: function (event, context, handler) {
            if (!events[event]) {
                events[event] = [];
            }

            events[event].push({
                student: context,
                callback: handler
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */
        off: function (event, context) {
            Object.keys(events)
                .filter(function (eventName) {
                    return event === eventName || eventName.indexOf(event + '.') !== -1;
                })
                .forEach(function (eventName) {
                    var consideredEvent = events[eventName];
                    for (var i = 0; i < consideredEvent.length; i++) {
                        if (context === consideredEvent[i].student) {
                            events[eventName].splice(i, 1);
                            i--;
                        }
                    }
                });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         */
        emit: function (event) {
            while (event) {
                if (events[event]) {
                    for (var i = 0; i < events[event].length; i++) {
                        var item = events[event][i];
                        if (item.times !== undefined) {
                            if (item.times > 0) {
                                item.callback.call(item.student);
                                item.times--;
                            }
                        } else if (item.frequency !== undefined) {
                            if (item.count % item.frequency === 0) {
                                item.callback.call(item.student);
                            }
                            item.count++;
                        } else {
                            item.callback.call(item.student);
                        }
                    }
                }

                var outerEventIndex = event.lastIndexOf('.');
                event = event.substring(0, outerEventIndex);
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
         */
        several: function (event, context, handler, times) {
            if (times <= 0) {
                this.on(event, context, handler);
            }

            if (!events[event]) {
                events[event] = [];
            }

            events[event].push({
                student: context,
                callback: handler,
                times: times
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                this.on(event, context, handler);
            }

            if (!events[event]) {
                events[event] = [];
            }

            events[event].push({
                student: context,
                callback: handler,
                frequency: frequency,
                count: 0
            });

            return this;
        }
    };
}
