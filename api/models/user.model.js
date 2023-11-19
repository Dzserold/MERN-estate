import mongoose from "mongoose";

// User sablon for db
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
  },
  {
    timestamps: true, //Record time two information: time of creating user and time of update
  }
);

const User = mongoose.model("User", userSchema);

export default User;
