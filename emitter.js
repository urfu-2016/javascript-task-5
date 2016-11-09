'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function isEmiting(executor) {
    if (executor.frequency !== undefined) {
        if (executor.currentFrequency === 0) {
            executor.currentFrequency = executor.frequency;

            return true;
        }
        executor.currentFrequency--;

        return false;
    }
    if (executor.times !== undefined) {
        executor.times--;
        if (executor.times >= 0) {
            return true;
        }

        return false;
    }

    return true;
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
            if (!(event in this.events)) {
                this.events[event] = [];
            }
            var nameParam = '';
            if (arguments[3]) {
                nameParam = Object.keys(arguments[3]);
            }
            this.events[event].push({
                context: context,
                handler: handler.bind(context),
                times: (nameParam[0] === 'times') ? arguments[3].times : undefined,
                frequency: (nameParam[0] === 'frequency') ? arguments[3].frequency - 1 : undefined,
                currentFrequency: 0
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            var eventsForDelete = Object.keys(this.events).filter(function (eventForDelete) {
                return eventForDelete.indexOf(event + '.') === 0 || event === eventForDelete;
            });
            eventsForDelete.forEach(function (eventForDelete) {
                this.events[eventForDelete] = this.events[eventForDelete].filter(function (signer) {
                    return signer.context !== context;
                });
            }, this);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var parts = event.split('.');
            var namesEvent = [];
            namesEvent.push(parts[0]);
            parts.reduce(function (prev, curr) {
                prev += '.' + curr;
                namesEvent.push(prev);

                return prev;
            });
            namesEvent.reverse();
            var filteredNames = namesEvent.filter(function (eventForCheck) {
                return (eventForCheck in this.events);
            }, this);
            filteredNames.forEach(function (eventForCall) {
                this.events[eventForCall].forEach(function (executor) {
                    if (isEmiting(executor)) {
                        executor.handler.call();
                    }
                });
            }, this);

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
            if (times > 0) {
                this.on(event, context, handler, { times: times });
            } else {
                this.on(event, context, handler);
            }

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
            if (frequency > 0) {
                this.on(event, context, handler, { frequency: frequency });
            } else {
                this.on(event, context, handler);
            }

            return this;
        }
    };
}
