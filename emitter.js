'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

function initEvent(students, miniEvent) {
    for (var student in students) {
        if (students.hasOwnProperty(student) &&
            students[student].hasOwnProperty(miniEvent)) {
            students[student][miniEvent]();
        }
    }
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var students = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            if (students.indexOf(context) === -1) {
                students.push(context);
            }
            context[event] = handler.bind(context);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            delete context[event];

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            if (event === 'end') {
                return this;
            }
            var splittedEvent = event.split('.');
            for (var i = 0; i < splittedEvent.length; i++) {
                var miniEvent = splittedEvent.slice(0, splittedEvent.length - i).join('.');
                initEvent(students, miniEvent);
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
            console.info(event, context, handler, times);
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
            console.info(event, context, handler, frequency);
        }
    };
}
