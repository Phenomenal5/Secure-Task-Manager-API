import passport from "passport";
import User from "../models/User.js";
import { hasGoogleCredentials } from "../config/passport.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { signToken, sendTokenCookie } from "../utils/jwt.js";

const sendAuthResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  sendTokenCookie(res, token);

  // Do not expose password hashes in API responses.
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Name, email, and password are required", 400));
  }

  const user = await User.create({ name, email, password });
  sendAuthResponse(user, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.password || !user.checkPassword(password)) {
    return next(new AppError("Incorrect email or password", 401));
  }

  sendAuthResponse(user, 200, res);
});

export const logout = (req, res) => {
  res.cookie("jwt", "logged-out", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });

  res.status(200).json({ status: "success", message: "Logged out" });
};

export const googleLogin = (req, res, next) => {
  if (!hasGoogleCredentials) {
    return next(new AppError("Google OAuth is not configured yet", 503));
  }

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
};

export const googleCallback = (req, res, next) => {
  if (!hasGoogleCredentials) {
    return next(new AppError("Google OAuth is not configured yet", 503));
  }

  passport.authenticate("google", { session: false }, (error, user) => {
    if (error) return next(error);
    if (!user) return next(new AppError("Google authentication failed", 401));

    const token = signToken(user._id);
    sendTokenCookie(res, token);

    res.status(200).json({
      status: "success",
      token,
      data: { user },
    });
  })(req, res, next);
};
