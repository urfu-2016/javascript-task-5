'use strict';

getEmitter.isStar = true;
module.exports = getEmitter;
function getEmitter() {
    var events = {};

    /**
     * Возвращает новый emitter
     * @returns {Object}
     */
    return {

        /**
         * Подписаться на событие
         * @param {String} event - событие
         * @param {Object} context - чьё событие
         * @param {Function} handler - воздействие события
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (typeof event !== 'string' || typeof context !== 'object' ||
                typeof handler !== 'function') {
                throw new TypeError('Неверный формат входящих данных');
            }
            addEvent(event, context, handler, events);

            return this;
        },

        /**
         * Отписка от события
         * @param {String} event - событие
         * @param {Object} context - чьё событие
         * @returns {Object}
         */
        off: function (event, context) {
            var deepCount = event.split('.').length;
            Object.keys(events).forEach(function (key) {
                if (event === key.split('.').slice(0, deepCount)
                        .join('.')) {
                    events[key] = events[key].filter(function (student) {
                        return student.context !== context;
                    });
                }
            });

            return this;
        },

        /**
         * Выполнить событие
         * @param {String} event - событие
         * @returns {Object}
         */
        emit: function (event) {
            var copyOfEvent = event.split('.');
            startEvents(copyOfEvent.join('.'), events);
            while (copyOfEvent.length !== 0) {
                copyOfEvent = copyOfEvent.slice(0, -1);
                startEvents(copyOfEvent.join('.'), events);
            }

            return this;
        },

        /**
         * Подписаться на определённое число дынных событий
         * @param {String} event - событие
         * @param {Object} context - чьё событие
         * @param {Function} handler - воздействие события
         * @param {Number} times - сколько событий выполнить
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            addEvent(event, context, handler, events);
            events[event][(events[event]).length - 1].times = times;

            return this;
        },


        /**
         * Подписаться на все n-ые события
         * @param {String} event - событие
         * @param {Object} context - чьё событие
         * @param {Function} handler - воздействие события
         * @param {Number} frequency - через сколько событий выполнять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            addEvent(event, context, handler, events);
            events[event][(events[event]).length - 1].frequency = frequency;

            return this;
        }
    };
}

/**
 * Добавить новое событие
 * @param {String} event - событие
 * @param {Object} context - чьё событие
 * @param {Function} handler - воздействие события
 * @param {Object} events - справочник всех событий
 */
function addEvent(event, context, handler, events) {
    var newEvent = {
        context: context,
        handler: handler,
        times: Infinity,
        frequency: 0,
        frequencyCounter: 0
    };
    if (events.hasOwnProperty(event)) {
        events[event].push(newEvent);
    } else {
        events[event] = [newEvent];
    }
}

/**
 * Выполнить событие
 * @param {String} event - событие
 * @param {Object} events - справочник всех событий
 */
function startEvents(event, events) {
    if (events.hasOwnProperty(event)) {
        events[event].forEach(function (student) {
            if (student.frequencyCounter > 0) {
                student.frequencyCounter--;
            }
            if (student.times > 0 && student.frequencyCounter === 0) {
                student.times--;
                student.frequencyCounter = student.frequency;
                student.handler.call(student.context);
            }
        });
    }
}
