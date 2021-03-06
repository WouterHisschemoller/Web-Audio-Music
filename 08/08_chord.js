/**
 * Chord sound.
 */

window.WH = window.WH || {};

WH.createChord = function(specs) {
    let ctx = specs.ctx,
        voices = [{
            pitch:  0,
            panner: null,
            gain: null,
            filter: null
        }, {
            pitch:  3,
            panner: null,
            gain: null,
            filter: null
        }, {
            pitch:  7,
            panner: null,
            gain: null,
            filter: null
        }, {
            pitch: 10,
            panner: null,
            gain: null,
            filter: null
        }],
        numVoices = voices.length,
        convolver,
        convGain,

        init = function() {

            convolver = ctx.createConvolver();
            convolver.buffer = WH.getImpulseResponse(2, 10);

            convGain = ctx.createGain();
            convGain.gain.value = 0.3;

            convolver.connect(convGain).connect(ctx.destination);

            for (var i = 0; i < numVoices; i++) {
                voices[i].panner = ctx.createStereoPanner();
                voices[i].gain = ctx.createGain();
                voices[i].filter = ctx.createBiquadFilter();

                voices[i].panner.connect(convolver);
                voices[i].panner.connect(ctx.destination);
                voices[i].gain.connect(voices[i].panner);
                voices[i].filter.connect(voices[i].gain);

                voices[i].filter.type = 'highpass';
                voices[i].filter.Q.value = 4;
            }
        },

        createVoice = function(when, until, voiceIndex, freq, filtFreq, pan, loopIndex) {
            let voice = voices[voiceIndex];
            voice.panner.pan.setValueAtTime(pan, when);
            voice.gain.gain.setValueAtTime(0.3, when);

            let envTime = when + ((until - when) * ((loopIndex % 24) / 24));
            voice.filter.frequency.setValueAtTime(filtFreq, when);
            voice.filter.frequency.exponentialRampToValueAtTime(4000, envTime);
            voice.filter.frequency.exponentialRampToValueAtTime(10000, until);

            let osc = ctx.createOscillator();
            osc.type = (Math.random() > 0.5) ? 'triangle' : 'sawtooth';
            osc.frequency.setValueAtTime(freq, when);
            osc.connect(voice.filter);
            osc.start(when + Math.random() * 0.01);
            osc.stop(until + Math.random() * 0.15);
        },

        process = function(when, index, length) {
            if (index >= 32 - 16 && index < 128) {
                for (var i = 0; i < numVoices; i++) {
                    let pan = 1 - (2 * (i / (numVoices - 1)));
                    createVoice(
                        when + (length * (12/16)),
                        when + (length * (13/16)), i,
                        WH.mtof(55 + voices[i].pitch), 20000, pan, index);
                }
            }
        };

    init();

    return {
        process: process
    }
};
