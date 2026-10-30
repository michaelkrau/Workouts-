import { buildTimeline, isTimedFormat, nextExercise, stepSeconds } from './timeline.js';
import { LANGUAGES, setLanguage, t } from './i18n.js';

const STORE = { lang: 'strong.lang', history: 'strong.history', warmup: 'strong.includeWarmup' };
const app = document.getElementById('app');
const live = document.getElementById('live');

const state = {
  library: null,
  options: {},
  routines: null,
  tab: 'goal',
  equipment: 'all',
  player: null,
  lastResult: null,
};

/* ---------- storage (best effort: private mode may throw) ---------- */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* not persisted */ }
  },
};

/* ---------- tiny DOM helpers ---------- */
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) if (c != null && c !== false) el.append(c instanceof Node ? c : String(c));
  return el;
}

const ICONS = {
  clock: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  weight: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  play: '<path d="M8 5.5v13l10-6.5-10-6.5z" fill="currentColor"/>',
  pause: '<path d="M9 6v12M15 6v12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  back: '<path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  close: '<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  // RTL: "previous" points right, "next" points left.
  prev: '<path d="M16 6v12M14 12 6 6v12z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  next: '<path d="M8 6v12M10 12l8-6v12z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
};
function icon(name, size = 20) {
  const span = h('span', { 'aria-hidden': 'true', style: `display:inline-grid;width:${size}px;height:${size}px` });
  span.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">${ICONS[name]}</svg>`;
  return span;
}

/** The STRONG mark: eight segments, the first in copper. */
function mark(size = 28) {
  const r = 18, gap = (9 * Math.PI) / 180, seg = (2 * Math.PI) / 8;
  const p = (a) => `${(24 + r * Math.cos(a)).toFixed(2)} ${(24 + r * Math.sin(a)).toFixed(2)}`;
  let paths = '';
  for (let i = 0; i < 8; i++) {
    const a0 = -Math.PI / 2 + i * seg + gap / 2, a1 = a0 + seg - gap;
    paths += `<path class="seg${i === 0 ? ' first' : ''}" d="M${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`;
  }
  const span = h('span', { class: 'mark', 'aria-hidden': 'true' });
  span.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 48 48">${paths}</svg>`;
  return span;
}
const lockup = () => h('span', { class: 'lockup' }, mark(28), h('span', { class: 'wordmark' }, 'STRONG'));

/* ---------- formatting ---------- */
const levelTone = { beginner: 'low', intermediate: 'mid', advanced: 'high' };
const pad2 = (n) => String(n).padStart(2, '0');
const idx = (w) => pad2(w.id);
const clock = (sec) => `${Math.floor(sec / 60)}:${pad2(Math.max(0, Math.floor(sec % 60)))}`;
const labelOf = (group, key) => state.library.labels[group][key];

function structureShort(w) {
  const f = w.format;
  switch (f.type) {
    case 'interval':
    case 'circuit': return `${f.rounds} ${t('rounds')} · ${f.workSec}/${f.restSec}`;
    case 'tabata': return `${f.blocks} בלוקים · ${f.workSec}/${f.restSec}`;
    case 'superset': return `${f.sets} ${t('sets')} · זוגות`;
    case 'dropset': return `${f.sets} ${t('sets')} · ${f.drops} הורדות`;
    default: return `${f.sets} ${t('sets')} · ${f.reps} חזרות`;
  }
}

function structureLong(w) {
  const f = w.format;
  switch (f.type) {
    case 'interval':
      return `${f.rounds} סבבים. בכל סבב ${w.exercises.length} תרגילים ברצף: ${f.workSec} שניות עבודה ו-${f.restSec} שניות מנוחה. ${f.restBetweenRoundsSec} שניות מנוחה בין סבבים.`;
    case 'circuit':
      return `אימון מחזורי: ${f.rounds} סבבים של ${w.exercises.length} תרגילים ברצף, ${f.workSec} שניות לכל תרגיל ו-${f.restSec} שניות מעבר. ${f.restBetweenRoundsSec} שניות מנוחה בסוף כל סבב.`;
    case 'tabata':
      return `${f.blocks} בלוקים של 4 דקות. בכל בלוק ${f.rounds} סבבים: ${f.workSec} שניות מאמץ מקסימלי ו-${f.restSec} שניות מנוחה, בהחלפה בין שני תרגילים. דקת מנוחה בין בלוקים.`;
    case 'superset':
      return `התרגילים מסודרים בזוגות (A1+A2). מבצעים סט מהתרגיל הראשון, ומיד סט מהשני — ללא מנוחה ביניהם. המנוחה מגיעה בסוף הזוג.`;
    case 'dropset':
      return `סט ראשי עם משקל מאתגר, ומיד ${f.drops} הורדות משקל של כ-${f.dropPercent}% עד כשל טכני — ללא מנוחה בין ההורדות. ${f.restSec} שניות מנוחה בין סטים.`;
    default:
      return `${f.sets} סטים לכל תרגיל, ${f.reps} חזרות בקצב מבוקר. מסיימים את כל הסטים של תרגיל לפני המעבר לבא.`;
  }
}

