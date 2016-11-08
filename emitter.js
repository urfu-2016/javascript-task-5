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
            for (var i = 0; i < this.events.length; i++) {
                if (this.events[i].name === event) {
                    this.events[i].info.push({
                        context: context,
                        handler: handler
                    });

                    return this;
                }
            }
            this.events.push({
                name: event,
                info: [{
                    context: context,
                    handler: handler
                }]
            });

            return this;
        },

        offFromOneEvent: function (j, context) {
            var savesInfo = [];
            for (var i = 0; i < this.events[j].info.length; i++) {
                if (this.events[j].info[i].context !== context) {
                    savesInfo.push(this.events[j].info[i]);
                }
            }
            this.events[j].info = savesInfo;

        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            for (var i = 0; i < this.events.length; i++) {
                var name = this.events[i].name;
                if ((name === event) || (name.indexOf(event + '.') === 0)) {
                    this.offFromOneEvent(i, context);
                }
            }

            return this;
        },

        /**
         * Уведомить об одном событие
         * @param {Object} info
         */
        emitForOneEvent: function (info) {
            for (var i = 0; i < info.length; i++) {
                info[i].handler.call(info[i].context);
            }
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
            for (var i = 0; i < sortedEvents.length; i++) {
                if (currentEvent.indexOf(sortedEvents[i].name) === 0) {
                    this.emitForOneEvent(sortedEvents[i].info);
                    currentEvent = sortedEvents[i].name;
                }
            }

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
