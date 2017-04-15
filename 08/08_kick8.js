/**
 * 808 kick sound.
 */

window.WH = window.WH || {};

WH.createKick8 = function(specs) {
    var ctx = specs.ctx,
        noiseSource = specs.noise,
        voices = [],
        oscGain,
        choke,
        noiseFilter,
        noiseGain,

        init = function() {
        	oscGain = ctx.createGain();

            choke = ctx.createGain();

			noiseFilter = ctx.createBiquadFilter();
			noiseFilter.type = 'bandpass';
			noiseFilter.frequency.value = 1380 * 2;
			noiseFilter.Q.value = 20;

            noiseGain = ctx.createGain();

            oscGain.connect(choke);
            noiseFilter.connect(noiseGain).connect(choke);
			choke.connect(ctx.destination);
        },

        /**
         * Create an 808 kick drum voice.
         * @return {object} Voice public interface.
         */
         createVoice = function(when) {
        	let voice, osc, noise;

        	var tone = 64;
        	var decay = 64;
        	var level = 100;
        	var max = 1;
			var min = 0.09;
        	var duration = 0.3; // (max - min) * (decay / 127) + min;

        	osc = ctx.createOscillator();
        	osc.frequency.setValueAtTime(54 + Math.random() * 20, when);
  			osc.frequency.exponentialRampToValueAtTime(32, when + duration);

			oscGain.gain.setValueAtTime(0.0001, when);
  			oscGain.gain.exponentialRampToValueAtTime(1, when + 0.004);
  			oscGain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

            choke.gain.cancelScheduledValues(when);
			choke.gain.setValueAtTime(0, when);
			choke.gain.setValueAtTime(0, when + 0.0001);
			choke.gain.linearRampToValueAtTime(1, when + 0.0002);

			noise = ctx.createBufferSource();
			noise.buffer = noiseSource.getWhite();
			noise.loop = true;

            noiseGain.gain.cancelScheduledValues(when);
			noiseGain.gain.setValueAtTime(2 * Math.max((tone / 127), 0.0001), when);
			noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.01);

			osc.connect(oscGain);
			noise.connect(noiseFilter);

			noise.start(when);
  			noise.stop(when + duration + 1.0);

			osc.start(when);
			osc.stop(when + duration + 1.0);

			return voice;
        },

        process = function(when, index, length) {
            createVoice(when);
            createVoice(when + (length * (2/16)));
            createVoice(when + (length * (5/16)));
        };

    init();

    return {
        process: process
    }
};
