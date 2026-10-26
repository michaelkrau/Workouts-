import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const load = (file) => JSON.parse(readFileSync(new URL(file, import.meta.url), 'utf8'));
const library = load('./workouts.he.json');
const { options } = load('./exercise-options.he.json');
const routines = load('./routines.he.json');

const { workouts, labels, methods } = library;
const SECONDS_PER_REP = 3;
const SECONDS_PER_OPEN_SET = 60; // drop sets and other "to failure" sets

// Gendered imperatives and second-person forms the copy must avoid.
// "את" is excluded on purpose: it is also the Hebrew direct-object marker.
const GENDERED = ['אתה', 'לך', 'שלך', 'שמור', 'שמרי', 'תנשום', 'תנשמי', 'הקפד', 'הקפידי', 'התחל', 'התחילי', 'סיימת', 'תרגיש', 'תרגישי', 'תעשה', 'תעשי'];
const gendered = new RegExp(`(^|[\\s.,:;!?—–-])(${GENDERED.join('|')})(?=$|[\\s.,:;!?—–-])`);

/** Estimated length of the main block in seconds, derived from its structure. */
function mainBlockSeconds(workout) {
  const { format, exercises } = workout;
  switch (format.type) {
    case 'interval':
    case 'circuit':
      return exercises.length * (format.workSec + format.restSec) * format.rounds
        + (format.rounds - 1) * format.restBetweenRoundsSec;
    case 'tabata':
      return format.blocks * format.rounds * (format.workSec + format.restSec)
        + (format.blocks - 1) * format.restBetweenRoundsSec;
    default:
      return exercises.reduce((sum, ex) => {
        const setSeconds = typeof ex.reps === 'number' ? ex.reps * SECONDS_PER_REP : SECONDS_PER_OPEN_SET;
        return sum + ex.sets * (setSeconds + ex.restSec);
      }, 0);
  }
}

function* strings(value) {
  if (typeof value === 'string') yield value;
  else if (Array.isArray(value)) for (const v of value) yield* strings(v);
  else if (value && typeof value === 'object') for (const v of Object.values(value)) yield* strings(v);
}

test('workout ids are unique', () => {
  const ids = workouts.map((w) => w.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every workout uses known enums and exactly one equipment type', () => {
  for (const w of workouts) {
    assert.ok(labels.collections[w.collection], `${w.id}: collection ${w.collection}`);
    assert.equal(typeof w.equipment, 'string', `${w.id}: equipment must be a single value`);
    assert.ok(labels.equipment[w.equipment], `${w.id}: equipment ${w.equipment}`);
    assert.ok(labels.level[w.level], `${w.id}: level ${w.level}`);
    assert.ok(labels.formatType[w.format.type], `${w.id}: format ${w.format.type}`);
  }
});

test('there are 11 goal workouts and every method has at least one workout', () => {
  assert.equal(workouts.filter((w) => w.collection === 'goal').length, 11);
  const byId = new Map(workouts.map((w) => [w.id, w]));
  for (const m of methods) {
    assert.ok(m.workoutIds.length > 0, `${m.id} has no workouts`);
    for (const id of m.workoutIds) {
      assert.equal(byId.get(id)?.collection, 'method', `${m.id} -> ${id}`);
    }
  }
  const referenced = new Set(methods.flatMap((m) => m.workoutIds));
  for (const w of workouts.filter((x) => x.collection === 'method')) {
    assert.ok(referenced.has(w.id), `method workout ${w.id} is not listed under any method`);
  }
});

test('every exercise has a description and an easier/harder option', () => {
  for (const w of workouts) {
    assert.ok(w.exercises.length >= 5, `${w.id}: too few exercises`);
    for (const ex of w.exercises) {
      assert.ok(ex.description?.length >= 20, `${w.id}/${ex.name}: description`);
      assert.ok(options[ex.name]?.easier && options[ex.name]?.harder, `${ex.name}: missing options`);
    }
  }
});

test('tabata blocks only reference exercises of the same workout', () => {
  for (const w of workouts.filter((x) => x.blocks)) {
    const names = new Set(w.exercises.map((e) => e.name));
    for (const b of w.blocks) for (const n of b.exercises) assert.ok(names.has(n), `${w.id}: ${n}`);
  }
});

// Timed formats are exact, so the stated length may only round up by a minute.
// Rep-based formats are estimates (rep speed, transitions), so they get more slack.
const TIMED_FORMATS = new Set(['interval', 'circuit', 'tabata']);
const TIMED_ROUNDING_MIN = 1;
const REP_BASED_ALLOWANCE_MIN = 10;

test('stated duration matches the workout structure', () => {
  for (const w of workouts) {
    const minutes = mainBlockSeconds(w) / 60;
    const timed = TIMED_FORMATS.has(w.format.type);
    const min = timed ? Math.ceil(minutes) : Math.floor(minutes);
    const max = Math.ceil(minutes) + (timed ? TIMED_ROUNDING_MIN : REP_BASED_ALLOWANCE_MIN);
    assert.ok(w.durationMin >= min, `${w.id}: ${w.durationMin} min < ${minutes.toFixed(1)} min of work`);
    assert.ok(w.durationMin <= max, `${w.id}: ${w.durationMin} min is above ${minutes.toFixed(1)} min of work`);
  }
});

test('side-specific timed exercises switch sides within each interval', () => {
  // Switching sides "between rounds" only balances out with an even round count.
  for (const w of workouts.filter((x) => TIMED_FORMATS.has(x.format.type))) {
    for (const ex of w.exercises) {
      assert.doesNotMatch(ex.description, /בין סבבים|בסבבים מתחלפים/, `${w.id}/${ex.name}`);
    }
  }
});

test('every workout has a valid warm-up and cool-down', () => {
  const warmups = new Set(routines.warmups.map((r) => r.id));
  const cooldowns = new Set(routines.cooldowns.map((r) => r.id));
  for (const w of workouts) {
    const a = routines.assignments[w.id];
    assert.ok(a, `${w.id}: no routine assignment`);
    assert.ok(warmups.has(a.warmup), `${w.id}: warm-up ${a.warmup}`);
    assert.ok(cooldowns.has(a.cooldown), `${w.id}: cool-down ${a.cooldown}`);
  }
  for (const r of [...routines.warmups, ...routines.cooldowns]) {
    const seconds = r.items.reduce((s, i) => s + i.durationSec, 0);
    assert.ok(Math.abs(seconds / 60 - r.durationMin) <= 1, `${r.id}: items total ${seconds}s vs ${r.durationMin} min`);
  }
});

test('copy is gender-neutral', () => {
  for (const [source, data] of [['workouts', library], ['options', options], ['routines', routines]]) {
    for (const s of strings(data)) {
      assert.doesNotMatch(s, gendered, `${source}: "${s}"`);
    }
  }
});
