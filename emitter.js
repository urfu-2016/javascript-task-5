'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
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
        eventFuncs: [],

        func: function () {
            for (var eventFunc in this.eventFuncs) {
                if (this.eventFuncs.hasOwnProperty(eventFunc)) {
                    execEventFunc(this.eventFuncs, eventFunc);
                }
            }
            if (context.hasOwnProperty('funcObj')) {
                context.funcObj.func();
            }
        }
    };
}

function execEventFunc(eventFuncs, eventFunc) {
    var eventFuncObj = eventFuncs[eventFunc];
    if (eventFuncObj.callCounter % eventFuncObj.mod === 0) {
        if (eventFuncObj.count > 0) {
            eventFuncs[eventFunc].func();
            eventFuncs[eventFunc].count--;
        } else {
            delete eventFuncs[eventFunc];

            return;
        }
    }
    eventFuncObj.callCounter++;
}

function execLastEvent(student, event) {
    var lEvent = lastEvent(student, event);
    if (lEvent.funcObj) {
        lEvent.funcObj.func();
    }
}

function createEventFunc(func, count, mod) {
    return {
        func: func,
        count: count,
        callCounter: 0,
        mod: mod
    };
}

function createEventFuncParams(count, frequency) {
    return { count: count,
    freq: frequency };
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var students = [];

    function eventNameSpace(event, context, eventFunc) {
        var splittedEvent = event.split('.');
        var miniContext = context;
        var length = splittedEvent.length;
        for (var i = 0; i < length; i++) {
            var miniEvent = splittedEvent[i];
            if (miniContext.hasOwnProperty(miniEvent)) {
                miniContext = eventExists(miniContext, miniEvent, isLastElem(i, length), eventFunc);
            } else {
                miniContext[miniEvent] = {};
                miniContext[miniEvent].funcObj = standartFunc(miniContext);
                miniContext[miniEvent].funcObj.eventFuncs = [eventFunc];
            }
        }
    }

    function isLastElem(i, length) {
        return i === length - 1;
    }

    function eventExists(miniContext, miniEvent, isLast, eventFunc) {
        if (!isLast) {
            miniContext = miniContext[miniEvent];
        } else {
            miniContext[miniEvent].funcObj.eventFuncs
                .push(eventFunc); /* handler.bind(miniContext)*/
        }

        return miniContext;
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Object} eventFuncParams
         * @returns {Object} this
         */
        on: function (event, context, handler, eventFuncParams) {
            if (students.indexOf(context) === -1) {
                students.push(context);
            }
            eventFuncParams = eventFuncParams
                ? eventFuncParams : createEventFuncParams(Infinity, 1);
            handler = handler.bind(context);
            eventNameSpace(event, context, createEventFunc(handler,
                eventFuncParams.count, eventFuncParams.freq));

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
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            return this.on(event, context, handler,
                createEventFuncParams(times <= 0 ? Infinity : times, 1));
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) { /* freq <= 0 check */
            return this.on(event, context, handler,
                createEventFuncParams(Infinity, frequency));
        }
    };
}
