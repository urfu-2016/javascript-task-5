'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function getLastEvent(context, event) {
    var splittedEvent = event.split('.');
    splittedEvent.forEach(function (miniEvent) {
        if (context.hasOwnProperty(miniEvent)) {
            context = context[miniEvent];
        }
    });

    return context;
}

/**
 * @this {Object}
 * @param {Object} context
 * @returns {Function}
 */
function wrapFunction(context) {
    return {
        eventFuncs: [],

        func: function () {
            this.eventFuncs.forEach(function (eventFunc) {
                execEventFunc(eventFunc);
            });
            if (context.hasOwnProperty('func')) {
                context.func();
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
    if (lastEvent.func) {
        lastEvent.func();
    }
}

function createEventFunc(func, params) {
    return {
        func: func,
        count: params ? params.count || Infinity : Infinity,
        callCounter: 0,
        mod: params ? params.mod || 1 : 1
    };
}

function addEventHandler(event, context, eventFunc) {
    var splittedEvent = event.split('.');
    var miniContext = context;
    var length = splittedEvent.length;
    for (var i = 0; i < length; i++) {
        var miniEvent = splittedEvent[i];
        if (miniContext.hasOwnProperty(miniEvent)) {
            miniContext = i === length - 1 ? miniContext : miniContext[miniEvent];
        } else {
            miniContext[miniEvent] = wrapFunction(miniContext);
        }
        if (i === length - 1) {
            miniContext[miniEvent].eventFuncs.push(eventFunc);
        }
    }
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var students = [];
    var subscriptions = [];
    function on(event, context, handler, eventFuncParams) {
        if (students.indexOf(context) === -1) {
            students.push(context);
            subscriptions.push({});
        }
        var subscription = subscriptions[students.indexOf(context)];
        handler = handler.bind(context);
        addEventHandler(event, subscription, createEventFunc(handler, eventFuncParams));
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
        on: function (event, context, handler) {
            on(event, context, handler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            context = subscriptions[students.indexOf(context)];
            var splittedEvent = event.split('.');
            splittedEvent.every(function (miniEvent, index) {
                if (context.hasOwnProperty(miniEvent)) {
                    if (index === splittedEvent.length - 1) {
                        delete context[miniEvent];
                    } else {
                        context = context[miniEvent];
                    }

                    return true;
                }

                return false;
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            subscriptions.forEach(function (subscription) {
                execLastEvent(subscription, event);
            });

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
            on(event, context, handler, { count: times <= 0 ? Infinity : times });

            return this;
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
            on(event, context, handler, { mod: frequency <= 0 ? 1 : frequency });

            return this;
        }
    };
}
