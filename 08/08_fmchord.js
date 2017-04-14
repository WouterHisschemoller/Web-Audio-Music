/**
 * FM chord sound.
 */
window.WH = window.WH || {};

WH.fmChord = function(specs) {
    var ctx = specs.ctx,

        createVoice = function(when) {
            
        },

        process = function(when, index, length) {
            createVoice(when);
            createVoice(when + (length * (5/16)));
        };

    return {
        process: process
    }
};