function timingOf(w, ex) {
  if (isTimedFormat(w.format.type)) return `${w.format.workSec}״`;
  return typeof ex.reps === 'number' ? `${ex.sets}×${ex.reps}` : `${ex.sets}× דרופ`;
}

function routinesFor(w) {
  const a = state.routines.assignments[w.id];
  return {
    warmup: state.routines.warmups.find((r) => r.id === a?.warmup),
    cooldown: state.routines.cooldowns.find((r) => r.id === a?.cooldown),
  };
}

/* ---------- history ---------- */
const history = () => store.get(STORE.history, []);
function workoutsThisWeek() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay()); // week starts on Sunday
  return history().filter((e) => new Date(e.date) >= start).length;
}

function todaysWorkout() {
  const day = Math.floor(Date.now() / 86_400_000);
  const goal = state.library.workouts.filter((w) => w.collection === 'goal');
  return goal[day % goal.length];
}

/* ---------- views ---------- */
function viewWelcome() {
  let chosen = 'he';
  const options = LANGUAGES.map((l) =>
    h('button', {
      class: 'lang', role: 'radio', 'aria-checked': String(l.code === chosen), dir: l.dir, lang: l.code,
      disabled: !l.available,
      onclick: (e) => {
        chosen = l.code;
        for (const b of e.currentTarget.parentElement.children) b.setAttribute('aria-checked', String(b === e.currentTarget));
      },
    },
    h('span', {}, h('span', { class: 'title-s' }, l.native), l.available ? null : h('span', { class: 'label-xs faded', style: 'display:block' }, t('comingSoon'))),
    h('span', { class: 'radio', 'aria-hidden': 'true' })));

  return h('main', { class: 'welcome' },
    mark(60),
    h('span', { class: 'wordmark' }, 'STRONG'),
    h('h1', { class: 'display-xl' }, t('tagline')),
    h('p', { class: 'faded' }, t('welcomeLead')),
    h('div', { class: 'spacer' }),
    h('p', { class: 'label-xs faded', id: 'lang-label' }, t('chooseLanguage')),
    h('div', { role: 'radiogroup', 'aria-labelledby': 'lang-label', style: 'display:flex;flex-direction:column;gap:8px' }, options),
    h('button', {
      class: 'btn btn-accent',
      onclick: () => { store.set(STORE.lang, chosen); applyLanguage(chosen); go('#/'); },
    }, t('continue')),
    h('p', { class: 'label-xs faded', style: 'text-align:center' }, t('languageNote')));
}

function workoutCard(w) {
  return h('button', { class: 'card', onclick: () => go(`#/w/${w.id}`) },
    h('span', { class: 'row' },
      h('span', { class: 'idx' }, idx(w)),
      h('span', { class: `chip ${levelTone[w.level]}` }, labelOf('level', w.level))),
    h('span', { class: 'display-m' }, w.title),
    h('span', { class: 'body-s muted' }, w.summary),
    h('hr'),
    h('span', { class: 'meta label-m' },
      h('span', {}, icon('clock', 16), t('minShort', w.durationMin)),
      h('span', {}, icon('weight', 16), labelOf('equipment', w.equipment)),
      h('span', { class: 'accent' }, structureShort(w))));
}

