'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

function getLastEvent(context, event) {
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
function standartizeFunc(context) {
    return {
        eventFuncs: [],

        func: function () {
            this.eventFuncs.forEach(function (eventFunc) {
                execEventFunc(eventFunc);
            });
            if (context.hasOwnProperty('funcObj')) {
                context.funcObj.func();
            }
        }
    };
}

function execEventFunc(eventFunc) {
    if (eventFunc.count > 0 && eventFunc.callCounter % eventFunc.mod === 0) {
        eventFunc.func();
        eventFunc.count--;
    }
    eventFunc.callCounter++;
}

function execLastEvent(student, event) {
    var lastEvent = getLastEvent(student, event);
    if (lastEvent.funcObj) {
        lastEvent.funcObj.func();
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

    function addEventHandler(event, context, eventFunc) {
        var splittedEvent = event.split('.');
        var miniContext = context;
        var length = splittedEvent.length;
        for (var i = 0; i < length; i++) {
            var miniEvent = splittedEvent[i];
            if (miniContext.hasOwnProperty(miniEvent)) {
                miniContext = changeContextIfEventExists(miniContext,
                    miniEvent, isLastElem(i, length), eventFunc);
            } else {
                miniContext = changeContextIfEventNotExists(miniContext, miniEvent,
                    isLastElem(i, length), eventFunc);
            }
        }
    }

    function isLastElem(i, length) {
        return i === length - 1;
    }

    function changeContextIfEventExists(miniContext, miniEvent, isLast, eventFunc) {
        if (!isLast) {
            miniContext = miniContext[miniEvent];
        } else {
            miniContext[miniEvent].funcObj.eventFuncs
                .push(eventFunc);
        }

        return miniContext;
    }

    function changeContextIfEventNotExists(miniContext, miniEvent, isLast, eventFunc) {
        miniContext[miniEvent] = {};
        miniContext[miniEvent].funcObj = standartizeFunc(miniContext);
        if (isLast) {
            miniContext[miniEvent].funcObj.eventFuncs = [eventFunc];
        } else {
            miniContext[miniEvent].funcObj.eventFuncs = [];
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
            addEventHandler(event, context, createEventFunc(handler,
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
                var lastEvent = getLastEvent(context, lastEventSearch[1]);
                var property = lastEventSearch[2];
                delete lastEvent[property];
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
        through: function (event, context, handler, frequency) {
            return this.on(event, context, handler,
                createEventFuncParams(Infinity, frequency > 0
                    ? frequency : 1));
        }
    };
}
