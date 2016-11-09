'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

function comparer(a, b) {
    return (a.event >= b.event) ? -1 : 1;
}

function getEmitter() {
    var events = [];

    return {

        on: function (event, context, handler) {
            events.push(
                {
                    event: event,
                    context: context,
                    handler: handler
                }
            );
            events.sort(comparer);

            return this;
        },

        off: function (event, context) {
            for (var i = events.length - 1; i >= 0; i--) {
                if ((event === events[i].event.split('.')[0] || event === events[i].event) &&
                    context === events[i].context) {
                    events[i].handler = function () {
                        this.focus += 0;
                        this.wisdom += 0;
                    };
                }
            }

            return this;
        },

        emit: function (event) {
            for (var i = 0; i < events.length; i++) {
                if (event.split('.')[0] === events[i].event || event === events[i].event) {
                    events[i].handler.call(events[i].context);
                }
            }

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
