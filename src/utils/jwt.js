import jwt from "jsonwebtoken";

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const sendTokenCookie = (res, token) => {
  res.cookie("jwt", token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie, enhancing security against XSS attacks
    secure: process.env.NODE_ENV === "production", // Sets the cookie to be sent only over HTTPS in production
    sameSite: "strict", // Prevents CSRF attacks by ensuring the cookie is only sent in requests originating from the same site
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

export { signToken, sendTokenCookie };
