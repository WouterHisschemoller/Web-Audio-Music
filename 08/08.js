'use strict';

window.WH = window.WH || {};

document.addEventListener('DOMContentLoaded', function(e) {

    function createTimer(specs) {
        var ctx = specs.ctx,
            index = 0,
            length = 2,
            next = 0,
            processors = [],

            run = function () {
                if (ctx.currentTime <= next && ctx.currentTime + 0.167 > next) {
                    var delay = next - ctx.currentTime;
                    for (var i = 0; i < processors.length; i++) {
                        processors[i].process(next, index, length);
                    }
                    index += 1;
                    next += length;
                }
                requestAnimationFrame(run);
            },

            start = function() {
                next = ctx.currentTime;
                run();
            },

            add = function(processor) {
                processors.push(processor);
            };

        return {
            start: start,
            add: add
        }
    };

    var ctx = new AudioContext(),
        timer = createTimer({
            ctx: ctx
        }),
        utils = WH.createUtils({
            ctx: ctx
        }),
        beep = WH.createBeep({
            ctx: ctx
        }),
        chord = WH.createChord({
            ctx: ctx
        }),
        click = WH.createClick({
            ctx: ctx
        }),
        fmChord = WH.createFMChord({
            ctx: ctx
        }),
        kick8 = WH.createKick8({
            ctx: ctx
        });

    timer.add(beep);
    timer.add(chord);
    timer.add(click);
    timer.add(fmChord);
    timer.add(kick8);
    timer.start();
});
