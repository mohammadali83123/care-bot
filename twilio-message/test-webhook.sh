#!/bin/bash

# Test script for CareBot WhatsApp webhook
# Usage: ./test-webhook.sh [message]

PORT=${PORT:-3000}
MESSAGE=${1:-"Hello, I need help with my order"}
FROM="whatsapp:+923001234567"

echo "🧪 Testing CareBot Webhook"
echo "================================"
echo "Port: $PORT"
echo "Message: $MESSAGE"
echo "From: $FROM"
echo "================================"
echo ""

curl -X POST "http://localhost:$PORT/api/whatsapp" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=$FROM" \
  -d "Body=$MESSAGE" \
  -d "MessageSid=TEST_MSG_SID" \
  -d "AccountSid=TEST_ACCOUNT_SID" \
  -v

echo ""
echo "================================"
echo "✅ Test complete!"

