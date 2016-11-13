'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        events: [],

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            var existsEvent = false;
            this.events.forEach(function (eventsItem) {
                if (eventsItem.name === event) {
                    eventsItem.info.push({
                        context: context,
                        handler: handler
                    });
                    existsEvent = true;
                }
            });
            if (!existsEvent) {
                this.events.push({
                    name: event,
                    info: [{
                        context: context,
                        handler: handler
                    }]
                });
            }

            return this;
        },

        /**
         * Отписаться от одного события
         * @param {Number} indexOfEvent
         * @param {Object} context
         */
        offFromOneEvent: function (indexOfEvent, context) {
            var savesInfo = [];
            this.events[indexOfEvent].info.forEach(function (info) {
                if (info.context !== context) {
                    savesInfo.push(info);
                }
            });
            this.events[indexOfEvent].info = savesInfo;

        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            this.events.forEach(function (eventsItem, indexOfEvent) {
                var name = eventsItem.name;
                if ((name === event) || (name.indexOf(event + '.') === 0)) {
                    this.offFromOneEvent(indexOfEvent, context);
                }
            }, this);

            return this;
        },

        /**
         * Уведомить об одном событие
         * @param {Object} info
         */
        emitForOneEvent: function (info) {
            info.forEach(function (infoItem) {
                infoItem.handler.call(infoItem.context);
            });
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var currentEvent = event;
            var sortedEvents = this.events.slice();
            sortedEvents = sortedEvents.sort().reverse();
            sortedEvents.forEach(function (sortedEvent) {
                var name = sortedEvent.name;
                if ((currentEvent === name) || (currentEvent.indexOf(name + '.') === 0)) {
                    this.emitForOneEvent(sortedEvent.info);
                    currentEvent = sortedEvent.name;
                }
            }, this);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}
