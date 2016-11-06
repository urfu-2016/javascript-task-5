'use strict';

getEmitter.isStar = true;
module.exports = getEmitter;

function startEvents(event, events) {
    if (events.hasOwnProperty(event)) {
        events[event].forEach(function (student) {
            if (student.frequencyCounter > 0) {
                student.frequencyCounter--;
            }
            if (student.times > 0 && student.frequencyCounter === 0) {
                student.times--;
                student.frequencyCounter = student.frequency;
                student.handler.call(student.context);
            }
        });
    }
}

function getEmitter() {
    var events = {};

    return {

        on: function (event, context, handler) {
            addEvent(event, context, handler, events);

            return this;
        },

        off: function (event, context) {
            var deepCount = event.split('.').length;
            Object.keys(events).forEach(function (key) {
                if (event === key.split('.').slice(0, deepCount)
                        .join('.')) {
                    events[key] = events[key].filter(function (student) {
                        return student.context !== context;
                    });
                }
            });

            return this;
        },

        emit: function (event) {
            startEvents(event, events);
            while (event.indexOf('.') !== -1) {
                event = event.split('.').slice(0, -1)
                    .join('.');
                startEvents(event, events);
            }

            return this;
        },

        several: function (event, context, handler, times) {
            if (times < 1) {
                addEvent(event, context, handler, events);

                return this;
            }
            var newEvetn = {
                context: context,
                handler: handler,
                times: times,
                frequency: 0,
                frequencyCounter: 0
            };
            if (events.hasOwnProperty(event)) {
                events[event].push(newEvetn);
            } else {
                events[event] = [newEvetn];
            }

            return this;
        },


        through: function (event, context, handler, frequency) {
            if (frequency < 1) {
                addEvent(event, context, handler, events);

                return this;
            }
            var newEvent = {
                context: context,
                handler: handler,
                times: Infinity,
                frequency: frequency,
                frequencyCounter: 0
            };
            if (events.hasOwnProperty(event)) {
                events[event].push(newEvent);
            } else {
                events[event] = [newEvent];
            }

            return this;
        }
    };
}

function addEvent(event, context, handler, events) {
    var newEvent = {
        context: context,
        handler: handler,
        times: Infinity,
        frequency: 0,
        frequencyCounter: 0
    };
    if (events.hasOwnProperty(event)) {
        events[event].push(newEvent);
    } else {
        events[event] = [newEvent];
    }
}
