'use strict';

getEmitter.isStar = false;
module.exports = getEmitter;

function getevents(event) {
    var events = [];
    var lastDotIndex = event.lastIndexOf('.');
    while (lastDotIndex > 0) {
        events.push(event);
        event = event.slice(0, lastDotIndex);
        lastDotIndex = event.lastIndexOf('.');
    }
    events.push(event);

    return events;
}

function getSubEvents(allEvents, event) {
    var subEvents = [];
    allEvents.forEach(function (elem) {
        if (elem.startsWith(event + '.') || elem === event) {
            subEvents.push(elem);
        }
    });

    return subEvents;
}

function getEmitter() {
    var subscribers = {};

    return {
        on: function (event, context, handler) {
            if (!subscribers.hasOwnProperty(event)) {
                subscribers[event] = [];
            }
            subscribers[event].push({ 'context': context, 'handler': handler });

            return this;
        },

        off: function (event, context) {
            var allEvents = Object.keys(subscribers);
            var subEvents = getSubEvents(allEvents, event);
            subEvents.forEach(function (elem) {
                subscribers[elem] = subscribers[elem].filter(function (subscriber) {
                    return subscriber.context !== context;
                });
            });

            return this;
        },


        emit: function (event) {
            var events = getevents(event);
            events.forEach(function (elem) {
                if (subscribers.hasOwnProperty(elem)) {
                    subscribers[elem].forEach(function (subscriber) {
                        subscriber.handler.call(subscriber.context);
                    });
                }
            });

            return this;
        }
    };
}
