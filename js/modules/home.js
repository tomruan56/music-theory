/* Module: Home — landing dashboard with quick links into each trainer. */
(function (MT) {
  'use strict';

  const CARD_IDS = ['notes', 'intervals', 'scales', 'chords', 'guitar', 'circle', 'progress'];
  const ICONS = { notes: '🎼', intervals: '👂', scales: '🎹', chords: '🎵', guitar: '🎸', circle: '🕐', progress: '📈' };

  function init(root, navigate) {
    const t = MT.i18n.t;
    root.innerHTML = `
      <h2>${t('home.title')}</h2>
      <p class="module-intro">${t('home.intro')}</p>
      <div class="home-grid" id="home-grid"></div>
    `;
    const grid = root.querySelector('#home-grid');
    CARD_IDS.forEach((id) => {
      const card = document.createElement('button');
      card.className = 'home-card';
      card.innerHTML = `<span class="home-card-icon">${ICONS[id]}</span><span class="home-card-title">${t('home.card.' + id + '.title')}</span><span class="home-card-desc">${t('home.card.' + id + '.desc')}</span>`;
      card.addEventListener('click', () => navigate(id));
      grid.appendChild(card);
    });
  }

  MT.modules = MT.modules || {};
  MT.modules.home = { init, title: 'Home', needsNavigate: true };
})(window.MT = window.MT || {});
