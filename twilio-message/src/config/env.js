import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  // Server Configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "INFO",

  // API Access Tokens
  BAZAAR_AI_ACCESS_TOKEN: process.env.BAZAAR_AI_ACCESS_TOKEN,

  // External API Endpoints
  CHECK_USER_REGISTERATION_API_URL: process.env.CHECK_USER_REGISTERATION_API_URL,
  GET_USER_ORDERS_API_URL: process.env.GET_USER_ORDERS_API_URL,
  TICKETING_API_URL: process.env.TICKETING_API_URL,

  // OpenAI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o",

  // Twilio Configuration (optional, if needed for sending messages)
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER,
};

// Validate required environment variables
const requiredVars = [
  "OPENAI_API_KEY",
  "CHECK_USER_REGISTERATION_API_URL",
  "GET_USER_ORDERS_API_URL",
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error("\nPlease check your .env file.");
  process.exit(1);
}