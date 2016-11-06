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
        _getSubNameSpaces: function (event) {
            return Object.keys(this._events).filter(function (eventName) {
                return eventName === event || eventName.match("^"+event + '[.].*');
            });
        },

        _getUpperNameSpaces: function(event) {
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
            event.handlers.push({
                'context': context,
                'function': handler.bind(context)
            });

            return event;
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
        off: function (eventName, context) {
            console.log(this._events);
            this._getSubNameSpaces(eventName).forEach(function (subEventName) {
                this._events[subEventName].handlers = this._events[subEventName].handlers
                .filter(function (handler) {
                    return handler.context !== context;
                });
            }.bind(this));

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Emmitter} this
         */
        emit: function (eventName) {
            this._getUpperNameSpaces(eventName).forEach(function (upperEventName) {
                this._events[upperEventName].handlers.forEach(function (handler) {
                    handler.function(handler.context);
                });
            }.bind(this));

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
