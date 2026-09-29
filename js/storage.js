/* localStorage-backed progress tracking, per module. */
(function (MT) {
  'use strict';

  const KEY = 'musicTheoryApp.progress.v1';
  const MODULES = ['notes', 'intervals', 'scales', 'chords'];

  function loadAll() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      return { ...defaults(), ...parsed };
    } catch (e) {
      return defaults();
    }
  }

  function defaults() {
    const d = {};
    MODULES.forEach((m) => { d[m] = { attempts: 0, correct: 0, streak: 0, bestStreak: 0, last: null }; });
    return d;
  }

  function saveAll(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* storage unavailable */ }
  }

  function record(moduleId, isCorrect) {
    const data = loadAll();
    const m = data[moduleId] || { attempts: 0, correct: 0, streak: 0, bestStreak: 0, last: null };
    m.attempts += 1;
    if (isCorrect) {
      m.correct += 1;
      m.streak += 1;
      m.bestStreak = Math.max(m.bestStreak, m.streak);
    } else {
      m.streak = 0;
    }
    m.last = new Date().toISOString();
    data[moduleId] = m;
    saveAll(data);
    return m;
  }

  function reset(moduleId) {
    const data = loadAll();
    if (moduleId) {
      data[moduleId] = { attempts: 0, correct: 0, streak: 0, bestStreak: 0, last: null };
    } else {
      MODULES.forEach((m) => { data[m] = { attempts: 0, correct: 0, streak: 0, bestStreak: 0, last: null }; });
    }
    saveAll(data);
  }

  MT.storage = { loadAll, record, reset, MODULES };
})(window.MT = window.MT || {});
