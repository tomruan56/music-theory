/* Module: Chords — explore chord construction, then ear-train chord quality. */
(function (MT) {
  'use strict';

  const ROOTS = MT.data.SHARP_NAMES;
  let state = null;

  function chordMidis(rootPc, steps) {
    const start = 48 + rootPc;
    return steps.map((s) => start + s);
  }

  function renderExplore(root) {
    const rootPc = ROOTS.indexOf(root.querySelector('#ch-root').value);
    const chordDef = MT.data.CHORDS.find((c) => c.id === root.querySelector('#ch-type').value);
    const midis = chordMidis(rootPc, chordDef.steps);
    state.explorePiano.clearHighlights();
    state.explorePiano.highlight([midis[0]], 'hl-root');
    state.explorePiano.highlight(midis.slice(1), 'hl-note');
    root.querySelector('#ch-name').textContent = `${ROOTS[rootPc]}${chordDef.symbol}`;
    root.querySelector('#ch-notes').textContent = midis.map((m) => MT.data.noteLabel(m)).join('  –  ');
    state.exploreMidis = midis;
  }

  function updateStats(root) {
    const s = MT.storage.loadAll().chords;
    const pct = s.attempts ? Math.round((100 * s.correct) / s.attempts) : 0;
    root.querySelector('#ch-stats').textContent =
      MT.i18n.t('chords.stats', { attempts: s.attempts, pct, streak: s.streak, best: s.bestStreak });
  }

  function switchTab(root, tab) {
    root.querySelectorAll('.tab-btn').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
    root.querySelectorAll('.tab-pane').forEach((p) => p.classList.toggle('active', p.dataset.pane === tab));
  }

  function playQuizChord() {
    const { midis, style } = state.quiz;
    if (style === 'block') MT.audio.playChord(midis, { duration: 1.7 });
    else MT.audio.playSequence(midis, { gap: 0.4, duration: 0.6 });
  }

  function newQuizQuestion(root) {
    const rootPc = Math.floor(Math.random() * 12);
    const chordDef = MT.data.CHORDS[Math.floor(Math.random() * MT.data.CHORDS.length)];
    const midis = chordMidis(rootPc, chordDef.steps);
    const style = root.querySelector('#ch-quiz-style').value === 'random'
      ? (Math.random() < 0.5 ? 'block' : 'arpeggio')
      : root.querySelector('#ch-quiz-style').value;
    state.quiz = { midis, chordDef, rootName: ROOTS[rootPc], style };
    state.quizPiano.clearHighlights();
    root.querySelector('#ch-quiz-feedback').textContent = '';
    root.querySelector('#ch-quiz-feedback').className = 'feedback';
    root.querySelectorAll('.answer-btn').forEach((b) => b.classList.remove('hl-correct', 'hl-wrong'));
    playQuizChord();
  }

  function handleAnswer(root, chordId, btn) {
    const q = state.quiz;
    const correct = chordId === q.chordDef.id;
    const fb = root.querySelector('#ch-quiz-feedback');
    const vars = { root: q.rootName, symbol: q.chordDef.symbol, name: MT.i18n.t('chord.' + q.chordDef.id) };
    if (correct) {
      fb.textContent = MT.i18n.t('chords.correct', vars);
      fb.className = 'feedback ok';
      btn.classList.add('hl-correct');
    } else {
      fb.textContent = MT.i18n.t('chords.wrong', vars);
      fb.className = 'feedback bad';
      btn.classList.add('hl-wrong');
      root.querySelectorAll('.answer-btn').forEach((b) => {
        if (b.dataset.id === q.chordDef.id) b.classList.add('hl-correct');
      });
    }
    state.quizPiano.highlight([q.midis[0]], 'hl-root');
    state.quizPiano.highlight(q.midis.slice(1), 'hl-note');
    MT.storage.record('chords', correct);
    updateStats(root);
    setTimeout(() => newQuizQuestion(root), correct ? 1000 : 2000);
  }

  function init(root) {
    const t = MT.i18n.t;
    root.innerHTML = `
      <h2>${t('chords.title')}</h2>
      <p class="module-intro">${t('chords.intro')}</p>
      <div class="tab-row">
        <button class="tab-btn active" data-tab="explore">${t('chords.tabExplore')}</button>
        <button class="tab-btn" data-tab="quiz">${t('chords.tabQuiz')}</button>
      </div>

      <div class="tab-pane active" data-pane="explore">
        <div class="control-row">
          <label>${t('chords.rootLabel')}
            <select id="ch-root">${ROOTS.map((r) => `<option value="${r}">${r}</option>`).join('')}</select>
          </label>
          <label>${t('chords.chordLabel')}
            <select id="ch-type">${MT.data.CHORDS.map((c) => `<option value="${c.id}">${t('chord.' + c.id)}</option>`).join('')}</select>
          </label>
          <button class="btn" id="ch-play-block">${t('chords.playBlock')}</button>
          <button class="btn" id="ch-play-arp">${t('chords.playArp')}</button>
        </div>
        <div class="formula-line">${t('chords.chordNameLabel')} <span id="ch-name"></span></div>
        <div class="formula-line">${t('chords.notesLabel')} <span id="ch-notes"></span></div>
        <div id="ch-explore-piano" class="piano-scroll"></div>
      </div>

      <div class="tab-pane" data-pane="quiz">
        <div class="control-row">
          <label>${t('chords.playbackLabel')}
            <select id="ch-quiz-style">
              <option value="random">${t('chords.styleRandom')}</option>
              <option value="block">${t('chords.styleBlock')}</option>
              <option value="arpeggio">${t('chords.styleArpeggio')}</option>
            </select>
          </label>
          <button class="btn" id="ch-replay">${t('chords.replay')}</button>
        </div>
        <div class="answer-grid" id="ch-answers"></div>
        <div id="ch-quiz-feedback" class="feedback"></div>
        <div id="ch-quiz-piano" class="piano-scroll"></div>
      </div>

      <div class="stats-row" id="ch-stats"></div>
    `;

    root.querySelectorAll('.tab-btn').forEach((b) => b.addEventListener('click', () => switchTab(root, b.dataset.tab)));

    const grid = root.querySelector('#ch-answers');
    MT.data.CHORDS.forEach((c) => {
      const btn = document.createElement('button');
      btn.className = 'btn answer-btn';
      btn.dataset.id = c.id;
      btn.innerHTML = `<strong>${c.symbol || 'maj'}</strong><span>${t('chord.' + c.id)}</span>`;
      btn.addEventListener('click', () => handleAnswer(root, c.id, btn));
      grid.appendChild(btn);
    });

    const explorePiano = MT.piano.create(root.querySelector('#ch-explore-piano'), { min: 48, max: 84 });
    const quizPiano = MT.piano.create(root.querySelector('#ch-quiz-piano'), { min: 48, max: 84 });

    state = { explorePiano, quizPiano, exploreMidis: [], quiz: null };

    root.querySelector('#ch-root').addEventListener('change', () => renderExplore(root));
    root.querySelector('#ch-type').addEventListener('change', () => renderExplore(root));
    root.querySelector('#ch-play-block').addEventListener('click', () => MT.audio.playChord(state.exploreMidis, { duration: 1.7 }));
    root.querySelector('#ch-play-arp').addEventListener('click', () => MT.audio.playSequence(state.exploreMidis, { gap: 0.35, duration: 0.5 }));
    root.querySelector('#ch-replay').addEventListener('click', playQuizChord);

    renderExplore(root);
    newQuizQuestion(root);
    updateStats(root);
  }

  MT.modules = MT.modules || {};
  MT.modules.chords = { init, title: 'Chords' };
})(window.MT = window.MT || {});
