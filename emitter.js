'use strict';

getEmitter.isStar = true;
module.exports = getEmitter;

function getEmitter() {
    var events = {};

    function addEvent(eventName, eventInfo) {
        if (!events.hasOwnProperty(eventName)) {
            events[eventName] = [];
        }
        eventInfo.period = 0;
        events[eventName].push(eventInfo);
    }

    var launch = function (event) {
        if (event.period % event.frequency === 0 && event.times) {
            event.callback.call(event.student);
            event.times--;
        }
        event.period++;
    };

    return {
        on: function (event, context, handler) {
            addEvent(event, {
                student: context,
                callback: handler,
                times: -1,
                frequency: 1
            });

            return this;
        },

        off: function (event, context) {
            Object.keys(events).forEach(function (eventObject) {
                if (eventObject.startsWith(event + '.') || eventObject === event) {
                    events[eventObject] = events[eventObject].filter(function (currentEvent) {
                        return context !== currentEvent.student;
                    });
                }
            });

            return this;
        },

        emit: function (event) {
            while (event) {
                if (events.hasOwnProperty(event)) {
                    events[event].forEach(function (eventObject) {
                        launch(eventObject);
                    });
                }
                event = event.replace(/.(\w+)$/, '');
            }

            return this;
        },

        several: function (event, context, handler, times) {
            addEvent(event, {
                student: context,
                callback: handler,
                times: times || -1,
                frequency: 1
            });

            return this;
        },

        through: function (event, context, handler, frequency) {
            addEvent(event, {
                student: context,
                callback: handler,
                times: -1,
                frequency: frequency <= 0 ? 1 : frequency
            });

            return this;
        }
    };
}
