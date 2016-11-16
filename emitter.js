'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function generateAllNamespaces(str) {
    var namespacePart = str.split('.');
    var namespaces = [];
    for (var i = namespacePart.length; i > 0; i--) {
        namespaces.push(namespacePart.join('.'));
        namespacePart.pop();
    }

    return namespaces;
}

function isNotExpires(item) {
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

function checkOneEventUsed(event) {
    return event.filter(function (item) {
        return item.expires === null || item.expires === undefined ||
            item.expires > 0 || item.frequency !== null;
    });
}
function removeUnusedEvents(events) {
    Object.keys(events).map(function (i) {
        return checkOneEventUsed(events[i]);
    });
}

function checkOneEvent(eventToCheck, eventChecker, contextToCheck, contextChecker) {
    return contextToCheck !== contextChecker ||
        generateAllNamespaces(eventToCheck).indexOf(eventChecker) === -1;
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
            this.events[event].push({
                context: context,
                handler: handler,
                expires: arguments[3] === undefined ? null : arguments[3],
                frequency: arguments[4] || null });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            Object.keys(this.events).map(function (e) {
                this.events[e] = this.events[e].filter(function (item) {
                    return checkOneEvent(e, event, item.context, context);
                }, this);
            }, this);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            generateAllNamespaces(event).forEach(function (eventNamespace) {
                if (!this.events[eventNamespace]) {
                    return;
                }
                this.events[eventNamespace].forEach(function (item) {
                    if (isNotExpires(item)) {
                        item.handler.call(item.context);
                    }
                });
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
