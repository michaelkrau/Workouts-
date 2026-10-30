# Fitness Platform 🏋️

## STRONG client app

A mobile-first Hebrew (RTL) app that runs the trainer's pre-built workouts.

```bash
npm install
npm start          # then open http://localhost:3000/app/
npm test           # content checks + timer timeline tests
```

- **Library**: today's workout, workouts by goal or by method, and an equipment filter.
- **Workout page**: structure, exercises with easier/harder options, and an optional warm-up and cool-down.
- **Player**:
  - a timed ring for interval, circuit and tabata workouts, with a "set done" button for rep-based ones
  - sound and vibration in the last 3 seconds, and the screen stays on
  - keyboard: space pauses; the arrow keys follow reading direction
- **Finish**: effort rating (1–10) and a note. History is saved on the device.

Code lives in `app/`. The content it reads is in `src/data/`, and the brand guide is in `design/BRAND.md`.

A comprehensive fitness platform for group class scheduling, client management, and custom workout creation. Features a multi-modal AI assistant for generating workout plans, answering fitness questions, and providing quick tips.

## 🌟 Features

### 📚 Workout Library
- **15+ Pre-loaded Exercises** covering all major muscle groups
- **5 Superset Configurations** for efficient training
  - Push-Pull Upper Body Superset
  - Leg Power Superset
  - Arm Sculptor Superset
  - Shoulder Definition Superset
  - Back Builder Superset
- **4 Rep Max Progression Programs**
  - 5/3/1 Progression
  - Linear Progression
  - Strength Builder (3x5)
  - Hypertrophy Focus

### 👥 Group Workout Programs
- Build custom workout plans with supersets and rep max progressions
- Create and manage training groups
- Assign workout programs to specific groups
- **Scheduling Options:**
  - **Recurring schedules** (e.g., every Monday, Wednesday, Friday)
  - **Seasonal schedules** (e.g., 8-week summer program)

### 👤 Client Management
- Comprehensive client profiles
- Fitness assessments and body composition tracking
- Progress tracking and workout history
- Trainer-client assignments
- Multi-group membership support

### 🤖 Multi-Modal AI Assistant
- **Workout Plan Generation** - Custom plans based on goals, experience, and equipment
- **Fitness Q&A** - Answers questions about training, nutrition, and recovery
- **Quick Tips** - Context-specific advice for various fitness topics
- **Exercise Recommendations** - Smart filtering by muscle group and equipment
- **1RM Calculator** - Estimate one-rep max from any rep range

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/michaelkrau/Workouts-.git
cd Workouts-

# Install dependencies
npm install

# Start the server
npm start
```

### Development

```bash
# Run with auto-reload
npm run dev

# Run tests
npm test
```

### Try the Demo

```bash
# Load a complete demo scenario
curl http://localhost:3000/api/demo
```

## 📖 Documentation

- **[Full Documentation](DOCUMENTATION.md)** - Comprehensive guide to all features
- **[API Examples](EXAMPLES.md)** - Practical examples for every endpoint

## 🎯 Example Use Cases

### Create a Workout Plan with Supersets

```bash
curl -X POST http://localhost:3000/api/workout-plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Push Day with Supersets",
    "trainerId": "trainer_001",
    "exercises": [
      {"type": "superset", "supersetId": "ss1", "sets": 4},
      {"type": "exercise", "exerciseId": "ex5", "sets": 3, "reps": 8}
    ]
  }'
```

### Generate AI Workout Plan

```bash
curl -X POST http://localhost:3000/api/ai/generate-workout \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "strength",
    "experience": "intermediate",
    "daysPerWeek": 4
  }'
```

### Ask the AI Assistant

```bash
curl -X POST http://localhost:3000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are supersets and how do I use them?"
  }'
```

## 📋 API Endpoints

### Workout Library
- `GET /api/library` - Get all exercises, supersets, and progressions
- `GET /api/library/exercises/:muscleGroup` - Get exercises by muscle group

### Workout Plans
- `POST /api/workout-plans` - Create workout plan
- `GET /api/workout-plans/trainer/:trainerId` - Get trainer's plans

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups/trainer/:trainerId` - Get trainer's groups
- `POST /api/groups/:groupId/assign` - Assign workout to group
- `GET /api/groups/:groupId/assignments` - View assignments

### Clients
- `POST /api/clients` - Create client
- `GET /api/clients/trainer/:trainerId` - Get trainer's clients
- `POST /api/clients/:clientId/progress` - Record progress
- `GET /api/clients/:clientId/progress` - View progress history

### AI Assistant
- `POST /api/ai/generate-workout` - Generate custom workout plan
- `POST /api/ai/ask` - Ask fitness questions
- `GET /api/ai/tip?category=strength` - Get quick tips
- `POST /api/ai/recommend-exercises` - Get exercise recommendations
- `POST /api/ai/calculate-1rm` - Calculate one-rep max

## 🏗️ Architecture

```
src/
├── models/              # Data models
│   ├── WorkoutLibrary.js    # Exercises, supersets, progressions
│   ├── GroupWorkout.js      # Workout plans, groups, assignments
│   └── Client.js            # Client profiles and progress
├── services/            # Business logic
│   └── FitnessPlatform.js   # Main platform orchestrator
├── ai-assistant/        # AI features
│   └── AIAssistant.js       # Workout generation and Q&A
└── index.js            # Express server and API routes
```

## 💡 Key Features Explained

### Supersets
Supersets pair two exercises back-to-back with minimal rest, increasing workout efficiency and intensity. The platform includes 5 pre-configured supersets:

- **ss1**: Push-Pull (Bench Press + Pull-ups)
- **ss2**: Leg Power (Squat + Burpees)
- **ss3**: Arm Sculptor (Bicep Curl + Tricep Dips)
- **ss4**: Shoulder Definition (Overhead Press + Lateral Raise)
- **ss5**: Back Builder (Barbell Row + Face Pulls)

### Rep Max Progressions
Progressive overload programs that use percentages of your one-rep max (1RM):

- **5/3/1**: 4-week cycle with wave loading and deload
- **Linear**: Simple weekly 2.5% increases
- **Strength Builder**: Heavy 3x5 protocol
- **Hypertrophy**: Volume-focused with varying rep ranges

### Scheduling
- **Recurring**: Ongoing programs (e.g., MWF at 6 PM)
- **Seasonal**: Time-bound (e.g., 12-week program from Jan-Mar)

## 🔧 Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **ES6 Modules** - Modern JavaScript
- **In-Memory Storage** - Fast development (easily adaptable to database)

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! This platform is designed to be extended with:
- Database integration (PostgreSQL, MongoDB)
- Authentication and authorization
- Real-time features (WebSocket)
- Mobile app integration
- Video exercise library
- Payment processing

## 📧 Contact

For questions or support, please open an issue on GitHub.
