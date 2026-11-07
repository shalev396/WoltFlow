import { rateLimit } from "express-rate-limit";
import { type AuthenticatedRequest } from "../types/express.js";

// Counters live in memory, so each limit applies per warm Lambda container.
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const rateLimitExceededResponse = {
  success: false,
  message: "Too many requests, please try again later.",
};

/**
 * Rate limiter for the public auth routes, keyed by client IP.
 * serverless-http sets req.ip from API Gateway's sourceIp (Express "trust
 * proxy" has no effect on it), so forwarding headers are never used for the
 * key and their misconfiguration checks are turned off.
 */
export const authRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitExceededResponse,
  validate: { xForwardedForHeader: false, forwardedHeader: false },
});

/**
 * Rate limiter for authenticated user routes, keyed by user ID.
 * expressAuth runs before the user routes, so req.user is always set.
 */
export const userRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitExceededResponse,
  keyGenerator: (req) => (req as AuthenticatedRequest).user.id,
});