function viewLibrary() {
  const { workouts, methods } = state.library;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('greetingMorning') : hour < 17 ? t('greetingNoon') : t('greetingEvening');
  const today = todaysWorkout();
  const streak = workoutsThisWeek();

  const order = state.tab === 'goal'
    ? workouts.filter((w) => w.collection === 'goal')
    : methods.flatMap((m) => m.workoutIds.map((id) => workouts.find((w) => w.id === id)));
  const shown = order.filter((w) => state.equipment === 'all' || w.equipment === state.equipment);

  const tab = (key, label, count) => h('button', {
    role: 'tab', 'aria-selected': String(state.tab === key),
    onclick: () => { state.tab = key; render(); },
  }, `${label} · ${count}`);

  const filter = (key, label) => h('button', {
    class: 'chip', 'aria-pressed': String(state.equipment === key),
    onclick: () => { state.equipment = key; render(); },
  }, label);

  return h('main', { class: 'view' },
    h('header', { class: 'header' },
      lockup(),
      streak ? h('span', { class: 'streak label-m' }, t('weekStreak', streak)) : null),
    h('div', {},
      h('p', { class: 'label-xs muted' }, new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())),
      h('h1', { class: 'display-l' }, greeting, h('br'), t('greetingQuestion'))),
    h('section', { class: 'today', 'aria-label': t('todaysWorkout') },
      h('div', { class: 'row' }, h('span', { class: 'label-xs faded' }, t('todaysWorkout')), h('span', { class: 'idx' }, idx(today))),
      h('h2', { class: 'display-xl' }, today.title),
      h('p', { class: 'body-s faded' }, today.summary),
      h('div', { class: 'chips' },
        h('span', { class: 'chip' }, t('minShort', today.durationMin)),
        h('span', { class: 'chip' }, labelOf('equipment', today.equipment)),
        h('span', { class: `chip ${levelTone[today.level]}` }, labelOf('level', today.level))),
      h('button', { class: 'btn btn-accent', onclick: () => go(`#/w/${today.id}`) }, icon('play', 16), t('start'))),
    h('div', { class: 'segmented', role: 'tablist' },
      tab('goal', t('byGoal'), workouts.filter((w) => w.collection === 'goal').length),
      tab('method', t('byMethod'), workouts.filter((w) => w.collection === 'method').length)),
    h('div', { class: 'chips', role: 'group' },
      filter('all', t('all')),
      ...Object.entries(state.library.labels.equipment).map(([k, v]) => filter(k, v))),
    shown.length
      ? h('div', { class: 'list' }, shown.map(workoutCard))
      : h('p', { class: 'empty muted' }, t('noResults')));
}

function viewDetail(w) {
  const { warmup, cooldown } = routinesFor(w);
  const includeWarmup = store.get(STORE.warmup, true);
  const f = w.format;
  const timed = isTimedFormat(f.type);
  const stats = [
    [String(w.durationMin), t('minutes')],
    timed ? [`${f.workSec}/${f.restSec}`, t('workRest')] : [String(f.sets), t('sets')],
    f.type === 'tabata' ? [`${f.blocks}×${f.rounds}`, 'בלוקים × סבבים'] : timed ? [String(f.rounds), t('rounds')] : f.type === 'dropset' ? [String(f.drops), 'הורדות'] : [String(f.reps), 'חזרות'],
    [labelOf('equipment', w.equipment), t('equipment'), true],
  ];

  const exercise = (ex, i) => {
    const opt = state.options[ex.name];
    return h('li', { class: 'exercise' },
      h('span', { class: 'n' }, ex.pair ?? i + 1),
      h('div', { class: 'body' },
        h('span', { class: 'title-s' }, ex.name),
        h('span', { class: 'body-s muted' }, ex.description),
        opt ? h('details', {},
          h('summary', {}, `${t('easier')} / ${t('harder')}`),
          h('dl', {}, h('dt', {}, t('easier')), h('dd', {}, opt.easier), h('dt', {}, t('harder')), h('dd', {}, opt.harder))) : null),
      h('span', { class: 'timing label-m num' }, timingOf(w, ex)));
  };

  return h('main', { class: 'view' },
    h('button', { class: 'back label-m', onclick: () => go('#/') }, icon('back', 22), t('back')),
    h('div', { style: 'display:flex;flex-direction:column;gap:10px' },
      h('p', { class: 'label-xs accent' }, `${idx(w)} · ${t(w.collection === 'goal' ? 'byGoal' : 'byMethod')}`),
      h('h1', { class: 'display-xl' }, w.title),
      h('p', { class: 'muted' }, w.summary + (w.focus ? `. ${w.focus}.` : '.'))),
    h('div', { class: 'stats' }, stats.map(([v, l, text]) =>
      h('div', { class: 'stat' }, h('span', { class: `v${text ? ' text' : ''}` }, v), h('span', { class: 'label-xs muted' }, l)))),
    h('div', { class: 'chips' }, h('span', { class: `chip ${levelTone[w.level]}` }, labelOf('level', w.level)), h('span', { class: 'chip' }, labelOf('formatType', f.type))),
    h('section', { class: 'structure' }, h('h2', { class: 'title-s' }, t('structure')), h('p', { class: 'body-s' }, structureLong(w))),
    warmup && cooldown ? h('label', { class: 'toggle' },
      h('span', {}, h('span', { class: 'title-s', style: 'display:block' }, t('includeWarmup')), h('span', { class: 'body-s muted' }, t('warmupNote', warmup.durationMin, cooldown.durationMin))),
      h('input', { type: 'checkbox', checked: includeWarmup, onchange: (e) => store.set(STORE.warmup, e.target.checked) })) : null,
    h('div', { class: 'header' }, h('h2', { class: 'display-m' }, t('exercises')), h('span', { class: 'label-m muted' }, t('exerciseCount', w.exercises.length))),
    h('ol', { style: 'list-style:none;margin:0;padding:0' }, w.exercises.map(exercise)),
    h('div', { class: 'sticky-cta' }, h('button', { class: 'btn btn-primary', onclick: () => startWorkout(w) }, icon('play', 16), t('start'))));
}

