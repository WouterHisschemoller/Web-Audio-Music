/**
 * Noise.
 */

window.WH = window.WH || {};

WH.createNoise = function(specs) {
    var ctx = specs.ctx,
        utils = specs.utils,
        panL,
        panR,

        init = function() {
            let gainOut = ctx.createGain();
            panL = ctx.createStereoPanner();
            panR = ctx.createStereoPanner();

            panL.connect(gainOut);
            panR.connect(gainOut);
            gainOut.connect(ctx.destination);

            panL.pan.value = -1.0;
            panR.pan.value = 1.0;
            gainOut.gain.value = 0.05;
        },

        createVoice = function(when, until) {
            let oscL = ctx.createBufferSource(),
                oscR = ctx.createBufferSource();

            oscL.connect(panL);
            oscR.connect(panR);

            oscL.buffer = utils.getWhiteNoise();
            oscL.loop = true;
            oscR.buffer = utils.getWhiteNoise();
            oscR.loop = true;

            oscL.start(when);
            oscL.stop(until);
            oscR.start(when, 0.1);
            oscR.stop(until);

            oscL.onended = function(e) {};
        },

        process = function(when, index, length) {
            createVoice(when + (length * (0/16)), when + length);
        };

    init();

    return {
        process: process
    }
};
