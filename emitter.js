'use strict';

getEmitter.isStar = false;
module.exports = getEmitter;

function getEmitter() {
    var subscribed = {};

    return {
        on: function (event, context, handler) {
            if (!subscribed.hasOwnProperty(event)) {
                subscribed[event] = [];
            }
            subscribed[event].push({ 'context': context, 'handler': handler });

            return this;
        },

        off: function (event, context) {
            Object.keys(subscribed).forEach(function (key) {
                if (event === key || event === key.substr(0, event.length) + '.') {
                    subscribed[key].forEach(function (elem) {
                        if (elem.context === context) {
                            subscribed[key].splice(subscribed[key].indexOf(elem), 1);
                        }
                    });
                }
            });

            return this;
        },

        emit: function (event) {
            var allEvents = [];
            while (event.length !== 0) {
                allEvents.push(event);
                if (event.lastIndexOf('.') !== -1) {
                    event = event.slice(0, event.lastIndexOf('.'));
                } else {
                    event = '';
                }
            }
            allEvents.forEach(function (item) {
                if (subscribed.hasOwnProperty(item)) {
                    subscribed[item].forEach(function (elem) {
                        elem.handler.call(elem.context);
                    });
                }
            });

            return this;
        }
    };
}
