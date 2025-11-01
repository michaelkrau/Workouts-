/**
 * Fitness Platform - Main Entry Point
 * Multi-modal AI-powered fitness platform for trainers and clients
 */

import express from 'express';
import { FitnessPlatform } from './services/FitnessPlatform.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Fitness Platform
const platform = new FitnessPlatform();

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Fitness Platform API',
    version: '1.0.0',
    endpoints: {
      library: '/api/library',
      workoutPlans: '/api/workout-plans',
      groups: '/api/groups',
      clients: '/api/clients',
      ai: '/api/ai',
      demo: '/api/demo'
    }
  });
});

// === Workout Library Endpoints ===
app.get('/api/library', (req, res) => {
  const library = platform.getWorkoutLibrary();
  res.json({
    success: true,
    data: library,
    summary: {
      exercises: library.exercises.length,
      supersets: library.supersets.length,
      repMaxProgressions: library.repMaxProgressions.length
    }
  });
});

app.get('/api/library/exercises/:muscleGroup', (req, res) => {
  const { muscleGroup } = req.params;
  const exercises = platform.getExercisesByMuscleGroup(muscleGroup);
  res.json({
    success: true,
    muscleGroup,
    data: exercises,
    count: exercises.length
  });
});

// === Workout Plan Endpoints ===
app.post('/api/workout-plans', (req, res) => {
  const { name, description, exercises, trainerId, duration } = req.body;
  
  if (!name || !trainerId) {
    return res.status(400).json({
      success: false,
      error: 'Name and trainerId are required'
    });
  }

  const plan = platform.createWorkoutPlan(name, description, exercises || [], trainerId, duration);
  res.json({
    success: true,
    data: plan
  });
});

app.get('/api/workout-plans/trainer/:trainerId', (req, res) => {
  const { trainerId } = req.params;
  const plans = platform.getTrainerWorkoutPlans(trainerId);
  res.json({
    success: true,
    trainerId,
    data: plans,
    count: plans.length
  });
});

// === Group Management Endpoints ===
app.post('/api/groups', (req, res) => {
  const { name, trainerId, clientIds, description } = req.body;
  
  if (!name || !trainerId) {
    return res.status(400).json({
      success: false,
      error: 'Name and trainerId are required'
    });
  }

  const group = platform.createGroup(name, trainerId, clientIds || [], description);
  res.json({
    success: true,
    data: group
  });
});

app.get('/api/groups/trainer/:trainerId', (req, res) => {
  const { trainerId } = req.params;
  const groups = platform.getTrainerGroups(trainerId);
  res.json({
    success: true,
    trainerId,
    data: groups,
    count: groups.length
  });
});

app.post('/api/groups/:groupId/assign', (req, res) => {
  const { groupId } = req.params;
  const { workoutPlanId, scheduleType, scheduleParams, trainerId } = req.body;
  
  if (!workoutPlanId || !scheduleType || !scheduleParams || !trainerId) {
    return res.status(400).json({
      success: false,
      error: 'workoutPlanId, scheduleType, scheduleParams, and trainerId are required'
    });
  }

  const assignment = platform.assignWorkoutToGroup(
    groupId, workoutPlanId, scheduleType, scheduleParams, trainerId
  );
  
  res.json({
    success: true,
    data: assignment
  });
});

app.get('/api/groups/:groupId/assignments', (req, res) => {
  const { groupId } = req.params;
  const assignments = platform.getGroupAssignments(groupId);
  res.json({
    success: true,
    groupId,
    data: assignments,
    count: assignments.length
  });
});

// === Client Management Endpoints ===
app.post('/api/clients', (req, res) => {
  const { firstName, lastName, email, phone, dateOfBirth } = req.body;
  
  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      success: false,
      error: 'firstName, lastName, and email are required'
    });
  }

  const client = platform.createClient(firstName, lastName, email, phone, dateOfBirth);
  res.json({
    success: true,
    data: client
  });
});

app.get('/api/clients/trainer/:trainerId', (req, res) => {
  const { trainerId } = req.params;
  const clients = platform.getTrainerClients(trainerId);
  res.json({
    success: true,
    trainerId,
    data: clients,
    count: clients.length
  });
});

app.post('/api/clients/:clientId/progress', (req, res) => {
  const { clientId } = req.params;
  const { workoutId, completedDate, exercises } = req.body;
  
  const progress = platform.recordClientProgress(
    clientId,
    workoutId,
    new Date(completedDate),
    exercises || []
  );
  
  res.json({
    success: true,
    data: progress
  });
});

app.get('/api/clients/:clientId/progress', (req, res) => {
  const { clientId } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const progress = platform.getClientProgress(clientId, limit);
  res.json({
    success: true,
    clientId,
    data: progress,
    count: progress.length
  });
});

// === AI Assistant Endpoints ===
app.post('/api/ai/generate-workout', (req, res) => {
  const params = req.body;
  const plan = platform.generateWorkoutPlan(params);
  res.json({
    success: true,
    data: plan
  });
});

app.post('/api/ai/ask', (req, res) => {
  const { question } = req.body;
  
  if (!question) {
    return res.status(400).json({
      success: false,
      error: 'Question is required'
    });
  }

  const answer = platform.askFitnessQuestion(question);
  res.json({
    success: true,
    question,
    data: answer
  });
});

app.get('/api/ai/tip', (req, res) => {
  const category = req.query.category || 'general';
  const tip = platform.getQuickTip(category);
  res.json({
    success: true,
    data: tip
  });
});

app.post('/api/ai/recommend-exercises', (req, res) => {
  const params = req.body;
  const recommendations = platform.recommendExercises(params);
  res.json({
    success: true,
    data: recommendations
  });
});

app.post('/api/ai/calculate-1rm', (req, res) => {
  const { weight, reps } = req.body;
  
  if (!weight || !reps) {
    return res.status(400).json({
      success: false,
      error: 'Weight and reps are required'
    });
  }

  const result = platform.calculate1RM(weight, reps);
  res.json({
    success: true,
    input: { weight, reps },
    data: result
  });
});

// === Demo Endpoint ===
app.get('/api/demo', (req, res) => {
  const demo = platform.getDemoScenario();
  res.json({
    success: true,
    data: demo
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🏋️  Fitness Platform API Server');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`\n📚 Available endpoints:`);
  console.log(`   GET  /api/library - View workout library`);
  console.log(`   POST /api/workout-plans - Create workout plan`);
  console.log(`   POST /api/groups - Create group`);
  console.log(`   POST /api/clients - Create client`);
  console.log(`   POST /api/ai/generate-workout - AI workout generation`);
  console.log(`   POST /api/ai/ask - Ask fitness questions`);
  console.log(`   GET  /api/ai/tip - Get quick tips`);
  console.log(`   GET  /api/demo - Load demo scenario\n`);
});

export default app;
