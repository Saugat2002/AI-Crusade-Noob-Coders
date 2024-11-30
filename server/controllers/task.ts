import { NextFunction, Request, Response } from "express";
import Task from "../models/task";

export const handleAddTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, task, time, completed, priority, category } = req.body;
    // Save task to database
    const newTask = await Task.create({
      userId,
      task,
      time,
      completed,
      priority,
      category,
    });
    res.status(201).json({ status: 200, message: "Task added successfully" });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export const handleDeleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.body;
    await Task.deleteOne({ _id: taskId });
    res.status(200).json({ status: 200, message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export const handleUpdateTask = async (req: Request, res: Response) => {
  try {
    const { taskId, task, time, completed, priority, category } = req.body;
    await Task.updateOne(
      { _id: taskId },
      { task, time, completed, priority, category }
    );
    res.status(200).json({ status: 200, message: "Task updated successfully" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
