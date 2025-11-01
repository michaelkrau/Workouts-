/**
 * Multi-modal AI Assistant
 * Generates workout plans, answers fitness questions, and provides quick tips
 */

export class AIAssistant {
  constructor(workoutLibrary) {
    this.workoutLibrary = workoutLibrary;
    this.conversationHistory = [];
  }

  /**
   * Generate a custom workout plan based on user goals and preferences
   */
  generateWorkoutPlan(params) {
    const {
      goal = 'general fitness',
      experience = 'beginner',
      daysPerWeek = 3,
      duration = 60,
      equipment = 'full gym',
      focusAreas = []
    } = params;

    const plan = {
      id: `ai_plan_${Date.now()}`,
      name: `${goal.charAt(0).toUpperCase() + goal.slice(1)} - ${experience} Plan`,
      goal,
      experience,
      daysPerWeek,
      duration,
      workouts: []
    };

    // Generate workouts based on parameters
    const workoutsNeeded = daysPerWeek;
    
    if (goal === 'strength') {
      plan.workouts = this._generateStrengthWorkouts(workoutsNeeded, experience, duration);
    } else if (goal === 'hypertrophy') {
      plan.workouts = this._generateHypertrophyWorkouts(workoutsNeeded, experience, duration);
    } else if (goal === 'weight loss') {
      plan.workouts = this._generateWeightLossWorkouts(workoutsNeeded, experience, duration);
    } else {
      plan.workouts = this._generateGeneralFitnessWorkouts(workoutsNeeded, experience, duration);
    }

    plan.tips = this._generatePlanTips(goal, experience);
    plan.progressionNotes = this._generateProgressionNotes(goal, experience);

    return plan;
  }

  _generateStrengthWorkouts(days, experience, duration) {
    const workouts = [];
    const exercises = this.workoutLibrary.getAllExercises();
    const progressions = this.workoutLibrary.getAllRepMaxProgressions();

    if (days >= 3) {
      // Push Day
      workouts.push({
        day: 1,
        name: 'Push Day',
        exercises: [
          { exerciseId: 'ex1', name: 'Barbell Bench Press', sets: 4, reps: 5, progression: 'prog3' },
          { exerciseId: 'ex5', name: 'Overhead Press', sets: 3, reps: 5, progression: 'prog3' },
          { exerciseId: 'ex8', name: 'Tricep Dips', sets: 3, reps: 8, progression: null },
        ]
      });

      // Pull Day
      workouts.push({
        day: 2,
        name: 'Pull Day',
        exercises: [
          { exerciseId: 'ex3', name: 'Deadlift', sets: 3, reps: 5, progression: 'prog3' },
          { exerciseId: 'ex4', name: 'Pull-ups', sets: 3, reps: 8, progression: null },
          { exerciseId: 'ex6', name: 'Barbell Row', sets: 4, reps: 5, progression: 'prog3' },
        ]
      });

      // Leg Day
      workouts.push({
        day: 3,
        name: 'Leg Day',
        exercises: [
          { exerciseId: 'ex2', name: 'Barbell Squat', sets: 4, reps: 5, progression: 'prog3' },
          { exerciseId: 'ex10', name: 'Romanian Deadlift', sets: 3, reps: 8, progression: null },
          { exerciseId: 'ex9', name: 'Leg Press', sets: 3, reps: 10, progression: null },
        ]
      });
    }

    return workouts;
  }

  _generateHypertrophyWorkouts(days, experience, duration) {
    const workouts = [];

    if (days >= 4) {
      workouts.push(
        {
          day: 1,
          name: 'Chest & Triceps',
          supersets: ['ss1'],
          exercises: [
            { exerciseId: 'ex1', name: 'Barbell Bench Press', sets: 4, reps: 10, progression: 'prog4' },
            { exerciseId: 'ex8', name: 'Tricep Dips', sets: 3, reps: 12, progression: null },
          ]
        },
        {
          day: 2,
          name: 'Back & Biceps',
          supersets: ['ss5'],
          exercises: [
            { exerciseId: 'ex4', name: 'Pull-ups', sets: 4, reps: 10, progression: null },
            { exerciseId: 'ex7', name: 'Dumbbell Bicep Curl', sets: 3, reps: 12, progression: null },
          ]
        },
        {
          day: 3,
          name: 'Legs',
          supersets: ['ss2'],
          exercises: [
            { exerciseId: 'ex2', name: 'Barbell Squat', sets: 4, reps: 10, progression: 'prog4' },
            { exerciseId: 'ex9', name: 'Leg Press', sets: 3, reps: 15, progression: null },
          ]
        },
        {
          day: 4,
          name: 'Shoulders & Arms',
          supersets: ['ss4', 'ss3'],
          exercises: [
            { exerciseId: 'ex5', name: 'Overhead Press', sets: 4, reps: 10, progression: 'prog4' },
          ]
        }
      );
    }

    return workouts;
  }

