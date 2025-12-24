#!/bin/bash
# Test pharmacy dispensing endpoints

# 1. Login and get token
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  http://localhost:8081/api/auth/login)

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

if [ -z "$TOKEN" ]; then
  echo "Login failed!"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

# 2. Get prescriptions
echo ""
echo "Fetching prescriptions..."
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:8081/api/prescriptions | jq '.data[0] | {id, medication, quantity, status}'

# 3. Get first prescription ID and try to dispense
echo ""
echo "Getting first prescription..."
PRESC_ID=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:8081/api/prescriptions | jq '.data[0].id')

if [ -z "$PRESC_ID" ] || [ "$PRESC_ID" = "null" ]; then
  echo "No prescriptions found"
  exit 0
fi

echo "Found prescription ID: $PRESC_ID"

# 4. Dispense prescription using simple endpoint
echo ""
echo "Testing dispense endpoint..."
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8081/api/pharmacy/prescriptions/$PRESC_ID/dispense-simple?dispensedBy=test-pharmacist" | jq '.'
