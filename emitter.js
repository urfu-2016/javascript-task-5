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

        // eventsArray: {
        //     events: {}
        // },

        eventsTree: {
            subEvents: {}
        },

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Object} additionalProperty
         * @returns {Object}
         */
        on: function (event, context, handler, additionalProperty) {
            var eventsQuery = event.split('.');
            var eventSubTree = eventsQuery
                .reduce(function (currentSubTree, currentEvent) {
                    if (!currentSubTree.subEvents.hasOwnProperty(currentEvent)) {
                        currentSubTree.subEvents[currentEvent] = {
                            subEvents: {},
                            signedContexts: []
                        };
                    }

                    return currentSubTree.subEvents[currentEvent];
                }, this.eventsTree);

            additionalProperty = additionalProperty || {};
            var times = additionalProperty.times;
            var frequency = additionalProperty.frequency;

            // Дефолтное значения для количества вызовов emit = Infinity, т.е. сколько угодно раз
            // Дефолтная частота вызовов emit = 1, т.е. вызывает каждое событие
            // emitCallsCount - сколько раз делали попытку вызова handler у этого объекта
            //      (он мог срабатывать не всегда из-за through)
            eventSubTree.signedContexts.push({
                context: context,
                handler: handler,
                emitCallsCount: 0,
                times: times > 0 ? times : Infinity,
                frequency: frequency > 0 ? frequency : 1
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
            var lastEvent = event
                .split('.')
                .reduce(getLastEvent, this.eventsTree);

            unsignContextFromSubTree(lastEvent, context);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            event
                .split('.')
                .forEach(function (currentEventQuery, index, eventsArray) {
                    var eventSubTree = eventsArray.slice(0, eventsArray.length - index);
                    var lastEvent = eventSubTree.reduce(getLastEvent, this.eventsTree);

                    if (!lastEvent.hasOwnProperty('signedContexts')) {
                        return;
                    }

                    lastEvent.signedContexts
                        .forEach(function (signedContext) {
                            if (signedContext.emitCallsCount < signedContext.times) {
                                tryToCallHandler(signedContext);
                            } else {
                                unsignContextFromSignedContexts(lastEvent, signedContext);
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
            this.on(event, context, handler, { 'times': times });

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
            this.on(event, context, handler, { 'frequency': frequency });

            return this;
        }
    };
}

function getLastEvent(currentSubTree, currentEvent) {
    if (currentSubTree.subEvents.hasOwnProperty(currentEvent)) {
        return currentSubTree.subEvents[currentEvent];
    }

    return {};
}

function unsignContextFromSubTree(eventSubTree, context) {
    unsignContextFromSignedContexts(eventSubTree, context);

    Object
        .keys(eventSubTree.subEvents)
        .forEach(function (event) {
            unsignContextFromSubTree(eventSubTree.subEvents[event], context);
        });
}

function unsignContextFromSignedContexts(eventSubTree, context) {
    eventSubTree.signedContexts = eventSubTree.signedContexts
        .reduce(function (newEventsArray, signedContext) {
            if (signedContext.context !== context) {
                newEventsArray.push(signedContext);
            }

            return newEventsArray;
        }, []);
}

function tryToCallHandler(signedContext) {
    var frequency = signedContext.frequency;
    var emitCallsCount = signedContext.emitCallsCount;
    signedContext.emitCallsCount++;

    if (emitCallsCount % frequency === 0 || emitCallsCount === 0) {
        signedContext.handler.call(signedContext.context);
    }
}
