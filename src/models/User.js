import crypto from "crypto";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    googleId: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash passwords before saving. Google-only users may not have a password.
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(this.password, salt, 64).toString("hex");

  this.password = `${salt}:${hash}`;
  next();
});

userSchema.methods.checkPassword = function (plainPassword) {
  const [salt, storedHash] = this.password.split(":");
  const hash = crypto.scryptSync(plainPassword, salt, 64).toString("hex");

  return crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(hash));
};

export default mongoose.model("User", userSchema);
