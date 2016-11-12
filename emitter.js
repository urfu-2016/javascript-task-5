'use strict';

getEmitter.isStar = true;
module.exports = getEmitter;

function getEmitter() {
    var events = {};

    function addEvent(eventInfo) {
        if (!events.hasOwnProperty(eventInfo.name)) {
            events[eventInfo.name] = [];
        }
        events[eventInfo.name].push({
            student: eventInfo.student,
            callback: eventInfo.callback,
            times: eventInfo.times,
            frequency: eventInfo.frequency,
            period: 0
        });
    }

    var launch = function (event) {
        if (event.period % event.times === 0) {
            if (event.times) {
                event.callback.call(event.student);
                event.times--;
            }
        }
        event.period++;
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
                if (e.startsWith(event + '.') || e === event) {
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
                        launch(e);
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
                times: times || -1,
                frequence: 1
            });

            return this;
        },

        through: function (event, context, handler, frequency) {
            addEvent({
                name: event,
                student: context,
                callback: handler,
                times: -1,
                frequence: frequency || -1
            });

            return this;
        }
    };
}
