import todo from "../models/todo.js";
import User from "../models/user.js";
import Feedback from "../models/feedback.js";
import Hiring from "../models/hiring.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ===================== ADMIN LOGIN ===================== */
export const adminLogin = async (req, res) => {
  try {
    const {email, password} = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required",
      });
    }

    // 4️⃣ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // 5️⃣ Create JWT
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
      success: true,
      message: "Admin login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Admin: get ALL todos
export const getAllTodos = async (req, res) => {
  try {
    const todos = await todo
      .find()
      .populate("user", "name email role")
      .sort({createdAt: -1});

    res.json({
      success: true,
      count: todos.length,
      todos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch todos",
    });
  }
};

// Admin: delete ANY todo
export const deleteAnyTodo = async (req, res) => {
  try {
    const deletedTodo = await todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.json({
      success: true,
      message: "Todo deleted by admin",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete todo",
    });
  }
};

/* ===================== USER MANAGEMENT ===================== */

// Admin: get ALL users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") // Exclude password from response
      .sort({createdAt: -1});

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// Admin: delete a user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Also delete all todos associated with this user
    await todo.deleteMany({user: userId});

    res.json({
      success: true,
      message: "User and associated todos deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// Admin: update user role
export const updateUserRole = async (req, res) => {
  try {
    const {role} = req.body;
    const userId = req.params.id;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'user' or 'admin'",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {role},
      {new: true, runValidators: true}
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

/* ===================== FEEDBACK MANAGEMENT ===================== */

// Admin: get ALL feedback
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("userId", "name email role")
      .sort({createdAt: -1});

    res.json({
      success: true,
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
};

// Admin: delete feedback
export const deleteFeedback = async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!deletedFeedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
    });
  }
};

/* ===================== HIRING MANAGEMENT ===================== */

// Admin: get ALL hiring applications
export const getAllHiring = async (req, res) => {
  try {
    const hiring = await Hiring.find().sort({createdAt: -1});

    res.json({
      success: true,
      count: hiring.length,
      hiring,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hiring applications",
    });
  }
};

// Admin: delete hiring application
export const deleteHiring = async (req, res) => {
  try {
    const deletedHiring = await Hiring.findByIdAndDelete(req.params.id);

    if (!deletedHiring) {
      return res.status(404).json({
        success: false,
        message: "Hiring application not found",
      });
    }

    res.json({
      success: true,
      message: "Hiring application deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete hiring application",
    });
  }
};

/* ===================== DASHBOARD STATS ===================== */

// Admin: get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalTodos,
      totalFeedback,
      totalHiring,
      adminCount,
      userCount,
    ] = await Promise.all([
      User.countDocuments(),
      todo.countDocuments(),
      Feedback.countDocuments(),
      Hiring.countDocuments(),
      User.countDocuments({role: "admin"}),
      User.countDocuments({role: "user"}),
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [recentUsers, recentTodos, recentFeedback, recentHiring] =
      await Promise.all([
        User.countDocuments({createdAt: {$gte: sevenDaysAgo}}),
        todo.countDocuments({createdAt: {$gte: sevenDaysAgo}}),
        Feedback.countDocuments({createdAt: {$gte: sevenDaysAgo}}),
        Hiring.countDocuments({createdAt: {$gte: sevenDaysAgo}}),
      ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTodos,
        totalFeedback,
        totalHiring,
        adminCount,
        userCount,
        recentActivity: {
          users: recentUsers,
          todos: recentTodos,
          feedback: recentFeedback,
          hiring: recentHiring,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};
