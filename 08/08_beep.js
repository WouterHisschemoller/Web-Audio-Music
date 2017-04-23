/**
 * Beep sound.
 */

window.WH = window.WH || {};

WH.createBeep = function(specs) {
    var ctx = specs.ctx,
        osc,
        gain,
        hiBeepPosition = 0.875,
        hiBeepDisplacement = 0.25,

        init = function() {
            gain = ctx.createGain();
            gain.gain.value = 0;
            gain.connect(ctx.destination);
            osc = ctx.createOscillator();
            osc.frequency.value = 440;
            osc.connect(gain);
            osc.start();
        },

        playBeep = function(when, length, loopIndex) {
            osc.frequency.setValueAtTime(WH.mtof(36), when);
            gain.gain.setValueAtTime(0.001, when);
            gain.gain.exponentialRampToValueAtTime(0.5, when + 0.008);
            gain.gain.setValueAtTime(0.5, when + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, when + 0.12);

            if (Math.random() > 0.3) {
                when += (length * (4/16));
                osc.frequency.setValueAtTime(WH.mtof(36), when);
                gain.gain.setValueAtTime(0.001, when);
                gain.gain.exponentialRampToValueAtTime(0.5, when + 0.008);
                gain.gain.setValueAtTime(0.5, when + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, when + 0.12);
            }

            if (loopIndex >= 64) {
                when += (length * (1/16));
                osc.frequency.setValueAtTime(WH.mtof(36), when);
                gain.gain.setValueAtTime(0.001, when);
                gain.gain.exponentialRampToValueAtTime(0.5, when + 0.008);
                gain.gain.setValueAtTime(0.5, when + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, when + 0.12);
            }

            if (Math.random() > 0.9) {
                var hiBeepWhen = when + hiBeepPosition;
                hiBeepPosition = (hiBeepPosition + hiBeepDisplacement) % length;
                osc.frequency.value = WH.mtof(120);
                osc.frequency.setValueAtTime(WH.mtof(120), hiBeepWhen);
                gain.gain.setValueAtTime(0.001, hiBeepWhen);
                gain.gain.exponentialRampToValueAtTime(0.01, hiBeepWhen + 0.008);
                gain.gain.setValueAtTime(0.01, hiBeepWhen + 0.3);
                gain.gain.exponentialRampToValueAtTime(0.0000001, hiBeepWhen + 0.32);
            }
        },

        process = function(when, index, length) {
            if (index >= 32 && index < 128 ) {
                if (index >= 80 && index < 96 ) {
                    return;
                }
                playBeep(when + (length / 2), length, index);
            }
        };

    init();

    return {
        process: process
    }
};
