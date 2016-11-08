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
        events: [],

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * returns {Object}
         */

        on: function (event, context, handler) {
            this.events.push(
                {
                    event: event,
                    context: context,
                    handler: handler
                }
            );

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * returns {Object}
         */

        off: function (event, context) {
            this.events = this.events.filter(function (currentEvent) {
                if (currentEvent.event.indexOf(event + '.') === 0 || currentEvent.event === event) {
                    return context !== currentEvent.context;
                }

                return true;
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * returns {Object}
         */

        emit: function (event) {
            var developments = event.split('.')
            .reduce(function (acc, nameFunction) {
                var newNameFunction = acc.length > 0 ? [acc, nameFunction].join('.') : nameFunction;
                acc.push(newNameFunction);

                return acc;
            }, []);
            developments.reverse().forEach(function (nameFunction) {
                this.events.forEach(function (currentEvent) {
                    if (currentEvent.event === nameFunction) {
                        currentEvent.handler.call(currentEvent.context);
                    }
                });
            }, this);

            return this;
        }
    };
}
