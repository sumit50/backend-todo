import express from "express";
import {adminMiddleware, authMiddleware} from "../../middleware/AuthMid.js";
import {
  adminLogin,
  getAllTodos,
  deleteAnyTodo,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllFeedback,
  deleteFeedback,
  getAllHiring,
  deleteHiring,
  getDashboardStats,
} from "../../controller/admin.js";

const router = express.Router();

// ADMIN LOGIN (no auth required)
router.post("/login", adminLogin);

// Protected admin routes
// Dashboard
router.get("/stats", authMiddleware, adminMiddleware, getDashboardStats);

// User Management
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/user/:id", authMiddleware, adminMiddleware, deleteUser);
router.put("/user/:id/role", authMiddleware, adminMiddleware, updateUserRole);

// Todo Management
router.get("/todos", authMiddleware, adminMiddleware, getAllTodos);
router.delete("/todo/:id", authMiddleware, adminMiddleware, deleteAnyTodo);

// Feedback Management
router.get("/feedback", authMiddleware, adminMiddleware, getAllFeedback);
router.delete("/feedback/:id", authMiddleware, adminMiddleware, deleteFeedback);

// Hiring Management
router.get("/hiring", authMiddleware, adminMiddleware, getAllHiring);
router.delete("/hiring/:id", authMiddleware, adminMiddleware, deleteHiring);

export default router;
