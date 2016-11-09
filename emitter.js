'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
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
                if ((event === events[i].event.split('.')[0] || event === events[i].event) 
                    && context === events[i].context) {
                    var f = events[i].context.focus;
                    var w = events[i].context.wisdom;
                    events[i].handler.call(events[i].context);
                    var f2 = events[i].context.focus - f;
                    var w2 = events[i].context.wisdom - w;
                    events[i].context.focus -= 2 * f2;
                    events[i].context.wisdom -= 2 * w2;
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
            //console.info(event);
        },

        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}
