import Task from "../models/Task.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const createTask = catchAsync(async (req, res, next) => {
  const { title, description, completed } = req.body;

  if (!title) {
    return next(new AppError("Task title is required", 400));
  }

  const task = await Task.create({
    title,
    description,
    completed,
    owner: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: { task },
  });
});

export const getMyTasks = catchAsync(async (req, res) => {
  // Users only receive tasks that belong to their own account.
  const tasks = await Task.find({ owner: req.user._id }).sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: { tasks },
  });
});

export const deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!task) {
    return next(new AppError("Task not found or you do not own it", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
