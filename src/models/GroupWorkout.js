/**
 * Group Workout Model
 * Handles workout programs, groups, and assignments
 */

export class WorkoutPlan {
  constructor(id, name, description, exercises, trainerId, duration = 60) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.exercises = exercises; // Array of exercise/superset configurations
    this.trainerId = trainerId;
    this.duration = duration; // minutes
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export class ExerciseConfiguration {
  constructor(exerciseId, sets, reps, weight = null, restTime = 60, notes = '') {
    this.exerciseId = exerciseId;
    this.sets = sets;
    this.reps = reps;
    this.weight = weight;
    this.restTime = restTime; // seconds
    this.notes = notes;
  }
}

export class Group {
  constructor(id, name, trainerId, clientIds = [], description = '') {
    this.id = id;
    this.name = name;
    this.trainerId = trainerId;
    this.clientIds = clientIds; // Array of client IDs
    this.description = description;
    this.createdAt = new Date();
  }
}

export class Schedule {
  constructor(id, type, startDate, endDate = null, daysOfWeek = [], time = null) {
    this.id = id;
    this.type = type; // 'recurring' or 'seasonal'
    this.startDate = startDate;
    this.endDate = endDate; // null for ongoing recurring schedules
    this.daysOfWeek = daysOfWeek; // [0-6] where 0 is Sunday
    this.time = time; // HH:MM format
  }
}

export class GroupWorkoutAssignment {
  constructor(id, groupId, workoutPlanId, schedule, trainerId) {
    this.id = id;
    this.groupId = groupId;
    this.workoutPlanId = workoutPlanId;
    this.schedule = schedule; // Schedule object
    this.trainerId = trainerId;
    this.assignedAt = new Date();
    this.active = true;
  }
}

export class GroupWorkoutManager {
  constructor() {
    this.workoutPlans = new Map();
    this.groups = new Map();
    this.assignments = new Map();
  }

  // Workout Plan Management
  createWorkoutPlan(name, description, exercises, trainerId, duration = 60) {
    const id = `wp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const plan = new WorkoutPlan(id, name, description, exercises, trainerId, duration);
    this.workoutPlans.set(id, plan);
    return plan;
  }

  getWorkoutPlan(id) {
    return this.workoutPlans.get(id);
  }

  getAllWorkoutPlans(trainerId = null) {
    const plans = Array.from(this.workoutPlans.values());
    if (trainerId) {
      return plans.filter(plan => plan.trainerId === trainerId);
    }
    return plans;
  }

  updateWorkoutPlan(id, updates) {
    const plan = this.workoutPlans.get(id);
    if (!plan) return null;
    
    Object.assign(plan, updates);
    plan.updatedAt = new Date();
    return plan;
  }

  deleteWorkoutPlan(id) {
    return this.workoutPlans.delete(id);
  }

  // Group Management
  createGroup(name, trainerId, clientIds = [], description = '') {
    const id = `grp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const group = new Group(id, name, trainerId, clientIds, description);
    this.groups.set(id, group);
    return group;
  }

  getGroup(id) {
    return this.groups.get(id);
  }

  getAllGroups(trainerId = null) {
    const groups = Array.from(this.groups.values());
    if (trainerId) {
      return groups.filter(group => group.trainerId === trainerId);
    }
    return groups;
  }

  addClientToGroup(groupId, clientId) {
    const group = this.groups.get(groupId);
    if (!group) return null;
    
    if (!group.clientIds.includes(clientId)) {
      group.clientIds.push(clientId);
    }
    return group;
  }

  removeClientFromGroup(groupId, clientId) {
    const group = this.groups.get(groupId);
    if (!group) return null;
    
    group.clientIds = group.clientIds.filter(id => id !== clientId);
    return group;
  }

  // Assignment Management
  assignWorkoutToGroup(groupId, workoutPlanId, schedule, trainerId) {
    const id = `asg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const assignment = new GroupWorkoutAssignment(
      id,
      groupId,
      workoutPlanId,
      schedule,
      trainerId
    );
    this.assignments.set(id, assignment);
    return assignment;
  }

  getAssignment(id) {
    return this.assignments.get(id);
  }

  getAssignmentsByGroup(groupId) {
    return Array.from(this.assignments.values()).filter(
      assignment => assignment.groupId === groupId && assignment.active
    );
  }

  getAssignmentsByTrainer(trainerId) {
    return Array.from(this.assignments.values()).filter(
      assignment => assignment.trainerId === trainerId && assignment.active
    );
  }

  deactivateAssignment(id) {
    const assignment = this.assignments.get(id);
    if (!assignment) return null;
    
    assignment.active = false;
    return assignment;
  }

  // Schedule helpers
  createRecurringSchedule(startDate, daysOfWeek, time) {
    const id = `sch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return new Schedule(id, 'recurring', startDate, null, daysOfWeek, time);
  }

  createSeasonalSchedule(startDate, endDate, daysOfWeek, time) {
    const id = `sch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return new Schedule(id, 'seasonal', startDate, endDate, daysOfWeek, time);
  }
}
