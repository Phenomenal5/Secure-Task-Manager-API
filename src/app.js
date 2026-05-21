import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import globalErrorHandler from "./middleware/errorMiddleware.js";
import AppError from "./utils/AppError.js";
import "./config/passport.js";
import connectDB from "./config/db.js";

const app = express();

// Helmet sets safer HTTP headers by default.
app.use(helmet());
app.use(express.json());

// Connect DB
connectDB();

// These middlewares remove common NoSQL injection and XSS payloads from input.
app.use(mongoSanitize());
app.use(xss());

// Passport is used for Google OAuth.
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Secure Task Manager API is running",
  });
});

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Any route that reaches here does not exist.
app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} was not found`, 404));
});

app.use(globalErrorHandler);

export default app;
