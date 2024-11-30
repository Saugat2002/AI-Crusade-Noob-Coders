import { Schema, model } from "mongoose";

// Schema
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    guardiansEmail: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Model
const User = model("user", userSchema);

export default User;
