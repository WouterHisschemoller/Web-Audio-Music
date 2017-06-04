/**
 * FM tom sound tuned in G.
 */

 window.WH = window.WH || {};

 WH.createFMTom = function(specs) {
    var ctx = specs.ctx,
        output,
        filterFreq = 783.991,

        /**
         * Create the output stage that voices are connected to.
         * Two filters in series form a 24dB bandpass filter,
         * followed by makeup gain node.
         */
        init = function() {
            let filter1 = ctx.createBiquadFilter(),
                filter2 = ctx.createBiquadFilter()
            	gain = ctx.createGain();

            filter1.connect(filter2);
            filter2.connect(gain);
            gain.connect(ctx.destination);

            filter1.type = 'bandpass';
            filter1.frequency.value = filterFreq;
            filter1.Q.value = 3;

            filter2.type = 'bandpass';
            filter2.frequency.value = filterFreq;
            filter2.Q.value = 3;

            gain.gain.value = 10;

            output = filter1;
        },

        createVoice = function(when) {
            let cOsc = ctx.createOscillator(),
                cGain = ctx.createGain(),
                m1Osc = ctx.createOscillator(),
                m1Gain = ctx.createGain(),
                m2Osc = ctx.createOscillator(),
                m2Gain = ctx.createGain();

            cOsc.connect(cGain);
            cGain.connect(output);
            m1Osc.connect(m1Gain);
            m1Gain.connect(cOsc.frequency);
            m2Osc.connect(m2Gain);
            m2Gain.connect(m1Osc.frequency);

            cOsc.frequency.setValueAtTime(195.998 * 1.2, when);
            cOsc.frequency.exponentialRampToValueAtTime(195.998, when + 0.003);
            cGain.gain.setValueAtTime(0.7, when);
            cGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.007);

            m1Osc.frequency.setValueAtTime(1567.982 * 1.2, when);
            m1Osc.frequency.exponentialRampToValueAtTime(1567.982, when + 0.003);
            m1Gain.gain.setValueAtTime(15000, when);
            m1Gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.007);

            m2Osc.frequency.setValueAtTime(146.832, when);
            m2Gain.gain.setValueAtTime(12000, when);
            m2Gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.011);

            cOsc.start(when);
            m1Osc.start(when);
            m2Osc.start(when);

            cOsc.stop(when + 1.0);

            cOsc.onended = function(e) {
                m1Osc.stop();
                m2Osc.stop();
                cGain.disconnect();
                cGain = null;
                m1Gain.disconnect();
                m1Gain = null;
                m2Gain.disconnect();
                m2Gain = null;
            };
        },

        process = function(when, index, length) {
            createVoice(when + (length * (2/16)));
            createVoice(when + (length * (6/16)));
            createVoice(when + (length * (8/16)));
            createVoice(when + (length * (12/16)));
        };

    init();

    return {
        process: process
    }
 };
