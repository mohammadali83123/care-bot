# CareBot - Quick Setup Guide

## 🎯 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd CareBot
npm install
```

### Step 2: Create Environment File

```bash
cp .env.example .env
```

### Step 3: Configure `.env` File

Open `.env` and add your credentials:

```env
# ⚠️ REQUIRED - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-your-key-here

# ⚠️ REQUIRED - Your API endpoints
CHECK_USER_REGISTERATION_API_URL=https://your-api.com/check-user
GET_USER_ORDERS_API_URL=https://your-api.com/orders
BAZAAR_AI_ACCESS_TOKEN=your-token-here

# Optional - Defaults are fine for development
PORT=3000
OPENAI_MODEL=gpt-4o
LOG_LEVEL=INFO
```

### Step 4: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# You should see:
# 🚀 Server running on port 3000
```

### Step 5: Expose Your Local Server (for Twilio)

**Option A: Using ngrok (Recommended for testing)**

```bash
# In a new terminal
npx ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

**Option B: Deploy to Production**
- Deploy to Heroku, Railway, Render, or any cloud provider
- Use your production URL

### Step 6: Configure Twilio Webhook

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to: **Messaging** → **Settings** → **WhatsApp Sandbox**
3. In "When a message comes in":
   - Enter: `https://your-url.com/api/whatsapp` (or your ngrok URL)
   - Method: **POST**
4. Click **Save**

### Step 7: Test Your Bot

1. Join the Twilio WhatsApp Sandbox by sending the code to the sandbox number
2. Send a test message: "Hello"
3. Check your terminal logs - you should see:

```
============================================================
📩 INCOMING MESSAGE [timestamp]
   From: whatsapp:+1234567890
   Message: Hello
============================================================

⏳ [WORKFLOW] Session Management: processing
⏳ [WORKFLOW] Business Hours Check: processing
✅ [WORKFLOW] Business Hours Check: success: Within business hours
⏳ [WORKFLOW] Customer Validation: processing
...
```

4. You should receive an AI response in WhatsApp!

---

## ✅ Verification Checklist

- [ ] Server starts without errors
- [ ] `.env` file is configured with OpenAI API key
- [ ] Twilio webhook is configured
- [ ] Test message receives a response
- [ ] Logs show the complete workflow

---

## 🎨 Customize Your Bot

### Change Business Hours

Edit `twilio-message/src/services/business-hours.service.js`:

```javascript
const BUSINESS_HOURS = {
  timezone: "America/New_York", // Your timezone
  hours: {
    monday: { open: "09:00", close: "17:00" },
    // ... customize each day
  },
};
```

### Customize AI Personality

Edit the system prompt in `twilio-message/src/services/openai.service.js`:

```javascript
function buildSystemContext(context) {
  let systemPrompt = `You are a friendly and helpful customer support agent...`;
  // Customize the personality, tone, and instructions
}
```

### Change OpenAI Model

In `.env`:

```env
OPENAI_MODEL=gpt-4o-mini  # Faster and cheaper
# or
OPENAI_MODEL=gpt-4-turbo  # More capable
```

---

## 🔧 Troubleshooting

### Error: "Missing required environment variables"

**Problem**: Missing OpenAI API key or API URLs in `.env`

**Solution**:
```bash
# Make sure .env has these variables:
OPENAI_API_KEY=sk-...
CHECK_USER_REGISTERATION_API_URL=https://...
GET_USER_ORDERS_API_URL=https://...
```

### Error: "AI processing failed"

**Problem**: Invalid OpenAI API key or no credits

**Solution**:
- Verify API key at https://platform.openai.com/api-keys
- Check billing at https://platform.openai.com/account/billing

### No response in WhatsApp

**Problem**: Twilio webhook not configured or server not accessible

**Solution**:
1. Check that ngrok is running and URL hasn't changed
2. Verify webhook URL in Twilio console
3. Check server logs for incoming requests
4. Test webhook manually:
   ```bash
   curl -X POST http://localhost:3000/api/whatsapp \
     -d "From=whatsapp:+1234567890" \
     -d "Body=test message"
   ```

### "Customer check failed"

**Problem**: External API endpoints are not accessible

**Solution**:
- Verify API URLs in `.env`
- Check API credentials (BAZAAR_AI_ACCESS_TOKEN)
- Test APIs manually with curl or Postman
- Check if APIs require VPN or IP whitelisting

---

## 📚 Next Steps

1. **Read the full README**: `twilio-message/README.md`
2. **Customize AI prompts** for your business
3. **Add monitoring** (Sentry, LogRocket, etc.)
4. **Implement Redis** for session storage in production
5. **Add analytics** to track conversation metrics
6. **Enhance handover logic** for human escalation

---

## 🆘 Still Having Issues?

1. **Check logs**: Look at console output for detailed error messages
2. **Enable debug logging**: Set `LOG_LEVEL=DEBUG` in `.env`
3. **Test components individually**:
   - Test customer API: `curl YOUR_API_URL`
   - Test OpenAI: Create a test script
   - Test Twilio webhook: Use webhook testing tool

---

## 📞 Support

- GitHub Issues: [Create an issue](your-repo-url/issues)
- Email: your-email@example.com
- Documentation: See `twilio-message/README.md`

---

**Happy bot building! 🤖💙**

