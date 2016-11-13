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

        eventsArray: {
            events: {}
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
            // var eventTree = event.split('.');

            // var lastEvent = eventTree
            //     .reduce(function (currentLeaf, currentEvent) {
            //         if (!currentLeaf.hasOwnProperty(currentEvent)) {
            //             currentLeaf[currentEvent] = {
            //                 signedContexts: [],
            //                 events: {}
            //             };
            //         }

            //         return currentLeaf.events;
            //     }, this.eventsArray.events);

            if (!this.eventsArray.hasOwnProperty(event)) {
                this.eventsArray[event] = [];
            }

            additionalProperty = additionalProperty || {};

            var times = additionalProperty.times;
            var frequency = additionalProperty.frequency;

            // Дефолтное значения для количества вызовов emit = Infinity, т.е. сколько угодно раз
            // Дефолтная частота вызовов emit = 1, т.е. вызывает каждое событие
            // emitCallsCount - сколько раз делали попытку вызова handler у этого объекта
            //      (он мог срабатывать не всегда из-за through)
            this.eventsArray[event].push({
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
            Object
                .keys(this.eventsArray)
                // Получаем список событий, от которых надо отписаться (включая дочерние)
                .filter(function (signedEvent) {
                    // Либо это в точности переданное в функцию событие, либо его дочернее
                    return signedEvent.indexOf(event) === 0 &&
                        (event === signedEvent || signedEvent[event.length] === '.');
                })
                .forEach(function (eventToUnsign) {
                    this.eventsArray[eventToUnsign] = this.eventsArray[eventToUnsign]
                        .reduce(function (newEventArray, signedContext) {
                            if (signedContext.context !== context) {
                                newEventArray.push(signedContext);
                            }

                            return newEventArray;
                        }, [], this);

                }, this);

            // var eventTree = event.split('.');

            // var eventsSubTree = eventTree
            //     .reduce(function (currentLeaf, currentEvent) {
            //         if (currentLeaf.events.hasOwnProperty(currentEvent)) {
            //             return currentLeaf.events[currentEvent];
            //         }

            //         return [];
            //     }, this.eventsArray);

            // (function foo(events) {
            //     events.signedContexts = events
            //         .signedContexts
            //             .reduce(function (newSignedContexts, signedContext) {
            //                 if (signedContext.context !== context) {
            //                     newSignedContexts.push(signedContext);
            //                 }

            //                 return newSignedContexts;
            //             }, []);

            //     Object
            //         .keys(events.events)
            //         .forEach(function (key) {
            //             foo(events.events[key]);
            //         });
            // }(eventsSubTree));

            // while (Object.keys(eventsSubTree.events).length !== 0 ||
            //     eventsSubTree.signedContexts.length !== 0) {

            //     eventsSubTree.signedContexts = eventsSubTree
            //         .signedContexts
            //         .reduce(function (newSignedContexts, signedContext) {
            //             if (signedContext.context !== context) {
            //                     newSignedContexts.push(signedContext);
            //             }

            //             return newSignedContexts;
            //         }, []);

            // }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {

            var splittedEvents = event.split('.');
            var splittedEventsCount = splittedEvents.length;

            splittedEvents
                // Получаем список событий (исходное + его родители и т.д.)
                .map(function (partOfEvent, index) {
                    return splittedEvents
                        .slice(0, splittedEventsCount - index)
                        .join('.');
                })
                // Вызываем каждое событие
                .forEach(function (currentEvent) {
                    if (this.eventsArray.hasOwnProperty(currentEvent)) {
                        this.eventsArray[currentEvent]
                            .forEach(function (signedContext) {
                                if (signedContext.emitCallsCount < signedContext.times) {
                                    tryToCallHandler(signedContext);
                                } else {
                                    this.off(currentEvent, signedContext);
                                }
                            }, this);
                    }
                }, this);

            // var eventsTree = event.split('.');
            // eventsTree
            //     .forEach(function (currEvent, index) {
            //         var eventsSubTree = eventsTree.slice(0, eventsTree.length - index);
            //         var lastEv = '';
            //         eventsSubTree
            //             .reduce(function (lastEvent, currentEvent) {
            //                 lastEv = currentEvent;

            //                 return lastEvent.events[currentEvent];
            //             }, this.eventsArray)
            //             .signedContexts
            //             .forEach(function (signedContext) {
            //                 if (signedContext.emitCallsCount < signedContext.times) {
            //                     tryToCallHandler(signedContext);
            //                 } else {
            //                     this.off(lastEv, signedContext);
            //                 }
            //             }, this);
            //     }, this);

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

function tryToCallHandler(signedContext) {
    var frequency = signedContext.frequency;
    var emitCallsCount = signedContext.emitCallsCount;
    signedContext.emitCallsCount++;

    if (emitCallsCount % frequency === 0 || emitCallsCount === 0) {
        signedContext.handler.call(signedContext.context);
    }
}
