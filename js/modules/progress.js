/* Module: Progress — overview of stats across all training modules. */
(function (MT) {
  'use strict';

  function relativeTime(iso) {
    const t = MT.i18n.t;
    if (!iso) return t('progress.timeNever');
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return t('progress.timeJustNow');
    if (mins < 60) return t('progress.timeMinAgo', { n: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t('progress.timeHourAgo', { n: hrs });
    return t('progress.timeDayAgo', { n: Math.floor(hrs / 24) });
  }

  function render(root) {
    const t = MT.i18n.t;
    const data = MT.storage.loadAll();
    const rows = MT.storage.MODULES.map((id) => {
      const s = data[id];
      const pct = s.attempts ? Math.round((100 * s.correct) / s.attempts) : 0;
      return `
        <div class="progress-card">
          <div class="progress-card-head">
            <span>${t('nav.' + id)}</span>
            <span class="progress-pct">${pct}%</span>
          </div>
          <div class="progress-bar"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
          <div class="progress-meta">
            ${t('progress.meta', { attempts: s.attempts, streak: s.streak, best: s.bestStreak, last: relativeTime(s.last) })}
          </div>
        </div>`;
    }).join('');

    root.innerHTML = `
      <h2>${t('progress.title')}</h2>
      <p class="module-intro">${t('progress.intro')}</p>
      <div class="progress-grid">${rows}</div>
      <div class="control-row">
        <button class="btn ghost" id="pg-reset">${t('progress.resetButton')}</button>
      </div>
    `;

    root.querySelector('#pg-reset').addEventListener('click', () => {
      if (confirm(t('progress.resetConfirm'))) {
        MT.storage.reset();
        render(root);
      }
    });
  }

  MT.modules = MT.modules || {};
  MT.modules.progress = { init: render, title: 'Progress' };
})(window.MT = window.MT || {});
