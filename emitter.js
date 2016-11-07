'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

/**
 * Функция, превращающая {handler}, в хэндлер,
 * который будет вызываться {callsCount} раз
 * @param {Function} handler - исходный хэндлер
 * @param {Number} callsCount - сколько раз он должен вызваться
 * @param {Object} context - контекст вызова события
 * @returns {Function} - новый хэндлер
 */
function makeSeveralHandler(handler, callsCount, context) {
    var counter = 0;
    var repeats = callsCount > 0 ? callsCount : Infinity;

    return function () {
        if (counter < repeats) {
            handler.call(context);
            counter++;
        }
    };
}

/**
 * Функция, превращающая {handler}, в хэндлер,
 * который будет вызываться с частотой {frequency}
 * @param {Function} handler - исходный хэндлер
 * @param {Number} frequency - частота вызова
 * @param {Object} context - контекст вызова события
 * @returns {Function} - новый хэндлер
 */
function makeThoughtHandler(handler, frequency, context) {
    var counter = 0;
    var handleFrequency = frequency > 0 ? frequency : 1;

    return function () {
        if (!(counter % handleFrequency)) {
            handler.call(context);
        }
        counter = (counter + 1) % handleFrequency;
    };
}

/**
 * Функция создания события
 * Событие - объект, у которого есть контекст и оно может быть вызвано
 * @param {Object} context - контекст события
 * @param {Function} handler - функция, которая будет вызвана
 * @returns {{context: *, emit: emit}} - объект события
 */
function makeEvent(context, handler) {
    return {
        context: context,
        emit: function () {
            handler.call(context);
        }
    };
}

/**
 * Создать объект пространства имен
 * Объект пространства имен - объект, у которого есть внутренние пространства,
 * а также события, находящиеся в нем
 * @param {String} name - имя пространства имен
 * @returns {Object} - пространство имен
 */
function makeNamespace(name) {
    return {
        name: name,
        innerNamespaces: {},
        events: [],
        getOrCreateNamespace: function (path) {
            return path.reduce(function (currentNamespace, ns) {
                if (!(ns in currentNamespace.innerNamespaces)) {
                    currentNamespace.innerNamespaces[ns] = makeNamespace(ns);
                }

                return currentNamespace.innerNamespaces[ns];
            }, this);
        }
    };
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        /* Корень пространства имен */
        rootNamespace: makeNamespace(''),

        /**
         * Подписаться на событие
         * @param {String} eventName - имя события
         * @param {Object} context - контекст вызова события
         * @param {Function} handler - функция вызываемая событием
         * @returns {Object} - emitter
         */
        on: function (eventName, context, handler) {
            var dividedByDot = eventName.split('.');
            var namespace = this.rootNamespace.getOrCreateNamespace(dividedByDot);
            namespace.events.push(makeEvent(context, handler));

            return this;
        },

        /**
         * Отписаться от всех событий рекурсивно,
         * включая внутренние пространства имен
         * @param {Object} namespace - текущее пространство имен
         * @param {Object} context - контекст, для которого происходит отписка
         */
        offRecursive: function (namespace, context) {
            namespace.events = namespace.events.filter(function (event) {
                return event.context !== context;
            });
            for (var namespaceName in namespace.innerNamespaces) {
                if (namespace.innerNamespaces.hasOwnProperty(namespaceName)) {
                    var innerNamespace = namespace.innerNamespaces[namespaceName];
                    this.offRecursive(innerNamespace, context);
                }
            }
        },

        /**
         * Отписаться от события
         * @param {String} event - имя события
         * @param {Object} context - контекст вызова события
         * @returns {Object} - emitter
         */
        off: function (event, context) {
            var dividedByDot = event.split('.');
            var namespace = this.rootNamespace.getOrCreateNamespace(dividedByDot);
            this.offRecursive(namespace, context);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event - имя произошедшего события
         * @returns {Object} - emitter
         */
        emit: function (event) {
            var dividedByDot = event.split('.');
            for (var i = dividedByDot.length; i > 0; i--) {
                var path = dividedByDot.slice(0, i);
                var currentNamespace = this.rootNamespace.getOrCreateNamespace(path);
                currentNamespace.events.forEach(function (eventElement) {
                    eventElement.emit();
                });
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event - имя события
         * @param {Object} context - контекст вызова события
         * @param {Function} handler - функция, вызываемая событием
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object} - emitter
         */
        several: function (event, context, handler, times) {
            this.on(event, context, makeSeveralHandler(handler, times, context));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event - имя события
         * @param {Object} context - контекст вызова события
         * @param {Function} handler - функция, вызываемая событием
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} - emitter
         */
        through: function (event, context, handler, frequency) {
            this.on(event, context, makeThoughtHandler(handler, frequency, context));

            return this;
        }
    };
}
