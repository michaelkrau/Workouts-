/**
 * Client Management Model
 * Handles client profiles, assessments, and progress tracking
 */

export class Client {
  constructor(id, firstName, lastName, email, phone = '', dateOfBirth = null) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.dateOfBirth = dateOfBirth;
    this.trainerId = null;
    this.groupIds = []; // Array of group IDs this client belongs to
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.active = true;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

export class FitnessAssessment {
  constructor(clientId, assessmentDate, measurements = {}) {
    this.id = `assess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    this.clientId = clientId;
    this.assessmentDate = assessmentDate;
    this.measurements = measurements; // weight, height, bodyFat, etc.
    this.oneRepMaxes = {}; // Exercise ID -> weight
    this.goals = [];
    this.notes = '';
  }
}

export class ClientProgress {
  constructor(clientId, workoutId, completedDate, exercises = []) {
    this.id = `prog_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    this.clientId = clientId;
    this.workoutId = workoutId;
    this.completedDate = completedDate;
    this.exercises = exercises; // Array of completed exercise data
    this.duration = 0; // minutes
    this.notes = '';
  }
}

export class ClientManager {
  constructor() {
    this.clients = new Map();
    this.assessments = new Map();
    this.progress = new Map();
  }

  // Client CRUD operations
  createClient(firstName, lastName, email, phone = '', dateOfBirth = null) {
    const id = `client_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const client = new Client(id, firstName, lastName, email, phone, dateOfBirth);
    this.clients.set(id, client);
    return client;
  }

  getClient(id) {
    return this.clients.get(id);
  }

  getAllClients(trainerId = null, activeOnly = true) {
    let clients = Array.from(this.clients.values());
    
    if (activeOnly) {
      clients = clients.filter(client => client.active);
    }
    
    if (trainerId) {
      clients = clients.filter(client => client.trainerId === trainerId);
    }
    
    return clients;
  }

  updateClient(id, updates) {
    const client = this.clients.get(id);
    if (!client) return null;
    
    Object.assign(client, updates);
    client.updatedAt = new Date();
    return client;
  }

  deactivateClient(id) {
    const client = this.clients.get(id);
    if (!client) return null;
    
    client.active = false;
    client.updatedAt = new Date();
    return client;
  }

  assignTrainer(clientId, trainerId) {
    const client = this.clients.get(clientId);
    if (!client) return null;
    
    client.trainerId = trainerId;
    client.updatedAt = new Date();
    return client;
  }

  // Assessment Management
  createAssessment(clientId, assessmentDate, measurements = {}) {
    const assessment = new FitnessAssessment(clientId, assessmentDate, measurements);
    this.assessments.set(assessment.id, assessment);
    return assessment;
  }

  getClientAssessments(clientId) {
    return Array.from(this.assessments.values())
      .filter(assessment => assessment.clientId === clientId)
      .sort((a, b) => b.assessmentDate - a.assessmentDate);
  }

  getLatestAssessment(clientId) {
    const assessments = this.getClientAssessments(clientId);
    return assessments.length > 0 ? assessments[0] : null;
  }

  updateAssessment(id, updates) {
    const assessment = this.assessments.get(id);
    if (!assessment) return null;
    
    Object.assign(assessment, updates);
    return assessment;
  }

  // Progress Tracking
  recordProgress(clientId, workoutId, completedDate, exercises = []) {
    const progress = new ClientProgress(clientId, workoutId, completedDate, exercises);
    this.progress.set(progress.id, progress);
    return progress;
  }

  getClientProgress(clientId, limit = 10) {
    return Array.from(this.progress.values())
      .filter(prog => prog.clientId === clientId)
      .sort((a, b) => b.completedDate - a.completedDate)
      .slice(0, limit);
  }

  getWorkoutHistory(clientId, workoutId) {
    return Array.from(this.progress.values())
      .filter(prog => prog.clientId === clientId && prog.workoutId === workoutId)
      .sort((a, b) => b.completedDate - a.completedDate);
  }
}
