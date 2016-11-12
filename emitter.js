'use strict';

getEmitter.isStar = false;
module.exports = getEmitter;

function getParentEvents(event) {
    var upperEvents = [];
    while (event.lastIndexOf('.') > 0) {
        upperEvents.push(event);
        event = event.slice(0, event.lastIndexOf('.'));
    }
    upperEvents.push(event);

    return upperEvents;
}

function getSubEvents(allEvents, event) {
    var subEvents = [];
    allEvents.forEach(function (event_) {
        if (event_.indexOf(event + '.') == 0 || event_ === event) {
            subEvents.push(event_);
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
            subscribers[event].push({ 'context': context, 'handler': handler.bind(context) });

            return this;
        },

        off: function (event, context) {
            var allEvents = Object.keys(subscribers);
            var subEvents = getSubEvents(allEvents, event);
            subEvents.forEach(function (subEvent) {
                subscribers[subEvent].forEach(function (subscriber) {
                    if (subscriber.context === context) {
                        subscribers[subEvent].splice(subscribers[subEvent].indexOf(subscriber), 1);
                    }
                });
            });

            return this;
        },


        emit: function (event) {
            var parentEvents = getParentEvents(event);
            parentEvents.forEach(function (elem) {
                if (subscribers.hasOwnProperty(elem)) {
                    subscribers[elem].forEach(function (subscriber) {
                        subscriber.handler.call();
                    });
                }
            });

            return this;
        }
    };
}
