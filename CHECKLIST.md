# ✅ CareBot Startup Checklist

Use this checklist to ensure your CareBot is properly configured and ready to run.

---

## 📋 Pre-Flight Checklist

### 1. Environment Setup

- [ ] Node.js installed (v16 or higher)
  ```bash
  node --version  # Should show v16+
  ```

- [ ] Dependencies installed
  ```bash
  cd CareBot
  npm install
  ```

- [ ] `.env` file created
  ```bash
  cp twilio-message/.env.example twilio-message/.env
  ```

### 2. Configuration

- [ ] **OpenAI API Key** added to `.env`
  ```env
  OPENAI_API_KEY=sk-proj-your-actual-key-here
  ```
  Get from: https://platform.openai.com/api-keys

- [ ] **Customer API URL** configured
  ```env
  CHECK_USER_REGISTERATION_API_URL=https://your-api.com/check-user
  ```

- [ ] **Orders API URL** configured
  ```env
  GET_USER_ORDERS_API_URL=https://your-api.com/orders
  ```

- [ ] **Access Token** added
  ```env
  BAZAAR_AI_ACCESS_TOKEN=your-bearer-token
  ```

- [ ] **Business Hours** customized (optional)
  - File: `twilio-message/src/services/business-hours.service.js`
  - Set your timezone
  - Set your operating hours

### 3. External Services

- [ ] Twilio account active
- [ ] WhatsApp sandbox or approved number set up
- [ ] Customer API accessible (test with curl)
- [ ] OpenAI account has credits

---

## 🚀 Startup Sequence

### Step 1: Start Server

```bash
cd CareBot
npm run dev
```

**Expected Output**:
```
🚀 Server running on port 3000
```

**If you see errors**:
- "Missing required environment variables" → Check your `.env` file
- Port already in use → Change `PORT` in `.env` or kill existing process

---

### Step 2: Test Health Endpoint

```bash
curl http://localhost:3000/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-14T10:30:00.000Z",
  "uptime": 5.123
}
```

✅ If you get this, your server is running correctly!

---

### Step 3: Test Webhook Locally

```bash
cd twilio-message
./test-webhook.sh "Hello, I need help"
```

**Expected Output** (in server terminal):
```
============================================================
📩 INCOMING MESSAGE
   From: whatsapp:+923001234567
   Message: Hello, I need help
============================================================

⏳ [WORKFLOW] Session Management: processing
✅ [WORKFLOW] Business Hours Check: success
⏳ [WORKFLOW] Customer Validation: processing
...
```

**Expected Response** (in curl output):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>AI generated response here...</Message>
</Response>
```

✅ If you see XML response with AI message, it's working!

---

### Step 4: Expose Server (for Twilio)

#### Option A: Using ngrok (for testing)

```bash
# In a new terminal
npx ngrok http 3000
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

#### Option B: Deploy to production
- Heroku: `git push heroku main`
- Railway: Connect GitHub repo
- Render: Connect GitHub repo

---

### Step 5: Configure Twilio Webhook

1. Go to https://console.twilio.com/
2. Navigate to: **Messaging → Settings → WhatsApp Sandbox**
3. **When a message comes in**: `https://your-url.com/api/whatsapp`
4. Method: **POST**
5. Click **Save**

---

### Step 6: Test End-to-End

1. **Join WhatsApp Sandbox**
   - Send join code to Twilio sandbox number

2. **Send Test Message**
   - Type: "Hello"
   - Wait for response

3. **Check Server Logs**
   - Should see incoming message
   - Should see workflow steps
   - Should see outgoing message

4. **Verify Response**
   - Should receive AI-generated message in WhatsApp

✅ **Success!** Your bot is fully operational!

---

## 🔍 Troubleshooting Checklist

### Issue: Server won't start

**Check**:
- [ ] `.env` file exists in `/Users/Ali/Documents/CareBot/twilio-message/`
- [ ] All required env vars are set (run server, it will tell you what's missing)
- [ ] Port 3000 is available (`lsof -i :3000` to check)
- [ ] No syntax errors in code

**Fix**:
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Or use different port
echo "PORT=3001" >> twilio-message/.env
```

---

### Issue: "AI processing failed"

**Check**:
- [ ] OpenAI API key is correct
- [ ] OpenAI account has credits
- [ ] No network/firewall issues
- [ ] API key has proper permissions

**Test API Key**:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Fix**:
- Generate new API key at https://platform.openai.com/api-keys
- Add credits at https://platform.openai.com/account/billing
- Update `.env` with new key

---

### Issue: "Customer check failed"

**Check**:
- [ ] Customer API URL is correct
- [ ] Bearer token is valid
- [ ] API is accessible from your server
- [ ] Phone number format is correct

**Test API**:
```bash
curl -X GET "YOUR_API_URL/03001234567" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Fix**:
- Verify URL in `.env`
- Check API documentation for correct endpoint
- Ensure token hasn't expired
- Check if API requires VPN/IP whitelisting

---

### Issue: No response in WhatsApp

**Check**:
- [ ] Webhook URL is correct in Twilio
- [ ] Server is publicly accessible (not just localhost)
- [ ] HTTPS is used (not HTTP)
- [ ] Webhook is set to POST method
- [ ] No errors in server logs

**Debug**:
1. Check Twilio webhook logs in console
2. Enable debug logging: `LOG_LEVEL=DEBUG` in `.env`
3. Test locally with curl first
4. Verify ngrok is still running (URLs change on restart)

**Fix**:
- Update Twilio webhook with current ngrok URL
- Ensure server is running
- Check firewall/security group settings

---

### Issue: "Outside business hours" always shown

**Check**:
- [ ] Timezone is correct in `business-hours.service.js`
- [ ] Current time is within defined hours
- [ ] Day of week has hours defined

**Debug**:
```javascript
// Add to business-hours.service.js
console.log('Current time:', dayjs().tz(BUSINESS_HOURS.timezone).format());
```

**Fix**:
- Update timezone to match your location
- Adjust hours to include current time
- Check if day is correctly spelled (lowercase)

---

## 📊 Verification Matrix

| Component | Check | Status |
|-----------|-------|--------|
| Node.js | `node --version` | |
| Dependencies | `npm list openai` | |
| Environment | `.env` file exists | |
| OpenAI Key | First 7 chars: sk-proj | |
| Server | `curl localhost:3000/health` | |
| Webhook | `./test-webhook.sh` responds | |
| Business Hours | Within defined hours | |
| Customer API | `curl` test succeeds | |
| Twilio | Webhook configured | |
| End-to-End | WhatsApp message received | |

---

## 🎯 Success Criteria

Your CareBot is fully operational when:

✅ Server starts without errors  
✅ Health endpoint returns 200 OK  
✅ Local webhook test returns XML response  
✅ Server logs show complete workflow  
✅ WhatsApp message receives AI response  
✅ Logs show "OUTGOING MESSAGE" with AI reply  

---

## 📞 Need Help?

If you're stuck:

1. **Check Logs**: Look for error messages in terminal
2. **Enable Debug**: Set `LOG_LEVEL=DEBUG` in `.env`
3. **Test Components**: Test each service independently
4. **Review Docs**: Check `SETUP.md` and `README.md`
5. **Check Environment**: Verify all `.env` variables

---

## 🎉 All Done?

Once everything is checked:

1. ✅ Mark all items complete
2. ✅ Save this checklist for future reference
3. ✅ Start customizing your bot!
4. ✅ Read `IMPLEMENTATION_SUMMARY.md` for next steps

---

**Last Updated**: 2025-10-14  
**CareBot Version**: 1.0.0

