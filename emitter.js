'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        subscriptions: [],

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            this.subscriptions.push({
                event: event,
                context: context,
                handler: handler
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            this.subscriptions.forEach(function (subscription, i) {
                var subscriptionContext = subscription.context;
                var isNeededContext = context === subscriptionContext;

                var subscriptionEvent = subscription.event;
                var eventIndex = subscriptionEvent.indexOf(event);
                var nextSymbol = subscriptionEvent[eventIndex + event.length];
                var isTrueEvent = nextSymbol === '.' || nextSymbol === undefined;

                if (isNeededContext && eventIndex === 0 && isTrueEvent) {
                    delete this.subscriptions[i];
                }
            }, this);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var eventParts = event.split('.');
            var events = [];

            for (var i = 0; i < eventParts.length; i++) {
                var newEvent = eventParts.slice(0, i + 1).join('.');
                events.unshift(newEvent);
            }

            events.forEach(function (e) {
                this.subscriptions.forEach(function (subscription) {
                    if (subscription.event === e) {
                        subscription.handler.call(subscription.context);
                    }
                });
            }, this);

            return this;
        }
    };
}
