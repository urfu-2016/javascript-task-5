'use strict';

getEmitter.isStar = true;
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
                handler: handler,
                iteration: 0
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
                        humon.handler.call(humon.context, humon);
                    });
                }
            });

            return this;
        },

        several: function (event, context, handler, times) {
            var newHandler = function (humon) {
                humon.iteration++;
                if (humon.iteration <= times) {
                    handler.call(humon.context);
                }
            };
            this.on(event, context, newHandler);

            return this;
        },

        through: function (event, context, handler, frequency) {
            var newHandler = function (humon) {
                if (humon.iteration % frequency === 0) {
                    handler.call(humon.context);
                    humon.iteration = 0;
                }
                humon.iteration++;
            };
            this.on(event, context, newHandler);

            return this;
        }
    };
}
