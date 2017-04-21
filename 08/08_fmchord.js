/**
 * FM chord sound.
 */
window.WH = window.WH || {};

WH.createFMChord = function(specs) {
    let ctx = specs.ctx,
        voices = [
            {pitch:  0, modGain: null},
            {pitch:  3, modGain: null},
            {pitch:  7, modGain: null},
            {pitch: 10, modGain: null}],
        numVoices = voices.length,
        carGain,
        modGain,

        init = function () {
            carGain = ctx.createGain();

            for (var i = 0; i < numVoices; i++) {
                voices[i].modGain = ctx.createGain();
            }

            carGain.connect(ctx.destination);
        },

        createVoice = function(when, until, freq, voiceIndex, loopIndex) {
            const modGain = voices[voiceIndex].modGain
                carOsc = ctx.createOscillator(),
                car2Osc = ctx.createOscillator(),
                modOsc = ctx.createOscillator();

            carOsc.connect(carGain);
            car2Osc.connect(carGain);
            modOsc.connect(modGain);
            modGain.connect(carOsc.frequency);
            modGain.connect(car2Osc.frequency);

            carOsc.frequency.value = freq;
            car2Osc.frequency.value = freq / 2;

            carGain.gain.setValueAtTime(0, when);
            carGain.gain.linearRampToValueAtTime(0.05, when + 0.01);
            carGain.gain.linearRampToValueAtTime(0.03, when + 0.5);
            carGain.gain.linearRampToValueAtTime(0.05, when + 0.98);
            carGain.gain.exponentialRampToValueAtTime(0.00001, when + 1.0);

            modOsc.frequency.setValueAtTime(freq * 2, when);

            // second envelope point changes over time
            let envTime = ((loopIndex % 32) / 32) * 0.75;
            modGain.gain.setValueAtTime(2000, when);
            modGain.gain.exponentialRampToValueAtTime(8000, when + 0.25 + envTime);
            modGain.gain.exponentialRampToValueAtTime(0.01, when + 0.5);
            modGain.gain.exponentialRampToValueAtTime(3000, when + 1.0);

            carOsc.start(when);
            car2Osc.start(when);
            modOsc.start(when);

            carOsc.stop(until);
            car2Osc.stop(until);
            modOsc.stop(until);
        },

        process = function(when, index, length) {
            for (var i = 0; i < numVoices; i++) {
                createVoice(when, when + 1, WH.mtof(60 + voices[i].pitch), i, index);
            }
        };

    init();

    return {
        process: process
    }
};
