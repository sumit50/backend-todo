import User from "../models/login.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const {name, email, password} = req.body;

    // 1. Check empty fields
    if (!name || !email || !password) {
      return res.status(400).json({message: "All fields are required"});
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({message: "Invalid email format"});
    }

    // 4. Check if user already exists
    const oldUser = await User.findOne({email});
    if (oldUser) {
      return res.status(409).json({message: "Email already registered"});
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 7. Create JWT token with name
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name, // ← ADDED
      },
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    );

    // 8. Response
    res.status(201).json({
      message: "User registered successfully",
      token, // ← Return token
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Server error", error: err.message});
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    // 1. Check empty fields
    if (!email || !password) {
      return res.status(400).json({message: "Email and password required"});
    }

    // 2. Check user exists
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    // 3. Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({message: "Invalid password"});
    }

    // 4. Create JWT with name
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name, // ← ADDED THIS LINE
      },
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    );

    // 5. Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Server error", error: err.message});
  }
};
