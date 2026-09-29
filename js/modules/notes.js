/* Module: Note Reading — read a note on the staff, click the matching piano key. */
(function (MT) {
  'use strict';

  const TREBLE_POOL = [
    ['B', 3], ['C', 4], ['D', 4], ['E', 4], ['F', 4], ['G', 4], ['A', 4],
    ['B', 4], ['C', 5], ['D', 5], ['E', 5], ['F', 5], ['G', 5], ['A', 5]
  ];
  const BASS_POOL = [
    ['D', 2], ['E', 2], ['F', 2], ['G', 2], ['A', 2], ['B', 2],
    ['C', 3], ['D', 3], ['E', 3], ['F', 3], ['G', 3], ['A', 3], ['B', 3], ['C', 4]
  ];

  let state = null;

  function pick(clef) {
    const pool = clef === 'treble' ? TREBLE_POOL : BASS_POOL;
    const [letter, octave] = pool[Math.floor(Math.random() * pool.length)];
    const midi = MT.data.midiFromLetterOctave(letter, null, octave);
    return { letter, octave, midi };
  }

  function nextQuestion(root) {
    const clefSel = root.querySelector('#notes-clef').value;
    const clef = clefSel === 'random' ? (Math.random() < 0.5 ? 'treble' : 'bass') : clefSel;
    const q = pick(clef);
    state.current = { clef, ...q };
    MT.staff.render(root.querySelector('#notes-staff'), clef, q.letter, q.octave);
    root.querySelector('#notes-feedback').textContent = '';
    root.querySelector('#notes-feedback').className = 'feedback';
    state.piano.clearHighlights();
  }

  function updateStats(root) {
    const s = MT.storage.loadAll().notes;
    const pct = s.attempts ? Math.round((100 * s.correct) / s.attempts) : 0;
    root.querySelector('#notes-stats').textContent =
      MT.i18n.t('notes.stats', { attempts: s.attempts, pct, streak: s.streak, best: s.bestStreak });
  }

  function handleAnswer(root, midi) {
    const cur = state.current;
    const correct = midi === cur.midi;
    const fb = root.querySelector('#notes-feedback');
    if (correct) {
      fb.textContent = MT.i18n.t('notes.correct', { note: cur.letter + cur.octave });
      fb.className = 'feedback ok';
      state.piano.flash(midi, 'hl-correct');
    } else {
      fb.textContent = MT.i18n.t('notes.wrong', { played: MT.data.noteLabel(midi), note: cur.letter + cur.octave });
      fb.className = 'feedback bad';
      state.piano.flash(midi, 'hl-wrong');
      state.piano.flash(cur.midi, 'hl-correct');
    }
    MT.storage.record('notes', correct);
    updateStats(root);
    setTimeout(() => nextQuestion(root), correct ? 650 : 1400);
  }

  function init(root) {
    const t = MT.i18n.t;
    root.innerHTML = `
      <h2>${t('notes.title')}</h2>
      <p class="module-intro">${t('notes.intro')}</p>
      <div class="control-row">
        <label>${t('notes.clefLabel')}
          <select id="notes-clef">
            <option value="random">${t('notes.clefRandom')}</option>
            <option value="treble">${t('notes.clefTreble')}</option>
            <option value="bass">${t('notes.clefBass')}</option>
          </select>
        </label>
        <button class="btn" id="notes-replay">${t('notes.playNote')}</button>
        <button class="btn ghost" id="notes-skip">${t('notes.skip')}</button>
      </div>
      <div id="notes-staff" class="staff-wrap"></div>
      <div id="notes-feedback" class="feedback"></div>
      <div id="notes-piano" class="piano-scroll"></div>
      <div class="stats-row" id="notes-stats"></div>
    `;

    const pianoEl = root.querySelector('#notes-piano');
    const piano = MT.piano.create(pianoEl, {
      min: 36, max: 84,
      onKeyClick: (midi) => handleAnswer(root, midi)
    });

    state = { piano, current: null };

    root.querySelector('#notes-clef').addEventListener('change', () => nextQuestion(root));
    root.querySelector('#notes-replay').addEventListener('click', () => {
      if (state.current) MT.audio.playNote(state.current.midi, { duration: 0.9 });
    });
    root.querySelector('#notes-skip').addEventListener('click', () => nextQuestion(root));

    updateStats(root);
    nextQuestion(root);
  }

  MT.modules = MT.modules || {};
  MT.modules.notes = { init, title: 'Note Reading' };
})(window.MT = window.MT || {});
