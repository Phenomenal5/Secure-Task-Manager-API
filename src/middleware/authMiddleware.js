import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

const getCookieToken = (req) => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((result, cookie) => {
    const [key, value] = cookie.trim().split("=");
    result[key] = value;
    return result;
  }, {});

  return cookies.jwt;
};

export const verifyToken = catchAsync(async (req, res, next) => {
  let token = getCookieToken(req);

  // Bearer tokens are useful when testing with Postman.
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Please log in to access this route", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("The user for this token no longer exists", 401));
  }

  req.user = currentUser;
  next();
});
