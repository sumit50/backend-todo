import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import routes - note these are in the src directory
import todoRoutes from "./src/routes/todoRoutes.js";
import feedbackRoutes from "./src/routes/feedback.js";
import hiringRoutes from "./src/routes/hiring.js";
import adminTodoRoutes from "./src/routes/adminRoutes.js";
import loginRoutes from "./src/routes/user.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://my-todos-amber.vercel.app"],
    credentials: true,
  })
);

// routes
app.use("/user", loginRoutes);
app.use("/todo", todoRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/hiring", hiringRoutes);
app.use("/admin", adminTodoRoutes);

// database + server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Mongo connection error:", err.message);
  });
