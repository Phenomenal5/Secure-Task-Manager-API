import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      validate: [validator.isEmail, "Invalid email address"]
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
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.gensalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// compare password
userSchema.methods.checkPassword = async function (plainPassword) {

  return await bcrypt.compare(plainPassword, this.password);
};

export default mongoose.model("User", userSchema);
