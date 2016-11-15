'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

function comparer(a, b) {
    return (a.event >= b.event) ? -1 : 1;
}

/**
 * Сравнивает два пространства имен, и проверяет, является ли более короткое частью более длинного
 * @param {String} bigNamespace - "длинное" пространство имен
 * @param {Object} smallNamespace - "короткое" пространство имен
 * @returns {Boolean}
 */
function compareNamespaces(bigNamespace, smallNamespace) {
    var splitedBigNS = bigNamespace.split('.');
    var splitedSmallNS = smallNamespace.split('.');
    for (var i = 0; i < splitedSmallNS.length; i++) {
        if (splitedSmallNS[i] !== splitedBigNS[i]) {
            return false;
        }
    }

    return true;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    var events = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event - событие
         * @param {Object} context - субьект, который подписывается событие
         * @param {Function} handler - функция, меняющая характеристики субьекта
         * @returns {Object}
         */
        on: function (event, context, handler) {
            events.push(
                {
                    event: event,
                    context: context,
                    handler: handler
                }
            );
            events.sort(comparer);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event - событие
         * @param {Object} context - субьект, который отписывается от события
         * @returns {Object}
         */
        off: function (event, context) {
            events.forEach(function (item) {
                if (compareNamespaces(item.event, event) && context === item.context) {
                    delete item.handler;
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event - событие
         * @returns {Object}
         */
        emit: function (event) {
            events.forEach(function (item) {
                if (compareNamespaces(event, item.event) &&
                    item.hasOwnProperty('handler')) {
                    item.handler.call(item.context);
                }
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
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}
