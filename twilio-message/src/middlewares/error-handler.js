/**
 * Global Error Handler Middleware
 * Catches unhandled errors and sends appropriate responses
 */

import { logger } from "../utils/logger.js";

export function errorHandler(err, req, res, next) {
  logger.error("Unhandled error", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === "production"
    ? "Internal server error"
    : err.message;

  res.status(err.status || 500).json({
    error: {
      message,
      status: err.status || 500,
    },
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      message: "Route not found",
      status: 404,
      path: req.path,
    },
  });
}

