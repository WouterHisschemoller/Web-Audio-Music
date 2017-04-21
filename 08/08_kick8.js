/**
 * 808 kick sound.
 */

window.WH = window.WH || {};

WH.createKick8 = function(specs) {
    var ctx = specs.ctx,

        /**
         * Create an 808 kick drum voice.
         * @return {object} Voice public interface.
         */
         createVoice = function(when, duration) {
        	let osc, gain;

        	osc = ctx.createOscillator();
            gain = ctx.createGain();

            osc.connect(gain).connect(ctx.destination);

        	osc.frequency.setValueAtTime(54, when);
  			osc.frequency.exponentialRampToValueAtTime(32, when + duration);

			gain.gain.setValueAtTime(0.0001, when);
  			gain.gain.exponentialRampToValueAtTime(1, when + 0.004);
  			gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

            osc.onended = function(e) {
                gain.disconnect();
                gain = null;
            };

            osc.start(when);
            osc.stop(when + duration);
        },

        process = function(when, index, length) {
            createVoice(when, 0.5);
            createVoice(when + (length * (6/16)), 1.5);
            createVoice(when + (length * (10/16)), 0.5);
            createVoice(when + (length * (14/16)), 0.5);
        };

    return {
        process: process
    }
};
