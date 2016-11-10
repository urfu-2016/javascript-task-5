'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

var eventListeners = {};
var currentIssueEvent = 0;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {

    return {

        on: function (event, context, handler) {
            if (!eventListeners.hasOwnProperty(event)) {
                eventListeners[event] = [];
            }

            eventListeners[event].push({
                context: context,
                handler: handler
            });

            return this;
        },

        off: function (event, context) {

            if (eventListeners.hasOwnProperty(event)) {
                var events = Object.keys(eventListeners);
                var searchedEvents = [event];

                events.forEach(function (searchedEvent) {
                    var checkEventNames = searchedEvent.split('.');
                    for (var i = 0; i < checkEventNames.length; i++) {
                        if (searchedEvent.indexOf(event) === 0) {
                            searchedEvents.push(searchedEvent);
                        }
                    }
                });
                searchedEvents.forEach(function (searchEvent) {
                    eventListeners[searchEvent].forEach(function (subscriber, i) {
                        if (subscriber.context === context) {
                            eventListeners[searchEvent].splice(i, 1);
                        }
                    });
                });
            }

            return this;
        },

        emit: function (event) {
            var namesEvent = event.split('.');

            for (var i = namesEvent.length; i > -1; i--) {
                var nameEvent = namesEvent.slice(0, i).join('.');
                if (eventListeners.hasOwnProperty(nameEvent)) {
                    runEventHandlers(nameEvent);
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
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

function runEventHandlers(event) {
    var eventsKeys = Object.keys(eventListeners);
    var eventIssue = eventsKeys.indexOf(event.split('.')[0]);

    if (currentIssueEvent - eventIssue > -1) {
        currentIssueEvent = eventIssue + 1;
        eventListeners[event].forEach(function (subscriber) {
            subscriber.handler.call(subscriber.context);
        });
    }
}
