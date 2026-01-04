import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Todo text is required"],
      trim: true,
      minlength: [2, "Todo must be at least 2 characters"],
      maxlength: [50, "Todo cannot exceed 50 characters"],
      match: [/^[A-Za-z\s]+$/, "Todo must contain only alphabets and spaces"],
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    // 🔐 user-wise todos
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Todo", todoSchema);
