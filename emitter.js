'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

function lastEvent(context, event) {
    var splittedEvent = event.split('.');
    for (var miniEvent in splittedEvent) {
        if (context.hasOwnProperty(splittedEvent[miniEvent])) {
            context = context[splittedEvent[miniEvent]];
        }
    }

    return context;
}

/**
 * @this {Object}
 * @param {Object} context
 * @returns {Function}
 */
function standartFunc(context) {
    return {
        funcs: [],

        func: function () {
            for (var f in this.funcs) {
                if (this.funcs.hasOwnProperty(f)) {
                    this.funcs[f]();
                }
            }
            if (context.hasOwnProperty('funcObj')) {
                context.funcObj.func();
            }
        }
    };
}

function execLastEvent(student, event) {
    var lEvent = lastEvent(student, event);
    if (lEvent.funcObj) {
        lEvent.funcObj.func();
    }
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var students = [];

    function eventNameSpace(event, context, handler) {
        var splittedEvent = event.split('.');
        var miniContext = context;
        handler = handler.bind(context);
        var length = splittedEvent.length;
        for (var i = 0; i < length; i++) {
            var miniEvent = splittedEvent[i];
            if (miniContext.hasOwnProperty(miniEvent)) {
                miniContext = eventExists(miniContext, miniEvent, isLastElem(i, length), handler);
            } else {
                miniContext[miniEvent] = {};
                miniContext[miniEvent].funcObj = standartFunc(miniContext);
                miniContext[miniEvent].funcObj.funcs = [handler];

                /* .bind(miniContext)(handler.bind(miniContext)); */
                miniContext[miniEvent].funcObj.funcs[0].funcname = event;
            }
        }
    }

    function isLastElem(i, length) {
        return i === length - 1;
    }

    function eventExists(miniContext, miniEvent, isLast, handler) {
        if (!isLast) {
            miniContext = miniContext[miniEvent];
        } else {
            miniContext[miniEvent].funcObj.funcs
                .push(handler); /* handler.bind(miniContext)*/
        }

        return miniContext;
    }

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
            eventNameSpace(event, context, handler);

            return this;
        },

        offRegExp: /(.*)\.(\w+)$/,

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            var lastEventSearch = this.offRegExp.exec(event);
            if (lastEventSearch) {
                var lEvent = lastEvent(context, lastEventSearch[1]);
                var property = lastEventSearch[2];
                delete lEvent[property];
            } else {
                delete context[event];
            }

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
            for (var student in students) {
                if (students.hasOwnProperty(student)) {
                    execLastEvent(students[student], event);
                }
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
