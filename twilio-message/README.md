# CareBot - AI Customer Care Automation

CareBot is an intelligent WhatsApp chatbot that integrates Twilio with OpenAI's API to provide automated customer support with human handover capabilities.

## 🏗️ Architecture

```
WhatsApp → Twilio → Node.js Backend → OpenAI API → Customer
                         ↓
              Session Management & Business Logic
```

## ✨ Features

- **AI-Powered Responses**: Uses OpenAI GPT-4 for intelligent customer interactions
- **Business Hours Management**: Automatically checks and responds based on operational hours
- **Customer Context Awareness**: Fetches customer data and order history
- **Session Management**: Maintains conversation state across messages
- **Smart Handover**: Escalates complex issues to human agents
- **Structured Logging**: Comprehensive logging for debugging and monitoring
- **Clean Architecture**: Modular design with clear separation of concerns

## 📁 Project Structure

```
twilio-message/
├── src/
│   ├── config/
│   │   └── env.js                    # Environment configuration
│   ├── controllers/
│   │   └── whatsapp.controller.js    # Main message handler
│   ├── services/
│   │   ├── business-hours.service.js # Business hours validation
│   │   ├── customer.service.js       # Customer & order APIs
│   │   ├── openai.service.js         # OpenAI integration
│   │   └── session.service.js        # Conversation memory
│   ├── routes/
│   │   └── whatsapp.routes.js        # API routes
│   ├── utils/
│   │   ├── httpClient.js             # HTTP client wrapper
│   │   └── logger.js                 # Logging utility
│   ├── app.js                        # Express app setup
│   └── index.js                      # Server entry point
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Twilio account with WhatsApp sandbox or approved number
- OpenAI API key
- API endpoints for customer and order data

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CareBot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your credentials:
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=sk-your-openai-api-key
   OPENAI_MODEL=gpt-4o

   # API Endpoints
   CHECK_USER_REGISTERATION_API_URL=https://your-api.com/check-user
   GET_USER_ORDERS_API_URL=https://your-api.com/orders
   BAZAAR_AI_ACCESS_TOKEN=your-bearer-token

   # Server Configuration
   PORT=3000
   LOG_LEVEL=INFO
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

### Twilio Configuration

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to Messaging → Settings → WhatsApp Sandbox
3. Configure webhook URL: `https://your-domain.com/api/whatsapp`
4. Set HTTP method to POST
5. Save configuration

## 📝 Workflow

The bot follows this workflow for each incoming message:

1. **Receive Message** - Twilio webhook receives WhatsApp message
2. **Session Management** - Get or create conversation session
3. **Business Hours Check** - Validate if within operational hours
   - If closed → Send default message and end
4. **Customer Validation** - Check if customer is registered
5. **Fetch Context** - Get customer orders and profile data
6. **AI Processing** - Send message to OpenAI with context
7. **Response Handling** - Based on AI status:
   - **Resolved**: Send AI response and continue
   - **Handover**: Create support ticket and notify customer
   - **Abandon**: Send final message and end conversation

## 🛠️ Services Overview

### OpenAI Service (`openai.service.js`)
- Integrates with OpenAI Chat API
- Builds dynamic system context with customer data
- Analyzes response to determine conversation status
- Handles ticket creation for human handover

### Session Service (`session.service.js`)
- Maintains conversation state in memory (upgrade to Redis for production)
- Tracks message history and context
- Auto-expires sessions after 30 minutes of inactivity
- Provides session statistics

### Business Hours Service (`business-hours.service.js`)
- Validates current time against business hours
- Supports timezone-aware checks (Asia/Karachi by default)
- Returns friendly messages about availability
- Configurable hours per day of week

### Customer Service (`customer.service.js`)
- Fetches customer registration status
- Retrieves recent order history
- Integrates with external APIs

## 🔧 Configuration

### Business Hours

Edit `src/services/business-hours.service.js`:

```javascript
const BUSINESS_HOURS = {
  timezone: "Asia/Karachi",
  hours: {
    monday: { open: "09:00", close: "22:00" },
    tuesday: { open: "09:00", close: "22:00" },
    // ... customize as needed
  },
};
```

### AI System Prompt

The AI context is built dynamically in `openai.service.js` → `buildSystemContext()`. Customize the prompt to match your business needs.

### Session Timeout

Default: 30 minutes. Adjust in `session.service.js`:

```javascript
const SESSION_TIMEOUT = 30 * 60 * 1000; // milliseconds
```

## 📊 Logging

The bot uses structured logging with different levels:

- `DEBUG`: Detailed debugging information
- `INFO`: General informational messages
- `WARN`: Warning messages
- `ERROR`: Error messages

Set log level in `.env`:
```env
LOG_LEVEL=DEBUG  # DEBUG, INFO, WARN, or ERROR
```

## 🧪 Testing

Test the webhook locally using ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Start your server
npm run dev

# In another terminal, expose local server
ngrok http 3000

# Use the ngrok URL in Twilio webhook configuration
```

## 📦 Production Deployment

### Recommendations

1. **Session Storage**: Replace in-memory sessions with Redis
   ```javascript
   import Redis from 'ioredis';
   const redis = new Redis(process.env.REDIS_URL);
   ```

2. **Error Tracking**: Integrate Sentry or similar
   ```javascript
   import * as Sentry from '@sentry/node';
   ```

3. **Rate Limiting**: Add rate limiting to prevent abuse
   ```javascript
   import rateLimit from 'express-rate-limit';
   ```

4. **Environment**: Set `NODE_ENV=production`

5. **Monitoring**: Use PM2 for process management
   ```bash
   npm install -g pm2
   pm2 start src/index.js --name carebot
   ```

## 🔐 Security Considerations

- Store all credentials in environment variables
- Use HTTPS for production webhooks
- Validate Twilio webhook signatures (optional enhancement)
- Implement rate limiting
- Sanitize user inputs before passing to AI
- Monitor API usage and costs

## 🐛 Troubleshooting

### Issue: "Missing required environment variables"
**Solution**: Ensure all required vars are set in `.env` file

### Issue: "AI processing failed"
**Solution**: Verify OpenAI API key is valid and has credits

### Issue: "Customer check failed"
**Solution**: Verify external API endpoints are accessible and credentials are correct

### Issue: Messages not received
**Solution**: 
- Check Twilio webhook configuration
- Verify server is publicly accessible
- Check server logs for errors

## 📈 Monitoring & Analytics

Key metrics to monitor:

- Message volume per hour/day
- AI response time
- Handover rate
- Session duration
- API error rates
- Token usage (OpenAI costs)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch
2. Follow existing code style
3. Add appropriate logging
4. Test thoroughly
5. Submit a pull request

## 📄 License

[Your License Here]

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Email: [your-email]
- Slack: [your-slack-channel]

---

Built with ❤️ using Node.js, Express, OpenAI, and Twilio

