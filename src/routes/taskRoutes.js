import express from "express";
import * as taskController from "../controllers/taskController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Every task route below requires a valid logged-in user.
router.use(verifyToken);

router
  .route("/")
  .post(taskController.createTask)
  .get(taskController.getMyTasks);

router.delete("/:id", taskController.deleteTask);

export default router;
