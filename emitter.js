'use strict';

getEmitter.isStar = false;
module.exports = getEmitter;

function startEvents(event, events) {
    if (events.hasOwnProperty(event)) {
        events[event].forEach(function (student) {
            student.handler.call(student.context);
        });
    }
}

function getEmitter() {
    var events = {};

    return {


        on: function (event, context, handler) {

            if (events.hasOwnProperty(event)) {
                events[event].push({ context: context, handler: handler });
            } else {
                events[event] = [{ context: context, handler: handler }];
            }


            return this;
        },


        off: function (event, context) {
            // console.log(events['slide.funny'])
            Object.keys(events).forEach(function (key) {

                // console.log(events.key)
               // console.log('a')
                if (event.indexOf('.') > 0) {

                    // console.log(events)
                    if (key === event) {
                        // console.log(events[key])
                        // console.log(events.key)
                        events[key] = events[key].filter(function (student) {

                            return student.context !== context;
                        });
                        // console.log(events[key])
                    }

                }
                if (key.indexOf(event) >= 0) {
                    events[key] = events[key].filter(function (student) {
                        return student.context !== context;
                    });
                }

            });

            return this;
        },

        emit: function (event) {
            // console.log(events.begin)
            // console.log(events.slide)
            // console.log(events.slide.funny)
            startEvents(event, events);
            while (event.indexOf('.') !== -1) {
                event = event.split('.').slice(0, -1)
                    .join();
                startEvents(event, events);
            }


            return this;
        },


        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },


        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}
