'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function SubscribeHandler(subscribeInfo) {
    return {
        event: subscribeInfo.event,
        context: subscribeInfo.context,
        contextHandler: subscribeInfo.handler,
        maxCount: subscribeInfo.times || Number.POSITIVE_INFINITY,
        frequency: subscribeInfo.frequency || 1,
        count: 0,
        processEvent: function () {
            if (this.count % this.frequency === 0 && (this.maxCount - this.count) > 0) {
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

function decomposeEvent(event) {
    var events = event.split('.');
    var decomposedEvents = [];
    for (var i = 1; i <= events.length; i++) {
        decomposedEvents.push(events.slice(0, i).join('.'));
    }

    return decomposedEvents;
}

function filterSubscribe(event, context, subscribeQueue) {
    return subscribeQueue.filter(function (eventHandler) {
        var childEvents = decomposeEvent(eventHandler.event);

        return !(context === eventHandler.context && childEvents.indexOf(event) !== -1);
    });
}

function handleEvent(event, subscribeQueue) {
    var childEvents = decomposeEvent(event).reverse();
    childEvents.forEach(function (oneEvent) {
        subscribeQueue.forEach(function (eventHandler) {
            if (eventHandler.event === oneEvent) {
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
            subscribeQueue = filterSubscribe(event, context, subscribeQueue);

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
