'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;
var HashMap = require('hashmap');

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        events: new HashMap(),

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (this.events.has(event)) {
                this.events.get(event).info.push({
                    context: context,
                    handler: handler
                });
            } else {
                this.events.set(event, {
                    name: event,
                    info: [{
                        context: context,
                        handler: handler
                    }],
                    _runHandler: function (infoItem) {
                        infoItem.handler.call(infoItem.context);
                    },
                    off: function (cont) {
                        this.info = this.info.filter(function (infoItem) {

                            return (infoItem.context !== cont);
                        });
                    },
                    emit: function () {
                        this.info.forEach(function (infoItem) {
                            this._runHandler(infoItem);
                        }, this);
                    }
                });
            }

            return this;
        },

        /**
         * Должно ли запускаться name1 после name2
         * @param {String} name1
         * @param {String} name2
         * @returns {Boolean}
         */
        _isSubName: function (name1, name2) {

            return (name1 === name2) || (name2.indexOf(name1 + '.') === 0);
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */

        off: function (event, context) {
            this.events.forEach(function (value, key) {
                if (this._isSubName(event, key)) {
                    this.events.get(key).off(context);
                }
            }, this);

            return this;
        },

        /**
         * Удалить из строки все правее последней звездочки включительно
         * @param {String} str
         * @returns {String}
         */
        _deleteLastDot: function (str) {
            var indexLastDot = str.lastIndexOf('.');

            return str.substring(0, indexLastDot);
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var currentEvent = event;
            while (currentEvent !== '') {
                if (this.events.has(currentEvent)) {
                    this.events.get(currentEvent).emit();
                }
                currentEvent = this._deleteLastDot(currentEvent);
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
