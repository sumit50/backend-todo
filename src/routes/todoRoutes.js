import express from "express";
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  deleteallTodo,
} from "../controller/todoController.js";

const router = express.Router();

router.get("/get-todo", getTodos);
router.post("/add-todo", addTodo);
router.delete("/delete-todo/:id", deleteTodo);
router.put("/edit-todo/:id", updateTodo);
router.delete("/delete-all-todo", deleteallTodo);

export default router;
