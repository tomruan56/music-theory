/* Module: Circle of Fifths — interactive wheel with key-signature detail. */
(function (MT) {
  'use strict';

  const SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
  const FLAT_ORDER = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];
  const DATA = MT.data.CIRCLE_OF_FIFTHS;

  const CX = 170, CY = 170, R_OUT = 150, R_IN = 78, R_LABEL_OUT = 120, R_LABEL_IN = 100;

  function polar(cx, cy, r, angleDeg) {
    const rad = (angleDeg - 90) * Math.PI / 180 + Math.PI / 2; // 0deg = top, clockwise
    // simpler: theta measured clockwise from top
    const t = (Math.PI / 180) * angleDeg;
    return { x: cx + r * Math.sin(t), y: cy - r * Math.cos(t) };
  }

  function wedgePath(i) {
    const a0 = i * 30 - 15, a1 = i * 30 + 15;
    const p0 = polar(CX, CY, R_OUT, a0);
    const p1 = polar(CX, CY, R_OUT, a1);
    const p2 = polar(CX, CY, R_IN, a1);
    const p3 = polar(CX, CY, R_IN, a0);
    return `M ${p0.x} ${p0.y} A ${R_OUT} ${R_OUT} 0 0 1 ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${R_IN} ${R_IN} 0 0 0 ${p3.x} ${p3.y} Z`;
  }

  function svgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  function accidentalNotes(entry) {
    if (entry.accidentals === 0) return [];
    const order = entry.type === '#' ? SHARP_ORDER : FLAT_ORDER;
    return order.slice(0, entry.accidentals).map((l) => l + entry.type);
  }

  function pcForRoot(name) {
    // name like "C", "F#", "Db"
    const idx = MT.data.SHARP_NAMES.indexOf(name);
    if (idx >= 0) return idx;
    return MT.data.FLAT_NAMES.indexOf(name);
  }

  function showDetail(root, entry) {
    const acc = accidentalNotes(entry);
    const detail = root.querySelector('#cf-detail');
    const t = MT.i18n.t;
    let accidentalsText;
    if (entry.accidentals === 0) {
      accidentalsText = t('circle.noAccidentals');
    } else {
      const typeWord = entry.type === '#'
        ? (entry.accidentals > 1 ? t('circle.sharpPlural') : t('circle.sharp'))
        : (entry.accidentals > 1 ? t('circle.flatPlural') : t('circle.flat'));
      accidentalsText = t('circle.accidentals', { n: entry.accidentals, type: typeWord, list: acc.join(', ') });
    }
    detail.innerHTML = `
      <h3>${entry.major} major / ${entry.minor}</h3>
      <p>${accidentalsText}</p>
      <div class="control-row">
        <button class="btn" id="cf-play-major">${t('circle.playMajor', { root: entry.major })}</button>
        <button class="btn" id="cf-play-minor">${t('circle.playMinor', { root: entry.minor.replace('m', '') })}</button>
      </div>
    `;
    detail.querySelector('#cf-play-major').addEventListener('click', () => {
      const pc = pcForRoot(entry.major);
      const steps = MT.data.SCALES.find((s) => s.id === 'major').steps;
      MT.audio.playSequence(steps.map((s) => 48 + pc + s), { gap: 0.3, duration: 0.4 });
    });
    detail.querySelector('#cf-play-minor').addEventListener('click', () => {
      const pc = pcForRoot(entry.minor.replace('m', ''));
      const steps = MT.data.SCALES.find((s) => s.id === 'natural_minor').steps;
      MT.audio.playSequence(steps.map((s) => 48 + pc + s), { gap: 0.3, duration: 0.4 });
    });
  }

  function init(root) {
    const t = MT.i18n.t;
    root.innerHTML = `
      <h2>${t('circle.title')}</h2>
      <p class="module-intro">${t('circle.intro')}</p>
      <div class="circle-layout">
        <div id="cf-wheel"></div>
        <div id="cf-detail" class="cf-detail-panel">
          <p class="module-intro">${t('circle.selectPrompt')}</p>
        </div>
      </div>
    `;

    const wheelHost = root.querySelector('#cf-wheel');
    const svg = svgEl('svg', { viewBox: '0 0 340 340', class: 'circle-svg' });

    DATA.forEach((entry, i) => {
      const path = svgEl('path', { d: wedgePath(i), class: 'cf-wedge' });
      path.addEventListener('click', () => {
        svg.querySelectorAll('.cf-wedge').forEach((p) => p.classList.remove('active'));
        path.classList.add('active');
        showDetail(root, entry);
      });
      svg.appendChild(path);

      const outerPos = polar(CX, CY, R_LABEL_OUT, i * 30);
      const majorLabel = svgEl('text', { x: outerPos.x, y: outerPos.y, class: 'cf-label-major' });
      majorLabel.textContent = entry.major;
      svg.appendChild(majorLabel);

      const innerPos = polar(CX, CY, R_LABEL_IN - 22, i * 30);
      const minorLabel = svgEl('text', { x: innerPos.x, y: innerPos.y, class: 'cf-label-minor' });
      minorLabel.textContent = entry.minor;
      svg.appendChild(minorLabel);
    });

    wheelHost.appendChild(svg);
    showDetail(root, DATA[0]);
    svg.querySelector('.cf-wedge').classList.add('active');
  }

  MT.modules = MT.modules || {};
  MT.modules.circle = { init, title: 'Circle of Fifths' };
})(window.MT = window.MT || {});
