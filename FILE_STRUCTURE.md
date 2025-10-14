# 📂 CareBot Project Structure

## Complete File Tree

```
CareBot/
├── 📄 README.md                          (Project overview)
├── 📄 SETUP.md                           ✨ NEW - Quick start guide
├── 📄 ARCHITECTURE.md                    ✨ NEW - System architecture
├── 📄 IMPLEMENTATION_SUMMARY.md          ✨ NEW - What was built
├── 📄 package.json                       🔄 MODIFIED - Added dependencies
├── 📄 package-lock.json
│
├── 🤖 agent-care-bot/                    (Python AI Agent - existing)
│   ├── agent/
│   │   ├── __init__.py
│   │   ├── graph_definition.py
│   │   ├── reasoning_agent.py
│   │   ├── guardrails/
│   │   │   └── safety_rules.py
│   │   ├── handover/
│   │   │   └── handover_rules.py
│   │   ├── memory/
│   │   │   └── conversation_memory.py
│   │   ├── personality/
│   │   │   └── customer_care_profile.py
│   │   ├── rag/
│   │   │   ├── loader.py
│   │   │   ├── retriever.py
│   │   │   └── vector_store.py
│   │   └── tools/
│   │       ├── order_api_tool.py
│   │       └── user_api_tool.py
│   ├── config/
│   │   └── settings.py
│   ├── main.py
│   ├── requirements.txt
│   └── venv/
│
└── 💬 twilio-message/                    (Node.js Backend - main focus)
    ├── 📄 README.md                      ✨ NEW - Complete documentation
    ├── 📄 .env.example                   ✨ NEW - Environment template
    ├── 📄 test-webhook.sh                ✨ NEW - Testing script
    │
    └── src/
        ├── 📄 index.js                   (Server entry point)
        ├── 📄 app.js                     🔄 MODIFIED - Added health check & error handlers
        │
        ├── ⚙️ config/
        │   └── env.js                    🔄 MODIFIED - Added OpenAI config
        │
        ├── 🎮 controllers/
        │   └── whatsapp.controller.js    🔄 MODIFIED - Complete workflow implementation
        │
        ├── 🔧 services/
        │   ├── customer.service.js       (Existing - Customer API)
        │   ├── openai.service.js         ✨ NEW - OpenAI integration
        │   ├── session.service.js        ✨ NEW - Session management
        │   └── business-hours.service.js ✨ NEW - Business hours validation
        │
        ├── 🛡️ middlewares/
        │   └── error-handler.js          ✨ NEW - Error handling
        │
        ├── 🛣️ routes/
        │   └── whatsapp.routes.js        (Existing - Webhook route)
        │
        └── 🔨 utils/
            ├── httpClient.js             (Existing - HTTP client)
            └── logger.js                 ✨ NEW - Structured logging
```

---

## 📊 File Statistics

### ✨ New Files Created: 10
- `SETUP.md`
- `ARCHITECTURE.md`
- `IMPLEMENTATION_SUMMARY.md`
- `twilio-message/README.md`
- `twilio-message/.env.example`
- `twilio-message/test-webhook.sh`
- `twilio-message/src/services/openai.service.js`
- `twilio-message/src/services/session.service.js`
- `twilio-message/src/services/business-hours.service.js`
- `twilio-message/src/utils/logger.js`
- `twilio-message/src/middlewares/error-handler.js`

### 🔄 Modified Files: 4
- `package.json` (added dependencies)
- `twilio-message/src/config/env.js` (OpenAI config)
- `twilio-message/src/controllers/whatsapp.controller.js` (complete workflow)
- `twilio-message/src/app.js` (health check, error handlers)

### 📝 Lines of Code Added: ~1,200+

---

## 🗺️ Code Map by Feature

### 🤖 OpenAI Integration
```
src/services/openai.service.js
    ├─ processWithAI()                 - Main AI processing
    ├─ buildSystemContext()            - Dynamic prompt building
    ├─ analyzeResponseStatus()         - Status detection
    └─ createChatDropTicket()          - Human handover

src/config/env.js
    └─ OPENAI_API_KEY, OPENAI_MODEL    - Configuration
```

### 💾 Session Management
```
src/services/session.service.js
    ├─ getSession()                    - Get/create session
    ├─ updateSession()                 - Update state
    ├─ clearSession()                  - Clean up
    ├─ getSessionStats()               - Statistics
    └─ cleanupExpiredSessions()        - Auto cleanup
```

### 🕐 Business Hours
```
src/services/business-hours.service.js
    ├─ isBusinessHours()               - Check if open
    ├─ getBusinessHoursMessage()       - Friendly message
    ├─ shouldSendDefaultMessage()      - Routing logic
    └─ getNextOpeningTime()            - Next availability
```