  _generateWeightLossWorkouts(days, experience, duration) {
    const workouts = [];

    for (let i = 1; i <= days; i++) {
      workouts.push({
        day: i,
        name: `HIIT & Strength Day ${i}`,
        exercises: [
          { exerciseId: 'ex14', name: 'Burpees', sets: 4, reps: 15, progression: null },
          { exerciseId: 'ex15', name: 'Jump Rope', sets: 3, duration: '2 minutes', progression: null },
          { exerciseId: 'ex2', name: 'Barbell Squat', sets: 3, reps: 12, progression: null },
          { exerciseId: 'ex4', name: 'Pull-ups', sets: 3, reps: 8, progression: null },
        ],
        cardio: { type: 'running', duration: 20, intensity: 'moderate' }
      });
    }

    return workouts;
  }

  _generateGeneralFitnessWorkouts(days, experience, duration) {
    const workouts = [];

    workouts.push(
      {
        day: 1,
        name: 'Full Body Strength',
        exercises: [
          { exerciseId: 'ex2', name: 'Barbell Squat', sets: 3, reps: 10, progression: 'prog2' },
          { exerciseId: 'ex1', name: 'Barbell Bench Press', sets: 3, reps: 10, progression: 'prog2' },
          { exerciseId: 'ex4', name: 'Pull-ups', sets: 3, reps: 8, progression: null },
        ]
      }
    );

    if (days >= 2) {
      workouts.push({
        day: 2,
        name: 'Cardio & Core',
        exercises: [
          { exerciseId: 'ex13', name: 'Running', duration: '30 minutes', intensity: 'moderate' },
          { exerciseId: 'ex14', name: 'Burpees', sets: 3, reps: 15 },
        ]
      });
    }

    if (days >= 3) {
      workouts.push({
        day: 3,
        name: 'Upper Body & Arms',
        supersets: ['ss1', 'ss3'],
        exercises: [
          { exerciseId: 'ex5', name: 'Overhead Press', sets: 3, reps: 10, progression: 'prog2' },
        ]
      });
    }

    return workouts;
  }

  _generatePlanTips(goal, experience) {
    const tips = [];

    if (experience === 'beginner') {
      tips.push('Focus on proper form over heavy weight');
      tips.push('Start with lighter weights and gradually increase');
      tips.push('Rest 48 hours between training the same muscle groups');
    } else if (experience === 'intermediate') {
      tips.push('Implement progressive overload each week');
      tips.push('Consider tracking your workouts to monitor progress');
      tips.push('Include deload weeks every 4-6 weeks');
    } else {
      tips.push('Periodize your training for optimal results');
      tips.push('Focus on weak points and imbalances');
      tips.push('Consider advanced techniques like drop sets and tempo training');
    }

    if (goal === 'strength') {
      tips.push('Prioritize compound movements');
      tips.push('Keep rep ranges between 1-5 for main lifts');
      tips.push('Rest 3-5 minutes between heavy sets');
    } else if (goal === 'hypertrophy') {
      tips.push('Focus on time under tension');
      tips.push('Rep ranges of 8-12 are ideal for muscle growth');
      tips.push('Rest 60-90 seconds between sets');
    }

    return tips;
  }

  _generateProgressionNotes(goal, experience) {
    if (goal === 'strength') {
      return 'Increase weight by 2.5-5 lbs each week on main lifts. If you fail to complete all reps, repeat the same weight next week.';
    } else if (goal === 'hypertrophy') {
      return 'Progress by either adding reps, weight, or sets. Aim to increase total volume each week by 5-10%.';
    } else if (goal === 'weight loss') {
      return 'Focus on consistency and gradually increase workout intensity. Monitor your heart rate and aim for 70-85% max HR during cardio.';
    }
    return 'Progress at your own pace. Listen to your body and increase difficulty when exercises become easy.';
  }

