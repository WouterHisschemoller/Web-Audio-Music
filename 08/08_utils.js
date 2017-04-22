/**
 * Noise source provides white, pink and brown noise.
 */

window.WH = window.WH || {};

WH.createUtils = function(specs) {
    var ctx = specs.ctx,
        channels = 1,
        noiseBufferSize = ctx.sampleRate * 2,
        whiteNoise,
        pinkNoise,
        brownNoise,

        init = function() {
            whiteNoise = createWhiteNoise();
            pinkNoise = createPinkNoise();
            brownNoise = createBrownNoise();
        },

        /**
         * Create a buffer of white noise.
         * @return {object} AudioBuffer of white noise.
         */
        createWhiteNoise = function() {
            var buffer = ctx.createBuffer(channels, noiseBufferSize, ctx.sampleRate),
                bufferChannels = buffer.getChannelData(0),
                i;

            for (i = 0; i < noiseBufferSize; i++) {
                bufferChannels[i] = Math.random() * 2 - 1;
            }

            return buffer;
        },

        /**
         * Create a buffer of pink noise.
         * @return {object} AudioBuffer of pink noise.
         */
        createPinkNoise = function() {
            var buffer = ctx.createBuffer(channels, noiseBufferSize, ctx.sampleRate),
                bufferChannels = buffer.getChannelData(0),
                white, i, b0, b1, b2, b3, b4, b5, b6;

            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            for (i = 0; i < noiseBufferSize; i++) {
                white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                bufferChannels[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                bufferChannels[i] *= 0.11;
                b6 = white * 0.115926;
            }

            return buffer;
        },

        /**
         * Create a buffer of brown noise.
         * @return {object} AudioBuffer of brown noise.
         */
        createBrownNoise = function() {
            var buffer = ctx.createBuffer(channels, noiseBufferSize, ctx.sampleRate),
                bufferChannels = buffer.getChannelData(0),
                i, white,
                lastOut = 0.0;

            for (i = 0; i < noiseBufferSize; i++) {
                white = Math.random() * 2 - 1;
                bufferChannels[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = bufferChannels[i];
                bufferChannels[i] *= 3.5; // (roughly) compensate for gain
            }

            return buffer;
        },

        getWhiteNoise = function() {
            return whiteNoise;
        },

        getPinkNoise = function() {
            return pinkNoise;
        },

        getBrownNoise = function() {
            return brownNoise;
        },

        /**
         * Converts a MIDI pitch number to frequency.
         * @param  {Number} midi MIDI pitch (0 ~ 127)
         * @return {Number} Frequency (Hz)
         */
        mtof = function(midi) {
            if (midi <= -1500) return 0;
            else if (midi > 1499) return 3.282417553401589e+38;
            else return 440.0 * Math.pow(2, (Math.floor(midi) - 69) / 12.0);
        };

    init();

    WH.getWhiteNoise = getWhiteNoise;
    WH.getPinkNoise = getPinkNoise;
    WH.getBrownNoise = getBrownNoise;
    WH.mtof = mtof;
};
