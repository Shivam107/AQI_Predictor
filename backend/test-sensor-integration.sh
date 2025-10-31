#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "🧪 Testing Sensor Integration"
echo "=========================================="
echo ""

# Base URL (default to localhost, can be overridden)
BASE_URL="${1:-http://localhost:3001}"

echo "Testing backend at: $BASE_URL"
echo ""

# Test 1: Health check
echo "1️⃣  Testing health check..."
HEALTH_CHECK=$(curl -s "$BASE_URL/")
if [[ $HEALTH_CHECK == *"Backend is up"* ]]; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is not responding${NC}"
    exit 1
fi
echo ""

# Test 2: Sensor polling status
echo "2️⃣  Testing sensor polling status..."
POLLING_STATUS=$(curl -s "$BASE_URL/api/sensor-polling/status")
if [[ $POLLING_STATUS == *"\"success\":true"* ]]; then
    echo -e "${GREEN}✅ Sensor polling service is running${NC}"
    echo "$POLLING_STATUS" | python3 -m json.tool 2>/dev/null || echo "$POLLING_STATUS"
else
    echo -e "${RED}❌ Sensor polling service is not running${NC}"
    echo "$POLLING_STATUS"
fi
echo ""

# Test 3: Latest sensor data
echo "3️⃣  Testing latest sensor data..."
SENSOR_DATA=$(curl -s "$BASE_URL/api/sensor-data/latest")
if [[ $SENSOR_DATA == *"\"success\":true"* ]]; then
    echo -e "${GREEN}✅ Sensor data is available${NC}"
    echo "$SENSOR_DATA" | python3 -m json.tool 2>/dev/null || echo "$SENSOR_DATA"
elif [[ $SENSOR_DATA == *"No sensor data available"* ]]; then
    echo -e "${YELLOW}⚠️  No sensor data available yet (service might be starting)${NC}"
    echo "$SENSOR_DATA"
else
    echo -e "${RED}❌ Error fetching sensor data${NC}"
    echo "$SENSOR_DATA"
fi
echo ""

# Test 4: Test POST endpoint
echo "4️⃣  Testing manual sensor data submission..."
TEST_PAYLOAD='{
  "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
  "sensor_id": "test-sensor-001",
  "values": {
    "aq2": 85.5,
    "temperature": 27.3,
    "humidity": 62.1,
    "gps": {
      "latitude": 19.076,
      "longitude": 72.8777,
      "altitude": 14.2
    }
  }
}'

POST_RESULT=$(curl -s -X POST "$BASE_URL/api/sensor-data" \
  -H "Content-Type: application/json" \
  -d "$TEST_PAYLOAD")

if [[ $POST_RESULT == *"\"status\":\"received\""* ]]; then
    echo -e "${GREEN}✅ Manual sensor data submission works${NC}"
    echo "$POST_RESULT" | python3 -m json.tool 2>/dev/null || echo "$POST_RESULT"
else
    echo -e "${RED}❌ Error submitting sensor data${NC}"
    echo "$POST_RESULT"
fi
echo ""

echo "=========================================="
echo "✨ Sensor Integration Test Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Check backend logs for polling activity"
echo "2. Open frontend at http://localhost:3000 to see live data"
echo "3. Monitor sensor data: curl $BASE_URL/api/sensor-data/latest"
echo ""

