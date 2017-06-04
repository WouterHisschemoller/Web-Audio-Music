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

            start = function(delay = 0) {
                setTimeout(function() {
                    next = ctx.currentTime;
                    run();
                }, delay);
            },

            add = function(processor) {
                processors.push(processor);
            };

        return {
            start: start,
            add: add
        }
    };

    let ctx = new (window.AudioContext || window.webkitAudioContext)(),
        timer = createTimer({
            ctx: ctx
        }),
        utils = WH.createUtils({
            ctx: ctx
        }),
        fmKick = WH.createFMKick({
            ctx: ctx
        }),
        fmTom = WH.createFMTom({
            ctx: ctx
        });

    timer.add(fmKick);
    timer.add(fmTom);
    timer.start(100);
});
