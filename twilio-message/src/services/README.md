# Services Layer Documentation

This directory contains all business logic services for CareBot.

## 📋 Services Overview

### 1. OpenAI Service (`openai.service.js`)
**Purpose**: Integrate with OpenAI API for intelligent responses

**Key Functions**:
- `processWithAI(params)` - Send customer message to AI with context
- `buildSystemContext(context)` - Build dynamic system prompt
- `analyzeResponseStatus(message)` - Determine conversation status
- `createChatDropTicket(params)` - Create handover ticket

**Example Usage**:
```javascript
import { processWithAI } from './openai.service.js';

const response = await processWithAI({
  conversationId: 'conv_123',
  customerMessage: 'Where is my order?',
  context: {
    phoneNumber: 'whatsapp:+923001234567',
    customer: { exists: true, customerId: 'C123' },
    orders: [{ orderId: 'ORD-001', status: 'shipped' }],
    businessHours: true
  }
});

// response = {
//   message: "Your order ORD-001 is currently shipped...",
//   status: "resolved",
//   conversationId: "conv_123",
//   tokens: 245
// }
```

---

### 2. Session Service (`session.service.js`)
**Purpose**: Manage conversation state and memory

**Key Functions**:
- `getSession(phoneNumber)` - Get or create session
- `updateSession(phoneNumber, data)` - Update session data
- `clearSession(phoneNumber)` - Delete session
- `getSessionStats()` - Get active session count
- `cleanupExpiredSessions()` - Remove old sessions

**Example Usage**:
```javascript
import { getSession, updateSession } from './session.service.js';

// Get or create session
const session = getSession('whatsapp:+923001234567');

// Update with new message
updateSession('whatsapp:+923001234567', {
  message: 'Hello',
  role: 'user',
  context: { customer: {...} }
});

// Session structure:
// {
//   conversationId: "conv_1697123456_xyz",
//   phoneNumber: "whatsapp:+923001234567",
//   createdAt: 1697123456000,
//   lastActivity: 1697123456000,
//   messageCount: 1,
//   context: { customer: {...} },
//   history: [
//     { role: "user", content: "Hello", timestamp: 1697123456000 }
//   ]
// }
```

---

### 3. Business Hours Service (`business-hours.service.js`)
**Purpose**: Validate if current time is within business hours

**Key Functions**:
- `isBusinessHours()` - Check if currently open
- `getBusinessHoursMessage()` - Get friendly message
- `shouldSendDefaultMessage()` - Should send auto-reply
- `getNextOpeningTime()` - When will we open next

**Example Usage**:
```javascript
import { isBusinessHours, getBusinessHoursMessage } from './business-hours.service.js';

const status = isBusinessHours();
// {
//   isOpen: true,
//   currentTime: "14:30",
//   dayName: "monday",
//   openTime: "09:00",
//   closeTime: "22:00",
//   timezone: "Asia/Karachi"
// }

if (!status.isOpen) {
  const message = getBusinessHoursMessage();
  // "We're currently closed. Our hours today (monday) are..."
}
```

**Configuration**:
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

---

### 4. Customer Service (`customer.service.js`)
**Purpose**: Interact with external customer and order APIs

**Key Functions**:
- `checkCustomerExists(phoneNumber)` - Check if registered
- `getUserOrders(phoneNumber)` - Fetch recent orders

**Example Usage**:
```javascript
import { checkCustomerExists, getUserOrders } from './customer.service.js';

const customer = await checkCustomerExists('whatsapp:+923001234567');
// { exists: true, customerId: "C123", ... }

const orders = await getUserOrders('whatsapp:+923001234567');
// [
//   { orderId: "ORD-001", status: "shipped", ... },
//   { orderId: "ORD-002", status: "delivered", ... }
// ]
```

---

## 🔄 Service Interaction Flow

```
Controller receives request
        ↓
Get Session (session.service)
        ↓
Check Business Hours (business-hours.service)
        ↓
Check Customer (customer.service)
        ↓
Get Orders (customer.service)
        ↓
Process with AI (openai.service)
        ↓
Update Session (session.service)
        ↓
Return response to Controller
```

---

## 🛠️ Adding a New Service

1. **Create file**: `src/services/my-service.service.js`

2. **Structure**:
```javascript
/**
 * My Service
 * Description of what this service does
 */

import { logger } from "../utils/logger.js";
import { CONFIG } from "../config/env.js";

/**
 * Main function
 * @param {Object} params - Parameters
 * @returns {Promise<Object>} Result
 */
export async function myFunction(params) {
  try {
    logger.info("Doing something...");
    // Your logic here
    return result;
  } catch (error) {
    logger.error("My Service error", { error: error.message });
    throw new Error("Operation failed");
  }
}
```

3. **Import in controller**:
```javascript
import { myFunction } from "../services/my-service.service.js";
```

4. **Use in workflow**:
```javascript
const result = await myFunction({ ... });
```

---

## 🧪 Testing Services

### Manual Testing
```javascript
// test.js
import { processWithAI } from './services/openai.service.js';

const result = await processWithAI({
  conversationId: 'test_123',
  customerMessage: 'Hello',
  context: { /* ... */ }
});

console.log(result);
```

### Unit Testing (Future)
```javascript
// openai.service.test.js
import { analyzeResponseStatus } from './openai.service.js';

test('detects handover keyword', () => {
  const status = analyzeResponseStatus('Let me transfer you to an agent');
  expect(status).toBe('handover');
});
```

---

## 🔐 Best Practices

### ✅ Do's
- Use `logger` for all logging
- Use `CONFIG` for environment variables
- Handle errors gracefully with try/catch
- Return consistent data structures
- Add JSDoc comments
- Keep functions focused and small

### ❌ Don'ts
- Don't use `console.log` (use `logger`)
- Don't hardcode values (use `CONFIG`)
- Don't let errors bubble up uncaught
- Don't mix responsibilities
- Don't return inconsistent types

---

## 📚 Further Reading

- Controller documentation: `../controllers/README.md`
- Utilities documentation: `../utils/README.md`
- Architecture: `/ARCHITECTURE.md`

