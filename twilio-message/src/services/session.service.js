/**
 * Session Management Service
 * Handles conversation state and memory across messages
 * 
 * In production, this should use Redis or a database
 * For now, using in-memory storage
 */

// In-memory session store (replace with Redis in production)
const sessions = new Map();

// Session timeout: 30 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000;

/**
 * Get or create a session for a phone number
 * @param {string} phoneNumber - Customer's phone number
 * @returns {Object} Session data
 */
export function getSession(phoneNumber) {
  if (!sessions.has(phoneNumber)) {
    const newSession = createNewSession(phoneNumber);
    sessions.set(phoneNumber, newSession);
    return newSession;
  }

  const session = sessions.get(phoneNumber);
  
  // Check if session has expired
  if (Date.now() - session.lastActivity > SESSION_TIMEOUT) {
    console.log(`⏰ Session expired for ${phoneNumber}, creating new one`);
    const newSession = createNewSession(phoneNumber);
    sessions.set(phoneNumber, newSession);
    return newSession;
  }

  // Update last activity
  session.lastActivity = Date.now();
  return session;
}

/**
 * Create a new session
 * @param {string} phoneNumber - Customer's phone number
 * @returns {Object} New session object
 */
function createNewSession(phoneNumber) {
  return {
    conversationId: generateConversationId(),
    phoneNumber,
    createdAt: Date.now(),
    lastActivity: Date.now(),
    messageCount: 0,
    context: {},
    history: [],
  };
}

/**
 * Update session with new message and context
 * @param {string} phoneNumber - Customer's phone number
 * @param {Object} data - Data to update
 */
export function updateSession(phoneNumber, data) {
  const session = getSession(phoneNumber);
  
  if (data.message) {
    session.history.push({
      role: data.role || "user",
      content: data.message,
      timestamp: Date.now(),
    });
  }

  if (data.context) {
    session.context = { ...session.context, ...data.context };
  }

  session.messageCount++;
  session.lastActivity = Date.now();

  sessions.set(phoneNumber, session);
  return session;
}

/**
 * Clear session for a phone number
 * @param {string} phoneNumber - Customer's phone number
 */
export function clearSession(phoneNumber) {
  console.log(`🗑️ Clearing session for ${phoneNumber}`);
  sessions.delete(phoneNumber);
}

/**
 * Get session statistics
 * @returns {Object} Stats about active sessions
 */
export function getSessionStats() {
  return {
    totalSessions: sessions.size,
    activeSessions: Array.from(sessions.values()).filter(
      s => Date.now() - s.lastActivity < SESSION_TIMEOUT
    ).length,
  };
}

/**
 * Generate a unique conversation ID
 * @returns {string} Conversation ID
 */
function generateConversationId() {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Cleanup expired sessions (should be called periodically)
 */
export function cleanupExpiredSessions() {
  let cleaned = 0;
  const now = Date.now();

  for (const [phoneNumber, session] of sessions.entries()) {
    if (now - session.lastActivity > SESSION_TIMEOUT) {
      sessions.delete(phoneNumber);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired session(s)`);
  }

  return cleaned;
}

// Cleanup expired sessions every 10 minutes
setInterval(cleanupExpiredSessions, 10 * 60 * 1000);

