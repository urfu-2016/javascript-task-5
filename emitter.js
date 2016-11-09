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

        _getSpacesByRegExp: function (regexp) {

            return Object.keys(this._events).filter(function (eventName) {

                return eventName.match(regexp) !== null;
            });
        },

        _getSubNameSpaces: function (event) {
            return this._getSpacesByRegExp('^' + event + '[.].*').concat(event);
        },

        _getUpperNameSpaces: function (event) {
            var events = [];
            while (event) {
                events = events.concat(this._getSpacesByRegExp('^' + event + '$'));
                event = event.split('.').slice(0, -1)
                    .join('.');
            }

            return events;
        },

        _createEvent: function (eventName) {
            if (!(eventName in this._events)) {
                this._events[eventName] = { 'handlerWrappers': [] };
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
            event.handlerWrappers.push(handlerWraper);

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
                this._events[subEventName].handlerWrappers =
                 this._events[subEventName].handlerWrappers
                .filter(function (handlerWrapper) {
                    return handlerWrapper.context !== context;
                });
            }.bind(this));

            return this;
        },

        _canEmit: function (handlerWrapper) {
            if (handlerWrapper.isSeveral) {
                if (handlerWrapper.counter >= handlerWrapper.times) {

                    return false;
                }
            }
            if (handlerWrapper.isThrough) {
                if (handlerWrapper.counter % handlerWrapper.frequency !== 0) {

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
            var _this = this;
            this._getUpperNameSpaces(eventName).forEach(function (upperEventName) {
                _this._events[upperEventName].handlerWrappers.forEach(function (handlerWrapper) {
                    if (_this._canEmit(handlerWrapper)) {
                        handlerWrapper.function(handlerWrapper.context);
                    }
                    handlerWrapper.counter += 1;
                });
            });

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
            handlerWraper.frequency = frequency;

            return this;
        }
    };
}
