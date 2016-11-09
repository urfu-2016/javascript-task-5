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
            var _this = this;

            _this.subscriptions.forEach(function (subscription, i) {
                var subscriptionContext = subscription.context;
                var isNeededContext = context === subscriptionContext;

                var subscriptionEvent = subscription.event;
                var indexOfEvent = subscriptionEvent.indexOf(event);
                var nextSymbol = subscriptionEvent[indexOfEvent + event.length];
                var isTrueEvent = nextSymbol === '.' || nextSymbol === undefined;

                if (isNeededContext && indexOfEvent === 0 && isTrueEvent) {
                    delete _this.subscriptions[i];
                }
            });

            return _this;
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
                events.push(newEvent);
            }
            events = events.reverse();

            var _this = this;

            events.forEach(function (e) {
                _this.subscriptions.forEach(function (subscription) {
                    if (subscription.event === e) {
                        subscription.handler.call(subscription.context);
                    }
                });
            });

            return _this;
        }
    };
}
