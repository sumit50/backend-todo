import express from "express";
import mongoose from "mongoose";
import todoRoutes from "./routes/todoRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

import loginRoutes from "./routes/login.js";

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
app.use("/todo", todoRoutes);
app.use("/user", loginRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running");
    });
  })
  .catch((err) => console.log(err));
