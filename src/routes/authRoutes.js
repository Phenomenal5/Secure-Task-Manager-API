import express from "express";
import * as authController from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/signup", authLimiter, authController.signup);
router.post("/login", authLimiter, authController.login);
router.post("/logout", authController.logout);

router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallback);

export default router;
