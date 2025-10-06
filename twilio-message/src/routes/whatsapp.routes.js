import express from "express";
import { handleIncomingMessage } from "../controllers/whatsapp.controller.js";

const router = express.Router();

router.post("/whatsapp", handleIncomingMessage);

export default router;