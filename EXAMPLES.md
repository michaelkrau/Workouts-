# Fitness Platform API Examples

This document provides practical examples of how to use the Fitness Platform API.

## Table of Contents

1. [Getting the Workout Library](#getting-the-workout-library)
2. [Creating Workout Plans with Supersets](#creating-workout-plans-with-supersets)
3. [Using Rep Max Progressions](#using-rep-max-progressions)
4. [Creating and Managing Groups](#creating-and-managing-groups)
5. [Scheduling Workouts](#scheduling-workouts)
6. [Client Management](#client-management)
7. [AI Assistant Features](#ai-assistant-features)

## Getting the Workout Library

### View All Exercises, Supersets, and Progressions

```bash
curl http://localhost:3000/api/library
```

Response includes:
- 15 exercises across all muscle groups
- 5 pre-configured supersets
- 4 rep max progression programs

### Get Exercises by Muscle Group

```bash
# Get all leg exercises
curl http://localhost:3000/api/library/exercises/legs

# Get all back exercises
curl http://localhost:3000/api/library/exercises/back
```

## Creating Workout Plans with Supersets

### Example 1: Beginner Full Body with Supersets

```bash
curl -X POST http://localhost:3000/api/workout-plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Beginner Full Body",
    "description": "Full body workout with push-pull superset",
    "trainerId": "trainer_001",
    "duration": 60,
    "exercises": [
      {
        "type": "superset",
        "supersetId": "ss1",
        "sets": 3
      },
      {
        "type": "exercise",
        "exerciseId": "ex2",
        "sets": 3,
        "reps": 10,
        "notes": "Focus on depth and form"
      }
    ]
  }'
```

### Example 2: Advanced Hypertrophy Plan

```bash
curl -X POST http://localhost:3000/api/workout-plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chest & Triceps Hypertrophy",
    "description": "High volume chest and triceps workout",
    "trainerId": "trainer_001",
    "duration": 75,
    "exercises": [
      {
        "type": "superset",
        "supersetId": "ss1",
        "sets": 4,
        "notes": "Push-pull superset for upper body"
      },
      {
        "type": "superset",
        "supersetId": "ss3",
        "sets": 3,
        "notes": "Arm sculptor superset"
      },
      {
        "type": "exercise",
        "exerciseId": "ex1",
        "sets": 4,
        "reps": 10,
        "progressionId": "prog4"
      }
    ]
  }'
```

## Using Rep Max Progressions

### Example 3: Strength Building Plan with 5/3/1

```bash
curl -X POST http://localhost:3000/api/workout-plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "5/3/1 Strength Program",
    "description": "Progressive strength building using 5/3/1 methodology",
    "trainerId": "trainer_001",
    "duration": 90,
    "exercises": [
      {
        "type": "exercise",
        "exerciseId": "ex2",
        "sets": 3,
        "reps": 5,
        "progressionId": "prog1",
        "notes": "Squat - Follow 5/3/1 progression"
      },
      {
        "type": "exercise",
        "exerciseId": "ex1",
        "sets": 3,
        "reps": 5,
        "progressionId": "prog1",
        "notes": "Bench Press - Follow 5/3/1 progression"
      },
      {
        "type": "exercise",
        "exerciseId": "ex3",
        "sets": 3,
        "reps": 5,
        "progressionId": "prog1",
        "notes": "Deadlift - Follow 5/3/1 progression"
      }
    ]
  }'
```

### Example 4: Linear Progression for Beginners

```bash
curl -X POST http://localhost:3000/api/workout-plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Linear Progression Program",
    "description": "Simple progressive overload for beginners",
    "trainerId": "trainer_001",
    "duration": 60,
    "exercises": [
      {
        "type": "exercise",
        "exerciseId": "ex2",
        "sets": 3,
        "reps": 8,
        "progressionId": "prog2",
        "notes": "Add 2.5% each week"
      },
      {
        "type": "exercise",
        "exerciseId": "ex1",
        "sets": 3,
        "reps": 8,
        "progressionId": "prog2"
      }
    ]
  }'
```

## Creating and Managing Groups

### Create a Training Group

```bash
curl -X POST http://localhost:3000/api/groups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Morning Strength Class",
    "trainerId": "trainer_001",
    "description": "Early morning strength training group",
    "clientIds": []
  }'
```

### Get All Groups for a Trainer

```bash
curl http://localhost:3000/api/groups/trainer/trainer_001
```

## Scheduling Workouts

### Recurring Schedule Example (Every Monday, Wednesday, Friday)

```bash
curl -X POST http://localhost:3000/api/groups/grp_123/assign \
  -H "Content-Type: application/json" \
  -d '{
    "workoutPlanId": "wp_456",
    "scheduleType": "recurring",
    "trainerId": "trainer_001",
    "scheduleParams": {
      "startDate": "2025-01-01",
      "daysOfWeek": [1, 3, 5],
      "time": "18:00"
    }
  }'
```

Days of week: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday

### Seasonal Schedule Example (8-Week Summer Program)

```bash
curl -X POST http://localhost:3000/api/groups/grp_123/assign \
  -H "Content-Type: application/json" \
  -d '{
    "workoutPlanId": "wp_789",
    "scheduleType": "seasonal",
    "trainerId": "trainer_001",
    "scheduleParams": {
      "startDate": "2025-06-01",
      "endDate": "2025-07-31",
      "daysOfWeek": [1, 2, 4, 5],
      "time": "06:00"
    }
  }'
```

### View Group Assignments

```bash
curl http://localhost:3000/api/groups/grp_123/assignments
```

## Client Management

### Create a New Client

```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "555-0100",
    "dateOfBirth": "1990-05-15"
  }'
```

### Record Client Progress

```bash
curl -X POST http://localhost:3000/api/clients/client_123/progress \
  -H "Content-Type: application/json" \
  -d '{
    "workoutId": "wp_456",
    "completedDate": "2025-01-15T18:30:00Z",
    "exercises": [
      {
        "exerciseId": "ex2",
        "sets": 3,
        "reps": 10,
        "weight": 185
      },
      {
        "exerciseId": "ex1",
        "sets": 3,
        "reps": 8,
        "weight": 155
      }
    ]
  }'
```

### View Client Progress History

```bash
# Get last 10 workouts
curl http://localhost:3000/api/clients/client_123/progress

# Get last 20 workouts
curl http://localhost:3000/api/clients/client_123/progress?limit=20
```

## AI Assistant Features

### Generate a Workout Plan

```bash
# Generate a strength plan for intermediate lifter
curl -X POST http://localhost:3000/api/ai/generate-workout \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "strength",
    "experience": "intermediate",
    "daysPerWeek": 4,
    "duration": 75,
    "equipment": "full gym"
  }'
```

Available goals: `strength`, `hypertrophy`, `weight loss`, `general fitness`
Experience levels: `beginner`, `intermediate`, `advanced`

### Ask Fitness Questions

```bash
# Ask about supersets
curl -X POST http://localhost:3000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are supersets and how do I use them?"
  }'

# Ask about rep max
curl -X POST http://localhost:3000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How do I calculate my 1RM?"
  }'

# Ask about beginner advice
curl -X POST http://localhost:3000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "I am a beginner, where should I start?"
  }'
```

### Get Quick Tips

```bash
# General tips
curl http://localhost:3000/api/ai/tip

# Strength training tips
curl http://localhost:3000/api/ai/tip?category=strength

# Nutrition tips
curl http://localhost:3000/api/ai/tip?category=nutrition

# Recovery tips
curl http://localhost:3000/api/ai/tip?category=recovery
```

Available categories: `general`, `strength`, `hypertrophy`, `nutrition`, `recovery`

### Get Exercise Recommendations

```bash
# Recommend back exercises
curl -X POST http://localhost:3000/api/ai/recommend-exercises \
  -H "Content-Type: application/json" \
  -d '{
    "muscleGroup": "back",
    "equipment": "barbell"
  }'

# Recommend bodyweight exercises
curl -X POST http://localhost:3000/api/ai/recommend-exercises \
  -H "Content-Type: application/json" \
  -d '{
    "equipment": "bodyweight"
  }'
```

### Calculate 1 Rep Max

```bash
# Calculate 1RM from a set of 225lbs x 8 reps
curl -X POST http://localhost:3000/api/ai/calculate-1rm \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 225,
    "reps": 8
  }'
```

Returns estimated 1RM and training percentages (70%, 75%, 80%, 85%, 90%)

## Demo Scenario

Load a complete demo with trainers, clients, groups, and workout plans:

```bash
curl http://localhost:3000/api/demo
```

This creates:
- 1 demo trainer
- 3 clients assigned to the trainer
- 2 groups (Beginner and Advanced)
- 2 workout plans (with supersets and rep max progressions)
- 2 scheduled assignments (recurring schedules)

## Complete Workflow Example

Here's a complete workflow for a trainer setting up a new group:

```bash
# 1. Create clients
CLIENT1=$(curl -s -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Alice","lastName":"Smith","email":"alice@example.com"}' \
  | jq -r '.data.id')

CLIENT2=$(curl -s -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Bob","lastName":"Jones","email":"bob@example.com"}' \
  | jq -r '.data.id')

# 2. Create a group
GROUP=$(curl -s -X POST http://localhost:3000/api/groups \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Evening Class\",\"trainerId\":\"trainer_001\",\"clientIds\":[\"$CLIENT1\",\"$CLIENT2\"]}" \
  | jq -r '.data.id')

# 3. Create a workout plan with supersets
PLAN=$(curl -s -X POST http://localhost:3000/api/workout-plans \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Full Body Supersets",
    "trainerId":"trainer_001",
    "exercises":[
      {"type":"superset","supersetId":"ss1","sets":3},
      {"type":"superset","supersetId":"ss2","sets":3}
    ]
  }' | jq -r '.data.id')

# 4. Assign workout to group with recurring schedule
curl -X POST http://localhost:3000/api/groups/$GROUP/assign \
  -H "Content-Type: application/json" \
  -d "{
    \"workoutPlanId\":\"$PLAN\",
    \"scheduleType\":\"recurring\",
    \"trainerId\":\"trainer_001\",
    \"scheduleParams\":{
      \"startDate\":\"2025-01-01\",
      \"daysOfWeek\":[1,3,5],
      \"time\":\"18:00\"
    }
  }"

echo "Setup complete!"
```

## Notes

- All timestamps should be in ISO 8601 format
- Client and group IDs are generated automatically
- Workout plans can mix exercises and supersets
- Rep max progressions can be applied to individual exercises
- Schedules support multiple days per week
- The AI assistant provides contextual responses based on question keywords
