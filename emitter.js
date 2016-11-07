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
        maxCount: arg.times || Number.POSITIVE_INFINITY,
        frequency: arg.frequency || 1,
        count: 0,
        processEvent: function () {
            var keepDoing = (this.maxCount - this.count) > 0;
            if (this.count % this.frequency === 0 && keepDoing) {
                this.contextHandler.call(this.context);
            }
            this.count++;
        }
    };
}

function addSubscribe(event, context, handler, subscribeQueue) {
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

function deleteSubscribe(event, context, subscribeQueue) {
    return subscribeQueue.filter(function (eventHandler) {
        var same = context === eventHandler.context;
        var subEvents = getSubEvents(eventHandler.event);

        return !(same && subEvents.indexOf(event) !== -1);
    });
}

function handleEvent(event, subscribeQueue) {
    var subEvents = getSubEvents(event).reverse();
    console.info(subEvents);
    subEvents.forEach(function (subEvent) {
        subscribeQueue.forEach(function (eventHandler) {
            if (eventHandler.event === subEvent) {
                eventHandler.processEvent();
            }
        });
    });
}

function multipleAddSubscribe(subscribeInfo, subscribeQueue) {
    var newSubscribe = new SubscribeHandler(subscribeInfo);
    subscribeQueue.push(newSubscribe);
}

function addFrequentlySubscribe(subscribeInfo, subscribeQueue) {
    var newSubscribe = new SubscribeHandler(subscribeInfo);
    subscribeQueue.push(newSubscribe);
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var subscribeQueue = [];

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
            addSubscribe(event, context, handler, subscribeQueue);

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
            subscribeQueue = deleteSubscribe(event, context, subscribeQueue);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            // console.info(event);
            handleEvent(event, subscribeQueue);

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
            times = times > 0 ? times : undefined;
            var subscribeInfo = { event: event, context: context,
                handler: handler, times: times };
            multipleAddSubscribe(subscribeInfo, subscribeQueue);

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
            frequency = frequency > 0 ? frequency : undefined;
            var subscribeInfo = { event: event, context: context,
                handler: handler, frequency: frequency };
            addFrequentlySubscribe(subscribeInfo, subscribeQueue);

            return this;
        }
    };
}
