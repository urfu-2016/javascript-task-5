'use strict';

getEmitter.isStar = true;
module.exports = getEmitter;
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
            var copyOfEvent = event.slice();
            startEvents(copyOfEvent, events);
            while (copyOfEvent.indexOf('.') !== -1) {
                copyOfEvent = copyOfEvent.split('.').slice(0, -1)
                    .join('.');
                startEvents(copyOfEvent, events);
            }

            return this;
        },

        several: function (event, context, handler, times) {
            addEvent(event, context, handler, events);
            events[event][(events[event]).length - 1].times = times;

            return this;
        },


        through: function (event, context, handler, frequency) {
            addEvent(event, context, handler, events);
            events[event][(events[event]).length - 1].frequency = frequency;

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
