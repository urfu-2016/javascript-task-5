'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function getEventHandler(subscription, event) {
    var splittedEvent = event.split('.');
    splittedEvent.every(function (miniEvent) {
        if (subscription.hasOwnProperty(miniEvent)) {
            subscription = subscription[miniEvent];

            return true;
        }

        return false;
    });

    return subscription.func ? subscription : undefined;
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
            if (context.func) {
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

function execLastEvent(subscription, event) {
    var lastEventHandler = getEventHandler(subscription, event);
    if (lastEventHandler) {
        lastEventHandler.func();
    }
}

function createEventFunc(func, params) {
    return {
        func: func,
        count: params && params.count > 0 && params.count || Infinity,
        callCounter: 0,
        mod: params && params.mod > 0 && params.mod || 1
    };
}

function addEventHandler(event, subscription, eventFunc) {
    var splittedEvent = event.split('.');
    var miniContext = subscription;
    var length = splittedEvent.length;
    for (var i = 0; i < length; i++) {
        var miniEvent = splittedEvent[i];
        var isLast = i === length - 1;
        if (miniContext.hasOwnProperty(miniEvent)) {
            miniContext = isLast ? miniContext : miniContext[miniEvent];
        } else {
            miniContext[miniEvent] = wrapFunction(miniContext);
        }
        if (isLast) {
            miniContext[miniEvent].eventFuncs.push(eventFunc);
        }
    }
}

function getSubscriptionObject(subscriptionObjects, student) {
    return subscriptionObjects.reduce(function (subscrObj, subscriptionObj) {
        if (subscriptionObj.student === student) {
            subscrObj = subscriptionObj;
        }

        return subscrObj;
    }, undefined);
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var subscriptionObjects = [];
    function on(event, context, handler, eventFuncParams) {
        var subscrObj = getSubscriptionObject(subscriptionObjects, context);
        if (!subscrObj) {
            subscriptionObjects.push({
                student: context,
                subscription: {}
            });
            subscrObj = subscriptionObjects[subscriptionObjects.length - 1];
        }
        var subscription = subscrObj.subscription;
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
            var subscription = getSubscriptionObject(subscriptionObjects, context).subscription;
            var splittedEvent = event.split('.');
            splittedEvent.every(function (miniEvent, index) {
                if (subscription.hasOwnProperty(miniEvent)) {
                    if (index === splittedEvent.length - 1) {
                        delete subscription[miniEvent];
                    } else {
                        subscription = subscription[miniEvent];
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
            subscriptionObjects.forEach(function (subscriptionObject) {
                execLastEvent(subscriptionObject.subscription, event);
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
            on(event, context, handler, { count: times });

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
            on(event, context, handler, { mod: frequency });

            return this;
        }
    };
}
