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
