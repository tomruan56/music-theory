/* SVG staff-notation renderer for natural notes (no accidentals). */
(function (MT) {
  'use strict';

  const LINE_SPACING = 20;
  const HALF = LINE_SPACING / 2;
  const VIEW_W = 220;
  const VIEW_H = 180;
  const STAFF_TOP_Y = 60; // y of the top staff line
  const NOTE_X = 140;

  // reference note = the bottom line of the staff, at position 0
  const REF = {
    treble: MT.data.diatonicIndex('E', 4),
    bass: MT.data.diatonicIndex('G', 2)
  };

  function positionFor(clef, letter, octave) {
    return MT.data.diatonicIndex(letter, octave) - REF[clef];
  }

  function yFor(position) {
    // bottom staff line sits at STAFF_TOP_Y + 4*LINE_SPACING
    const bottomY = STAFF_TOP_Y + 4 * LINE_SPACING;
    return bottomY - position * HALF;
  }

  function ledgerPositions(position) {
    const out = [];
    if (position <= -2) {
      const start = position % 2 === 0 ? position : position + 1;
      for (let p = -2; p >= start; p -= 2) out.push(p);
    } else if (position >= 10) {
      const start = position % 2 === 0 ? position : position - 1;
      for (let p = 10; p <= start; p += 2) out.push(p);
    }
    return out;
  }

  function svgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  /**
   * Renders a single natural note on a staff.
   * clef: 'treble' | 'bass'
   * letter: 'C'..'B', octave: integer (scientific pitch notation)
   */
  function render(container, clef, letter, octave) {
    container.innerHTML = '';
    const svg = svgEl('svg', {
      viewBox: `0 0 ${VIEW_W} ${VIEW_H}`,
      class: 'staff-svg'
    });

    // 5 staff lines
    for (let i = 0; i < 5; i++) {
      const y = STAFF_TOP_Y + i * LINE_SPACING;
      svg.appendChild(svgEl('line', { x1: 20, y1: y, x2: VIEW_W - 20, y2: y, class: 'staff-line' }));
    }

    // clef glyph
    const clefText = svgEl('text', {
      x: 28,
      y: clef === 'treble' ? STAFF_TOP_Y + 68 : STAFF_TOP_Y + 46,
      class: 'clef-glyph'
    });
    clefText.textContent = clef === 'treble' ? '\u{1D11E}' : '\u{1D122}';
    svg.appendChild(clefText);

    const position = positionFor(clef, letter, octave);
    const y = yFor(position);

    // ledger lines
    ledgerPositions(position).forEach((p) => {
      const ly = yFor(p);
      svg.appendChild(svgEl('line', {
        x1: NOTE_X - 14, y1: ly, x2: NOTE_X + 14, y2: ly, class: 'ledger-line'
      }));
    });

    // notehead
    const note = svgEl('ellipse', {
      cx: NOTE_X, cy: y, rx: 8, ry: 6,
      class: 'notehead',
      transform: `rotate(-18 ${NOTE_X} ${y})`
    });
    svg.appendChild(note);

    // stem (simple, direction based on position relative to middle line)
    const stemUp = position < 4;
    const stemX = stemUp ? NOTE_X + 7.5 : NOTE_X - 7.5;
    const stemY2 = stemUp ? y - 42 : y + 42;
    svg.appendChild(svgEl('line', { x1: stemX, y1: y, x2: stemX, y2: stemY2, class: 'stem' }));

    container.appendChild(svg);
  }

  MT.staff = { render };
})(window.MT = window.MT || {});
