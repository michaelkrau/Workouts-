/**
 * Workout Library Model
 * Contains exercises, supersets, and rep max progression examples
 */

export class Exercise {
  constructor(id, name, category, muscleGroup, equipment = 'bodyweight') {
    this.id = id;
    this.name = name;
    this.category = category; // strength, cardio, flexibility
    this.muscleGroup = muscleGroup;
    this.equipment = equipment;
  }
}

export class Superset {
  constructor(id, name, exercises, restBetweenExercises = 0, restBetweenSets = 90) {
    this.id = id;
    this.name = name;
    this.exercises = exercises; // Array of exercise IDs
    this.restBetweenExercises = restBetweenExercises; // seconds
    this.restBetweenSets = restBetweenSets; // seconds
    this.type = 'superset';
  }
}

export class RepMaxProgression {
  constructor(id, name, weeklyProgression, startingPercentage = 65) {
    this.id = id;
    this.name = name;
    this.weeklyProgression = weeklyProgression; // Array of weekly progression objects
    this.startingPercentage = startingPercentage; // % of 1RM to start
  }
}

export class WorkoutLibrary {
  constructor() {
    this.exercises = new Map();
    this.supersets = new Map();
    this.repMaxProgressions = new Map();
    this._initializeDefaultLibrary();
  }

  _initializeDefaultLibrary() {
    // Add default exercises
    this._addDefaultExercises();
    this._addDefaultSupersets();
    this._addDefaultRepMaxProgressions();
  }

  _addDefaultExercises() {
    const defaultExercises = [
      new Exercise('ex1', 'Barbell Bench Press', 'strength', 'chest', 'barbell'),
      new Exercise('ex2', 'Barbell Squat', 'strength', 'legs', 'barbell'),
      new Exercise('ex3', 'Deadlift', 'strength', 'back', 'barbell'),
      new Exercise('ex4', 'Pull-ups', 'strength', 'back', 'bodyweight'),
      new Exercise('ex5', 'Overhead Press', 'strength', 'shoulders', 'barbell'),
      new Exercise('ex6', 'Barbell Row', 'strength', 'back', 'barbell'),
      new Exercise('ex7', 'Dumbbell Bicep Curl', 'strength', 'arms', 'dumbbell'),
      new Exercise('ex8', 'Tricep Dips', 'strength', 'arms', 'bodyweight'),
      new Exercise('ex9', 'Leg Press', 'strength', 'legs', 'machine'),
      new Exercise('ex10', 'Romanian Deadlift', 'strength', 'legs', 'barbell'),
      new Exercise('ex11', 'Lateral Raise', 'strength', 'shoulders', 'dumbbell'),
      new Exercise('ex12', 'Face Pulls', 'strength', 'shoulders', 'cable'),
      new Exercise('ex13', 'Running', 'cardio', 'full-body', 'none'),
      new Exercise('ex14', 'Burpees', 'cardio', 'full-body', 'bodyweight'),
      new Exercise('ex15', 'Jump Rope', 'cardio', 'full-body', 'rope'),
    ];

    defaultExercises.forEach(exercise => {
      this.exercises.set(exercise.id, exercise);
    });
  }

  _addDefaultSupersets() {
    const defaultSupersets = [
      new Superset(
        'ss1',
        'Push-Pull Upper Body Superset',
        ['ex1', 'ex4'], // Bench Press + Pull-ups
        30,
        120
      ),
      new Superset(
        'ss2',
        'Leg Power Superset',
        ['ex2', 'ex14'], // Squat + Burpees
        15,
        180
      ),
      new Superset(
        'ss3',
        'Arm Sculptor Superset',
        ['ex7', 'ex8'], // Bicep Curl + Tricep Dips
        20,
        90
      ),
      new Superset(
        'ss4',
        'Shoulder Definition Superset',
        ['ex5', 'ex11'], // Overhead Press + Lateral Raise
        30,
        120
      ),
      new Superset(
        'ss5',
        'Back Builder Superset',
        ['ex6', 'ex12'], // Barbell Row + Face Pulls
        25,
        90
      ),
    ];

    defaultSupersets.forEach(superset => {
      this.supersets.set(superset.id, superset);
    });
  }

  _addDefaultRepMaxProgressions() {
    const defaultProgressions = [
      new RepMaxProgression(
        'prog1',
        '5/3/1 Progression',
        [
          { week: 1, sets: 3, reps: [5, 5, 5], percentages: [65, 75, 85] },
          { week: 2, sets: 3, reps: [3, 3, 3], percentages: [70, 80, 90] },
          { week: 3, sets: 3, reps: [5, 3, 1], percentages: [75, 85, 95] },
          { week: 4, sets: 3, reps: [5, 5, 5], percentages: [40, 50, 60] }, // Deload
        ],
        65
      ),
      new RepMaxProgression(
        'prog2',
        'Linear Progression',
        [
          { week: 1, sets: 3, reps: [8, 8, 8], percentages: [70, 70, 70] },
          { week: 2, sets: 3, reps: [8, 8, 8], percentages: [72.5, 72.5, 72.5] },
          { week: 3, sets: 3, reps: [8, 8, 8], percentages: [75, 75, 75] },
          { week: 4, sets: 3, reps: [8, 8, 8], percentages: [77.5, 77.5, 77.5] },
        ],
        70
      ),
      new RepMaxProgression(
        'prog3',
        'Strength Builder (3x5)',
        [
          { week: 1, sets: 3, reps: [5, 5, 5], percentages: [80, 80, 80] },
          { week: 2, sets: 3, reps: [5, 5, 5], percentages: [82.5, 82.5, 82.5] },
          { week: 3, sets: 3, reps: [5, 5, 5], percentages: [85, 85, 85] },
          { week: 4, sets: 3, reps: [5, 5, 5], percentages: [87.5, 87.5, 87.5] },
        ],
        80
      ),
      new RepMaxProgression(
        'prog4',
        'Hypertrophy Focus',
        [
          { week: 1, sets: 4, reps: [12, 10, 8, 8], percentages: [60, 65, 70, 70] },
          { week: 2, sets: 4, reps: [12, 10, 8, 8], percentages: [62, 67, 72, 72] },
          { week: 3, sets: 4, reps: [12, 10, 8, 8], percentages: [64, 69, 74, 74] },
          { week: 4, sets: 4, reps: [10, 10, 10, 10], percentages: [50, 50, 50, 50] }, // Deload
        ],
        60
      ),
    ];

    defaultProgressions.forEach(progression => {
      this.repMaxProgressions.set(progression.id, progression);
    });
  }

  // CRUD operations for exercises
  addExercise(exercise) {
    this.exercises.set(exercise.id, exercise);
    return exercise;
  }

  getExercise(id) {
    return this.exercises.get(id);
  }

  getAllExercises() {
    return Array.from(this.exercises.values());
  }

  getExercisesByMuscleGroup(muscleGroup) {
    return Array.from(this.exercises.values()).filter(
      ex => ex.muscleGroup === muscleGroup
    );
  }

  // CRUD operations for supersets
  addSuperset(superset) {
    this.supersets.set(superset.id, superset);
    return superset;
  }

  getSuperset(id) {
    return this.supersets.get(id);
  }

  getAllSupersets() {
    return Array.from(this.supersets.values());
  }

  // CRUD operations for rep max progressions
  addRepMaxProgression(progression) {
    this.repMaxProgressions.set(progression.id, progression);
    return progression;
  }

  getRepMaxProgression(id) {
    return this.repMaxProgressions.get(id);
  }

  getAllRepMaxProgressions() {
    return Array.from(this.repMaxProgressions.values());
  }
}
