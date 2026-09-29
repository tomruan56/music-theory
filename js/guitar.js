/* SVG fretboard-diagram renderer for guitar chord voicings. */
(function (MT) {
  'use strict';

  const STRING_X = [14, 34, 54, 74, 94, 114];
  const TOP_Y = 34;
  const FRET_H = 26;
  const FRET_COUNT = 4;
  const VIEW_W = 128;
  const VIEW_H = TOP_Y + FRET_H * FRET_COUNT + 14;

  function svgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  function render(container, voicing, opts) {
    const showFingers = !opts || opts.showFingers !== false;
    container.innerHTML = '';
    const frets = voicing.frets;
    const fretted = frets.filter((f) => f !== null && f > 0);
    const minFret = fretted.length ? Math.min(...fretted) : 0;
    const baseFret = minFret > 1 ? minFret - 1 : 0;
    const isOpenPosition = baseFret === 0;

    const svg = svgEl('svg', { viewBox: `0 0 ${VIEW_W} ${VIEW_H}`, class: 'fret-svg' });

    // strings
    STRING_X.forEach((x) => {
      svg.appendChild(svgEl('line', {
        x1: x, y1: TOP_Y, x2: x, y2: TOP_Y + FRET_H * FRET_COUNT, class: 'fret-string'
      }));
    });

    // frets (horizontal lines)
    for (let i = 0; i <= FRET_COUNT; i++) {
      const y = TOP_Y + i * FRET_H;
      const nut = isOpenPosition && i === 0;
      svg.appendChild(svgEl('line', {
        x1: STRING_X[0], y1: y, x2: STRING_X[5], y2: y,
        class: nut ? 'fret-nut' : 'fret-line'
      }));
    }

    if (!isOpenPosition) {
      const label = svgEl('text', { x: 4, y: TOP_Y + FRET_H * 0.7, class: 'fret-label' });
      label.textContent = (baseFret + 1) + 'fr';
      svg.appendChild(label);
    }

    // open/mute markers above the nut
    frets.forEach((f, i) => {
      const x = STRING_X[i];
      if (f === null) {
        const t = svgEl('text', { x, y: TOP_Y - 10, class: 'fret-mute' });
        t.textContent = '✕';
        svg.appendChild(t);
      } else if (f === 0) {
        svg.appendChild(svgEl('circle', { cx: x, cy: TOP_Y - 12, r: 4.5, class: 'fret-open' }));
      }
    });

    // barre bar
    if (voicing.barre) {
      const row = voicing.barre.fret - baseFret; // 1-based row within window
      const y = TOP_Y + (row - 0.5) * FRET_H;
      const x1 = STRING_X[voicing.barre.from];
      const x2 = STRING_X[voicing.barre.to];
      svg.appendChild(svgEl('rect', {
        x: x1 - 6, y: y - 6, width: (x2 - x1) + 12, height: 12, rx: 6, class: 'fret-barre'
      }));
      if (showFingers && voicing.fingers) {
        const barreFinger = voicing.fingers[voicing.barre.from];
        if (barreFinger) {
          const label = svgEl('text', { x: (x1 + x2) / 2, y: y + 3.5, class: 'fret-finger fret-finger-barre' });
          label.textContent = barreFinger;
          svg.appendChild(label);
        }
      }
    }

    // fretted note dots
    const barreCovered = voicing.barre
      ? (i) => i >= voicing.barre.from && i <= voicing.barre.to && frets[i] === voicing.barre.fret
      : () => false;
    frets.forEach((f, i) => {
      if (f === null || f === 0) return;
      const row = f - baseFret;
      const x = STRING_X[i];
      const y = TOP_Y + (row - 0.5) * FRET_H;
      svg.appendChild(svgEl('circle', { cx: x, cy: y, r: 6.5, class: 'fret-dot' }));
      const finger = showFingers && !barreCovered(i) && voicing.fingers && voicing.fingers[i];
      if (finger) {
        const label = svgEl('text', { x, y: y + 3.5, class: 'fret-finger' });
        label.textContent = finger;
        svg.appendChild(label);
      }
    });

    container.appendChild(svg);
  }

  MT.guitar = { render };
})(window.MT = window.MT || {});
