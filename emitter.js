'use strict';

getEmitter.isStar = false;
module.exports = getEmitter;

// из строки с событием получаем массив со всеми подсобытиями, которые нужно вывзвать, например:
// 'funny.slide.lol'  ===> ['funny.slide.lol', 'funny.slide', 'funny']
function getSubevents(eventName) {
    var eventParts = eventName.split('.');
    var partsNumber = eventParts.length;
    var subevents = [];

    for (var i = 0; i < partsNumber; i++) {
        var subevent = eventParts.slice(0, partsNumber - i).join('.');
        subevents.push(subevent);
    }

    return subevents;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var events = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} eventName
         * @param {Object} context
         * @param {Function} handler
         */

        on: function (eventName, context, handler) {
            events.push({
                eventName: eventName,
                context: context,
                handler: handler
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} eventName
         * @param {Object} context
         */

        off: function (eventName, context) {
            events = events.filter(function (event) {
                return event.context !== context ||
                    getSubevents(event.eventName).indexOf(eventName) === -1;
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} eventName
         */

        emit: function (eventName) {
            var subeventsToCall = getSubevents(eventName);
            subeventsToCall.forEach(function (subeventToCall) {
                events.forEach(function (event) {
                    if (event.eventName === subeventToCall) {
                        event.handler.call(event.context);
                    }
                });
            });

            return this;
        }
    };
}
