/* Reusable on-screen piano keyboard component. */
(function (MT) {
  'use strict';

  const WHITE_W = 34;
  const WHITE_H = 128;
  const BLACK_W = 20;
  const BLACK_H = 80;

  function isBlackPc(pc) {
    return [1, 3, 6, 8, 10].includes(pc);
  }

  /**
   * Creates a piano inside `container`.
   * opts: { min, max, onKeyClick(midi), playOnClick=true, showLabelsFor: Set<midi> }
   * Returns an API object for highlighting keys.
   */
  function create(container, opts = {}) {
    const min = opts.min ?? 48; // C3
    const max = opts.max ?? 84; // C6
    const playOnClick = opts.playOnClick !== false;

    container.innerHTML = '';
    container.classList.add('piano');
    const inner = document.createElement('div');
    inner.className = 'piano-inner';
    container.appendChild(inner);

    const whiteKeys = [];
    const blackKeys = [];
    let whiteIndex = 0;
    const keyEls = new Map();

    for (let midi = min; midi <= max; midi++) {
      const pc = ((midi % 12) + 12) % 12;
      const black = isBlackPc(pc);
      const el = document.createElement('div');
      el.dataset.midi = String(midi);

      if (!black) {
        el.className = 'key white';
        el.style.left = whiteIndex * WHITE_W + 'px';
        el.style.width = WHITE_W - 2 + 'px';
        el.style.height = WHITE_H + 'px';
        if (pc === 0) {
          const tag = document.createElement('span');
          tag.className = 'key-octave-tag';
          tag.textContent = 'C' + MT.data.octaveOf(midi);
          el.appendChild(tag);
        }
        whiteKeys.push(el);
        whiteIndex++;
      } else {
        el.className = 'key black';
        el.style.left = whiteIndex * WHITE_W - BLACK_W / 2 + 'px';
        el.style.width = BLACK_W + 'px';
        el.style.height = BLACK_H + 'px';
        blackKeys.push(el);
      }

      el.addEventListener('click', () => {
        if (playOnClick) MT.audio.playNote(midi, { duration: 0.7 });
        if (opts.onKeyClick) opts.onKeyClick(midi);
      });

      keyEls.set(midi, el);
      inner.appendChild(el);
    }

    inner.style.width = whiteIndex * WHITE_W + 'px';
    inner.style.height = WHITE_H + 'px';

    function clearHighlights() {
      keyEls.forEach((el) => {
        el.classList.remove('hl-root', 'hl-note', 'hl-correct', 'hl-wrong', 'hl-active');
      });
    }

    function highlight(midiArray, cls = 'hl-note') {
      midiArray.forEach((m) => {
        const el = keyEls.get(m);
        if (el) el.classList.add(cls);
      });
    }

    function flash(midi, cls, ms = 700) {
      const el = keyEls.get(midi);
      if (!el) return;
      el.classList.add(cls);
      setTimeout(() => el.classList.remove(cls), ms);
    }

    return { clearHighlights, highlight, flash, min, max, keyEls };
  }

  MT.piano = { create };
})(window.MT = window.MT || {});
