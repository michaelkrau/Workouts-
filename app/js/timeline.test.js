import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildTimeline, isTimedFormat, nextExercise, totalSeconds } from './timeline.js';

const load = (file) => JSON.parse(readFileSync(new URL(`../../src/data/${file}`, import.meta.url), 'utf8'));
const { workouts } = load('workouts.he.json');
const routines = load('routines.he.json');
const byId = (id) => workouts.find((w) => w.id === id);

const routinesFor = (w) => {
  const a = routines.assignments[w.id];
  return {
    warmup: routines.warmups.find((r) => r.id === a.warmup),
    cooldown: routines.cooldowns.find((r) => r.id === a.cooldown),
  };
};

test('every workout builds a non-empty timeline that never ends on a rest', () => {
  for (const w of workouts) {
    for (const steps of [buildTimeline(w), buildTimeline(w, routinesFor(w))]) {
      assert.ok(steps.length > 0, `${w.id}`);
      assert.ok(!['rest', 'roundRest'].includes(steps.at(-1).phase), `${w.id} ends on a rest`);
      for (const s of steps) assert.ok(s.durationSec > 0 || s.phase === 'set', `${w.id}: step without duration`);
    }
  }
});

test('timed workouts fit inside their stated duration', () => {
  for (const w of workouts.filter((x) => isTimedFormat(x.format.type))) {
    const minutes = totalSeconds(buildTimeline(w)) / 60;
    assert.ok(minutes <= w.durationMin, `${w.id}: ${minutes.toFixed(1)} > ${w.durationMin}`);
    assert.ok(minutes > w.durationMin - 1, `${w.id}: ${minutes.toFixed(1)} is more than a minute under ${w.durationMin}`);
  }
});

test('interval rounds: every exercise once per round, round rest only between rounds', () => {
  const w = byId(1); // pilates: 7 exercises × 2 rounds
  const steps = buildTimeline(w);
  assert.equal(steps.filter((s) => s.phase === 'work').length, 7 * 2);
  assert.equal(steps.filter((s) => s.phase === 'roundRest').length, 1);
  assert.equal(steps.filter((s) => s.phase === 'rest').length, 6 * 2);
});

test('tabata alternates the block pair for 8 rounds in each of 4 blocks', () => {
  const w = byId(5);
  const work = buildTimeline(w).filter((s) => s.phase === 'work');
  assert.equal(work.length, 4 * 8);
  assert.deepEqual(work.slice(0, 4).map((s) => s.name), ['סקוואט קפיצה', 'שכיבות סמיכה', 'סקוואט קפיצה', 'שכיבות סמיכה']);
  assert.equal(work[8].name, 'ברפי');
  assert.equal(work[8].block, 2);
});

test('supersets alternate partners set by set with no rest inside the pair', () => {
  const steps = buildTimeline(byId(30));
  const firstSix = steps.slice(0, 6).map((s) => s.pair ?? s.phase);
  assert.deepEqual(firstSix, ['A1', 'A2', 'rest', 'A1', 'A2', 'rest']);
});

test('classic sets finish all sets of one exercise before the next', () => {
  const sets = buildTimeline(byId(28)).filter((s) => s.phase === 'set');
  assert.deepEqual(sets.slice(0, 4).map((s) => [s.name, s.set]), [
    ['סקוואט גביע', 1], ['סקוואט גביע', 2], ['סקוואט גביע', 3], ['לחיצת חזה בשכיבה', 1],
  ]);
});

test('warm-up and cool-down wrap the main block', () => {
  const w = byId(4);
  const steps = buildTimeline(w, routinesFor(w));
  assert.equal(steps[0].phase, 'warmup');
  assert.equal(steps.at(-1).phase, 'cooldown');
});

test('nextExercise skips rests', () => {
  const steps = buildTimeline(byId(4));
  assert.equal(steps[1].phase, 'rest');
  assert.equal(nextExercise(steps, 0).name, steps[2].name);
  assert.equal(nextExercise(steps, steps.length - 1), null);
});
