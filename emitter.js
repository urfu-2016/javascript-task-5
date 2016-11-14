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
    var eventStudents = {};

    return {

        /**
         * Подписаться на событие
         *
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {this}
         */
        on: function (event, context, handler) {
            console.info(event, context, handler);

            if (!eventStudents.hasOwnProperty(event)) {
                eventStudents[event] = [];
            }
            eventStudents[event].push({
                context: context,
                handler: handler
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {this}
         */
        off: function (event, context) {
            console.info(event, context);
            Object.keys(eventStudents).forEach(function (currentEvent) {
                if (this.isHasEvent(event, currentEvent)) {
                    eventStudents[currentEvent] =
                        this.filterEvents(eventStudents[currentEvent], context);
                }
            }, this);

            return this;
        },

        /**
         * Проверяем равняется ли событие данному или содержится в нем
         * @param {String} event
         * @param {String} currentEvent
         * @returns {Boolean}
         */
        isHasEvent: function (event, currentEvent) {
            return (event === currentEvent) || (currentEvent.indexOf(event + '.') === 0);
        },

        /**
         * Возвращаем только те события, которые не равны данному
         * @param {Array} arrayEvents
         * @param {String} context
         * @returns {Boolean}
         */
        filterEvents: function (arrayEvents, context) {
            return arrayEvents.filter(function (item) {
                return item.context !== context;
            });
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {this}
         */
        emit: function (event) {
            console.info(event);
            var events = this.createAllEvents(event);

            events.forEach(function (currentEvent) {
                eventStudents[currentEvent].forEach(function (student) {
                    student.handler.call(student.context);
                }, this);
            }, this);

            return this;
        },

        /**
         * Подается строка в виде "str1.str2.str3"
         * и мы выводим все события и подсобытия из данной строки
         * вывод "str1", "str1.str2", "str1.str2.str3"
         * @param {String} event
         * @returns {this}
         */
        createAllEvents: function (event) {
            var eventNames = event.split('.');
            if (eventNames.length === 1 && eventStudents.hasOwnProperty(event)) {
                return [event];
            }
            var rootEvent = eventNames.shift();
            var eventsArray = [rootEvent];

            eventNames.forEach(function (currentEvent) {
                rootEvent += '.' + currentEvent;
                eventsArray.unshift(rootEvent);
            });

            return eventsArray.filter(function (current) {
                return eventStudents.hasOwnProperty(current);
            }, this);
        },

        /**
         * Модифицируем handler под подсчет кол-ва его вызовов
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Function}
         */
        modifiedHandlerSeveral: function (context, handler, times) {
            var counter = times;
            var hand = handler;
            var currentContext = context;

            return function () {
                if (counter > 0) {
                    counter--;

                    return hand.call(currentContext);
                }
            };
        },

        /**
         * Модифицируем handler под вызово каждый n-й раз
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Function}
         */
        modifiedHandlerThrough: function (context, handler, frequency) {
            var currentFrequency = -1;
            var mustFrequency = frequency;
            var hand = handler;
            var currentContext = context;

            return function () {
                currentFrequency++;
                if (currentFrequency % mustFrequency === 0) {
                    return hand.call(currentContext);
                }
            };
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {this}
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
            if (times < 0) {
                this.on(event, context, handler);
            }

            this.on(event, context, this.modifiedHandlerSeveral(context, handler, times));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {this}
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
            if (frequency < 0) {
                this.on(event, context, handler);
            }

            this.on(event, context, this.modifiedHandlerThrough(context, handler, frequency));

            return this;
        }
    };
}

