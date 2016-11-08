'use strict';

getEmitter.isStar = false;
module.exports = getEmitter;

function getEmitter() {
    var events = {};
    // var period = 1;

    function addEvent(eventInfo) {
        if (!(events.hasOwnProperty(eventInfo.name))) {
            events[eventInfo.name] = [];
        }
        events[eventInfo.name].push({
            student: eventInfo.student,
            callback: eventInfo.callback,
            times: eventInfo.times,
            type: eventInfo.type,
            period: 1
        });
    }

    var launch = {
        'on_several': function (event) {
            if (event.times !== 0) {
                event.callback.call(event.student);
                event.times--;
            }
        },
        'through': function (event) {
            if (event.period % event.times === 0) {
                event.callback.call(event.student);
            }
            event.period++;
        }
    };

    return {

        on: function (event, context, handler) {
            addEvent({
                name: event,
                student: context,
                callback: handler,
                times: -1,
                type: 'on_several'
            });

            return this;
        },

        off: function (event, context) {
            Object.keys(events).forEach(function (e) {
                if (e.startsWith(event)) {
                    events[e] = events[e].filter(function (ev) {
                        return context !== ev.student;
                    });
                }
            });

            return this;
        },

        emit: function (event) {
            while (event) {
                if (events.hasOwnProperty(event)) {
                    events[event].forEach(function (e) {
                        launch[e.type](e);
                    });
                }
                event = event.replace(/.(\w+)$/, '');
            }

            return this;
        },

        several: function (event, context, handler, times) {
            addEvent({
                name: event,
                student: context,
                callback: handler,
                times: times === 0 ? -1 : times,
                type: 'on_several'
            });

            return this;
        },

        through: function (event, context, handler, frequency) {
            addEvent({
                name: event,
                student: context,
                callback: handler,
                times: frequency === 0 ? -1 : frequency,
                type: frequency <= 0 ? 'on_several' : 'through'
            });

            return this;
        }
    };
}
