import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    profileImage: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "offline"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
