// A simple FM Cmin7 chord synthesis example.
var data = [
  {f: 261.626},
  {f: 311.127},
  {f: 391.995},
  {f: 466.164}
];

var carGain = context.createGain();
carGain.connect(context.destination);
carGain.gain.setValueAtTime(0, context.currentTime);
carGain.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.01);
carGain.gain.linearRampToValueAtTime(0.03, context.currentTime + 0.5);
carGain.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.98);
carGain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.0);

for (var i = 0; i < data.length; i++) {
  const carOsc = context.createOscillator();
  const car2Osc = context.createOscillator();
  const modOsc = context.createOscillator();
  const modGain = context.createGain();

  carOsc.connect(carGain);
  car2Osc.connect(carGain);
  modOsc.connect(modGain);
  modGain.connect(carOsc.frequency);
  modGain.connect(car2Osc.frequency);

  carOsc.frequency.value = data[i].f;
  car2Osc.frequency.value = data[i].f / 2;
  modOsc.frequency.setValueAtTime(data[i].f, context.currentTime);
  modOsc.frequency.exponentialRampToValueAtTime(data[i].f, context.currentTime + 0.5);
  //modOsc.frequency.exponentialRampToValueAtTime(data[i].f, context.currentTime + 1.0);
  modGain.gain.setValueAtTime(2000, context.currentTime);
  modGain.gain.exponentialRampToValueAtTime(8000, context.currentTime + 0.25);
  modGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
  modGain.gain.exponentialRampToValueAtTime(3000, context.currentTime + 1.0);

  carOsc.start();
  car2Osc.start();
  modOsc.start();
}




// A simple FM Cmin7 chord synthesis example.
var data = [
    {f: 261.626},
    {f: 311.127},
    {f: 391.995},
    {f: 466.164}
];

var carGain = context.createGain();
carGain.connect(context.destination);
carGain.gain.setValueAtTime(0, context.currentTime);
carGain.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.01);
carGain.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.98);
carGain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.0);

for (var i = 0; i < data.length; i++) {
    const carOsc = context.createOscillator();
    const modOsc = context.createOscillator();
    const modGain = context.createGain();

    carOsc.connect(carGain);
    modOsc.connect(modGain);
    modGain.connect(carOsc.frequency);

    carOsc.frequency.value = data[i].f;
    modOsc.frequency.setValueAtTime(data[i].f, context.currentTime);
    modOsc.frequency.exponentialRampToValueAtTime(data[i].f, context.currentTime + 0.5);
    modOsc.frequency.exponentialRampToValueAtTime(data[i].f, context.currentTime + 1.0);
    modGain.gain.setValueAtTime(2000, context.currentTime);
    modGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    modGain.gain.exponentialRampToValueAtTime(2000, context.currentTime + 1.0);

    carOsc.start();
    modOsc.start();
}






// 1. Check the tutorial in the main menu.
// 2. Then press ARROW button on the tool bar left.
// 3. Have some WebAudio fun!
//
// @channels 1
// @duration 1.0
// @sampleRate 44100

var carrier = context.createOscillator();
var gain = context.createGain();
carrier.frequency.setValueAtTime(220, 0.0);
gain.gain.setValueAtTime(1, 0.0);
carrier.connect(gain);
gain.connect(context.destination);

var modulator = context.createOscillator();
var modGain = context.createGain();
modulator.frequency.setValueAtTime(110, 0.0);
modGain.gain.value = 300;
modulator.connect(modGain);
modGain.connect(carrier.frequency);

modulator.start();
carrier.start();
