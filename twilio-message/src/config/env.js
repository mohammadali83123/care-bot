import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 3000,
  CHECK_USER_REGISTERATION_API_URL: process.env.CHECK_USER_REGISTERATION_API_URL,
  BAZAAR_AI_ACCESS_TOKEN: process.env.BAZAAR_AI_ACCESS_TOKEN,
};