import User from "../../models/user.js";
import Todo from "../../models/todo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ===================== REGISTER ===================== */
export const register = async (req, res) => {
  try {
    const {name, email, password} = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password) {
      return res.status(400).json({message: "All fields are required"});
    }

    // 2️⃣ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({message: "Invalid email format"});
    }

    // 3️⃣ Check existing user
    const oldUser = await User.findOne({email});
    if (oldUser) {
      return res.status(409).json({message: "Email already registered"});
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create user (ROLE IS FIXED AS USER)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    // 6️⃣ Create JWT
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/* ===================== LOGIN ===================== */
export const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    // 3️⃣ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({message: "Invalid password"});
    }

    // 4️⃣ Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/* ===================== DASHBOARD STATS ===================== */
/* ⚠️ This route MUST be protected by authMiddleware */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Todo.countDocuments({user: userId});
    const pending = await Todo.countDocuments({
      user: userId,
      status: "pending",
    });
    const completed = await Todo.countDocuments({
      user: userId,
      status: "completed",
    });

    res.status(200).json({
      total,
      pending,
      completed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};
