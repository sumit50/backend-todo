import express from "express";
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  deleteallTodo,
} from "../controller/todoController.js";
import authMiddleware from "../Middleware/AuthMid.js";

const router = express.Router();

// ✅ PROTECTED ROUTES
router.get("/get-todo", authMiddleware, getTodos);
router.post("/add-todo", authMiddleware, addTodo);
router.delete("/delete-todo/:id", authMiddleware, deleteTodo);
router.put("/edit-todo/:id", authMiddleware, updateTodo);
router.delete("/delete-all-todo", authMiddleware, deleteallTodo);

export default router;