/* ---------- player ---------- */
let audio = null;
function beep(freq = 880, ms = 120) {
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.15, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + ms / 1000);
  osc.connect(gain).connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + ms / 1000);
}

let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && !wakeLock && 'wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
    if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch { wakeLock = null; }
}

function startWorkout(w) {
  try { audio ??= new (window.AudioContext || window.webkitAudioContext)(); } catch { audio = null; }
  const withRoutines = store.get(STORE.warmup, true);
  const steps = buildTimeline(w, withRoutines ? routinesFor(w) : {});
  state.player = { workout: w, steps, index: 0, remaining: stepSeconds(steps[0]), running: true, activeSec: 0, last: performance.now(), timer: null };
  go(`#/play/${w.id}`);
}

function stopTicking() {
  const p = state.player;
  if (p?.timer) { clearInterval(p.timer); p.timer = null; }
  keepAwake(false);
}

function tick() {
  const p = state.player;
  const now = performance.now();
  const dt = (now - p.last) / 1000;
  p.last = now;
  if (!p.running) return;
  p.activeSec += dt;
  const step = p.steps[p.index];
  if (step.durationSec == null) return; // manual set: waits for "set done"
  const before = Math.ceil(p.remaining);
  p.remaining -= dt;
  const after = Math.ceil(p.remaining);
  if (after !== before && after > 0 && after <= 3) { beep(660, 90); navigator.vibrate?.(40); }
  if (p.remaining <= 0) { beep(990, 220); navigator.vibrate?.([80, 40, 80]); advance(1); return; }
  updatePlayer();
}

function advance(delta) {
  const p = state.player;
  const target = p.index + delta;
  if (target >= p.steps.length) return finishWorkout();
  p.index = Math.max(0, target);
  p.remaining = stepSeconds(p.steps[p.index]);
  renderPlayer();
}

function finishWorkout() {
  const p = state.player;
  stopTicking();
  const names = new Set(p.steps.filter((s) => s.phase === 'work' || s.phase === 'set').map((s) => s.name));
  state.lastResult = {
    id: p.workout.id, title: p.workout.title,
    seconds: Math.round(p.activeSec),
    rounds: p.steps.filter((s) => s.phase === 'work' || s.phase === 'set').length,
    timed: isTimedFormat(p.workout.format.type),
    exercises: names.size,
  };
  state.player = null;
  go('#/done');
}

function contextSegments(step, steps, index) {
  if (step.totalRounds) return { total: step.totalRounds, done: step.round - 1 };
  if (step.totalSets) return { total: step.totalSets, done: step.set - 1 };
  // warm-up / cool-down / block rest: progress through steps of the same phase
  const same = steps.map((s, i) => [s, i]).filter(([s]) => s.phase === step.phase);
  return { total: same.length, done: same.findIndex(([, i]) => i === index) };
}

