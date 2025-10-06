import axios from "axios";
import { CONFIG } from "../config/env.js";

export const httpClient = axios.create({
  timeout: 5000,
  headers: { "Content-Type": "application/json", "Authorization": `Bearer ${CONFIG.BAZAAR_AI_ACCESS_TOKEN}` },
});