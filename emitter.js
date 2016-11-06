'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;


/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {

    return {
        _events: {},
        _getSubNameSpaces: function (event) {
            return Object.keys(this._events).filter(function (eventName) {
                return eventName === event || eventName.match('^' + event + '[.].*');
            });
        },

        _getUpperNameSpaces: function (event) {
            var events = [];
            while (event.split('.').length > 0 && event !== '') {
                if (event in this._events) {
                    events.push(event);
                }
                event = event.split('.').slice(0, -1)
                .join('.');
            }

            return events;
        },

        _createEvent: function (eventName) {
            if (!(eventName in this._events)) {
                this._events[eventName] = { 'handlers': [], 'name': eventName };
            }

            return this._events[eventName];
        },

        _addEvent: function (eventName, context, handler) {
            var event = this._createEvent(eventName);
            var handlerWraper = {
                'context': context,
                'function': handler.bind(context),
                'counter': 0
            };
            event.handlers.push(handlerWraper);

            return handlerWraper;
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
         * @param {String} eventName
         * @param {Object} context
         * @returns {Emmitter} this
         */
        off: function (eventName, context) {
            this._getSubNameSpaces(eventName).forEach(function (subEventName) {
                this._events[subEventName].handlers = this._events[subEventName].handlers
                .filter(function (handler) {
                    return handler.context !== context;
                });
            }.bind(this));

            return this;
        },

        _canEmit: function (handler) {
            if (handler.isSeveral) {
                if (handler.counter >= handler.times) {

                    return false;
                }
            }
            if (handler.isThrough) {
                if (handler.counter % handler.freq !== 0) {

                    return false;
                }
            }

            return true;
        },


        /**
         * Уведомить о событии
         * @param {String} eventName
         * @returns {Emmitter} this
         */
        emit: function (eventName) {
            this._getUpperNameSpaces(eventName).forEach(function (upperEventName) {
                this._events[upperEventName].handlers.forEach(function (handler) {
                    if (this._canEmit(handler)) {
                        handler.function(handler.context);
                    }
                    handler.counter += 1;
                }.bind(this));
            }.bind(this));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} eventName
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Emmitter} this
         */
        several: function (eventName, context, handler, times) {
            var handlerWraper = this._addEvent(eventName, context, handler);
            handlerWraper.isSeveral = true;
            handlerWraper.times = times;

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} eventName
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Emmitter} this
         */
        through: function (eventName, context, handler, frequency) {
            var handlerWraper = this._addEvent(eventName, context, handler);
            handlerWraper.isThrough = true;
            handlerWraper.freq = frequency;

            return this;
        }
    };
}
