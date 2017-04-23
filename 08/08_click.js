/**
 * Click sound.
 */

window.WH = window.WH || {};

WH.createClick = function(specs) {
    var ctx = specs.ctx,
        panner,
        buffer1,
        buffer6

        init = function() {
            let bufferSize = 100;

            buffer1 = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            let bufferChannel = buffer1.getChannelData(0);
            for (i = 0; i < bufferSize; i++) {
            	bufferChannel[i] = (i > 10 && i < 12) ? 1 : 0;
            }

            buffer6 = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            bufferChannel = buffer6.getChannelData(0);
            for (i = 0; i < bufferSize; i++) {
            	bufferChannel[i] = (i > 10 && i < 17) ? 1 : 0;
            }

            panner = ctx.createStereoPanner();
            panner.connect(ctx.destination);
        },

        createVoice = function(when, buffer) {

            let pan = (buffer === buffer6) ? -0.7 : 0.2 + (Math.random() * 0.5);
            panner.pan.setValueAtTime(pan, when);

            let src = ctx.createBufferSource();
            src.buffer = buffer;
            src.connect(panner);
            src.start(when);
        },

        process = function(when, index, length) {
            if (index >= 128) {
                return;
            }
            if (index >= 80 && index < 96 ) {
                return;
            }

            createVoice(when + (length * (5/16)), buffer6);

            createVoice(when + (length * (11/16)), buffer1);
            createVoice(when + (length * (11.5/16)), buffer1);
            createVoice(when + (length * (12/16)), buffer1);

            createVoice(when + (length * (14/16)), buffer1);
            createVoice(when + (length * (15/16)), buffer1);

        };

    init();

    return {
        process: process
    }
};
