/**
 * Turns a workout definition into the ordered list of steps the player runs.
 *
 * A step is either timed (`durationSec`) or manual (`reps`, finished by the user).
 * Phases: warmup, work, rest, roundRest, set, cooldown.
 */

const TIMED_FORMATS = new Set(['interval', 'circuit', 'tabata']);
const SECONDS_PER_REP = 3;
const SECONDS_PER_OPEN_SET = 60;

export const isTimedFormat = (type) => TIMED_FORMATS.has(type);

function routineSteps(routine, phase) {
  if (!routine) return [];
  return routine.items.map((item) => ({
    phase,
    name: item.name,
    description: item.description,
    durationSec: item.durationSec,
  }));
}

function timedRounds(workout) {
  const { format, exercises } = workout;
  const steps = [];
  for (let round = 1; round <= format.rounds; round++) {
    exercises.forEach((ex, i) => {
      steps.push({ phase: 'work', name: ex.name, description: ex.description, durationSec: format.workSec, round, totalRounds: format.rounds });
      const lastInRound = i === exercises.length - 1;
      if (!lastInRound && format.restSec > 0) {
        steps.push({ phase: 'rest', durationSec: format.restSec, round, totalRounds: format.rounds });
      } else if (lastInRound && round < format.rounds) {
        steps.push({ phase: 'roundRest', durationSec: format.restBetweenRoundsSec, round, totalRounds: format.rounds });
      }
    });
  }
  return steps;
}

function tabataBlocks(workout) {
  const { format, blocks, exercises } = workout;
  const byName = new Map(exercises.map((e) => [e.name, e]));
  const steps = [];
  blocks.forEach((block, b) => {
    for (let round = 1; round <= format.rounds; round++) {
      const ex = byName.get(block.exercises[(round - 1) % block.exercises.length]);
      steps.push({ phase: 'work', name: ex.name, description: ex.description, durationSec: format.workSec, round, totalRounds: format.rounds, block: b + 1, totalBlocks: blocks.length });
      if (round < format.rounds) {
        steps.push({ phase: 'rest', durationSec: format.restSec, round, totalRounds: format.rounds, block: b + 1, totalBlocks: blocks.length });
      }
    }
    if (b < blocks.length - 1) {
      steps.push({ phase: 'roundRest', durationSec: format.restBetweenRoundsSec, block: b + 1, totalBlocks: blocks.length });
    }
  });
  return steps;
}

/** Groups superset partners (A1, A2 → "A"); other exercises form groups of one. */
function exerciseGroups(exercises) {
  const groups = [];
  for (const ex of exercises) {
    const key = ex.pair?.[0];
    const last = groups[groups.length - 1];
    if (key && last?.key === key) last.items.push(ex);
    else groups.push({ key, items: [ex] });
  }
  return groups;
}

function setSteps(workout) {
  const steps = [];
  for (const group of exerciseGroups(workout.exercises)) {
    const sets = Math.max(...group.items.map((e) => e.sets));
    for (let set = 1; set <= sets; set++) {
      for (const ex of group.items) {
        if (set > ex.sets) continue;
        steps.push({ phase: 'set', name: ex.name, description: ex.description, reps: ex.reps, set, totalSets: ex.sets, pair: ex.pair });
        if (ex.restSec > 0) steps.push({ phase: 'rest', durationSec: ex.restSec, set, totalSets: ex.sets });
      }
    }
  }
  return steps;
}

function mainSteps(workout) {
  switch (workout.format.type) {
    case 'interval':
    case 'circuit':
      return timedRounds(workout);
    case 'tabata':
      return tabataBlocks(workout);
    default:
      return setSteps(workout);
  }
}

/** Estimated seconds for a step; manual sets use the same estimate as the content tests. */
export function stepSeconds(step) {
  if (step.durationSec != null) return step.durationSec;
  return typeof step.reps === 'number' ? step.reps * SECONDS_PER_REP : SECONDS_PER_OPEN_SET;
}

/**
 * @param {object} workout  entry from workouts.he.json
 * @param {{warmup?: object, cooldown?: object}} [routines]  resolved routine objects to include
 */
export function buildTimeline(workout, routines = {}) {
  const steps = [
    ...routineSteps(routines.warmup, 'warmup'),
    ...mainSteps(workout),
    ...routineSteps(routines.cooldown, 'cooldown'),
  ];
  // A workout never ends on a rest.
  while (steps.length && ['rest', 'roundRest'].includes(steps[steps.length - 1].phase)) steps.pop();
  return steps;
}

export const totalSeconds = (steps) => steps.reduce((sum, s) => sum + stepSeconds(s), 0);

/** The next step that has an exercise name (skips rests), for the "next up" card. */
export function nextExercise(steps, index) {
  for (let i = index + 1; i < steps.length; i++) if (steps[i].name) return steps[i];
  return null;
}
