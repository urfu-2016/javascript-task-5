'use strict';

getEmitter.isStar = true;
module.exports = getEmitter;

function getEmitter() {
    var events = {};
    function getEventsForEmit(event) {
        var nameOfEvent = '';

        return event
            .split('.')
            .map(function (e) {
                nameOfEvent += e + '.';

                return nameOfEvent.slice(0, -1);
            })
            .reverse();
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
                    events[eventForOff] = events[eventForOff].filter(function (record) {
                        return record.context !== context;
                    });
                }
            });

            return this;
        },

        emit: function (event) {
            var eventsForEmit = getEventsForEmit(event);
            eventsForEmit.forEach(function (eventForEmit) {
                if (events.hasOwnProperty(eventForEmit)) {
                    events[eventForEmit].forEach(function (record) {
                        record.handler.call(record.context, record);
                    });
                }
            });

            return this;
        },

        several: function (event, context, handler, times) {
            var handlerWrapper = function (record) {
                record.iteration++;
                if (record.iteration <= times) {
                    handler.call(record.context);
                }
            };
            this.on(event, context, handlerWrapper);

            return this;
        },

        through: function (event, context, handler, frequency) {
            var handlerWrapper = function (record) {
                if (record.iteration % frequency === 0) {
                    handler.call(record.context);
                    record.iteration = 0;
                }
                record.iteration++;
            };
            this.on(event, context, handlerWrapper);

            return this;
        }
    };
}
