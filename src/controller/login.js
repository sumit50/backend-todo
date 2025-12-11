import User from "../models/login.js"; // keep this if your model file is login.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({message: "All fields are required"});
    }

    // check if user already exists
    const oldUser = await User.findOne({email});
    if (oldUser) {
      return res.status(409).json({message: "Email already registered"});
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
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

    if (!email || !password) {
      return res.status(400).json({message: "Email and password required"});
    }

    // check user
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({message: "Invalid password"});
    }

    // create JWT
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

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
