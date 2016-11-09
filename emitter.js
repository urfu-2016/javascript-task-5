'use strict';

getEmitter.isStar = false;
module.exports = getEmitter;

function getEmitter() {
    var events = {};
    function getEventsForEmit(event) {
        var eventsForEmit = [];
        var nameEvent = '';
        event.split('.').forEach(function (e) {
            nameEvent += e;
            eventsForEmit.push(nameEvent);
            nameEvent += '.';
        });

        return eventsForEmit.reverse();
    }

    return {
        on: function (event, context, handler) {
            if (!events.hasOwnProperty(event)) {
                events[event] = [];
            }
            events[event].push({
                context: context,
                handler: handler
            });

            return this;
        },

        off: function (event, context) {
            Object.keys(events).forEach(function (eventForOff) {
                if (eventForOff === event || eventForOff.indexOf(event + '.') === 0) {
                    events[eventForOff] = events[eventForOff].filter(function (humon) {
                        return humon.context !== context;
                    });
                }
            });

            return this;
        },

        emit: function (event) {
            var eventsForEmit = getEventsForEmit(event);
            eventsForEmit.forEach(function (eventForEmit) {
                if (events.hasOwnProperty(eventForEmit)) {
                    events[eventForEmit].forEach(function (humon) {
                        humon.handler.call(humon.context);
                    });
                }
            });

            return this;
        },

        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}
