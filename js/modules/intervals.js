/* Module: Interval ear-training — hear two notes, name the interval. */
(function (MT) {
  'use strict';

  let state = null;
  const MIN_ROOT = 55; // G3
  const MAX_ROOT = 72; // C5

  function playCurrent() {
    const { rootMidi, semitones, mode } = state.current;
    const second = rootMidi + semitones;
    if (mode === 'harmonic') {
      MT.audio.playChord([rootMidi, second], { duration: 1.6 });
    } else {
      MT.audio.playSequence([rootMidi, second], { gap: 0.55, duration: 0.6 });
    }
  }

  function nextQuestion(root) {
    const mode = root.querySelector('#iv-mode').value;
    const interval = MT.data.INTERVALS[Math.floor(Math.random() * MT.data.INTERVALS.length)];
    const rootMidi = MIN_ROOT + Math.floor(Math.random() * (MAX_ROOT - MIN_ROOT - interval.semitones + 1));
    state.current = { rootMidi, semitones: interval.semitones, short: interval.short, mode };
    state.piano.clearHighlights();
    root.querySelector('#iv-feedback').textContent = '';
    root.querySelector('#iv-feedback').className = 'feedback';
    root.querySelectorAll('.answer-btn').forEach((b) => b.classList.remove('hl-correct', 'hl-wrong'));
    playCurrent();
  }

  function updateStats(root) {
    const s = MT.storage.loadAll().intervals;
    const pct = s.attempts ? Math.round((100 * s.correct) / s.attempts) : 0;
    root.querySelector('#iv-stats').textContent =
      MT.i18n.t('intervals.stats', { attempts: s.attempts, pct, streak: s.streak, best: s.bestStreak });
  }

  function handleAnswer(root, short, btn) {
    const cur = state.current;
    const correct = short === cur.short;
    const fb = root.querySelector('#iv-feedback');
    const second = cur.rootMidi + cur.semitones;
    const curName = MT.i18n.t('interval.' + cur.short);
    if (correct) {
      fb.textContent = MT.i18n.t('intervals.correct', { name: curName });
      fb.className = 'feedback ok';
      btn.classList.add('hl-correct');
    } else {
      fb.textContent = MT.i18n.t('intervals.wrong', { name: curName, short: cur.short });
      fb.className = 'feedback bad';
      btn.classList.add('hl-wrong');
      root.querySelectorAll('.answer-btn').forEach((b) => {
        if (b.dataset.short === cur.short) b.classList.add('hl-correct');
      });
    }
    state.piano.highlight([cur.rootMidi], 'hl-root');
    state.piano.highlight([second], 'hl-note');
    MT.storage.record('intervals', correct);
    updateStats(root);
    setTimeout(() => nextQuestion(root), correct ? 900 : 1800);
  }

  function init(root) {
    const t = MT.i18n.t;
    root.innerHTML = `
      <h2>${t('intervals.title')}</h2>
      <p class="module-intro">${t('intervals.intro')}</p>
      <div class="control-row">
        <label>${t('intervals.modeLabel')}
          <select id="iv-mode">
            <option value="melodic">${t('intervals.modeMelodic')}</option>
            <option value="harmonic">${t('intervals.modeHarmonic')}</option>
          </select>
        </label>
        <button class="btn" id="iv-replay">${t('intervals.replay')}</button>
      </div>
      <div class="answer-grid" id="iv-answers"></div>
      <div id="iv-feedback" class="feedback"></div>
      <div id="iv-piano" class="piano-scroll"></div>
      <div class="stats-row" id="iv-stats"></div>
    `;

    const grid = root.querySelector('#iv-answers');
    MT.data.INTERVALS.forEach((iv) => {
      const btn = document.createElement('button');
      btn.className = 'btn answer-btn';
      btn.dataset.short = iv.short;
      btn.innerHTML = `<strong>${iv.short}</strong><span>${t('interval.' + iv.short)}</span>`;
      btn.addEventListener('click', () => handleAnswer(root, iv.short, btn));
      grid.appendChild(btn);
    });

    const pianoEl = root.querySelector('#iv-piano');
    const piano = MT.piano.create(pianoEl, { min: 48, max: 84, playOnClick: true });

    state = { piano, current: null };

    root.querySelector('#iv-mode').addEventListener('change', () => nextQuestion(root));
    root.querySelector('#iv-replay').addEventListener('click', playCurrent);

    updateStats(root);
    nextQuestion(root);
  }

  MT.modules = MT.modules || {};
  MT.modules.intervals = { init, title: 'Intervals' };
})(window.MT = window.MT || {});
