/* Simple Web Audio synth used for ear-training playback. */
(function (MT) {
  'use strict';

  let ctx = null;
  let masterGain = null;
  let volume = 0.6;

  function ensureCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = volume;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (masterGain) masterGain.gain.value = volume;
  }

  function playFrequency(freq, { duration = 0.85, delay = 0, type = 'triangle' } = {}) {
    ensureCtx();
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(0.9, t0 + 0.015);
    gain.gain.linearRampToValueAtTime(0.55, t0 + duration * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  function playNote(midi, opts) {
    playFrequency(MT.data.midiToFreq(midi), opts);
  }

  // Plays notes one after another.
  function playSequence(midiArray, { gap = 0.42, duration = 0.5, type = 'triangle' } = {}) {
    midiArray.forEach((m, i) => playNote(m, { duration, delay: i * gap, type }));
    return midiArray.length * gap + duration;
  }

  // Plays all notes together (a block chord).
  function playChord(midiArray, { duration = 1.5, type = 'triangle' } = {}) {
    midiArray.forEach((m) => playNote(m, { duration, delay: 0, type }));
  }

  MT.audio = { ensureCtx, setVolume, playFrequency, playNote, playSequence, playChord };
})(window.MT = window.MT || {});
