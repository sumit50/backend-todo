import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import user  from "../models/user.js";
dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const adminExists = await user.findOne({role: "admin"});
    if (adminExists) {
      console.log("Admin already exists 👑");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await user.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully 👑");
    process.exit(0);
  } catch (error) {
    console.error("Seeder error:", error);
    process.exit(1);
  }
};


seedAdmin();
