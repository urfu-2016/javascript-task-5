'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function getAllNamespaces(str) {
    var namespacePart = str.split('.');
    var namespaces = [];
    for (var i = namespacePart.length; i > 0; i--) {
        namespaces.push(namespacePart.slice(0, i).join('.'));
    }

    return namespaces;
}

function processExpires(item) {
    if (item.expires === null) {
        return true;
    }

    if (item.expires === 0) {
        if (item.frequency !== null) {
            item.expires = item.frequency - 1;

            return true;
        }

        return false;
    }
    item.expires--;

    return item.frequency === null;
}

function removeUnusedEvents(events) {
    for (var i in events) {
        if (events.hasOwnProperty(i)) {
            events[i] = events[i].filter(function (item) {
                return item.expires === null || item.expires === undefined ||
                    item.expires > 0 || item.frequency !== null;
            });
        }
    }
}

function filterOneEvent(e, context, event, events) {
    return events[e].filter(function (item) {
        return item.context !== context || getAllNamespaces(e).indexOf(event) === -1;
    });
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        events: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push({ context: context, handler: handler,
                expires: arguments[3] === undefined ? null : arguments[3],
                frequency: arguments[4] || null });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         * jshint loop-func:true
         */
        off: function (event, context) {
            for (var e in this.events) {
                if (this.events.hasOwnProperty(e)) {
                    this.events[e] = filterOneEvent(e, context, event, this.events);
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            getAllNamespaces(event).forEach(function (eventNamespace) {
                if (this.events[eventNamespace]) {
                    this.events[eventNamespace].forEach(function (item) {
                        if (processExpires(item)) {
                            item.handler.call(item.context);
                        }
                    });
                }
            }, this);
            removeUnusedEvents(this.events);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            if (!times || times <= 0) {
                times = null;
            }
            this.on(event, context, handler, times, null);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            if (frequency && frequency > 0) {
                this.on(event, context, handler, 0, frequency);

                return this;
            }
            this.on(event, context, handler, null, null);

            return this;
        }
    };
}
