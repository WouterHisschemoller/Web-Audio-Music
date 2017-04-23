/**
 * FM chord sound.
 */
window.WH = window.WH || {};

WH.createFMChord = function(specs) {
    let ctx = specs.ctx,
        voices = [
            {pitch:  0, modGain: null, panner: null},
            {pitch:  3, modGain: null, panner: null},
            {pitch:  7, modGain: null, panner: null},
            {pitch: 10, modGain: null, panner: null}],
        numVoices = voices.length,
        carGain,

        init = function () {
            carGain = ctx.createGain();

            for (var i = 0; i < numVoices; i++) {
                voices[i].modGain = ctx.createGain();
                voices[i].panner = ctx.createStereoPanner();
                voices[i].panner.connect(carGain);
            }

            carGain.connect(ctx.destination);
        },

        createVoice = function(when, until, freq, voiceIndex, loopIndex) {
            let voice = voices[voiceIndex],
                modGain = voice.modGain
                carOsc = ctx.createOscillator(),
                car2Osc = ctx.createOscillator(),
                modOsc = ctx.createOscillator();

            carOsc.connect(voice.panner);
            car2Osc.connect(voice.panner);
            modOsc.connect(modGain);
            modGain.connect(carOsc.frequency);
            modGain.connect(car2Osc.frequency);

            carOsc.frequency.value = freq;
            car2Osc.frequency.value = freq / 2;

            carGain.gain.setValueAtTime(0, when);
            carGain.gain.linearRampToValueAtTime(0.03, when + 0.01);
            carGain.gain.linearRampToValueAtTime(0.015, when + 0.5);
            carGain.gain.linearRampToValueAtTime(0.03, when + 0.98);
            carGain.gain.exponentialRampToValueAtTime(0.00001, when + 1.0);

            modOsc.frequency.setValueAtTime(freq * 2, when);

            // second envelope point changes over time
            let triangle16LFO = ((loopIndex % 32) / 32 >= 0.5) ? ((16 - (loopIndex % 16)) / 16) : ((loopIndex % 16) / 16),
                triangle24LFO = ((loopIndex % 48) / 48 >= 0.5) ? ((24 - (loopIndex % 24)) / 24) : ((loopIndex % 24) / 24),
                envTime = ((loopIndex % 32) / 32) * 0.75,
                startLevel = 1 + (triangle24LFO * 1000),
                endLevel = 3000 - (triangle24LFO * 2500);

            modGain.gain.setValueAtTime(startLevel, when);
            modGain.gain.exponentialRampToValueAtTime(8000, when + 0.25 + envTime);
            modGain.gain.exponentialRampToValueAtTime(0.01, when + 0.5);
            modGain.gain.exponentialRampToValueAtTime(endLevel, when + 1.0);

            let pan = 1 - (2 * (voiceIndex / (numVoices - 1))); // -1 + (2 * (voiceIndex / (numVoices - 1)));
            voice.panner.pan.setValueAtTime(pan, when);

            carOsc.start(when);
            car2Osc.start(when);
            modOsc.start(when);

            carOsc.stop(until);
            car2Osc.stop(until);
            modOsc.stop(until);
        },

        process = function(when, index, length) {
            if (index >= 128) {
                return;
            }

            for (var i = 0; i < numVoices; i++) {
                if (index >= 64 && index < 96 - 16) {
                    createVoice(when + (length * (2/16)), when + (length * (4/16)), WH.mtof(60 + voices[i].pitch), i, index);
                    createVoice(when + (length * (4/16)), when + (length * (5/16)), WH.mtof(60 + voices[i].pitch), i, index);
                } else {
                    createVoice(when + (length * (2/16)), when + (length * (10/16)), WH.mtof(60 + voices[i].pitch), i, index);
                }
            }
        };

    init();

    return {
        process: process
    }
};
