# 🚀 Getting Started with CareBot

Welcome! Your AI-powered WhatsApp customer care bot is ready. Follow these 3 simple steps to get started.

---

## ⚡ Quick Start (3 Steps)

### Step 1: Install & Configure

```bash
# Navigate to project
cd CareBot

# Install dependencies
npm install

# Create environment file
cp twilio-message/.env.example twilio-message/.env

# Edit .env and add your OpenAI API key
nano twilio-message/.env
```

**Required in `.env`**:
```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
CHECK_USER_REGISTERATION_API_URL=https://your-api.com/check-user
GET_USER_ORDERS_API_URL=https://your-api.com/orders
BAZAAR_AI_ACCESS_TOKEN=your-token-here
```

---

### Step 2: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3000
```

---

### Step 3: Test It

```bash
# In a new terminal
cd twilio-message
./test-webhook.sh "Hello, I need help"
```

You should see logs showing:
- ✅ Session Management
- ✅ Business Hours Check
- ✅ Customer Validation
- ✅ AI Processing
- ✅ Response Sent

**That's it!** Your bot is working locally.

---

## 🌐 Connect to WhatsApp

### Option A: Testing with ngrok

```bash
# In a new terminal
npx ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

Then configure Twilio:
1. Go to https://console.twilio.com/
2. Messaging → Settings → WhatsApp Sandbox
3. **When a message comes in**: `https://abc123.ngrok.io/api/whatsapp`
4. Method: **POST**
5. Save

### Option B: Deploy to Production

**Heroku**:
```bash
heroku create your-carebot
git push heroku main
```

**Railway**:
1. Connect GitHub repo
2. Add environment variables
3. Deploy automatically

**Render**:
1. Connect GitHub repo
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

---

## 📚 Documentation

Here's all the documentation available:

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **GETTING_STARTED.md** | Quick start (this file) | First time setup |
| **SETUP.md** | Detailed setup guide | Need more details |
| **CHECKLIST.md** | Pre-flight checklist | Before deployment |
| **twilio-message/README.md** | Complete technical docs | Understanding features |
| **ARCHITECTURE.md** | System design | Understanding how it works |
| **IMPLEMENTATION_SUMMARY.md** | What was built | Seeing what's included |
| **FILE_STRUCTURE.md** | Project file tree | Navigating the code |

---

## 🎨 Customize Your Bot

### Change AI Personality

**File**: `twilio-message/src/services/openai.service.js`  
**Function**: `buildSystemContext()`

```javascript
let systemPrompt = `You are a [friendly/professional/casual] customer service agent...`;
```

### Change Business Hours

**File**: `twilio-message/src/services/business-hours.service.js`

```javascript
const BUSINESS_HOURS = {
  timezone: "Your/Timezone",
  hours: {
    monday: { open: "09:00", close: "17:00" },
    // ... customize each day
  },
};
```

### Change OpenAI Model

**File**: `twilio-message/.env`

```env
OPENAI_MODEL=gpt-4o-mini  # Faster and cheaper
# or
OPENAI_MODEL=gpt-4-turbo  # More capable
```

---

## 🔍 How It Works

```
Customer sends WhatsApp message
            ↓
Twilio forwards to your webhook
            ↓
CareBot receives message
            ↓
Checks business hours
            ↓
Validates customer & fetches orders
            ↓
Sends to OpenAI with context
            ↓
OpenAI generates intelligent response
            ↓
CareBot sends reply to customer
```

**Special Features**:
- 🕐 Business hours detection
- 👤 Customer recognition
- 📦 Order history awareness
- 🤝 Automatic handover to humans
- 💾 Conversation memory
- 📊 Detailed logging

---

## ⚙️ Key Components

### Services (Business Logic)
- **OpenAI Service**: AI integration
- **Session Service**: Conversation memory
- **Business Hours Service**: Time validation
- **Customer Service**: API integration

### Controllers (HTTP Handling)
- **WhatsApp Controller**: Main webhook handler

### Utils (Helpers)
- **Logger**: Structured logging
- **HTTP Client**: API calls

---

## 🐛 Common Issues

### "Missing required environment variables"
→ Make sure `.env` exists in `twilio-message/` directory with all required keys

### "AI processing failed"
→ Check your OpenAI API key and account credits

### "Customer check failed"
→ Verify your external API URLs and tokens

### No response in WhatsApp
→ Check Twilio webhook URL and ensure server is publicly accessible

---

## 📞 Testing Checklist

Before going live, verify:

- [ ] Server starts without errors
- [ ] Health endpoint responds: `curl localhost:3000/health`
- [ ] Local webhook test works: `./test-webhook.sh "test"`
- [ ] Twilio webhook is configured correctly
- [ ] WhatsApp test message receives response
- [ ] Logs show complete workflow
- [ ] Business hours logic works correctly
- [ ] Customer API returns data
- [ ] Orders API returns data
- [ ] AI responses are appropriate

---

## 🎯 Next Steps

1. **Test thoroughly** with different message types
2. **Customize AI prompts** for your business
3. **Adjust business hours** for your timezone
4. **Monitor logs** to see how customers interact
5. **Deploy to production** when ready
6. **Add monitoring** (Sentry, LogRocket, etc.)
7. **Implement Redis** for session storage (production)

---

## 💡 Pro Tips

1. **Use Debug Mode**: Set `LOG_LEVEL=DEBUG` to see detailed logs
2. **Test Locally First**: Always test with `./test-webhook.sh` before Twilio
3. **Monitor Tokens**: OpenAI charges per token, watch usage in logs
4. **Save ngrok URL**: Update Twilio webhook if ngrok restarts
5. **Check Health**: Use `/health` endpoint for monitoring
6. **Read Logs**: Logs show exactly what's happening at each step

---

## 🆘 Need Help?

1. **Check Logs**: Most issues are visible in console output
2. **Enable Debug**: `LOG_LEVEL=DEBUG` shows more details
3. **Review Docs**: All documentation is in the repo
4. **Test Components**: Test each service independently
5. **Use Checklist**: `CHECKLIST.md` has troubleshooting steps

---

## 🎉 You're Ready!

Your CareBot is:
- ✅ Fully integrated with OpenAI
- ✅ Production-ready with error handling
- ✅ Well-documented and maintainable
- ✅ Modular and easily extensible
- ✅ Following best practices

**Start chatting with your customers!** 🤖💙

---

**Quick Commands Reference**:

```bash
# Start development server
npm run dev

# Start production server
npm start

# Test webhook locally
./twilio-message/test-webhook.sh "test message"

# Check health
curl http://localhost:3000/health

# View logs with debug
LOG_LEVEL=DEBUG npm run dev

# Install dependencies
npm install

# Update dependencies
npm update
```

---

**Created**: 2025-10-14  
**Version**: 1.0.0  
**Status**: Ready for Production ✅

