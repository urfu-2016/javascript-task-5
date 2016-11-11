'use strict';

getEmitter.isStar = false;
module.exports = getEmitter;

function getEmitter() {
    var subscriptions = {};

    return {
        on: function (event, context, handler) {
            if (!subscriptions.hasOwnProperty(event)) {
                subscriptions[event] = [];
            }
            subscriptions[event].push({ 'context': context, 'handler': handler });

            return this;
        },

        off: function (event, context) {
            Object.keys(subscriptions).forEach(function (key) {
                if (event === key || event + '.' === key.substr(0, event.length + 1)) {
                    subscriptions[key].forEach(function (elem) {
                        if (elem.context === context) {
                            subscriptions[key].splice(subscriptions[key].indexOf(elem), 1);
                        }
                    });
                }
            });

            return this;
        },

        emit: function (event) {
            var eventsToEmit = [];
            while (event.length !== 0) {
                eventsToEmit.push(event);
                if (event.lastIndexOf('.') !== -1) {
                    event = event.slice(0, event.lastIndexOf('.'));
                } else {
                    event = '';
                }
            }
            eventsToEmit.forEach(function (eventToEmit) {
                if (subscriptions.hasOwnProperty(eventToEmit)) {
                    subscriptions[eventToEmit].forEach(function (elem) {
                        elem.handler.call(elem.context);
                    });
                }
            });

            return this;
        }
    };
}
