/**
 * FM kick sound tuned in G.
 */

window.WH = window.WH || {};

WH.createFMKick = function(specs) {
    var ctx = specs.ctx,

        createVoice = function(when) {
            let cOsc = ctx.createOscillator(),
                cGain = ctx.createGain(),
                m1Osc = ctx.createOscillator(),
                m1Gain = ctx.createGain(),
                m2Osc = ctx.createOscillator(),
                m2Gain = ctx.createGain();

            cOsc.connect(cGain).connect(ctx.destination);
            m1Osc.connect(m1Gain).connect(cOsc.frequency);
            m2Osc.connect(m2Gain).connect(ctx.destination);

            cOsc.frequency.setValueAtTime(49.0, when);
            cGain.gain.setValueAtTime(1, when);
            cGain.gain.exponentialRampToValueAtTime(0.001, when + 1.2);

            m1Osc.frequency.setValueAtTime(24.5, when);
            m1Gain.gain.setValueAtTime(5000, when);
            m1Gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.01);

            m2Osc.type = 'sawtooth';
            m2Osc.frequency.setValueAtTime(166, when);
            m2Gain.gain.setValueAtTime(6, when);
            m2Gain.gain.setValueAtTime(0, when + 0.0001);

            cOsc.start(when);
            m1Osc.start(when);
            m2Osc.start(when);

            cOsc.stop(when + 1.5);

            cOsc.onended = function(e) {
                cGain.disconnect();
                cGain = null;
                m1Osc.stop();
                m1Gain.disconnect();
                m1Gain = null;
                m2Osc.stop();
                m2Gain.disconnect();
                m2Gain = null;
            };
        },

        process = function(when, index, length) {
            createVoice(when + (length * (0/16)));
            createVoice(when + (length * (8/16)));
        };

    return {
        process: process
    }
};
