/**
 * Click sound.
 */

window.WH = window.WH || {};

WH.createClick = function(specs) {
    var ctx = specs.ctx,
        buffer,

        init = function() {
            let bufferSize = 100;
            buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            let bufferChannel = buffer.getChannelData(0);
            for (i = 0; i < bufferSize; i++) {
            	bufferChannel[i] = (i > 10 && i < 12) ? 1 : 0;
            }
        },

        createVoice = function(when) {
            let src = ctx.createBufferSource();
            src.buffer = buffer;
            src.connect(ctx.destination);
            src.start(when);
        },

        process = function(when, index, length) {
            // createVoice(when + (length * (0/16)));
            // createVoice(when + (length * (1/16)));
            // createVoice(when + (length * (2/16)));
            // createVoice(when + (length * (3/16)));
            // createVoice(when + (length * (4/16)));
            createVoice(when + (length * (5/16)));
            // createVoice(when + (length * (6/16)));
            // createVoice(when + (length * (7/16)));
            // createVoice(when + (length * (8/16)));
            // createVoice(when + (length * (9/16)));

            createVoice(when + (length * (11/16)));
            createVoice(when + (length * (11.5/16)));
            createVoice(when + (length * (12/16)));

            createVoice(when + (length * (14/16)));
            createVoice(when + (length * (15/16)));
            // createVoice(when + (length * (16/16)));
        };

    init();

    return {
        process: process
    }
};
