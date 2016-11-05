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
    return {
        eventStudents: {},

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

            if (!this.eventStudents.hasOwnProperty(event)) {
                this.eventStudents[event] = [];
            }
            this.eventStudents[event].push({
                context: context,
                handler: handler,
                currentFrequency: 0,
                frequency: 1,
                count: Infinity
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
            Object.keys(this.eventStudents).forEach(function (currentEvent) {
                if (this.isHasEvent(event, currentEvent)) {
                    this.eventStudents[currentEvent] =
                        this.describeEvents(this.eventStudents[currentEvent], context);
                }
            }, this);

            return this;
        },

        isHasEvent: function (event, currentEvent) {
            return (currentEvent.indexOf(event + '.') === 0) || (event === currentEvent);
        },

        describeEvents: function (arrayEvents, context) {
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
                this.eventStudents[currentEvent].forEach(function (student) {
                    if (this.isCanEmit(student)) {
                        student.handler.call(student.context);
                    }
                    student.count--;
                    student.currentFrequency++;

                }, this);
            }, this);

            return this;
        },

        isCanEmit: function (student) {
            var correctFrequency = student.currentFrequency % student.frequency === 0;

            return correctFrequency && (student.count > 0);
        },

        createAllEvents: function (event) {
            var eventNames = event.split('.');
            if (eventNames.length === 1 && this.eventStudents.hasOwnProperty(event)) {
                return [event];
            }
            var rootEvent = eventNames[0];
            var eventsArray = [rootEvent];
            eventNames.splice(0, 1);
            eventNames.forEach(function (currentEvent) {
                rootEvent += '.' + currentEvent;
                eventsArray.push(rootEvent);
            });

            return eventsArray.reverse().filter(function (current) {
                return this.eventStudents.hasOwnProperty(current);
            }, this);
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

            if (!this.eventStudents.hasOwnProperty(event)) {
                this.eventStudents[event] = [];
            }

            this.eventStudents[event].push({
                context: context,
                handler: handler,
                currentFrequency: 0,
                frequency: 1,
                count: times
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
         * @returns {this}
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
            if (frequency < 0) {
                this.on(event, context, handler);
            }

            if (!this.eventStudents.hasOwnProperty(event)) {
                this.eventStudents[event] = [];
            }

            this.eventStudents[event].push({
                context: context,
                handler: handler,
                currentFrequency: 0,
                frequency: frequency,
                count: Infinity
            });

            return this;
        }
    };
}