function viewPlayer() {
  const p = state.player;
  const step = p.steps[p.index];
  const isRest = step.phase === 'rest' || step.phase === 'roundRest';
  const next = nextExercise(p.steps, p.index);
  const C = 2 * Math.PI * 46;
  const seg = contextSegments(step, p.steps, p.index);

  const counter = step.block
    ? t('blockOf', step.block, step.totalBlocks)
    : step.totalSets ? t('setOf', step.set, step.totalSets)
    : t('stepOf', p.index + 1, p.steps.length);
  const sub = step.round ? t('roundOf', step.round, step.totalRounds) : step.phase === 'set' ? (step.pair ?? '') : t(`phase.${step.phase}`);

  const readout = step.durationSec != null
    ? [h('span', { class: 'phase' }, t(`phase.${step.phase}`)),
       h('span', { class: 'clock', id: 'clock' }, clock(Math.ceil(p.remaining))),
       h('span', { class: 'label-xs faded' }, t('secondsOf', step.durationSec))]
    : [h('span', { class: 'phase' }, t('phase.set')), h('span', { class: 'reps' }, t('repsLabel', step.reps))];

  return h('main', { class: 'player', 'data-phase': step.phase },
    h('div', { class: 'top' },
      h('span', { class: 'label-m faded' }, counter),
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => { if (confirm(t('confirmExit'))) { stopTicking(); const id = p.workout.id; state.player = null; go(`#/w/${id}`); } } }, icon('close', 22))),
    h('div', { class: 'progress', 'aria-hidden': 'true' },
      Array.from({ length: seg.total }, (_, i) => h('span', { class: i < seg.done ? 'done' : i === seg.done ? 'now' : '' }))),
    h('p', { class: 'label-xs faded' }, sub),
    h('div', { class: 'ring-wrap' },
      (() => {
        const wrap = h('div', { style: 'display:contents' });
        wrap.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="ring-track" cx="50" cy="50" r="46" fill="none" stroke-width="2.4"/><circle id="ring" class="ring-bar" cx="50" cy="50" r="46" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>`;
        return wrap;
      })(),
      h('div', { class: 'readout' }, readout)),
    h('div', {},
      h('h1', { class: 'now-name' }, isRest ? t('breathe') : step.name),
      h('p', { class: 'faded' }, isRest ? t('breatheCue') : step.description)),
    h('div', { class: 'spacer' }),
    step.phase === 'set' ? h('button', { class: 'btn btn-accent', onclick: () => advance(1) }, icon('check', 20), t('setDone')) : null,
    h('div', { class: 'next-card' },
      h('div', {}, h('p', { class: 'label-xs faded' }, next ? t('nextUp') : ''), h('p', { class: 'title-s' }, next ? next.name : t('lastOne'))),
      next?.reps != null && next.phase === 'set' ? h('span', { class: 'label-m accent' }, t('repsLabel', next.reps)) : null),
    h('div', { class: 'controls' },
      h('button', { class: 'round-btn', 'aria-label': t('previous'), onclick: () => advance(-1) }, icon('prev', 20)),
      h('button', { class: 'round-btn main', id: 'toggle', 'aria-label': p.running ? t('pause') : t('resume'), onclick: togglePause }, icon(p.running ? 'pause' : 'play', 28)),
      h('button', { class: 'round-btn', 'aria-label': t('skip'), onclick: () => advance(1) }, icon('next', 20))));
}

function updatePlayer() {
  const p = state.player;
  const step = p.steps[p.index];
  const el = document.getElementById('clock');
  if (el) el.textContent = clock(Math.ceil(p.remaining));
  const ring = document.getElementById('ring');
  if (ring) {
    const C = 2 * Math.PI * 46;
    const frac = step.durationSec ? 1 - Math.max(0, p.remaining) / step.durationSec : 1;
    ring.setAttribute('stroke-dashoffset', String(C * (1 - frac)));
  }
}

function renderPlayer() {
  const p = state.player;
  app.replaceChildren(viewPlayer());
  updatePlayer();
  const step = p.steps[p.index];
  live.textContent = `${t(`phase.${step.phase}`)}${step.name ? `: ${step.name}` : ''}`;
}

function togglePause() {
  const p = state.player;
  p.running = !p.running;
  p.last = performance.now();
  keepAwake(p.running);
  const btn = document.getElementById('toggle');
  btn.replaceChildren(icon(p.running ? 'pause' : 'play', 28));
  btn.setAttribute('aria-label', p.running ? t('pause') : t('resume'));
}

function viewComplete() {
  const r = state.lastResult;
  let rpe = null;
  const scale = h('div', { class: 'rpe', role: 'group', 'aria-label': t('effortQuestion') },
    Array.from({ length: 10 }, (_, i) => h('button', {
      'aria-pressed': 'false',
      onclick: (e) => { rpe = i + 1; for (const b of e.currentTarget.parentElement.children) b.setAttribute('aria-pressed', String(b === e.currentTarget)); },
    }, String(i + 1))));
  const note = h('textarea', { placeholder: t('notePlaceholder'), 'aria-label': t('notePlaceholder') });

  return h('main', { class: 'view' },
    h('header', { class: 'header' }, lockup()),
    h('span', { class: 'badge' }, icon('check', 28)),
    h('div', { style: 'display:flex;flex-direction:column;gap:10px' },
      h('h1', { class: 'display-xl' }, t('completeTitle')),
      h('p', { class: 'muted' }, `${t('completeLead')} ${r.title}.`)),
    h('div', { class: 'summary' },
      [[clock(r.seconds), t('workoutTime')], [String(r.rounds), t(r.timed ? 'rounds' : 'sets')], [String(r.exercises), t('exercisesDone')]].map(([v, l]) =>
        h('div', { class: 'stat' }, h('span', { class: 'v num' }, v), h('span', { class: 'label-xs muted' }, l)))),
    h('div', { style: 'display:flex;flex-direction:column;gap:12px' },
      h('h2', { class: 'title-s' }, t('effortQuestion')),
      scale,
      h('div', { class: 'legend label-xs muted' }, h('span', {}, t('effortLow')), h('span', {}, t('effortHigh')))),
    note,
    h('button', {
      class: 'btn btn-primary',
      onclick: () => {
        store.set(STORE.history, [...history(), { id: r.id, title: r.title, date: new Date().toISOString(), seconds: r.seconds, rpe, note: note.value.trim() || undefined }]);
        state.lastResult = null;
        go('#/');
      },
    }, t('saveFinish')));
}

/* ---------- routing ---------- */
function go(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

function applyLanguage(code) {
  const lang = LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
  setLanguage(lang.code);
  document.documentElement.lang = lang.code;
  document.documentElement.dir = lang.dir;
}

function render() {
  const hash = location.hash || '#/';
  if (!store.get(STORE.lang, null)) { app.replaceChildren(viewWelcome()); return; }

  const playMatch = hash.match(/^#\/play\/(\d+)/);
  if (playMatch) {
    // A reload loses the in-memory session: fall back to the workout page.
    if (!state.player) return go(`#/w/${playMatch[1]}`);
    renderPlayer();
    if (!state.player.timer) {
      state.player.last = performance.now();
      state.player.timer = setInterval(tick, 200);
      keepAwake(true);
    }
    return;
  }
  stopTicking();

  const detail = hash.match(/^#\/w\/(\d+)/);
  if (detail) {
    const w = state.library.workouts.find((x) => x.id === Number(detail[1]));
    if (!w) return go('#/');
    app.replaceChildren(viewDetail(w));
  } else if (hash === '#/done' && state.lastResult) {
    app.replaceChildren(viewComplete());
  } else {
    app.replaceChildren(viewLibrary());
  }
  window.scrollTo(0, 0);
}

document.addEventListener('keydown', (e) => {
  if (!state.player || !location.hash.startsWith('#/play')) return;
  if (e.code === 'Space') { e.preventDefault(); togglePause(); }
  // Arrow keys follow reading direction: in RTL, left is forward.
  const forward = document.documentElement.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const backward = forward === 'ArrowLeft' ? 'ArrowRight' : 'ArrowLeft';
  if (e.key === forward) advance(1);
  if (e.key === backward) advance(-1);
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && state.player?.running) keepAwake(true);
});
window.addEventListener('hashchange', render);

async function boot() {
  const load = (f) => fetch(`data/${f}`).then((r) => { if (!r.ok) throw new Error(f); return r.json(); });
  const [library, options, routines] = await Promise.all([
    load('workouts.he.json'), load('exercise-options.he.json'), load('routines.he.json'),
  ]);
  Object.assign(state, { library, options: options.options, routines });
  applyLanguage(store.get(STORE.lang, 'he'));
  render();
}

boot().catch(() => {
  app.replaceChildren(h('main', { class: 'view' }, h('p', {}, 'לא ניתן לטעון את האימונים. יש להפעיל את השרת (npm start) ולפתוח את /app.')));
});
