/**
 * FM kick sound tuned in G.
 */

window.WH = window.WH || {};

WH.createFMKick = function(specs) {
    var ctx = specs.ctx,
        cOscBuffer,

        init = function() {
            // record the kick sound and play it as a sample,
            // because scheduled oscillator start will not play the
            // waveform from its start point.
            let when = ctx.currentTime,
                numChannels = 1,
                length = 4 * ctx.sampleRate,
                offlineCtx = new OfflineAudioContext(numChannels, length, ctx.sampleRate),
                cOsc = offlineCtx.createOscillator(),
                m1Osc = offlineCtx.createOscillator(),
                m1Gain = offlineCtx.createGain(),
                m2Osc = offlineCtx.createOscillator(),
                m2Gain = offlineCtx.createGain();

            cOsc.connect(offlineCtx.destination);
            m1Osc.connect(m1Gain);
            m1Gain.connect(cOsc.frequency);
            m2Osc.connect(m2Gain);
            m2Gain.connect(offlineCtx.destination);

            cOsc.frequency.setValueAtTime(49.0, when);

            m1Osc.frequency.setValueAtTime(24.5, when);
            m1Gain.gain.setValueAtTime(3000, when);
            m1Gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.01);

            m2Osc.type = 'sawtooth';
            m2Osc.frequency.setValueAtTime(98, when);
            m2Gain.gain.setValueAtTime(4, when);
            m2Gain.gain.setValueAtTime(0, when + 0.0001);

            cOsc.start(when);
            m1Osc.start(when);
            m2Osc.start(when);

            offlineCtx.startRendering().then(function(renderedBuffer) {
                cOscBuffer = renderedBuffer;
            });
        },

        createVoice = function(when) {
            let osc = ctx.createBufferSource(),
                gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.buffer = cOscBuffer;
            osc.playbackRate.value = 1.0;
            gain.gain.setValueAtTime(1, when);
            gain.gain.exponentialRampToValueAtTime(0.00001, when + 1.2);

            osc.start(when);
            osc.stop(when + 1.5);

            osc.onended = function(e) {
                gain.disconnect();
                gain = null;
            };
        },

        process = function(when, index, length) {
            if (cOscBuffer) {
                createVoice(when + (length * (0/16)));
                createVoice(when + (length * (8/16)));
            }
        };

    init();

    return {
        process: process
    }
};
