import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { default: app } = await import("./src/app.js");
const PORT = process.env.PORT || 5000;

// Keep the database connection in one place so server startup is easy to read.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
