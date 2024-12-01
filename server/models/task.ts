import { Schema, model } from "mongoose";

// Schema
const taskSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "user",
    },
    task: {
      type: String,
      required: true,
    },
    time: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
        type: String,
        default: "Medium",
    },
    category: {
        type: String,
    }

  },
  { timestamps: true }
);

// Model
const Task = model("task", taskSchema);

export default Task;
