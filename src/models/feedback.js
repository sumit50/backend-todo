// models/feedback.js
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: false, // Make optional for non-logged in users
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // REMOVE unique: true
  },
  message: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false,
    default: null,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Feedback", feedbackSchema);
