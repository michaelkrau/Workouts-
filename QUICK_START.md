# Quick Start Guide

Get up and running with the Fitness Platform in under 5 minutes!

## Installation

```bash
# Clone and install
git clone https://github.com/michaelkrau/Workouts-.git
cd Workouts-
npm install

# Start the server
npm start
```

The server will start on `http://localhost:3000`

## Try It Now!

### 1. View the Workout Library

```bash
curl http://localhost:3000/api/library | jq '.summary'
```

**Output:**
```json
{
  "exercises": 15,
  "supersets": 5,
  "repMaxProgressions": 4
}
```

### 2. Generate an AI Workout Plan

```bash
curl -X POST http://localhost:3000/api/ai/generate-workout \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "strength",
    "experience": "beginner",
    "daysPerWeek": 3
  }' | jq '.data.name'
```

### 3. Ask the AI Assistant

```bash
curl -X POST http://localhost:3000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are supersets?"}' | jq '.data.answer'
```

### 4. Calculate Your 1RM

```bash
curl -X POST http://localhost:3000/api/ai/calculate-1rm \
  -H "Content-Type: application/json" \
  -d '{"weight": 200, "reps": 5}' | jq '.data.estimated1RM'
```

### 5. Load Complete Demo

```bash
curl http://localhost:3000/api/demo | jq '.data.message'
```

Creates 3 clients, 2 groups, 2 workout plans, and 2 scheduled assignments!

## Key Features at a Glance

### 📚 Workout Library
- **5 Supersets:**
  - ss1: Push-Pull Upper Body (Bench + Pull-ups)
  - ss2: Leg Power (Squat + Burpees)
  - ss3: Arm Sculptor (Bicep Curl + Tricep Dips)
  - ss4: Shoulder Definition (Overhead Press + Lateral Raise)
  - ss5: Back Builder (Barbell Row + Face Pulls)

- **4 Rep Max Progressions:**
  - prog1: 5/3/1 Progression (4-week cycle)
  - prog2: Linear Progression (weekly 2.5% increases)
  - prog3: Strength Builder 3x5 (heavy compound focus)
  - prog4: Hypertrophy Focus (volume-based)

### 🤖 AI Assistant

```bash
# Get a quick tip
curl http://localhost:3000/api/ai/tip?category=strength

# Recommend exercises for a muscle group
curl -X POST http://localhost:3000/api/ai/recommend-exercises \
  -H "Content-Type: application/json" \
  -d '{"muscleGroup": "back"}'
```

### 👥 Create a Training Group

```bash
# 1. Create clients
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com"}'

# 2. Create a group
curl -X POST http://localhost:3000/api/groups \
  -H "Content-Type: application/json" \
  -d '{"name":"Morning Class","trainerId":"trainer_001"}'

# 3. Create workout with supersets
curl -X POST http://localhost:3000/api/workout-plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Full Body Power",
    "trainerId": "trainer_001",
    "exercises": [
      {"type":"superset","supersetId":"ss1","sets":3},
      {"type":"exercise","exerciseId":"ex2","sets":4,"reps":5,"progressionId":"prog1"}
    ]
  }'
```

### 📅 Schedule Workouts

**Recurring (Every MWF):**
```bash
curl -X POST http://localhost:3000/api/groups/GROUP_ID/assign \
  -H "Content-Type: application/json" \
  -d '{
    "workoutPlanId": "PLAN_ID",
    "scheduleType": "recurring",
    "trainerId": "trainer_001",
    "scheduleParams": {
      "startDate": "2025-01-01",
      "daysOfWeek": [1,3,5],
      "time": "18:00"
    }
  }'
```

**Seasonal (8-week program):**
```bash
curl -X POST http://localhost:3000/api/groups/GROUP_ID/assign \
  -H "Content-Type: application/json" \
  -d '{
    "workoutPlanId": "PLAN_ID",
    "scheduleType": "seasonal",
    "trainerId": "trainer_001",
    "scheduleParams": {
      "startDate": "2025-06-01",
      "endDate": "2025-07-31",
      "daysOfWeek": [1,2,4,5],
      "time": "06:00"
    }
  }'
```

## Available Endpoints

| Category | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| **Library** | GET | `/api/library` | All exercises, supersets, progressions |
| | GET | `/api/library/exercises/:muscle` | Exercises by muscle group |
| **Plans** | POST | `/api/workout-plans` | Create workout plan |
| | GET | `/api/workout-plans/trainer/:id` | Get trainer's plans |
| **Groups** | POST | `/api/groups` | Create group |
| | GET | `/api/groups/trainer/:id` | Get trainer's groups |
| | POST | `/api/groups/:id/assign` | Assign workout to group |
| | GET | `/api/groups/:id/assignments` | View assignments |
| **Clients** | POST | `/api/clients` | Create client |
| | GET | `/api/clients/trainer/:id` | Get trainer's clients |
| | POST | `/api/clients/:id/progress` | Record progress |
| | GET | `/api/clients/:id/progress` | View progress |
| **AI** | POST | `/api/ai/generate-workout` | Generate custom plan |
| | POST | `/api/ai/ask` | Ask fitness question |
| | GET | `/api/ai/tip` | Get quick tip |
| | POST | `/api/ai/recommend-exercises` | Get recommendations |
| | POST | `/api/ai/calculate-1rm` | Calculate 1RM |
| **Demo** | GET | `/api/demo` | Load demo scenario |

## Test Everything

Run the included test script:

```bash
chmod +x test-api.sh
./test-api.sh
```

## Next Steps

1. **Read the full documentation**: [DOCUMENTATION.md](DOCUMENTATION.md)
2. **Check out examples**: [EXAMPLES.md](EXAMPLES.md)
3. **See demo output**: [DEMO_OUTPUT.md](DEMO_OUTPUT.md)

## Need Help?

- Check the documentation files
- All endpoints return JSON with `success` and `data` fields
- Error responses include helpful error messages
- The AI assistant can answer fitness questions!

## Architecture

```
Fitness Platform
├── Workout Library (15 exercises, 5 supersets, 4 progressions)
├── Group Management (create groups, assign workouts, schedule)
├── Client Management (profiles, assessments, progress tracking)
└── AI Assistant (plan generation, Q&A, tips, calculator)
```

**Built with:** Node.js + Express.js
**Storage:** In-memory (easily adaptable to database)
**API:** RESTful JSON endpoints

---

🏋️ **Happy Training!**
