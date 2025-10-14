# CareBot Architecture Documentation

## 📐 System Architecture

```
┌─────────────┐
│  Customer   │
│  (WhatsApp) │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Twilio Platform                         │
│  • WhatsApp Business API Integration                            │
│  • Message Routing & Delivery                                   │
└──────────────────────────┬──────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CareBot Node.js Backend                     │
│                                                                  │
│  ┌────────────────┐        ┌──────────────────┐                │
│  │  Controllers   │        │   Middlewares    │                │
│  │  - WhatsApp    │        │   - Error Handler│                │
│  └───────┬────────┘        └──────────────────┘                │
│          │                                                       │
│          ▼                                                       │
│  ┌──────────────────────────────────────────────────┐          │
│  │              Services Layer                       │          │
│  │                                                    │          │
│  │  ┌──────────────┐  ┌─────────────────┐          │          │
│  │  │   Session    │  │  Business Hours │          │          │
│  │  │  Management  │  │    Validator    │          │          │
│  │  └──────────────┘  └─────────────────┘          │          │
│  │                                                    │          │
│  │  ┌──────────────┐  ┌─────────────────┐          │          │
│  │  │   Customer   │  │     OpenAI      │          │          │
│  │  │   Service    │  │    Service      │          │          │
│  │  └──────────────┘  └─────────────────┘          │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │              Utilities Layer                      │          │
│  │  - Logger                                         │          │
│  │  - HTTP Client                                    │          │
│  └──────────────────────────────────────────────────┘          │
└──────────────┬──────────────┬───────────────┬──────────────────┘
               │              │               │
               ▼              ▼               ▼
      ┌────────────┐  ┌──────────┐   ┌──────────────┐
      │ OpenAI API │  │ Customer │   │  Ticketing   │
      │  (GPT-4)   │  │   API    │   │     API      │
      └────────────┘  └──────────┘   └──────────────┘
```

## 🔄 Message Flow

### Standard Flow (Happy Path)

```
1. Customer sends WhatsApp message
   ↓
2. Twilio receives message
   ↓
3. Twilio webhook → POST /api/whatsapp
   ↓
4. Controller: handleIncomingMessage()
   ↓
5. Get/Create session for customer
   ↓
6. Check business hours
   ├─ Outside hours → Send default message → END
   └─ Within hours → Continue
   ↓
7. Validate customer registration
   ↓
8. Fetch customer orders (if registered)
   ↓
9. Build context object
   ↓
10. Send to OpenAI with context
    ↓
11. Analyze AI response status
    ├─ "resolved" → Send AI reply → END
    ├─ "handover" → Create ticket → Notify customer → END
    └─ "abandon" → Send final message → END
```

### Error Flow

```
Error occurs at any step
   ↓
Try-Catch captures error
   ↓
Log error with context
   ↓
Send fallback message to customer
   ↓
Return 500 or appropriate status
```

## 🏛️ Layer Responsibilities

### 1. Controllers Layer
**Purpose**: Handle HTTP requests and responses

**Responsibilities**:
- Parse incoming Twilio webhook data
- Orchestrate service calls
- Handle response formatting (TwiML)
- Error handling and logging

**Files**:
- `controllers/whatsapp.controller.js`

### 2. Services Layer
**Purpose**: Business logic and external integrations

#### Session Service
- Maintain conversation state
- Store message history
- Track customer context
- Session lifecycle management

#### Business Hours Service
- Time zone aware validation
- Configurable hours per day
- Next opening time calculation

#### Customer Service
- Check customer registration
- Fetch order history
- External API integration

#### OpenAI Service
- AI model interaction
- Context building
- Response analysis
- Status determination

**Files**:
- `services/session.service.js`
- `services/business-hours.service.js`
- `services/customer.service.js`
- `services/openai.service.js`

### 3. Utilities Layer
**Purpose**: Reusable helper functions

**Components**:
- Logger: Structured logging
- HTTP Client: Configured axios instance

**Files**:
- `utils/logger.js`
- `utils/httpClient.js`

### 4. Configuration Layer
**Purpose**: Environment and app configuration

**Files**:
- `config/env.js`

## 📊 Data Flow Diagrams

### Session Management

```
Customer Message Arrives
        ↓
Check if session exists
        ├─ Yes → Retrieve session
        │        Update lastActivity
        │        Check if expired
        │        └─ Expired → Create new session
        │        └─ Valid → Use existing session
        └─ No → Create new session
                 Generate conversationId
                 Initialize context
        ↓
Return session object
```

### Context Building

