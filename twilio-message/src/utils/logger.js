/**
 * Logging Utility
 * Provides structured logging for better debugging and monitoring
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const CURRENT_LOG_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || "INFO"];

/**
 * Format timestamp
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Log with specific level
 */
function log(level, emoji, message, data = null) {
  if (LOG_LEVELS[level] < CURRENT_LOG_LEVEL) return;

  const timestamp = getTimestamp();
  const logMessage = `[${timestamp}] ${emoji} ${level}: ${message}`;

  console.log(logMessage);
  
  if (data) {
    console.log("   Data:", JSON.stringify(data, null, 2));
  }
}

/**
 * Public logging methods
 */
export const logger = {
  debug: (message, data) => log("DEBUG", "🔍", message, data),
  info: (message, data) => log("INFO", "ℹ️", message, data),
  warn: (message, data) => log("WARN", "⚠️", message, data),
  error: (message, data) => log("ERROR", "❌", message, data),
  success: (message, data) => log("INFO", "✅", message, data),

  // Special purpose loggers
  incoming: (from, message) => {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📩 INCOMING MESSAGE [${getTimestamp()}]`);
    console.log(`   From: ${from}`);
    console.log(`   Message: ${message}`);
    console.log(`${"=".repeat(60)}\n`);
  },

  outgoing: (to, message) => {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📤 OUTGOING MESSAGE [${getTimestamp()}]`);
    console.log(`   To: ${to}`);
    console.log(`   Message: ${message}`);
    console.log(`${"=".repeat(60)}\n`);
  },

  workflow: (step, status, details) => {
    const statusEmoji = status === "success" ? "✅" : status === "failed" ? "❌" : "⏳";
    console.log(`${statusEmoji} [WORKFLOW] ${step}${details ? `: ${details}` : ""}`);
  },
};

export default logger;

