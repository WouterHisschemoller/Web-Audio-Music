'use strict';

window.WH = window.WH || {};

/**
 * Converts a MIDI pitch number to frequency.
 * @param  {Number} midi MIDI pitch (0 ~ 127)
 * @return {Number} Frequency (Hz)
 */
WH.mtof = function(midi) {
    if (midi <= -1500) return 0;
    else if (midi > 1499) return 3.282417553401589e+38;
    else return 440.0 * Math.pow(2, (Math.floor(midi) - 69) / 12.0);
};

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
        // noise = WH.createNoise({
        //     ctx: ctx
        // }),
        // beep = WH.createBeep({
        //     ctx: ctx
        // }),
        // chord = WH.createChord({
        //     ctx: ctx
        // }),
        fmChord = WH.createFMChord({
            ctx: ctx
        });
        // kick8 = WH.createKick8({
        //     ctx: ctx,
        //     noise, noise
        // });

    // timer.add(chord);
    timer.add(fmChord);
    // timer.add(beep);
    // timer.add(kick8);
    timer.start();
});
