#!/bin/bash
# Fitness Platform API Test Script

echo "🏋️  Testing Fitness Platform API"
echo "=================================="
echo ""

BASE_URL="http://localhost:3000"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=$4
    
    echo -n "Testing $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -X POST "$url" -H "Content-Type: application/json" -d "$data")
    else
        response=$(curl -s "$url")
    fi
    
    if [ $? -eq 0 ] && [ ! -z "$response" ]; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        return 1
    fi
}

# Test root endpoint
test_endpoint "Root endpoint" "$BASE_URL/"

# Test workout library
echo ""
echo "📚 Workout Library Tests"
test_endpoint "  Get library" "$BASE_URL/api/library"
test_endpoint "  Get leg exercises" "$BASE_URL/api/library/exercises/legs"
test_endpoint "  Get back exercises" "$BASE_URL/api/library/exercises/back"

# Test AI Assistant
echo ""
echo "🤖 AI Assistant Tests"
test_endpoint "  Generate workout" "$BASE_URL/api/ai/generate-workout" "POST" '{"goal":"strength","experience":"beginner","daysPerWeek":3}'
test_endpoint "  Ask question" "$BASE_URL/api/ai/ask" "POST" '{"question":"What are supersets?"}'
test_endpoint "  Get tip" "$BASE_URL/api/ai/tip?category=strength"
test_endpoint "  Calculate 1RM" "$BASE_URL/api/ai/calculate-1rm" "POST" '{"weight":200,"reps":5}'
test_endpoint "  Recommend exercises" "$BASE_URL/api/ai/recommend-exercises" "POST" '{"muscleGroup":"chest"}'

# Test demo scenario
echo ""
echo "🎬 Demo Tests"
test_endpoint "  Load demo" "$BASE_URL/api/demo"

# Test workout plan creation
echo ""
echo "💪 Workout Plan Tests"
test_endpoint "  Create plan" "$BASE_URL/api/workout-plans" "POST" '{"name":"Test Plan","trainerId":"trainer_001","exercises":[]}'

# Test group creation
echo ""
echo "👥 Group Tests"
test_endpoint "  Create group" "$BASE_URL/api/groups" "POST" '{"name":"Test Group","trainerId":"trainer_001"}'

# Test client creation
echo ""
echo "👤 Client Tests"
test_endpoint "  Create client" "$BASE_URL/api/clients" "POST" '{"firstName":"Test","lastName":"User","email":"test@example.com"}'

echo ""
echo "=================================="
echo -e "${GREEN}All tests completed!${NC}"
echo ""

# Display library summary
echo "📊 Library Summary:"
curl -s "$BASE_URL/api/library" | jq '.summary'

echo ""
echo "💡 View supersets:"
curl -s "$BASE_URL/api/library" | jq '.data.supersets | map({id, name})'

echo ""
echo "📈 View rep max progressions:"
curl -s "$BASE_URL/api/library" | jq '.data.repMaxProgressions | map({id, name})'
