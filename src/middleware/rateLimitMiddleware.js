import rateLimit from "express-rate-limit";

// Basic login/signup limiter to slow down brute-force attempts.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many auth attempts. Please try again later.",
  },
});
