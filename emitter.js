'use strict';

getEmitter.isStar = false;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var allEvents = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         */

        on: function (event, context, handler) {
            allEvents.push({
                eventName: event,
                subscriber: context,
                action: handler
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */

        off: function (event, context) {
            allEvents = allEvents.filter(function (nextEvent) {

                return nextEvent.subscriber !== context ||
                    nextEvent.eventName.indexOf(event) === -1;
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         */

        emit: function (event) {
            var splittedEvent = event.split('.');
            var splitLength = splittedEvent.length;
            var partsOfEventToCall = [];
            for (var i = 0; i < splitLength; i++) {
                var nextPart = splittedEvent.slice(0, splitLength - i).join('.');
                partsOfEventToCall.push(nextPart);
            }
            partsOfEventToCall.forEach(function (nextToCall) {
                allEvents.forEach(function (nextEvent) {
                    if (nextEvent.eventName === nextToCall) {
                        nextEvent.action.call(nextEvent.subscriber);
                    }
                });
            });

            return this;
        }
    };
}
