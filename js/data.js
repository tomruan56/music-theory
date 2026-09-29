/* Core music-theory data & pure helper functions. No DOM code here. */
(function (MT) {
  'use strict';

  const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const FLAT_NAMES  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const LETTER_STEP = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // pitchClass name (sharp spelling by default, or flat if useFlats true)
  function pcName(midi, useFlats) {
    const pc = ((midi % 12) + 12) % 12;
    return (useFlats ? FLAT_NAMES : SHARP_NAMES)[pc];
  }

  function octaveOf(midi) {
    return Math.floor(midi / 12) - 1; // MIDI 60 = C4
  }

  function noteLabel(midi, useFlats) {
    return pcName(midi, useFlats) + octaveOf(midi);
  }

  // diatonic index used for staff placement: letter step + 7*octave
  function diatonicIndex(letter, octave) {
    return LETTER_STEP[letter] + 7 * octave;
  }

  function midiFromLetterOctave(letter, accidental, octave) {
    const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[letter];
    const acc = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0;
    return (octave + 1) * 12 + base + acc;
  }

  const INTERVALS = [
    { semitones: 0, name: 'Unison', short: 'P1' },
    { semitones: 1, name: 'Minor 2nd', short: 'm2' },
    { semitones: 2, name: 'Major 2nd', short: 'M2' },
    { semitones: 3, name: 'Minor 3rd', short: 'm3' },
    { semitones: 4, name: 'Major 3rd', short: 'M3' },
    { semitones: 5, name: 'Perfect 4th', short: 'P4' },
    { semitones: 6, name: 'Tritone', short: 'TT' },
    { semitones: 7, name: 'Perfect 5th', short: 'P5' },
    { semitones: 8, name: 'Minor 6th', short: 'm6' },
    { semitones: 9, name: 'Major 6th', short: 'M6' },
    { semitones: 10, name: 'Minor 7th', short: 'm7' },
    { semitones: 11, name: 'Major 7th', short: 'M7' },
    { semitones: 12, name: 'Octave', short: 'P8' }
  ];

  const SCALES = [
    { id: 'major', name: 'Major (Ionian)', steps: [0, 2, 4, 5, 7, 9, 11] },
    { id: 'natural_minor', name: 'Natural Minor (Aeolian)', steps: [0, 2, 3, 5, 7, 8, 10] },
    { id: 'harmonic_minor', name: 'Harmonic Minor', steps: [0, 2, 3, 5, 7, 8, 11] },
    { id: 'melodic_minor', name: 'Melodic Minor (asc.)', steps: [0, 2, 3, 5, 7, 9, 11] },
    { id: 'dorian', name: 'Dorian', steps: [0, 2, 3, 5, 7, 9, 10] },
    { id: 'phrygian', name: 'Phrygian', steps: [0, 1, 3, 5, 7, 8, 10] },
    { id: 'lydian', name: 'Lydian', steps: [0, 2, 4, 6, 7, 9, 11] },
    { id: 'mixolydian', name: 'Mixolydian', steps: [0, 2, 4, 5, 7, 9, 10] },
    { id: 'locrian', name: 'Locrian', steps: [0, 1, 3, 5, 6, 8, 10] }
  ];

  const CHORDS = [
    { id: 'maj', name: 'Major', symbol: '', steps: [0, 4, 7] },
    { id: 'min', name: 'Minor', symbol: 'm', steps: [0, 3, 7] },
    { id: 'dim', name: 'Diminished', symbol: '°', steps: [0, 3, 6] },
    { id: 'aug', name: 'Augmented', symbol: '+', steps: [0, 4, 8] },
    { id: 'maj7', name: 'Major 7th', symbol: 'maj7', steps: [0, 4, 7, 11] },
    { id: 'dom7', name: 'Dominant 7th', symbol: '7', steps: [0, 4, 7, 10] },
    { id: 'min7', name: 'Minor 7th', symbol: 'm7', steps: [0, 3, 7, 10] },
    { id: 'm7b5', name: 'Half-Diminished 7th', symbol: 'm7b5', steps: [0, 3, 6, 10] },
    { id: 'dim7', name: 'Diminished 7th', symbol: 'dim7', steps: [0, 3, 6, 9] }
  ];

  // Circle of fifths, clockwise from C. useFlats marks the conventional spelling side.
  const CIRCLE_OF_FIFTHS = [
    { major: 'C',  minor: 'Am',  accidentals: 0, type: null },
    { major: 'G',  minor: 'Em',  accidentals: 1, type: '#' },
    { major: 'D',  minor: 'Bm',  accidentals: 2, type: '#' },
    { major: 'A',  minor: 'F#m', accidentals: 3, type: '#' },
    { major: 'E',  minor: 'C#m', accidentals: 4, type: '#' },
    { major: 'B',  minor: 'G#m', accidentals: 5, type: '#' },
    { major: 'F#', minor: 'D#m', accidentals: 6, type: '#' },
    { major: 'Db', minor: 'Bbm', accidentals: 5, type: 'b' },
    { major: 'Ab', minor: 'Fm',  accidentals: 4, type: 'b' },
    { major: 'Eb', minor: 'Cm',  accidentals: 3, type: 'b' },
    { major: 'Bb', minor: 'Gm',  accidentals: 2, type: 'b' },
    { major: 'F',  minor: 'Dm',  accidentals: 1, type: 'b' }
  ];

  MT.data = {
    SHARP_NAMES, FLAT_NAMES, LETTER_STEP,
    midiToFreq, pcName, octaveOf, noteLabel,
    diatonicIndex, midiFromLetterOctave,
    INTERVALS, SCALES, CHORDS, CIRCLE_OF_FIFTHS
  };
})(window.MT = window.MT || {});
