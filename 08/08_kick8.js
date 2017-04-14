/**
 * 808 kick sound.
 */

window.WH = window.WH || {};

WH.createKick8 = function(specs) {
    var ctx = specs.ctx,
        noiseSource = specs.noise,
        voices = [],

        /**
         * Create an 808 kick drum voice.
         * @return {object} Voice public interface.
         */
         createVoice = function(when) {
        	var voice, osc, oscGain, choke, noise, noiseGain, noiseFilter;

        	var tone = 64;
        	var decay = 64;
        	var level = 100;
        	var max = 1;
			var min = 0.09;
        	var duration = (max - min) * (decay / 127) + min;

        	osc = ctx.createOscillator();
        	osc.frequency.value = 54;
        	osc.frequency.setValueAtTime(54 + Math.random() * 20, when);
  			osc.frequency.exponentialRampToValueAtTime(32, when + duration);

			oscGain = ctx.createGain();
			oscGain.gain.setValueAtTime(0.0001, when);
  			oscGain.gain.exponentialRampToValueAtTime(1, when + 0.004);
  			oscGain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

			choke = ctx.createGain();
			choke.gain.value = 0;
			choke.gain.setValueAtTime(0, when + 0.0001);
			choke.gain.linearRampToValueAtTime(1, when + 0.0002);

			noise = ctx.createBufferSource();
			noise.buffer = noiseSource.getWhite();
			noise.loop = true;

			noiseFilter = ctx.createBiquadFilter();
			noiseFilter.type = 'bandpass';
			noiseFilter.frequency.value = 1380 * 2;
			noiseFilter.Q.value = 20;

			noiseGain = ctx.createGain();
			noiseGain.gain.setValueAtTime(2 * Math.max((tone / 127), 0.0001), when);
			noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.01);

			osc.connect(oscGain).connect(choke);
			noise.connect(noiseFilter).connect(noiseGain).connect(choke);
			choke.connect(ctx.destination);

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

    return {
        process: process
    }
};
