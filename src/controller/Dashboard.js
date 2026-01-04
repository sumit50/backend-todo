import Todo from "../models/todo.js";

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
    res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};
