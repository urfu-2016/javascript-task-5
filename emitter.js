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
        _events: {},
        _insertEvent: function (event) {
            this._events[event] = {
                'handlers': []
            };
        },
        _addEvent: function (event, context, handler) {
            if (!(event in this._events)) {
                var eventCopy = event;
                var eventTmp = event;
                while (!(eventTmp in this._events) && eventTmp !== '') {
                    eventTmp = eventTmp.split('.').slice(0, -1)
                    .join('.');
                }
                var tails = eventCopy.replace(event + '.', '').split('.');
                while (tails.length > 0 && eventTmp !== '') {
                    eventTmp = eventTmp + '.' + tails.splice(0, 1);
                    this._insertEvent(eventTmp);
                }
                event = eventCopy;
                this._insertEvent(event);
            }
            this._events[event].handlers.push({
                'context': context,
                'function': handler.bind(context)
            });

            return this._events[event];
        },

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Emmitter} this
         */
        on: function (event, context, handler) {
            this._addEvent(event, context, handler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Emmitter} this
         */
        off: function (event, context) {
            for (var key in this._events) {
                if (key.match(event + '[.].*|' + event + '$')) {
                    this._events[key].handlers = this._events[key].handlers
                        .filter(function (handler) {

                            return handler.context !== context;
                        });
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Emmitter} this
         */
        emit: function (event) {
            while (event.split('.').length > 0 && event !== '') {
                if (event in this._events) {
                    this._events[event].handlers.forEach(function (handler) {
                        handler.function (handler.context);
                    });
                }
                event = event.split('.').slice(0, -1)
                .join('.');
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
         * @returns {Emmitter} this
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Emmitter} this
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);

            return this;
        }
    };
}
