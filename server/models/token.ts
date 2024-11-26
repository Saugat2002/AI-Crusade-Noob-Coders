import { Schema, model } from "mongoose";

// Schema
const tokenSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "user",
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Model
const Token = model("token", tokenSchema);

export default Token;
