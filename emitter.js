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
            if (existsEvent === false) {
                this.events.push({
                    name: event,
                    info: [{
                        context: context,
                        handler: handler
                    }],
                    off: function (cont) {
                        var savesInfo = [];
                        this.info.forEach(function (infoItem) {
                            if (infoItem.context !== cont) {
                                savesInfo.push(infoItem);
                            }
                        });
                        this.info = savesInfo;
                    },
                    emit: function () {
                        this.info.forEach(function (infoItem) {
                            infoItem.handler.call(infoItem.context);
                        });
                    }
                });
            }

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            this.events.forEach(function (eventsItem) {
                var name = eventsItem.name;
                if ((name === event) || (name.indexOf(event + '.') === 0)) {
                    eventsItem.off(context);
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
//  eventsInReverseOrder содержит "подсобытия" события event по возрастанию длины имен
            var eventsInOrder = [];
            this.events.forEach(function (eventsItem) {
                var name = eventsItem.name;
                if ((name === event) || (event.indexOf(name + '.') === 0)) {
                    var indexEvent = eventsItem.name.split('.').length + 1;
                    eventsInOrder[indexEvent] = eventsItem;
                }
            });
            eventsInOrder.reverse().forEach(function (eventsItem) {
                eventsItem.emit();
            });

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
