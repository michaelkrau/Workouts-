/**
 * Main Fitness Platform Service
 * Orchestrates all components of the fitness platform
 */

import { WorkoutLibrary } from '../models/WorkoutLibrary.js';
import { GroupWorkoutManager } from '../models/GroupWorkout.js';
import { ClientManager } from '../models/Client.js';
import { AIAssistant } from '../ai-assistant/AIAssistant.js';

export class FitnessPlatform {
  constructor() {
    this.workoutLibrary = new WorkoutLibrary();
    this.groupWorkoutManager = new GroupWorkoutManager();
    this.clientManager = new ClientManager();
    this.aiAssistant = new AIAssistant(this.workoutLibrary);
    
    console.log('✅ Fitness Platform initialized');
    console.log(`📚 Loaded ${this.workoutLibrary.getAllExercises().length} exercises`);
    console.log(`💪 Loaded ${this.workoutLibrary.getAllSupersets().length} supersets`);
    console.log(`📈 Loaded ${this.workoutLibrary.getAllRepMaxProgressions().length} rep max progressions`);
  }

  // Workout Library methods
  getWorkoutLibrary() {
    return {
      exercises: this.workoutLibrary.getAllExercises(),
      supersets: this.workoutLibrary.getAllSupersets(),
      repMaxProgressions: this.workoutLibrary.getAllRepMaxProgressions()
    };
  }

  getExercisesByMuscleGroup(muscleGroup) {
    return this.workoutLibrary.getExercisesByMuscleGroup(muscleGroup);
  }

  // Group Workout Management methods
  createWorkoutPlan(name, description, exercises, trainerId, duration) {
    return this.groupWorkoutManager.createWorkoutPlan(
      name, description, exercises, trainerId, duration
    );
  }

  getTrainerWorkoutPlans(trainerId) {
    return this.groupWorkoutManager.getAllWorkoutPlans(trainerId);
  }

  createGroup(name, trainerId, clientIds, description) {
    return this.groupWorkoutManager.createGroup(name, trainerId, clientIds, description);
  }

  getTrainerGroups(trainerId) {
    return this.groupWorkoutManager.getAllGroups(trainerId);
  }

  assignWorkoutToGroup(groupId, workoutPlanId, scheduleType, scheduleParams, trainerId) {
    let schedule;
    
    if (scheduleType === 'recurring') {
      schedule = this.groupWorkoutManager.createRecurringSchedule(
        scheduleParams.startDate,
        scheduleParams.daysOfWeek,
        scheduleParams.time
      );
    } else {
      schedule = this.groupWorkoutManager.createSeasonalSchedule(
        scheduleParams.startDate,
        scheduleParams.endDate,
        scheduleParams.daysOfWeek,
        scheduleParams.time
      );
    }

    return this.groupWorkoutManager.assignWorkoutToGroup(
      groupId, workoutPlanId, schedule, trainerId
    );
  }

  getGroupAssignments(groupId) {
    return this.groupWorkoutManager.getAssignmentsByGroup(groupId);
  }

  // Client Management methods
  createClient(firstName, lastName, email, phone, dateOfBirth) {
    return this.clientManager.createClient(firstName, lastName, email, phone, dateOfBirth);
  }

  getTrainerClients(trainerId) {
    return this.clientManager.getAllClients(trainerId);
  }

  assignClientToTrainer(clientId, trainerId) {
    return this.clientManager.assignTrainer(clientId, trainerId);
  }

  addClientToGroup(groupId, clientId) {
    return this.groupWorkoutManager.addClientToGroup(groupId, clientId);
  }

  createClientAssessment(clientId, assessmentDate, measurements) {
    return this.clientManager.createAssessment(clientId, assessmentDate, measurements);
  }

  recordClientProgress(clientId, workoutId, completedDate, exercises) {
    return this.clientManager.recordProgress(clientId, workoutId, completedDate, exercises);
  }

  getClientProgress(clientId, limit) {
    return this.clientManager.getClientProgress(clientId, limit);
  }

  // AI Assistant methods
  generateWorkoutPlan(params) {
    return this.aiAssistant.generateWorkoutPlan(params);
  }

  askFitnessQuestion(question) {
    return this.aiAssistant.answerFitnessQuestion(question);
  }

  getQuickTip(category) {
    return this.aiAssistant.getQuickTips(category);
  }

  recommendExercises(params) {
    return this.aiAssistant.recommendExercises(params);
  }

  calculate1RM(weight, reps) {
    return this.aiAssistant.calculate1RM(weight, reps);
  }

  // Demo/Example methods
  getDemoScenario() {
    // Create a demo trainer
    const trainerId = 'trainer_demo_001';

    // Create demo clients
    const client1 = this.createClient('John', 'Doe', 'john@example.com', '555-0101', new Date('1990-01-15'));
    const client2 = this.createClient('Jane', 'Smith', 'jane@example.com', '555-0102', new Date('1992-05-20'));
    const client3 = this.createClient('Mike', 'Johnson', 'mike@example.com', '555-0103', new Date('1988-11-30'));

    // Assign clients to trainer
    this.assignClientToTrainer(client1.id, trainerId);
    this.assignClientToTrainer(client2.id, trainerId);
    this.assignClientToTrainer(client3.id, trainerId);

    // Create groups
    const beginnerGroup = this.createGroup(
      'Beginner Strength Training',
      trainerId,
      [client1.id, client2.id],
      'Group for beginners focusing on foundational strength'
    );

    const advancedGroup = this.createGroup(
      'Advanced Powerlifting',
      trainerId,
      [client3.id],
      'Advanced group for powerlifting enthusiasts'
    );

    // Create workout plans with supersets
    const beginnerPlan = this.createWorkoutPlan(
      'Beginner Full Body',
      'Full body workout for beginners with supersets',
      [
        { type: 'superset', supersetId: 'ss1', sets: 3 }, // Push-Pull superset
        { type: 'exercise', exerciseId: 'ex2', sets: 3, reps: 10 }, // Squats
      ],
      trainerId,
      60
    );

    const advancedPlan = this.createWorkoutPlan(
      'Powerlifting - Heavy Day',
      'Heavy compound lifts with 5/3/1 progression',
      [
        { type: 'exercise', exerciseId: 'ex2', sets: 4, reps: 5, progressionId: 'prog1' }, // Squat with 5/3/1
        { type: 'exercise', exerciseId: 'ex1', sets: 4, reps: 5, progressionId: 'prog1' }, // Bench with 5/3/1
        { type: 'superset', supersetId: 'ss5', sets: 3 }, // Back Builder superset
      ],
      trainerId,
      90
    );

    // Assign workouts to groups with recurring schedule
    const beginnerAssignment = this.assignWorkoutToGroup(
      beginnerGroup.id,
      beginnerPlan.id,
      'recurring',
      {
        startDate: new Date('2025-01-01'),
        daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
        time: '18:00'
      },
      trainerId
    );

    const advancedAssignment = this.assignWorkoutToGroup(
      advancedGroup.id,
      advancedPlan.id,
      'recurring',
      {
        startDate: new Date('2025-01-01'),
        daysOfWeek: [2, 4, 6], // Tuesday, Thursday, Saturday
        time: '06:00'
      },
      trainerId
    );

    return {
      trainerId,
      clients: [client1, client2, client3],
      groups: [beginnerGroup, advancedGroup],
      workoutPlans: [beginnerPlan, advancedPlan],
      assignments: [beginnerAssignment, advancedAssignment],
      message: 'Demo scenario created successfully!'
    };
  }
}
