// import User from "../models/user.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// export const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // check exist
//     const exist = await User.findOne({ email });
//     if (exist) return res.status(400).json({ msg: "Email already exists" });

//     const hash = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hash,
//     });

//     res.json({ msg: "User registered", user });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", err });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "User not found" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ msg: "Wrong password" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

//     res.json({ msg: "Login ok", token });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", err });
//   }
// };

// export const todo = (req, res) => {
//   res.json({ msg: "todo created" });
// };
