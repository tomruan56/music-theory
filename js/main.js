/* App shell: navigation, routing between modules, global controls. */
(function (MT) {
  'use strict';

  const NAV = [
    { id: 'home', icon: '🏠' },
    { id: 'notes', icon: '🎼' },
    { id: 'intervals', icon: '👂' },
    { id: 'scales', icon: '🎹' },
    { id: 'chords', icon: '🎵' },
    { id: 'guitar', icon: '🎸' },
    { id: 'circle', icon: '🕐' },
    { id: 'progress', icon: '📈' }
  ];

  let currentId = 'home';

  function navigate(id) {
    currentId = id;
    const main = document.getElementById('app-main');
    document.querySelectorAll('.nav-item').forEach((el) => {
      el.classList.toggle('active', el.dataset.id === id);
    });
    const mod = MT.modules[id];
    if (!mod) return;
    main.scrollTop = 0;
    if (mod.needsNavigate) mod.init(main, navigate);
    else mod.init(main);
    location.hash = id;
  }

  function buildNav() {
    const nav = document.getElementById('app-nav');
    nav.innerHTML = '';
    NAV.forEach((item) => {
      const btn = document.createElement('button');
      btn.className = 'nav-item';
      btn.dataset.id = item.id;
      btn.innerHTML = `<span class="nav-icon">${item.icon}</span><span>${MT.i18n.t('nav.' + item.id)}</span>`;
      btn.addEventListener('click', () => navigate(item.id));
      nav.appendChild(btn);
    });
    document.querySelectorAll('.nav-item').forEach((el) => {
      el.classList.toggle('active', el.dataset.id === currentId);
    });
  }

  function buildLangSwitch() {
    const host = document.getElementById('lang-switch');
    host.innerHTML = '';
    MT.i18n.LANGS.forEach((l) => {
      const btn = document.createElement('button');
      btn.className = 'lang-btn' + (MT.i18n.getLang() === l.id ? ' active' : '');
      btn.textContent = l.label;
      btn.addEventListener('click', () => {
        if (MT.i18n.getLang() === l.id) return;
        MT.i18n.setLang(l.id);
        applyLanguage();
      });
      host.appendChild(btn);
    });
  }

  function applyLanguage() {
    document.documentElement.lang = MT.i18n.getLang();
    document.getElementById('app-title').textContent = '🎶 ' + MT.i18n.t('app.title');
    buildLangSwitch();
    buildNav();
    navigate(currentId);
  }

  function setupVolume() {
    const slider = document.getElementById('volume-slider');
    slider.addEventListener('input', () => MT.audio.setVolume(Number(slider.value)));
    MT.audio.setVolume(Number(slider.value));
  }

  document.addEventListener('DOMContentLoaded', () => {
    currentId = (location.hash || '').replace('#', '') || 'home';
    if (!MT.modules[currentId]) currentId = 'home';
    applyLanguage();
    setupVolume();
  });
})(window.MT = window.MT || {});
