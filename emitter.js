'use strict';

getEmitter.isStar = false;
module.exports = getEmitter;

// из строки с событием получаем массив со всеми частями, которые тоже нужно вывзвать, например:
// 'funny.slide.lol'  ===> ['funny.slide.lol', 'funny.slide', 'funny']
function makeArrayWithPartsOfEvent(event) {
    var splittedEvent = event.split('.');
    var splitLength = splittedEvent.length;
    var arrayWithPartsToCall = [];
    for (var i = 0; i < splitLength; i++) {
        var nextPart = splittedEvent.slice(0, splitLength - i).join('.');
        arrayWithPartsToCall.push(nextPart);
    }

    return arrayWithPartsToCall;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var allEvents = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         */

        on: function (event, context, handler) {
            allEvents.push({
                eventName: event,
                subscriber: context,
                action: handler
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */

        off: function (event, context) {
            allEvents = allEvents.filter(function (nextEvent) {

                return nextEvent.subscriber !== context ||
                    makeArrayWithPartsOfEvent(nextEvent.eventName).indexOf(event) === -1;
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         */

        emit: function (event) {
            var partsOfEventToCall = makeArrayWithPartsOfEvent(event);
            partsOfEventToCall.forEach(function (nextToCall) {
                allEvents.forEach(function (nextEvent) {
                    if (nextEvent.eventName === nextToCall) {
                        nextEvent.action.call(nextEvent.subscriber);
                    }
                });
            });

            return this;
        }
    };
}
