/**
 * Chord sound.
 */

window.WH = window.WH || {};

WH.createChord = function(specs) {
    var ctx = specs.ctx,
        chordPitches = [-4, 0, 3, 7, 10],
        numVoices = chordPitches.length,

        createVoice = function(when, until, freq, filtFreq, pan) {
            var panner = ctx.createStereoPanner();
            panner.pan.value = pan;
            panner.connect(ctx.destination);

            var gain = ctx.createGain();
            gain.gain.value = 0.2;
            gain.connect(panner);

            var filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = filtFreq;
            filter.Q.value = 2;
            filter.connect(gain);
            filter.frequency.linearRampToValueAtTime(50, until);

            var filter2 = ctx.createBiquadFilter();
            filter2.type = 'bandpass';
            filter2.frequency.value = filtFreq;
            filter2.Q.value = 4;
            filter2.connect(gain);
            filter2.frequency.linearRampToValueAtTime(50, until);

            var osc = ctx.createOscillator();
            osc.type = (Math.random() > 0.5) ? 'triangle' : 'sawtooth';
            osc.frequency.value = freq;
            osc.connect(filter2);
            osc.start(when + Math.random() * 0.01);
            osc.stop(until + Math.random() * 0.15);
        },

        process = function(when, index, length) {
            var hiFiltFreq = 5000;
            for (var i = 0; i < numVoices; i++) {
                var pan = 1 - (2 * (i / (numVoices - 1)));
                createVoice(when, when + 1, WH.mtof(48 + chordPitches[i]), 400, pan);
                // createVoice(when + 0.5, when + 1, pitch);
                createVoice(when + 1.125, when + 1.4, WH.mtof(55 + chordPitches[i]), hiFiltFreq, pan);
                // createVoice(when + 1.375, when + 1.5, WH.mtof(56 + chordPitches[i]), hiFiltFreq, pan);
                // createVoice(when + 1.625, when + 1.75, WH.mtof(55 + chordPitches[i]), hiFiltFreq, pan);
                // var start = index % 2 ? 1.75 : 1.875;
                // createVoice(when + start, when + start + 0.125, WH.mtof(51 + chordPitches[i]), hiFiltFreq, pan);
            }
        };

    return {
        process: process
    }
};