  /**
   * Answer fitness-related questions
   */
  answerFitnessQuestion(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Knowledge base for common questions
    if (lowerQuestion.includes('superset')) {
      return {
        answer: 'A superset involves performing two exercises back-to-back with minimal rest. This increases workout intensity, saves time, and can enhance muscle growth. Common types include agonist supersets (same muscle group), antagonist supersets (opposing muscles like chest and back), and compound supersets (unrelated exercises).',
        relatedSupersets: this.workoutLibrary.getAllSupersets(),
        tip: 'Start with antagonist supersets as they allow one muscle to recover while working the other.'
      };
    }

    if (lowerQuestion.includes('rep max') || lowerQuestion.includes('1rm')) {
      return {
        answer: 'Your one-rep max (1RM) is the maximum weight you can lift for a single repetition with proper form. Progressive overload using a percentage of your 1RM helps build strength systematically.',
        relatedProgressions: this.workoutLibrary.getAllRepMaxProgressions(),
        tip: 'Test your 1RM every 8-12 weeks, or use rep max calculators to estimate it from higher rep sets.'
      };
    }

    if (lowerQuestion.includes('beginner') || lowerQuestion.includes('start')) {
      return {
        answer: 'Beginners should focus on learning proper form with compound movements (squat, bench press, deadlift, overhead press, rows). Start with 3 full-body workouts per week, allowing rest days between sessions.',
        tip: 'Consider working with a trainer initially to learn proper technique and prevent injuries.'
      };
    }

    if (lowerQuestion.includes('rest') || lowerQuestion.includes('recovery')) {
      return {
        answer: 'Rest periods depend on your goal: Strength (3-5 min), Hypertrophy (60-90 sec), Endurance (30-60 sec). Between workouts, allow 48-72 hours for the same muscle groups to recover.',
        tip: 'Quality sleep (7-9 hours) and proper nutrition are crucial for recovery.'
      };
    }

    if (lowerQuestion.includes('cardio')) {
      return {
        answer: 'Cardio improves cardiovascular health and aids fat loss. HIIT (High-Intensity Interval Training) is time-efficient and preserves muscle. Steady-state cardio is great for building aerobic base.',
        tip: 'Do cardio after weights or on separate days to avoid interfering with strength gains.'
      };
    }

    if (lowerQuestion.includes('diet') || lowerQuestion.includes('nutrition')) {
      return {
        answer: 'Nutrition is crucial for results. Aim for adequate protein (0.7-1g per lb bodyweight), balanced carbs and fats. For muscle gain, eat in a slight caloric surplus. For fat loss, maintain a moderate deficit.',
        tip: 'Track your intake for a week to understand your baseline, then adjust based on goals.'
      };
    }

    // Default response
    return {
      answer: 'That\'s a great question! For personalized advice, I recommend consulting with a certified fitness professional. However, I can help you with workout plans, exercise selection, and training principles.',
      tip: 'Feel free to ask about specific exercises, supersets, rep schemes, or workout programming!'
    };
  }

  /**
   * Provide quick fitness tips
   */
  getQuickTips(category = 'general') {
    const tipCategories = {
      general: [
        'Consistency beats intensity - show up regularly',
        'Progressive overload is key to continuous improvement',
        'Track your workouts to monitor progress',
        'Warm up properly before heavy lifting',
        'Stay hydrated throughout your workout'
      ],
      strength: [
        'Focus on the big compound movements first',
        'Use proper form over heavier weight',
        'Rest adequately between heavy sets (3-5 minutes)',
        'Train each muscle group 2x per week for optimal gains',
        'Don\'t neglect your posterior chain (back, glutes, hamstrings)'
      ],
      hypertrophy: [
        'Time under tension matters for muscle growth',
        'Mind-muscle connection improves muscle activation',
        'Vary your rep ranges (6-15 reps)',
        'Include both compound and isolation exercises',
        'Eat in a slight caloric surplus with adequate protein'
      ],
      nutrition: [
        'Protein timing: consume within 2 hours post-workout',
        'Don\'t fear carbs - they fuel your workouts',
        'Healthy fats support hormone production',
        'Meal prep to stay consistent with nutrition',
        'Hydrate before, during, and after training'
      ],
      recovery: [
        'Sleep 7-9 hours for optimal recovery',
        'Include deload weeks every 4-6 weeks',
        'Active recovery (walking, light cardio) aids muscle repair',
        'Foam rolling can reduce muscle soreness',
        'Listen to your body - rest when needed'
      ]
    };

    const tips = tipCategories[category] || tipCategories.general;
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    return {
      category,
      tip: randomTip,
      allTips: tips
    };
  }

  /**
   * Recommend exercises based on goals and equipment
   */
  recommendExercises(params) {
    const { muscleGroup, equipment = 'any', difficulty = 'any' } = params;
    
    let exercises = this.workoutLibrary.getAllExercises();

    if (muscleGroup && muscleGroup !== 'any') {
      exercises = exercises.filter(ex => ex.muscleGroup === muscleGroup);
    }

    if (equipment !== 'any') {
      exercises = exercises.filter(ex => 
        ex.equipment === equipment || ex.equipment === 'bodyweight'
      );
    }

    return {
      exercises,
      count: exercises.length,
      tip: `Found ${exercises.length} exercises matching your criteria`
    };
  }

  /**
   * Calculate estimated 1RM from a set
   */
  calculate1RM(weight, reps) {
    if (reps === 1) return weight;
    
    // Epley Formula: 1RM = weight × (1 + reps/30)
    // One of the most widely used formulas for estimating one-rep max
    const estimated1RM = weight * (1 + reps / 30);
    
    return {
      estimated1RM: Math.round(estimated1RM * 10) / 10,
      formula: 'Epley Formula',
      note: 'This is an estimate. Actual 1RM may vary.',
      trainingPercentages: {
        '90%': Math.round(estimated1RM * 0.9 * 10) / 10,
        '85%': Math.round(estimated1RM * 0.85 * 10) / 10,
        '80%': Math.round(estimated1RM * 0.8 * 10) / 10,
        '75%': Math.round(estimated1RM * 0.75 * 10) / 10,
        '70%': Math.round(estimated1RM * 0.7 * 10) / 10
      }
    };
  }
}
