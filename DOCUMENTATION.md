# Fitness Platform Documentation

## Overview

A comprehensive fitness platform for group class scheduling, client management, and custom workout creation. Features a multi-modal AI assistant for generating workout plans, answering fitness questions, and providing quick tips.

## Features

### 1. Workout Library 📚

The platform includes a comprehensive workout library with:

- **Exercises**: 15+ pre-loaded exercises covering all major muscle groups
- **Supersets**: 5 pre-configured supersets for efficient training
- **Rep Max Progressions**: 4 progressive overload programs including:
  - 5/3/1 Progression
  - Linear Progression
  - Strength Builder (3x5)
  - Hypertrophy Focus

#### Exercise Categories
- Strength exercises (barbells, dumbbells, bodyweight, machines)
- Cardio exercises (running, burpees, jump rope)
- Organized by muscle groups: chest, back, legs, shoulders, arms, full-body

#### Superset Examples
1. **Push-Pull Upper Body**: Bench Press + Pull-ups
2. **Leg Power**: Squat + Burpees
3. **Arm Sculptor**: Bicep Curl + Tricep Dips
4. **Shoulder Definition**: Overhead Press + Lateral Raise
5. **Back Builder**: Barbell Row + Face Pulls

#### Rep Max Progression Programs

**5/3/1 Progression**
- Week 1: 3x5 @ 65%, 75%, 85%
- Week 2: 3x3 @ 70%, 80%, 90%
- Week 3: 5,3,1 @ 75%, 85%, 95%
- Week 4: Deload @ 40%, 50%, 60%

**Linear Progression**
- Progressive weekly increases of 2.5% of 1RM
- Consistent 3x8 rep scheme
- Ideal for beginners to intermediate lifters

**Strength Builder (3x5)**
- Focus on heavy compound movements
- Starting at 80% 1RM
- 2.5% weekly increases

**Hypertrophy Focus**
- Varying rep ranges (12, 10, 8, 8)
- Volume-focused approach
- Includes deload week

### 2. Group Workout Programs 👥

Trainers can:

- **Build Custom Workout Plans**: Create personalized workout programs
- **Create Groups**: Organize clients into training groups
- **Assign Workouts to Groups**: Link workout plans to specific groups
- **Schedule Options**:
  - **Recurring**: Ongoing schedules (e.g., every Monday, Wednesday, Friday)
  - **Seasonal**: Time-bound programs (e.g., 8-week summer program)

#### Scheduling Features
- Set specific days of the week (Sunday = 0, Saturday = 6)
- Define training times (HH:MM format)
- Start and end dates for seasonal programs
- Multiple assignments per group supported

### 3. Client Management 👤

Comprehensive client management system:

- **Client Profiles**: Name, contact info, demographics
- **Fitness Assessments**: Track measurements, body composition, 1RM values
- **Progress Tracking**: Record completed workouts and performance
- **Trainer Assignment**: Link clients to trainers
- **Group Membership**: Clients can belong to multiple groups

### 4. Multi-Modal AI Assistant 🤖

The AI assistant provides:

#### Workout Plan Generation
- Customized plans based on:
  - Goals (strength, hypertrophy, weight loss, general fitness)
  - Experience level (beginner, intermediate, advanced)
  - Training frequency (days per week)
  - Available equipment
  - Focus areas

#### Fitness Q&A
Answers questions about:
- Supersets and training techniques
- Rep max and progressive overload
- Beginner guidance
- Rest and recovery
- Cardio training
- Nutrition basics

#### Quick Tips
Categorized tips for:
- General fitness
- Strength training
- Hypertrophy/muscle building
- Nutrition
- Recovery

#### Exercise Recommendations
- Filter by muscle group
- Filter by available equipment
- Difficulty level suggestions

#### 1RM Calculator
- Calculate estimated 1 rep max from any rep range
- Provides training percentages (70%, 75%, 80%, 85%, 90%)
- Uses Epley Formula for accuracy

## API Endpoints

### Workout Library

```
GET /api/library
GET /api/library/exercises/:muscleGroup
```

### Workout Plans

```
POST /api/workout-plans
GET /api/workout-plans/trainer/:trainerId
```

### Groups

```
POST /api/groups
GET /api/groups/trainer/:trainerId
POST /api/groups/:groupId/assign
GET /api/groups/:groupId/assignments
```

### Clients

```
POST /api/clients
GET /api/clients/trainer/:trainerId
POST /api/clients/:clientId/progress
GET /api/clients/:clientId/progress
```

### AI Assistant

```
POST /api/ai/generate-workout
POST /api/ai/ask
GET /api/ai/tip?category=strength
POST /api/ai/recommend-exercises
POST /api/ai/calculate-1rm
```

### Demo

```
GET /api/demo
```

## Usage Examples

See `EXAMPLES.md` for detailed API usage examples.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. For development with auto-reload:
```bash
npm run dev
```

4. Test the API:
```bash
curl http://localhost:3000/api/demo
```

## Architecture

- **Models**: Data structures for workouts, clients, groups
- **Services**: Business logic layer (FitnessPlatform)
- **AI Assistant**: Intelligent workout and fitness advice
- **REST API**: Express.js server with JSON responses

## Future Enhancements

- User authentication and authorization
- Database integration (PostgreSQL/MongoDB)
- Real-time notifications
- Mobile app integration
- Video exercise library
- Social features and leaderboards
- Payment processing for trainers
- Calendar integration
