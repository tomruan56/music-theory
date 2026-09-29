/* Module: Scales — explore scale formulas on the keyboard, then quiz building them. */
(function (MT) {
  'use strict';

  const ROOTS = MT.data.SHARP_NAMES; // 12 pitch classes, C..B

  let state = null;

  function scaleMidis(rootPc, steps) {
    const start = 48 + rootPc; // C3-based, keeps every scale inside the keyboard range
    return steps.map((s) => start + s);
  }

  function stepLabel(diff) {
    if (diff === 1) return 'H';
    if (diff === 2) return 'W';
    return '+' + diff;
  }

  function formulaFor(steps) {
    const parts = [];
    for (let i = 1; i < steps.length; i++) parts.push(stepLabel(steps[i] - steps[i - 1]));
    parts.push(stepLabel(steps[0] + 12 - steps[steps.length - 1]));
    return parts.join(' – ');
  }

  function renderExplore(root) {
    const rootPc = ROOTS.indexOf(root.querySelector('#sc-root').value);
    const scaleDef = MT.data.SCALES.find((s) => s.id === root.querySelector('#sc-type').value);
    const midis = scaleMidis(rootPc, scaleDef.steps);
    state.explorePiano.clearHighlights();
    state.explorePiano.highlight([midis[0]], 'hl-root');
    state.explorePiano.highlight(midis.slice(1), 'hl-note');
    root.querySelector('#sc-formula').textContent = formulaFor(scaleDef.steps);
    root.querySelector('#sc-notes').textContent = midis.map((m) => MT.data.noteLabel(m)).join('  –  ');
    state.exploreMidis = midis;
  }

  function updateStats(root) {
    const s = MT.storage.loadAll().scales;
    const pct = s.attempts ? Math.round((100 * s.correct) / s.attempts) : 0;
    root.querySelector('#sc-stats').textContent =
      MT.i18n.t('scales.stats', { attempts: s.attempts, pct, streak: s.streak, best: s.bestStreak });
  }

  function newQuizQuestion(root) {
    const rootPc = Math.floor(Math.random() * 12);
    const scaleDef = MT.data.SCALES[Math.floor(Math.random() * MT.data.SCALES.length)];
    const midis = scaleMidis(rootPc, scaleDef.steps);
    state.quiz = { midis, scaleDef, rootName: ROOTS[rootPc], index: 0, mistakes: 0 };
    state.quizPiano.clearHighlights();
    root.querySelector('#sc-quiz-prompt').textContent =
      MT.i18n.t('scales.quizPrompt', { root: ROOTS[rootPc], scale: MT.i18n.t('scale.' + scaleDef.id) });
    root.querySelector('#sc-quiz-feedback').textContent = '';
    root.querySelector('#sc-quiz-feedback').className = 'feedback';
    state.quizPiano.highlight([midis[0]], 'hl-root');
  }

  function handleQuizClick(root, midi) {
    const q = state.quiz;
    if (!q || q.index >= q.midis.length) return;
    const expected = q.midis[q.index];
    if (midi === expected) {
      state.quizPiano.flash(midi, 'hl-correct', 1200);
      q.index++;
    } else {
      q.mistakes++;
      state.quizPiano.flash(midi, 'hl-wrong');
    }
    if (q.index >= q.midis.length) {
      const correct = q.mistakes === 0;
      const fb = root.querySelector('#sc-quiz-feedback');
      fb.textContent = correct
        ? MT.i18n.t('scales.quizComplete')
        : MT.i18n.t('scales.quizCompleteMistakes', { n: q.mistakes, notes: q.midis.map((m) => MT.data.noteLabel(m)).join(', ') });
      fb.className = 'feedback ' + (correct ? 'ok' : 'bad');
      MT.storage.record('scales', correct);
      updateStats(root);
      setTimeout(() => newQuizQuestion(root), 1800);
    }
  }

  function switchTab(root, tab) {
    root.querySelectorAll('.tab-btn').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
    root.querySelectorAll('.tab-pane').forEach((p) => p.classList.toggle('active', p.dataset.pane === tab));
  }

  function init(root) {
    const t = MT.i18n.t;
    root.innerHTML = `
      <h2>${t('scales.title')}</h2>
      <p class="module-intro">${t('scales.intro')}</p>
      <div class="tab-row">
        <button class="tab-btn active" data-tab="explore">${t('scales.tabExplore')}</button>
        <button class="tab-btn" data-tab="quiz">${t('scales.tabQuiz')}</button>
      </div>

      <div class="tab-pane active" data-pane="explore">
        <div class="control-row">
          <label>${t('scales.rootLabel')}
            <select id="sc-root">${ROOTS.map((r) => `<option value="${r}">${r}</option>`).join('')}</select>
          </label>
          <label>${t('scales.scaleLabel')}
            <select id="sc-type">${MT.data.SCALES.map((s) => `<option value="${s.id}">${t('scale.' + s.id)}</option>`).join('')}</select>
          </label>
          <button class="btn" id="sc-play-asc">${t('scales.playAsc')}</button>
          <button class="btn" id="sc-play-desc">${t('scales.playDesc')}</button>
        </div>
        <div class="formula-line">${t('scales.formulaLabel')} <span id="sc-formula"></span></div>
        <div class="formula-line">${t('scales.notesLabel')} <span id="sc-notes"></span></div>
        <div id="sc-explore-piano" class="piano-scroll"></div>
      </div>

      <div class="tab-pane" data-pane="quiz">
        <p id="sc-quiz-prompt" class="module-intro"></p>
        <div id="sc-quiz-feedback" class="feedback"></div>
        <div id="sc-quiz-piano" class="piano-scroll"></div>
        <div class="control-row"><button class="btn ghost" id="sc-quiz-new">${t('scales.newScale')}</button></div>
      </div>

      <div class="stats-row" id="sc-stats"></div>
    `;

    root.querySelectorAll('.tab-btn').forEach((b) => {
      b.addEventListener('click', () => switchTab(root, b.dataset.tab));
    });

    const explorePiano = MT.piano.create(root.querySelector('#sc-explore-piano'), { min: 48, max: 84 });
    const quizPiano = MT.piano.create(root.querySelector('#sc-quiz-piano'), {
      min: 48, max: 84,
      onKeyClick: (midi) => handleQuizClick(root, midi)
    });

    state = { explorePiano, quizPiano, exploreMidis: [], quiz: null };

    root.querySelector('#sc-root').addEventListener('change', () => renderExplore(root));
    root.querySelector('#sc-type').addEventListener('change', () => renderExplore(root));
    root.querySelector('#sc-play-asc').addEventListener('click', () => {
      MT.audio.playSequence(state.exploreMidis, { gap: 0.32, duration: 0.4 });
    });
    root.querySelector('#sc-play-desc').addEventListener('click', () => {
      MT.audio.playSequence([...state.exploreMidis].reverse(), { gap: 0.32, duration: 0.4 });
    });
    root.querySelector('#sc-quiz-new').addEventListener('click', () => newQuizQuestion(root));

    renderExplore(root);
    newQuizQuestion(root);
    updateStats(root);
  }

  MT.modules = MT.modules || {};
  MT.modules.scales = { init, title: 'Scales' };
})(window.MT = window.MT || {});
