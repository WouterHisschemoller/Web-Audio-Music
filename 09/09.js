'use strict';

window.WH = window.WH || {};

document.addEventListener('DOMContentLoaded', function(e) {

    function createTimer(specs) {
        var ctx = specs.ctx,
            index = 0,
            length = 1.8,
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

    if (window.hasOwnProperty('webkitAudioContext')) {
        window.AudioContext = webkitAudioContext;
    }

    let ctx = new AudioContext(),
        timer = createTimer({
            ctx: ctx
        }),
        utils = WH.createUtils({
            ctx: ctx
        }),
        fmKick = WH.createFMKick({
            ctx: ctx
        });

    timer.add(fmKick);
    timer.start();
});
