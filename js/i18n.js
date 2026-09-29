/* Translation strings and lookup helper. Pure data/logic, no DOM code. */
(function (MT) {
  'use strict';

  const LANGS = [
    { id: 'en', label: 'EN' },
    { id: 'vi', label: 'VI' }
  ];

  const STRINGS = {
    en: {
      app: { title: 'Music Theory Trainer' },
      nav: {
        home: 'Home', notes: 'Note Reading', intervals: 'Intervals', scales: 'Scales',
        chords: 'Chords', guitar: 'Guitar Chords', circle: 'Circle of Fifths', progress: 'Progress'
      },
      home: {
        title: 'Welcome',
        intro: 'Pick a topic below to start learning. Everything runs locally in your browser — your progress is saved automatically.',
        card: {
          notes: { title: 'Note Reading', desc: 'Read notes off the staff and find them on the keyboard.' },
          intervals: { title: 'Intervals', desc: 'Train your ear to recognize the distance between two notes.' },
          scales: { title: 'Scales', desc: 'Explore scale formulas, then build them from memory.' },
          chords: { title: 'Chords', desc: 'Learn triads and 7th chords, then identify them by ear.' },
          guitar: { title: 'Guitar Chords', desc: 'Browse a fretboard chord chart with alternate voicings and playback.' },
          circle: { title: 'Circle of Fifths', desc: 'See how keys relate, and how key signatures build up.' },
          progress: { title: 'Progress', desc: 'Track your accuracy and streaks across every module.' }
        }
      },
      notes: {
        title: 'Note Reading',
        intro: 'Identify the note shown on the staff, then click it on the keyboard.',
        clefLabel: 'Clef', clefRandom: 'Random', clefTreble: 'Treble', clefBass: 'Bass',
        playNote: '▶ Play note', skip: 'Skip',
        correct: "Correct — that's {note}.",
        wrong: 'Not quite — you played {played}. The note was {note}.',
        stats: 'Attempts: {attempts}  •  Accuracy: {pct}%  •  Streak: {streak}  •  Best: {best}'
      },
      intervals: {
        title: 'Interval Training',
        intro: 'Listen to two notes and identify the interval between them.',
        modeLabel: 'Mode', modeMelodic: 'Melodic (one after another)', modeHarmonic: 'Harmonic (together)',
        replay: '▶ Replay',
        correct: 'Correct — that was a {name}.',
        wrong: 'Not quite — that was a {name} ({short}).',
        stats: 'Attempts: {attempts}  •  Accuracy: {pct}%  •  Streak: {streak}  •  Best: {best}'
      },
      scales: {
        title: 'Scales',
        intro: 'Explore how scales are built, then test yourself by constructing one on the keyboard.',
        tabExplore: 'Explore', tabQuiz: 'Quiz',
        rootLabel: 'Root', scaleLabel: 'Scale',
        playAsc: '▶ Ascending', playDesc: '▶ Descending',
        formulaLabel: 'Formula:', notesLabel: 'Notes:',
        quizPrompt: 'Build the {root} {scale} scale, starting on the highlighted root.',
        quizComplete: 'Scale complete — no mistakes!',
        quizCompleteMistakes: 'Scale complete with {n} mistake(s). Notes: {notes}',
        newScale: 'New scale',
        stats: 'Attempts: {attempts}  •  Accuracy: {pct}%  •  Streak: {streak}  •  Best: {best}'
      },
      chords: {
        title: 'Chords',
        intro: 'See how triads and 7th chords are built, then train your ear to recognize them.',
        tabExplore: 'Explore', tabQuiz: 'Ear Quiz',
        rootLabel: 'Root', chordLabel: 'Chord',
        playBlock: '▶ Block', playArp: '▶ Arpeggio',
        chordNameLabel: 'Chord:', notesLabel: 'Notes:',
        playbackLabel: 'Playback', styleRandom: 'Random', styleBlock: 'Block', styleArpeggio: 'Arpeggio',
        replay: '▶ Replay',
        correct: 'Correct — that was {root}{symbol} ({name}).',
        wrong: 'Not quite — that was {root}{symbol} ({name}).',
        stats: 'Attempts: {attempts}  •  Accuracy: {pct}%  •  Streak: {streak}  •  Best: {best}'
      },
      guitar: {
        title: 'Guitar Chords',
        intro: 'A chord chart for guitar: pick a chord type to see all twelve roots, click one for a bigger diagram, alternate voicings, and playback.',
        chordTypeLabel: 'Chord type',
        strum: '▶ Strum', playTogether: '▶ Play together',
        voicingOpen: 'Open', voicingBarreE: 'Barre (E-shape)', voicingBarreA: 'Barre (A-shape)',
        fingerLegend: 'Left hand: 1 = index, 2 = middle, 3 = ring, 4 = pinky'
      },
      circle: {
        title: 'Circle of Fifths',
        intro: 'Click a wedge to see its key signature and hear its scales. Moving clockwise adds a sharp; moving counter-clockwise adds a flat.',
        selectPrompt: 'Select a key to see details.',
        noAccidentals: 'No sharps or flats.',
        accidentals: '{n} {type}: {list}',
        sharp: 'sharp', sharpPlural: 'sharps', flat: 'flat', flatPlural: 'flats',
        playMajor: '▶ Play {root} major', playMinor: '▶ Play {root} natural minor'
      },
      progress: {
        title: 'Progress',
        intro: 'Your accuracy and streaks across every training module, saved locally in this browser.',
        resetButton: 'Reset all progress',
        resetConfirm: 'Reset all saved progress? This cannot be undone.',
        meta: '{attempts} attempts · streak {streak} · best {best} · last {last}',
        timeNever: 'never', timeJustNow: 'just now',
        timeMinAgo: '{n}m ago', timeHourAgo: '{n}h ago', timeDayAgo: '{n}d ago'
      },
      interval: {
        P1: 'Unison', m2: 'Minor 2nd', M2: 'Major 2nd', m3: 'Minor 3rd', M3: 'Major 3rd',
        P4: 'Perfect 4th', TT: 'Tritone', P5: 'Perfect 5th', m6: 'Minor 6th', M6: 'Major 6th',
        m7: 'Minor 7th', M7: 'Major 7th', P8: 'Octave'
      },
      scale: {
        major: 'Major (Ionian)', natural_minor: 'Natural Minor (Aeolian)', harmonic_minor: 'Harmonic Minor',
        melodic_minor: 'Melodic Minor (asc.)', dorian: 'Dorian', phrygian: 'Phrygian', lydian: 'Lydian',
        mixolydian: 'Mixolydian', locrian: 'Locrian'
      },
      chord: {
        maj: 'Major', min: 'Minor', dim: 'Diminished', aug: 'Augmented', maj7: 'Major 7th',
        dom7: 'Dominant 7th', min7: 'Minor 7th', m7b5: 'Half-Diminished 7th', dim7: 'Diminished 7th',
        sus2: 'Sus2', sus4: 'Sus4'
      }
    },

    vi: {
      app: { title: 'Luyện Tập Lý Thuyết Âm Nhạc' },
      nav: {
        home: 'Trang chủ', notes: 'Đọc Nốt Nhạc', intervals: 'Quãng', scales: 'Gam',
        chords: 'Hợp Âm', guitar: 'Hợp Âm Guitar', circle: 'Vòng Quãng 5', progress: 'Tiến Độ'
      },
      home: {
        title: 'Chào mừng',
        intro: 'Chọn một chủ đề bên dưới để bắt đầu học. Mọi thứ chạy ngay trong trình duyệt của bạn — tiến độ được tự động lưu lại.',
        card: {
          notes: { title: 'Đọc Nốt Nhạc', desc: 'Đọc nốt nhạc trên khuông nhạc và tìm chúng trên bàn phím.' },
          intervals: { title: 'Quãng', desc: 'Luyện tai để nhận biết khoảng cách giữa hai nốt nhạc.' },
          scales: { title: 'Gam', desc: 'Khám phá công thức gam, sau đó tự xây dựng chúng từ trí nhớ.' },
          chords: { title: 'Hợp Âm', desc: 'Học hợp âm ba và hợp âm bảy, sau đó nhận biết chúng bằng tai.' },
          guitar: { title: 'Hợp Âm Guitar', desc: 'Xem sơ đồ hợp âm guitar với các thế bấm khác nhau và nghe thử.' },
          circle: { title: 'Vòng Quãng 5', desc: 'Xem cách các giọng liên hệ với nhau và hóa biểu được hình thành thế nào.' },
          progress: { title: 'Tiến Độ', desc: 'Theo dõi độ chính xác và chuỗi trả lời đúng ở từng phần.' }
        }
      },
      notes: {
        title: 'Đọc Nốt Nhạc',
        intro: 'Xác định nốt nhạc hiển thị trên khuông nhạc, sau đó nhấn vào nốt đó trên bàn phím.',
        clefLabel: 'Khóa nhạc', clefRandom: 'Ngẫu nhiên', clefTreble: 'Khóa Sol', clefBass: 'Khóa Fa',
        playNote: '▶ Phát nốt', skip: 'Bỏ qua',
        correct: 'Chính xác — đó là nốt {note}.',
        wrong: 'Chưa đúng — bạn đã chọn {played}. Nốt đúng là {note}.',
        stats: 'Số lần: {attempts}  •  Độ chính xác: {pct}%  •  Chuỗi đúng: {streak}  •  Tốt nhất: {best}'
      },
      intervals: {
        title: 'Luyện Quãng',
        intro: 'Nghe hai nốt nhạc và xác định quãng giữa chúng.',
        modeLabel: 'Chế độ', modeMelodic: 'Giai điệu (lần lượt)', modeHarmonic: 'Hòa âm (cùng lúc)',
        replay: '▶ Phát lại',
        correct: 'Chính xác — đó là {name}.',
        wrong: 'Chưa đúng — đó là {name} ({short}).',
        stats: 'Số lần: {attempts}  •  Độ chính xác: {pct}%  •  Chuỗi đúng: {streak}  •  Tốt nhất: {best}'
      },
      scales: {
        title: 'Gam',
        intro: 'Khám phá cách xây dựng gam, sau đó tự kiểm tra bằng cách dựng gam trên bàn phím.',
        tabExplore: 'Khám phá', tabQuiz: 'Kiểm tra',
        rootLabel: 'Âm chủ', scaleLabel: 'Gam',
        playAsc: '▶ Đi lên', playDesc: '▶ Đi xuống',
        formulaLabel: 'Công thức:', notesLabel: 'Các nốt:',
        quizPrompt: 'Hãy dựng gam {root} {scale}, bắt đầu từ âm chủ được tô sáng.',
        quizComplete: 'Hoàn thành gam — không sai lỗi nào!',
        quizCompleteMistakes: 'Hoàn thành gam với {n} lỗi. Các nốt: {notes}',
        newScale: 'Gam mới',
        stats: 'Số lần: {attempts}  •  Độ chính xác: {pct}%  •  Chuỗi đúng: {streak}  •  Tốt nhất: {best}'
      },
      chords: {
        title: 'Hợp Âm',
        intro: 'Xem cách hợp âm ba và hợp âm bảy được xây dựng, sau đó luyện tai để nhận biết chúng.',
        tabExplore: 'Khám phá', tabQuiz: 'Kiểm tra bằng tai',
        rootLabel: 'Âm chủ', chordLabel: 'Hợp âm',
        playBlock: '▶ Đồng thời', playArp: '▶ Rải nốt',
        chordNameLabel: 'Hợp âm:', notesLabel: 'Các nốt:',
        playbackLabel: 'Cách phát', styleRandom: 'Ngẫu nhiên', styleBlock: 'Đồng thời', styleArpeggio: 'Rải nốt',
        replay: '▶ Phát lại',
        correct: 'Chính xác — đó là {root}{symbol} ({name}).',
        wrong: 'Chưa đúng — đó là {root}{symbol} ({name}).',
        stats: 'Số lần: {attempts}  •  Độ chính xác: {pct}%  •  Chuỗi đúng: {streak}  •  Tốt nhất: {best}'
      },
      guitar: {
        title: 'Hợp Âm Guitar',
        intro: 'Sơ đồ hợp âm cho guitar: chọn loại hợp âm để xem đủ 12 âm chủ, nhấn vào một hợp âm để xem sơ đồ lớn hơn, các thế bấm khác và nghe thử.',
        chordTypeLabel: 'Loại hợp âm',
        strum: '▶ Rải dây', playTogether: '▶ Phát cùng lúc',
        voicingOpen: 'Thế mở', voicingBarreE: 'Chặn ngón (thế E)', voicingBarreA: 'Chặn ngón (thế A)',
        fingerLegend: 'Tay trái: 1 = ngón trỏ, 2 = ngón giữa, 3 = ngón áp út, 4 = ngón út'
      },
      circle: {
        title: 'Vòng Quãng 5',
        intro: 'Nhấn vào một múi để xem hóa biểu và nghe gam của nó. Đi theo chiều kim đồng hồ để thêm dấu thăng; đi ngược chiều kim đồng hồ để thêm dấu giáng.',
        selectPrompt: 'Chọn một giọng để xem chi tiết.',
        noAccidentals: 'Không có dấu thăng hay giáng.',
        accidentals: '{n} dấu {type}: {list}',
        sharp: 'thăng', sharpPlural: 'thăng', flat: 'giáng', flatPlural: 'giáng',
        playMajor: '▶ Phát gam {root} trưởng', playMinor: '▶ Phát gam {root} thứ tự nhiên'
      },
      progress: {
        title: 'Tiến Độ',
        intro: 'Độ chính xác và chuỗi trả lời đúng ở từng phần luyện tập, được lưu ngay trong trình duyệt này.',
        resetButton: 'Đặt lại toàn bộ tiến độ',
        resetConfirm: 'Đặt lại toàn bộ tiến độ đã lưu? Hành động này không thể hoàn tác.',
        meta: '{attempts} lần · chuỗi {streak} · tốt nhất {best} · lần cuối {last}',
        timeNever: 'chưa từng', timeJustNow: 'vừa xong',
        timeMinAgo: '{n} phút trước', timeHourAgo: '{n} giờ trước', timeDayAgo: '{n} ngày trước'
      },
      interval: {
        P1: 'Quãng 1 đúng', m2: 'Quãng 2 thứ', M2: 'Quãng 2 trưởng', m3: 'Quãng 3 thứ', M3: 'Quãng 3 trưởng',
        P4: 'Quãng 4 đúng', TT: 'Quãng tam cung', P5: 'Quãng 5 đúng', m6: 'Quãng 6 thứ', M6: 'Quãng 6 trưởng',
        m7: 'Quãng 7 thứ', M7: 'Quãng 7 trưởng', P8: 'Quãng 8 đúng'
      },
      scale: {
        major: 'Trưởng (Ionian)', natural_minor: 'Thứ Tự Nhiên (Aeolian)', harmonic_minor: 'Thứ Hòa Âm',
        melodic_minor: 'Thứ Giai Điệu (đi lên)', dorian: 'Dorian', phrygian: 'Phrygian', lydian: 'Lydian',
        mixolydian: 'Mixolydian', locrian: 'Locrian'
      },
      chord: {
        maj: 'Trưởng', min: 'Thứ', dim: 'Giảm', aug: 'Tăng', maj7: 'Trưởng 7',
        dom7: 'Bảy Át', min7: 'Thứ 7', m7b5: 'Nửa Giảm 7', dim7: 'Giảm 7',
        sus2: 'Treo 2', sus4: 'Treo 4'
      }
    }
  };

  function detectDefault() {
    try {
      const saved = localStorage.getItem('musicTheoryApp.lang');
      if (saved && STRINGS[saved]) return saved;
    } catch (e) { /* storage unavailable */ }
    return (navigator.language || '').toLowerCase().startsWith('vi') ? 'vi' : 'en';
  }

  let lang = detectDefault();

  function lookup(path, langId) {
    let node = STRINGS[langId];
    for (const part of path.split('.')) {
      if (node == null) return undefined;
      node = node[part];
    }
    return node;
  }

  function t(path, vars) {
    let str = lookup(path, lang);
    if (str === undefined) str = lookup(path, 'en');
    if (str === undefined) return path;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
      });
    }
    return str;
  }

  function getLang() { return lang; }

  function setLang(id) {
    if (!STRINGS[id]) return;
    lang = id;
    try { localStorage.setItem('musicTheoryApp.lang', id); } catch (e) { /* storage unavailable */ }
  }

  MT.i18n = { t, getLang, setLang, LANGS };
})(window.MT = window.MT || {});
