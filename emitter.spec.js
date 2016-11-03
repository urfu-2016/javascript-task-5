/* eslint-env mocha */
/* eslint-disable no-invalid-this, no-shadow */
'use strict';

var assert = require('assert');
var getEmitter = require('./emitter');

var students = {
    Sam: {
        focus: 100,
        wisdom: 50
    },
    Sally: {
        focus: 100,
        wisdom: 60
    },
    Bill: {
        focus: 90,
        wisdom: 50
    },
    Sharon: {
        focus: 110,
        wisdom: 40
    }
};

var lecturer = getEmitter()
    .on('begin', students.Sam, function () {
        this.focus += 10;
    })
    .on('begin', students.Sally, function () {
        this.focus += 10;
    })
    .on('begin', students.Bill, function () {
        this.focus += 10;
        this.wisdom += 5;
    })
    .on('begin', students.Sharon, function () {
        this.focus += 20;
    })
    .on('slide', students.Sam, function () {
        this.wisdom += Math.round(this.focus * 0.1);
        this.focus -= 10;
    })
    .on('slide', students.Sally, function () {
        this.wisdom += Math.round(this.focus * 0.15);
        this.focus -= 5;
    })
    .on('slide', students.Bill, function () {
        this.wisdom += Math.round(this.focus * 0.05);
        this.focus -= 10;
    })
    .on('slide', students.Sharon, function () {
        this.wisdom += Math.round(this.focus * 0.01);
        this.focus -= 5;
    })
    .on('slide.funny', students.Sam, function () {
        this.focus += 5;
        this.wisdom -= 10;
    })
    .on('slide.funny', students.Sally, function () {
        this.focus += 5;
        this.wisdom -= 5;
    })
    .on('slide.funny', students.Bill, function () {
        this.focus += 5;
        this.wisdom -= 10;
    })
    .on('slide.funny', students.Sharon, function () {
        this.focus += 10;
        this.wisdom -= 10;
    });

describe('lecturer-emitter', function () {
    it('должен всех оповестить о старте лекции', function () {
        lecturer.emit('begin');
        assert.strictEqual(
            getState(students),
            'Sam(110,50); Sally(110,60); Bill(100,55); Sharon(130,40)'
        );
    });

    it('должен донести слайды до всех', function () {
        lecturer
            .emit('slide.text')
            .emit('slide.text')
            .emit('slide.text')
            .emit('slide.funny');

        assert.strictEqual(
            getState(students),
            'Sam(75,79); Sally(95,118); Bill(65,63); Sharon(120,34)'
        );
    });

    it('не должен доносить смешные слайды до Шерон', function () {
        lecturer
            .off('slide.funny', students.Sharon)
            .emit('slide.text')
            .emit('slide.text')
            .emit('slide.funny');

        assert.strictEqual(
            getState(students),
            'Sam(50,90); Sally(85,155); Bill(40,62); Sharon(105,37)'
        );
    });

    it('не должен доносить вообще слайды до Билла', function () {
        lecturer
            .off('slide', students.Bill)
            .emit('slide.text')
            .emit('slide.text')
            .emit('slide.text');

        assert.strictEqual(
            getState(students),
            'Sam(20,102); Sally(70,191); Bill(40,62); Sharon(90,40)'
        );
    });

    it('должен тихо завершить лекцию', function () {
        lecturer.emit('end');

        assert.strictEqual(
            getState(students),
            'Sam(20,102); Sally(70,191); Bill(40,62); Sharon(90,40)'
        );
    });

    if (getEmitter.isStar) {
        describe('Особая лекция для Билла и Сэма', function () {
            var students = {
                Sam: {
                    focus: 100,
                    wisdom: 50
                },
                Bill: {
                    focus: 90,
                    wisdom: 50
                }
            };

            var lecturer = getEmitter()
                .several('begin', students.Sam, function () {
                    this.focus += 10;
                }, 1)
                .several('begin', students.Bill, function () {
                    this.focus += 10;
                    this.wisdom += 5;
                }, 1)
                // На Сэма действуют только нечетные слайды
                .through('slide', students.Sam, function () {
                    this.wisdom += Math.round(this.focus * 0.1);
                    this.focus -= 10;
                }, 2)
                // Концентрации Билла хватит ровно на 4 слайда
                .several('slide', students.Bill, function () {
                    this.wisdom += Math.round(this.focus * 0.05);
                    this.focus -= 10;
                }, 4)
                .on('slide.funny', students.Sam, function () {
                    this.focus += 5;
                    this.wisdom -= 10;
                })
                .on('slide.funny', students.Bill, function () {
                    this.focus += 5;
                    this.wisdom -= 10;
                });

            it('[*] должен всех оповестить о старте лекции', function () {
                lecturer.emit('begin');
                assert.strictEqual(
                    getState(students),
                    'Sam(110,50); Bill(100,55)'
                );
            });

            it('[*] должен донести до Билла все слайды, а до Сэма – нечетные', function () {
                lecturer
                    .emit('slide.text')
                    .emit('slide.text')
                    .emit('slide.text')
                    .emit('slide.funny');

                assert.strictEqual(
                    getState(students),
                    'Sam(95,61); Bill(65,63)'
                );
            });

            it('[*] не должен доносить обычные слайды до Билла', function () {
                lecturer
                    .emit('slide.text')
                    .emit('slide.text')
                    .emit('slide.text')
                    .emit('slide.funny');

                assert.strictEqual(
                    getState(students),
                    'Sam(80,70); Bill(70,53)'
                );
            });
        });
    }

    function getState(students) {
        return Object.keys(students)
            .map(function (name) {
                return [
                    name,
                    '(',
                    students[name].focus,
                    ',',
                    students[name].wisdom,
                    ')'
                ].join('');
            })
            .join('; ');
    }
});