```
Customer Data
    ├─ phoneNumber
    ├─ customer (from API)
    │  ├─ exists: boolean
    │  ├─ customerId
    │  └─ ...profile data
    ├─ orders (from API)
    │  └─ array of recent orders
    └─ businessHours: boolean
        ↓
Build AI System Prompt
    ├─ Role definition
    ├─ Customer status
    ├─ Order history
    ├─ Business context
    └─ Response guidelines
        ↓
Send to OpenAI with user message
```

### Status Determination

```
AI Response Received
        ↓
Analyze message content
        ↓
Check for keywords
    ├─ Abandon keywords?
    │  └─ Yes → return "abandon"
    ├─ Handover keywords?
    │  └─ Yes → return "handover"
    └─ Resolution keywords?
       └─ Yes → return "resolved"
        ↓
Default: "resolved"
```

## 🔐 Security Architecture

### Authentication & Authorization

```
Incoming Request
    ↓
[Optional] Twilio Signature Validation
    ↓
[Optional] Rate Limiting
    ↓
Environment Variable Validation
    ↓
Proceed to business logic
```

### Data Protection

- **Secrets**: Stored in environment variables
- **API Keys**: Never logged or exposed in responses
- **Customer Data**: Minimal retention, session-based
- **Logging**: PII is sanitized in production logs

## 🧩 Component Dependencies

```
whatsapp.controller.js
    ├── depends on →
    │   ├── session.service.js
    │   ├── business-hours.service.js
    │   ├── customer.service.js
    │   ├── openai.service.js
    │   └── logger.js
    │
session.service.js
    └── (no external dependencies)
    
business-hours.service.js
    └── depends on → dayjs
    
customer.service.js
    └── depends on →
        ├── httpClient.js
        └── env.js
        
openai.service.js
    └── depends on →
        ├── openai (SDK)
        └── env.js
        
httpClient.js
    └── depends on →
        ├── axios
        └── env.js
```

## 📦 Deployment Architecture

### Development Environment

```
Local Machine
    ├── Node.js Server (localhost:3000)
    ├── ngrok tunnel (public HTTPS URL)
    └── Twilio Webhook → ngrok → Local server
```

### Production Environment

```
Cloud Provider (Heroku/Railway/AWS)
    ├── Application Server
    │   ├── Node.js Runtime
    │   ├── Process Manager (PM2)
    │   └── Auto-scaling
    ├── Session Store
    │   └── Redis (recommended)
    ├── Logging
    │   └── CloudWatch/Datadog
    └── Monitoring
        └── Sentry/New Relic
        
External Services
    ├── Twilio (WhatsApp)
    ├── OpenAI API
    ├── Customer API
    └── Ticketing API
```

## 🔄 State Management

### Session State

```javascript
{
  conversationId: "conv_1234_abc",
  phoneNumber: "whatsapp:+923001234567",
  createdAt: 1634567890000,
  lastActivity: 1634567890000,
  messageCount: 5,
  context: {
    customer: { ... },
    orders: [ ... ]
  },
  history: [
    { role: "user", content: "...", timestamp: ... },
    { role: "assistant", content: "...", timestamp: ... }
  ]
}
```

### Session Lifecycle

1. **Creation**: When first message arrives
2. **Active**: Updated on each message (lastActivity)
3. **Expired**: After 30 minutes of inactivity
4. **Cleanup**: Automatic periodic cleanup

## 🚀 Scalability Considerations

### Current Limitations
- **In-memory sessions**: Not suitable for multiple instances
- **Synchronous processing**: One request at a time
- **No queue system**: Messages processed immediately

### Scaling Solutions

1. **Horizontal Scaling**
   - Replace in-memory sessions with Redis
   - Use sticky sessions or session affinity
   - Stateless design for all services

2. **Message Queue**
   - Add RabbitMQ/AWS SQS for async processing
   - Decouple Twilio webhook from AI processing
   - Handle high message volume

3. **Caching**
   - Cache customer data (Redis)
   - Cache AI responses for common queries
   - Reduce external API calls

4. **Database**
   - Store conversation history
   - Analytics and reporting
   - Audit trail

## 📈 Monitoring Points

### Key Metrics
- Request rate (messages/minute)
- Response time (p50, p95, p99)
- Error rate (%)
- AI response time
- External API latency
- Session count
- Token usage (OpenAI)

### Alerting Thresholds
- Error rate > 5%
- Response time > 3s
- OpenAI API failures
- External API failures
- High session count

## 🔮 Future Enhancements

1. **Multi-Channel Support**: Extend to SMS, Web Chat
2. **ML Intent Detection**: Replace keyword-based status detection
3. **A/B Testing**: Test different AI prompts
4. **Analytics Dashboard**: Real-time metrics
5. **Agent Dashboard**: Human agent interface
6. **Knowledge Base**: RAG for product information
7. **Sentiment Analysis**: Detect customer emotions
8. **Multi-Language**: i18n support

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-14  
**Maintained by**: CareBot Team

