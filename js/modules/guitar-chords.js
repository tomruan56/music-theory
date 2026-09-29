/* Module: Guitar Chords — browse a chord chart, then inspect & hear any chord. */
(function (MT) {
  'use strict';

  const ROOTS = MT.data.SHARP_NAMES;
  let state = null;

  function currentQualityDef(root) {
    const id = root.querySelector('#gt-quality').value;
    return MT.guitarData.QUALITIES.find((q) => q.id === id);
  }

  function renderGrid(root) {
    const qDef = currentQualityDef(root);
    const grid = root.querySelector('#gt-grid');
    grid.innerHTML = '';
    ROOTS.forEach((rootName, pc) => {
      const voicings = MT.guitarData.getVoicings(pc, qDef.id);
      const card = document.createElement('button');
      card.className = 'guitar-card';
      if (pc === state.selectedPc) card.classList.add('active');
      card.innerHTML = `<span class="guitar-card-label">${rootName}${qDef.symbol}</span><span class="guitar-card-diagram"></span>`;
      grid.appendChild(card);
      MT.guitar.render(card.querySelector('.guitar-card-diagram'), voicings[0], { showFingers: false });
      card.addEventListener('click', () => selectChord(root, pc));
    });
  }

  function voicingLabel(v) {
    return MT.i18n.t('guitar.' + v.labelKey);
  }

  function selectChord(root, pc) {
    state.selectedPc = pc;
    state.voicingIndex = 0;
    root.querySelectorAll('.guitar-card').forEach((c, i) => c.classList.toggle('active', i === pc));
    renderDetail(root);
  }

  function renderDetail(root) {
    const qDef = currentQualityDef(root);
    const rootName = ROOTS[state.selectedPc];
    const voicings = MT.guitarData.getVoicings(state.selectedPc, qDef.id);
    state.voicings = voicings;
    if (state.voicingIndex >= voicings.length) state.voicingIndex = 0;
    const voicing = voicings[state.voicingIndex];

    const detail = root.querySelector('#gt-detail');
    detail.innerHTML = `
      <div class="guitar-detail-head">
        <h3>${rootName}${qDef.symbol || ''} <span class="guitar-detail-sub">${MT.i18n.t('chord.' + qDef.id)}</span></h3>
        <div class="voicing-tabs" id="gt-voicing-tabs"></div>
      </div>
      <div class="guitar-detail-body">
        <div class="guitar-detail-diagram" id="gt-detail-diagram"></div>
        <div>
          <div class="control-row">
            <button class="btn" id="gt-play-strum">${MT.i18n.t('guitar.strum')}</button>
            <button class="btn" id="gt-play-block">${MT.i18n.t('guitar.playTogether')}</button>
          </div>
          ${voicing.fingers ? `<div class="finger-legend">${MT.i18n.t('guitar.fingerLegend')}</div>` : ''}
        </div>
      </div>
    `;

    MT.guitar.render(detail.querySelector('#gt-detail-diagram'), voicing);

    const tabs = detail.querySelector('#gt-voicing-tabs');
    voicings.forEach((v, i) => {
      const btn = document.createElement('button');
      btn.className = 'voicing-tab' + (i === state.voicingIndex ? ' active' : '');
      btn.textContent = voicingLabel(v);
      btn.addEventListener('click', () => { state.voicingIndex = i; renderDetail(root); });
      tabs.appendChild(btn);
    });

    detail.querySelector('#gt-play-strum').addEventListener('click', () => {
      MT.audio.playSequence(MT.guitarData.midiForVoicing(voicing), { gap: 0.09, duration: 0.9, type: 'triangle' });
    });
    detail.querySelector('#gt-play-block').addEventListener('click', () => {
      MT.audio.playChord(MT.guitarData.midiForVoicing(voicing), { duration: 1.6 });
    });
  }

  function init(root) {
    const t = MT.i18n.t;
    root.innerHTML = `
      <h2>${t('guitar.title')}</h2>
      <p class="module-intro">${t('guitar.intro')}</p>
      <div class="control-row">
        <label>${t('guitar.chordTypeLabel')}
          <select id="gt-quality">
            ${MT.guitarData.QUALITIES.map((q) => `<option value="${q.id}">${t('chord.' + q.id)}</option>`).join('')}
          </select>
        </label>
      </div>
      <div class="guitar-grid" id="gt-grid"></div>
      <div id="gt-detail" class="guitar-detail-panel"></div>
    `;

    state = { selectedPc: 0, voicingIndex: 0, voicings: [] };

    root.querySelector('#gt-quality').addEventListener('change', () => {
      renderGrid(root);
      renderDetail(root);
    });

    renderGrid(root);
    renderDetail(root);
  }

  MT.modules = MT.modules || {};
  MT.modules.guitar = { init, title: 'Guitar Chords' };
})(window.MT = window.MT || {});