### 🎯 Main Workflow
```
src/controllers/whatsapp.controller.js
    └─ handleIncomingMessage()
        ├─ 1. Session management
        ├─ 2. Business hours check
        ├─ 3. Customer validation
        ├─ 4. Order fetching
        ├─ 5. AI processing
        └─ 6. Status-based routing
            ├─ resolved  → Send & end
            ├─ handover  → Create ticket & notify
            └─ abandon   → Send final message
```

### 📊 Logging & Monitoring
```
src/utils/logger.js
    ├─ logger.debug()                  - Debug messages
    ├─ logger.info()                   - Info messages
    ├─ logger.warn()                   - Warnings
    ├─ logger.error()                  - Errors
    ├─ logger.incoming()               - Message received
    ├─ logger.outgoing()               - Message sent
    └─ logger.workflow()               - Workflow steps
```

---

## 🔗 Import/Dependency Graph

```
whatsapp.controller.js
├── imports: openai.service.js
├── imports: session.service.js
├── imports: business-hours.service.js
├── imports: customer.service.js
└── imports: logger.js

openai.service.js
├── imports: openai (npm package)
└── imports: env.js

session.service.js
└── (no external dependencies)

business-hours.service.js
└── imports: dayjs

customer.service.js
├── imports: httpClient.js
└── imports: env.js

logger.js
└── (no external dependencies)

error-handler.js
└── imports: logger.js

app.js
├── imports: whatsapp.routes.js
└── imports: error-handler.js
```

---

## 📦 NPM Dependencies

### Production Dependencies
```json
{
  "express": "^5.1.0",
  "twilio": "^5.10.2",
  "axios": "^1.12.2",
  "dotenv": "^17.2.3",
  "openai": "latest",           ✨ NEW
  "dayjs": "^1.11.18"           ✨ NEW
}
```

### Dev Dependencies
```json
{
  "nodemon": "^3.1.10"
}
```

---

## 🎯 Entry Points

### Main Application
- **Entry**: `twilio-message/src/index.js`
- **Port**: 3000 (default)
- **Routes**: `/api/whatsapp` (POST), `/health` (GET)

### Testing
- **Script**: `twilio-message/test-webhook.sh`
- **Usage**: `./test-webhook.sh "Your message"`

---

## 🔐 Configuration Files

### Environment Variables
- **Template**: `twilio-message/.env.example`
- **Actual**: `twilio-message/.env` (you create this)
- **Validation**: Automatic on startup

### Business Hours
- **File**: `src/services/business-hours.service.js`
- **Constant**: `BUSINESS_HOURS`

---

## 📚 Documentation Files

### For Developers
- **`ARCHITECTURE.md`** - System design, data flows, scaling
- **`twilio-message/README.md`** - Complete technical docs
- **`IMPLEMENTATION_SUMMARY.md`** - What was built

### For Getting Started
- **`SETUP.md`** - Quick start (5 minutes)
- **`twilio-message/.env.example`** - Configuration template

### For Reference
- **`FILE_STRUCTURE.md`** - This file!

---

## 🎨 Code Organization Principles

### ✅ Clean Architecture
- **Controllers**: HTTP handling only
- **Services**: Business logic
- **Utils**: Reusable helpers
- **Config**: Environment & settings

### ✅ Separation of Concerns
- Each service handles one responsibility
- No cross-contamination
- Easy to test independently

### ✅ Modularity
- Services are self-contained
- Easy to replace/upgrade
- Can be extracted to microservices

### ✅ Scalability Ready
- Stateless design (except sessions)
- Easy to horizontalize
- Database/Redis ready

---

## 🚀 How to Navigate This Project

### Want to understand the workflow?
→ Read `src/controllers/whatsapp.controller.js`

### Want to customize AI responses?
→ Edit `src/services/openai.service.js`

### Want to change business hours?
→ Edit `src/services/business-hours.service.js`

### Want to add logging?
→ Use `src/utils/logger.js`

### Want to understand architecture?
→ Read `ARCHITECTURE.md`

### Want to get started quickly?
→ Follow `SETUP.md`

---

## 📈 Growth Path

### Current: MVP (Monolith)
All services in one Node.js app

### Next: Microservices
```
API Gateway
├── Session Service (Redis)
├── AI Service (OpenAI)
├── Customer Service
└── Notification Service
```

### Future: Event-Driven
```
Message Queue (RabbitMQ)
├── Webhook Consumer
├── AI Processor
├── Response Publisher
└── Analytics Collector
```

---

**Last Updated**: 2025-10-14  
**Total Files**: 15+ files  
**Total Lines**: 1,200+ lines  
**Ready for**: Development → Testing → Production

