
'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

var LectureEvent = function (name) {
    this._name = name;
    this._subEvents = {};
    this._handlers = [];
    this._parent = undefined;
};

Object.defineProperties(LectureEvent.prototype, {

    _call: {
        value: function (handler) {
            var func = handler.function;
            var context = handler.context;
            if (handler.counter === undefined) {
                func(context);

                return;
            }
            if (handler.isSeveral && handler.counter > 0) {
                func(context);
                handler.counter -= 1;
            }
            if (handler.isThrough) {
                if (handler.counter === 0) {
                    func(context);
                    handler.counter = handler.freq - 1;
                } else {
                    handler.counter -= 1;
                }
            }
        }
    },
    emit: {
        value: function () {
            this._handlers.forEach(function (handler) {
                var func = handler.function;
                console.info('emit', handler.function.name, handler.context.name);
                if (func) {
                    this._call(handler);
                }
            }.bind(this));
            if (this._parent) {
                this._parent.emit();
            }
        }
    },
    setSeveral: {
        value: function (times, context) {
            if (times > 0) {
                this._handlers.forEach(function (handler) {
                    if (handler.context !== context) {

                        return;
                    }
                    handler.isSeveral = true;
                    handler.counter = times;
                });
            }
        }
    },

    setThrough: {
        value: function (freq, context) {
            if (freq > 0) {
                this._handlers.forEach(function (handler) {
                    if (handler.context !== context) {

                        return;
                    }
                    handler.isThrough = true;
                    handler.counter = 0;
                    handler.freq = freq;
                });
            }
        }
    },

    addHandler: {
        value: function (context, handler) {
            this._handlers.push({ 'function': handler.bind(context),
                                             'context': context });
        }
    },

    addSubEvent: {
        value: function (event) {
            var splitted = event.name.split('.');
            if (splitted.length > 1) {
                if (!this._subEvents[splitted[0]]) {
                    var emptyEvent = new LectureEvent(splitted[0]);
                    this.addSubEvent(emptyEvent);
                }
                event._name = splitted.slice(1, splitted.length).join('.');
                var subEvents = this._subEvents[splitted[0]];
                subEvents.forEach(function (subEvent) {
                    subEvent.addSubEvent(event);
                });
            } else {
                if (!(event.name in this._subEvents)) {
                    this._subEvents[event.name] = [];
                }
                this._subEvents[event.name].push(event);
                event._parent = this;
            }
        }
    },

    _deepDisable: {
        value: function (events, context) {
            for (var key in events) {
                if (!events[key]) {

                    return;
                }
                events[key].forEach(function (event) {
                    event._handlers = event._handlers.filter(function (handler) {

                        return handler.context !== context;
                    });
                    event._deepDisable(event._subEvents, context);
                });
            }
        }
    },
    removeEvent: {
        value: function (name, context) {
            var splitted = name.split('.');
            if (splitted.length > 0 && splitted[0] !== '') {
                name = splitted.slice(1, splitted.length).join('.');
                var subEvents = this._subEvents[splitted[0]];
                subEvents.forEach(function (subEvent) {
                    subEvent.removeEvent(name);
                });
            } else {
                this._handlers = this._handlers.filter(function (handler) {

                    return handler.context !== context;
                });
                this._deepDisable(this._subEvents, context);
            }
        }
    },
    name: {
        get: function () {

            return this._name;
        }
    },

    object: {
        get function() {

            return this._object;
        }
    }

});

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {

    return {
        _eventHandler: new LectureEvent('root'),
        _events: {},
        _addEvent: function (event, context, handler) {
            if (!(event in this._events)) {
                var lectEvent = new LectureEvent(event);
                this._eventHandler.addSubEvent(lectEvent);
                this._events[event] = lectEvent;
            }
            this._events[event].addHandler(context, handler);

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
            this._events[event].removeEvent('', context);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Emmitter} this
         */
        emit: function (event) {
            while (!(event in this._events) && event.split('.').length > 1) {
                event = event.split('.').slice(0, -1)
                .join('.');
            }
            if (!(event in this._events)) {
                return this;
            }
            this._events[event].emit();

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
            var lesEvent = this._addEvent(event, context, handler);
            lesEvent.setSeveral(times, context);

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
            var lesEvent = this._addEvent(event, context, handler, 'through');
            lesEvent.setThrough(frequency, context);

            return this;
        }
    };
}