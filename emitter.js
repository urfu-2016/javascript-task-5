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

function compareNamespaces(bigNamespace, smallNamespace) {
    var splitedBigNS = bigNamespace.split('.');
    var splitedSmallNS = smallNamespace.split('.');
    for (var i = 0; i < splitedSmallNS.length; i++) {
        if (splitedSmallNS[i] === splitedBigNS[i]) {
            continue;
        } else {
            return false;
        }
    }

    return true;
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
            for (var i = 0; i < events.length; i++) {
                if (compareNamespaces(events[i].event, event) && context === events[i].context) {
                    delete events[i].handler;
                }
            }

            return this;
        },

        emit: function (event) {
            for (var i = 0; i < events.length; i++) {
                if (compareNamespaces(event, events[i].event) && events[i].hasOwnProperty('handler')){
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
