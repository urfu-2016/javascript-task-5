'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function SubscribeHandler(arg) {
    return {
        event: arg.event,
        context: arg.context,
        contextHandler: arg.handler,
        maxCount: arg.times || -1,
        frequency: arg.frequency || 1,
        count: 0,
        processEvent: function () {
            var keepDoing = this.maxCount === -1 || (this.maxCount - this.count) > 0;
            if (this.count % this.frequency === 0 && keepDoing) {
                this.contextHandler.call(this.context);
            }
            this.count++;
        }
    };
}

var subscribeQueue = [];

function addSubscribe(event, context, handler) {
    var newSubscribe = new SubscribeHandler(
        { event: event, context: context, handler: handler });
    subscribeQueue.push(newSubscribe);
}

function getSubEvents(event) {
    var events = event.split('.');
    var subEvents = [];
    for (var i = 1; i <= events.length; i++) {
        subEvents.push(events.slice(0, i).join('.'));
    }

    return subEvents;
}

function deleteSubscribe(event, context) {
    subscribeQueue = subscribeQueue.filter(function (eventHandler) {
        var same = context === eventHandler.context;
        var subEvents = getSubEvents(eventHandler.event);

        return !(same && subEvents.indexOf(event) !== -1);
    });
}

function handleEvent(event) {
    var subEvents = getSubEvents(event);
    // console.info(subEvents);
    subscribeQueue.forEach(function (eventHandler) {
        if (subEvents.indexOf(eventHandler.event) !== -1) {
            eventHandler.processEvent();
        }
    });
}

function multipleAddSubscribe(event, context, handler, times) {
    var newSubscribe = new SubscribeHandler(
        {
            event: event,
            context: context,
            handler: handler,
            times: times
        }
    );
    subscribeQueue.push(newSubscribe);
}

function addFrequentlySubscribe(event, context, handler, frequency) {
    var newSubscribe = new SubscribeHandler(
        {
            event: event,
            context: context,
            handler: handler,
            frequency: frequency
        }
    );
    subscribeQueue.push(newSubscribe);
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            // console.info(event, context, handler);
            addSubscribe(event, context, handler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            // console.info(event, context);
            deleteSubscribe(event, context);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            // console.info(event);
            handleEvent(event);

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
            // console.info(event, context, handler, times);
            multipleAddSubscribe(event, context, handler, times);

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
            // console.info(event, context, handler, frequency);
            addFrequentlySubscribe(event, context, handler, frequency);

            return this;
        }
    };
}
