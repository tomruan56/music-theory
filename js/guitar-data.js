/* Guitar chord data: standard tuning, movable shape templates, and curated
   beginner-friendly open-position fingerings. Pure data/logic, no DOM code. */
(function (MT) {
  'use strict';

  // Standard tuning, low E to high e.
  const STRING_MIDI = [40, 45, 50, 55, 59, 64];
  const OPEN_E_PC = 4; // E
  const OPEN_A_PC = 9; // A

  const QUALITIES = [
    { id: 'maj', name: 'Major', symbol: '' },
    { id: 'min', name: 'Minor', symbol: 'm' },
    { id: 'dom7', name: 'Dominant 7th', symbol: '7' },
    { id: 'maj7', name: 'Major 7th', symbol: 'maj7' },
    { id: 'min7', name: 'Minor 7th', symbol: 'm7' },
    { id: 'sus2', name: 'Sus2', symbol: 'sus2' },
    { id: 'sus4', name: 'Sus4', symbol: 'sus4' }
  ];

  // Movable shape templates, frets relative to an open (unbarred) position.
  // null = muted string. Order: low E, A, D, G, B, high e.
  const SHAPES = {
    maj:  { E: [0, 2, 2, 1, 0, 0], A: [null, 0, 2, 2, 2, 0] },
    min:  { E: [0, 2, 2, 0, 0, 0], A: [null, 0, 2, 2, 1, 0] },
    dom7: { E: [0, 2, 0, 1, 0, 0], A: [null, 0, 2, 0, 2, 0] },
    maj7: { E: [0, 2, 1, 1, 0, 0], A: [null, 0, 2, 1, 2, 0] },
    min7: { E: [0, 2, 0, 0, 0, 0], A: [null, 0, 2, 0, 1, 0] },
    sus4: { E: [0, 2, 2, 2, 0, 0], A: [null, 0, 2, 2, 3, 0] },
    sus2: { A: [null, 0, 2, 2, 0, 0] }
  };

  // Curated open-position chords for natural roots — the shapes most guitar
  // method books teach first, rather than the (correct but less playable)
  // barre shape a movable template would generate. `fingers` follows the
  // same string order as `frets` (1=index, 2=middle, 3=ring, 4=pinky; null
  // where the string is open or muted).
  const CURATED = {
    C_maj:   { frets: [null, 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null] },
    D_maj:   { frets: [null, null, 0, 2, 3, 2], fingers: [null, null, null, 1, 3, 2] },
    E_maj:   { frets: [0, 2, 2, 1, 0, 0], fingers: [null, 2, 3, 1, null, null] },
    F_maj:   { frets: [null, null, 3, 2, 1, 1], barre: { fret: 1, from: 4, to: 5 }, fingers: [null, null, 3, 2, 1, 1] },
    G_maj:   { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, null, null, null, 3] },
    A_maj:   { frets: [null, 0, 2, 2, 2, 0], fingers: [null, null, 1, 2, 3, null] },

    A_min:   { frets: [null, 0, 2, 2, 1, 0], fingers: [null, null, 2, 3, 1, null] },
    D_min:   { frets: [null, null, 0, 2, 3, 1], fingers: [null, null, null, 2, 3, 1] },
    E_min:   { frets: [0, 2, 2, 0, 0, 0], fingers: [null, 2, 3, null, null, null] },

    A_dom7:  { frets: [null, 0, 2, 0, 2, 0], fingers: [null, null, 1, null, 2, null] },
    B_dom7:  { frets: [null, 2, 1, 2, 0, 2], fingers: [null, 2, 1, 3, null, 4] },
    C_dom7:  { frets: [null, 3, 2, 3, 1, 0], fingers: [null, 3, 2, 4, 1, null] },
    D_dom7:  { frets: [null, null, 0, 2, 1, 2], fingers: [null, null, null, 2, 1, 3] },
    E_dom7:  { frets: [0, 2, 0, 1, 0, 0], fingers: [null, 2, null, 1, null, null] },
    G_dom7:  { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, null, null, null, 1] },

    C_maj7:  { frets: [null, 3, 2, 0, 0, 0], fingers: [null, 3, 2, null, null, null] },
    D_maj7:  { frets: [null, null, 0, 2, 2, 2], fingers: [null, null, null, 1, 1, 1] },
    E_maj7:  { frets: [0, 2, 1, 1, 0, 0], fingers: [null, 2, 1, 1, null, null] },
    G_maj7:  { frets: [3, 2, 0, 0, 0, 2], fingers: [2, null, null, null, null, 1] },
    A_maj7:  { frets: [null, 0, 2, 1, 2, 0], fingers: [null, null, 2, 1, 3, null] },

    A_min7:  { frets: [null, 0, 2, 0, 1, 0], fingers: [null, null, 2, null, 1, null] },
    D_min7:  { frets: [null, null, 0, 2, 1, 1], fingers: [null, null, null, 2, 1, 1] },
    E_min7:  { frets: [0, 2, 0, 0, 0, 0], fingers: [null, 2, null, null, null, null] },

    A_sus2:  { frets: [null, 0, 2, 2, 0, 0], fingers: [null, null, 1, 1, null, null] },
    D_sus2:  { frets: [null, null, 0, 2, 3, 0], fingers: [null, null, null, 2, 3, null] },

    A_sus4:  { frets: [null, 0, 2, 2, 3, 0], fingers: [null, null, 1, 2, 3, null] },
    D_sus4:  { frets: [null, null, 0, 2, 3, 3], fingers: [null, null, null, 1, 3, 3] },
    E_sus4:  { frets: [0, 2, 2, 2, 0, 0], fingers: [null, 2, 3, 4, null, null] }
  };

  // Derives a standard left-hand fingering for a movable barre shape: the
  // index finger always takes the barre, and any note beyond it is assigned
  // by how many frets past the barre it sits (1 fret = middle, 2 = ring/
  // pinky), matching how these shapes are taught. Three-way ties (all on the
  // same fret) become one finger laid flat across them, the way a partial
  // barre is actually played.
  function barreFingers(tpl) {
    const fingers = new Array(6).fill(null);
    const groups = {};
    tpl.forEach((v, i) => {
      if (v === 0) { fingers[i] = 1; return; }
      if (v === null) return;
      (groups[v] = groups[v] || []).push(i);
    });
    Object.keys(groups).map(Number).sort((a, b) => a - b).forEach((val) => {
      const idxs = groups[val];
      const startFinger = Math.min(1 + val, 4);
      if (idxs.length >= 3) {
        idxs.forEach((i) => { fingers[i] = startFinger; });
      } else {
        idxs.forEach((i, k) => { fingers[i] = Math.min(startFinger + k, 4); });
      }
    });
    return fingers;
  }

  function generateFromShape(rootPc, quality, form) {
    const tpl = SHAPES[quality] && SHAPES[quality][form];
    if (!tpl) return null;
    const openPc = form === 'E' ? OPEN_E_PC : OPEN_A_PC;
    const shift = ((rootPc - openPc) % 12 + 12) % 12;
    const frets = tpl.map((f) => (f === null ? null : f + shift));
    let barre = null;
    let fingers = null;
    if (shift > 0) {
      const firstIdx = frets.findIndex((f) => f !== null);
      barre = { fret: shift, from: firstIdx, to: 5 };
      fingers = barreFingers(tpl);
    }
    return {
      frets, barre, fingers,
      labelKey: shift === 0 ? 'voicingOpen' : (form === 'E' ? 'voicingBarreE' : 'voicingBarreA')
    };
  }

  /**
   * Returns an ordered list of playable voicings for a root + quality.
   * rootPc: 0-11 (0 = C), quality: one of QUALITIES ids.
   */
  function getVoicings(rootPc, quality) {
    const rootName = MT.data.SHARP_NAMES[rootPc];
    const voicings = [];
    const curated = CURATED[rootName + '_' + quality];
    if (curated) {
      voicings.push({
        frets: curated.frets, barre: curated.barre || null,
        fingers: curated.fingers || null, labelKey: 'voicingOpen'
      });
    }

    const generated = [generateFromShape(rootPc, quality, 'E'), generateFromShape(rootPc, quality, 'A')]
      .filter((v) => v && !(curated && v.barre === null))
      .sort((a, b) => (a.barre ? a.barre.fret : 0) - (b.barre ? b.barre.fret : 0));

    return voicings.concat(generated);
  }

  function midiForVoicing(voicing) {
    return voicing.frets
      .map((f, i) => (f === null ? null : STRING_MIDI[i] + f))
      .filter((m) => m !== null);
  }

  MT.guitarData = { STRING_MIDI, QUALITIES, getVoicings, midiForVoicing };
})(window.MT = window.MT || {});
