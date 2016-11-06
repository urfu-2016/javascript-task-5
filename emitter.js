'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

var LectureEvent = function (name, object, func) {
    this._name = name;
    this._subEvents = {};
    if (func) {
        this._function = func.bind(object);
    }
    this._object = object;
    this._counter = undefined;
    this._isSeveral = false;
    this._isThrough = false;
    this._freq = undefined;
    this._parents = [];
};

Object.defineProperties(LectureEvent.prototype, {

    _call: {
        value: function (func, object) {
            if (this._counter === undefined) {
                func(object);

                return;
            }
            if (this._isSeveral && this._counter > 0) {
                func(object);
                this._counter -= 1;
            }
            if (this._isThrough) {
                if (this._counter === 0) {
                    func(object);
                    this._counter = this._freq - 1;
                } else {
                    this._counter -= 1;
                }
            }
        }
    },
    emit: {
        value: function () {

            if (this._function) {
                this._call(this._function, this._object);
            }
            this._parents.forEach(function (parent) {
                parent.emit();
            });
        }
    },

    setSeveral: {
        value: function (times) {
            if (times > 0) {
                this._isSeveral = true;
                this._counter = times;
            }
        }
    },

    setThrough: {
        value: function (freq) {
            if (freq > 0) {
                this._isThrough = true;
                this._counter = 0;
                this._freq = freq;
            }
        }
    },

    addSubEvent: {
        value: function (event) {
            if (event._object !== this._object && this._object !== undefined) {

                return;
            }
            var splitted = event.name.split('.');
            if (splitted.length > 1) {
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
                event._parents.push(this);
            }
        }
    },
    _deepDisable: {
        value: function (events) {
            for (var key in events) {
                if (!events[key]) {

                    return;
                }
                events[key].forEach(function (event) {
                    event._function = undefined;
                    this._deepDisable(event._subEvents);
                }.bind(this));
            }
        }

    },
    removeEvent: {
        value: function (name, object) {
            if (object !== this._object && this._object !== undefined) {

                return;
            }
            var splitted = name.split('.');
            if (splitted.length > 0 && splitted[0] !== '') {
                name = splitted.slice(1, splitted.length).join('.');
                var subEvents = this._subEvents[splitted[0]];
                subEvents.forEach(function (subEvent) {
                    subEvent.removeEvent(name, object);
                });
            } else {
                this._function = undefined;
                this._deepDisable(this._subEvents);
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
            var lectEvent = new LectureEvent(event, context, handler);
            this._eventHandler.addSubEvent(lectEvent);
            if (!(event in this._events)) {
                this._events[event] = [];
            }
            this._events[event].push(lectEvent);

            return lectEvent;
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
            this._events[event] = this._events[event].filter(function (ev) {
                ev.removeEvent('', context);

                return context !== ev.object;
            });

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

            this._events[event].forEach(function (lectEvent) {
                lectEvent.emit();
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
         * @returns {Emmitter} this
         */
        several: function (event, context, handler, times) {
            var lesEvent = this._addEvent(event, context, handler);
            lesEvent.setSeveral(times);

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
            lesEvent.setThrough(frequency);

            return this;
        }
    };
}
