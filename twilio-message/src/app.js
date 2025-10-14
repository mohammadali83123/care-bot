import express from "express";
import whatsappRoutes from "./routes/whatsapp.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api", whatsappRoutes);

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;