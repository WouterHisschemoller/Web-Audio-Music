// FM Tom
let ctx = context,
	when = ctx.currentTime;

let filterFreq = 400,
    cOsc = ctx.createOscillator(),
    cGain = ctx.createGain(),
    m1Osc = ctx.createOscillator(),
    m1Gain = ctx.createGain(),
    m2Osc = ctx.createOscillator(),
    m2Gain = ctx.createGain(),
    filter1 = ctx.createBiquadFilter(),
    filter2 = ctx.createBiquadFilter()
	gain = ctx.createGain();

cOsc.connect(cGain);
cGain.connect(filter1);
filter1.connect(filter2);
filter2.connect(gain);
gain.connect(ctx.destination);
m1Osc.connect(m1Gain);
m1Gain.connect(cOsc.frequency);
m2Osc.connect(m2Gain);
m2Gain.connect(m1Osc.frequency);

filter1.type = 'bandpass';
filter1.frequency.setValueAtTime(filterFreq, when);
filter1.Q.value = 3;

filter2.type = 'bandpass';
filter2.frequency.setValueAtTime(filterFreq, when);
filter2.Q.value = 3;

gain.gain.setValueAtTime(10, when);

cOsc.frequency.setValueAtTime(199.0 * 1.2, when);
cOsc.frequency.exponentialRampToValueAtTime(199.0, when + 0.003);
cGain.gain.setValueAtTime(0.7, when);
cGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.007);

m1Osc.frequency.setValueAtTime(1840.0 * 1.2, when);
m1Osc.frequency.exponentialRampToValueAtTime(1840.0, when + 0.003);
m1Gain.gain.setValueAtTime(15000, when);
m1Gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.007);

m2Osc.frequency.setValueAtTime(159.0, when);
m2Gain.gain.setValueAtTime(12000, when);
m2Gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.011);

cOsc.start(when);
m1Osc.start(when);
m2Osc.start(when);



// FM kick tuned in G
let ctx = context,
	when = ctx.currentTime;

let cOsc = ctx.createOscillator(),
    cGain = ctx.createGain(),
    m1Osc = ctx.createOscillator(),
    m1Gain = ctx.createGain(),
    m2Osc = ctx.createOscillator(),
    m2Gain = ctx.createGain();

cOsc.connect(cGain).connect(ctx.destination);
m1Osc.connect(m1Gain).connect(cOsc.frequency);
m2Osc.connect(m2Gain).connect(ctx.destination);

cOsc.frequency.setValueAtTime(49.0, when);
cGain.gain.setValueAtTime(1, when);
cGain.gain.exponentialRampToValueAtTime(0.001, when + 1.2);

m1Osc.frequency.setValueAtTime(24.5, when);
m1Gain.gain.setValueAtTime(5000, when);
m1Gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.01);

m2Osc.type = 'sawtooth';
m2Osc.frequency.setValueAtTime(166, when);
m2Gain.gain.setValueAtTime(6, when);
m2Gain.gain.setValueAtTime(0, when + 0.0001);

cOsc.start(when);
m1Osc.start(when);
m2Osc.start(when);



// Wave start bug Chrome and Safari
var gain = context.createGain();
gain.gain.value = 0.5;
gain.connect(context.destination);

var osc = new OscillatorNode(context);
osc.frequency.setValueAtTime(49.0, 0);
osc.connect(gain);
osc.start(0);
osc.stop(0.25);

var osc2 = new OscillatorNode(context);
osc2.frequency.setValueAtTime(49.0, 0.5);
osc2.connect(gain);
osc2.start(0.5);
osc2.stop(0.75);
