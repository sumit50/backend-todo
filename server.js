import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import todoRoutes from "./src/routes/todoRoutes.js";
import feedbackRoutes from "./src/routes/feedback.js";
import hiringRoutes from "./src/routes/hiring.js";
import adminTodoRoutes from "./src/routes/adminRoutes.js";
import loginRoutes from "./src/routes/user.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend origin
    credentials: true,
  })
);

// use routes
app.use("/user", loginRoutes);
app.use("/todo", todoRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/hiring", hiringRoutes);
app.use("/admin", adminTodoRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running");
    });
  })
  .catch((err) => console.log(err));
