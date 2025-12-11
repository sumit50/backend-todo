import Todo from "../models/todo.js";

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: "failed to fetch todos" });
  }
};

export const addTodo = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "todo text is required" });
    }

    const newTodo = await Todo.create({ text });
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: "failed to create todo" });
  }
};

// export const deleteTodo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Todo.findByIdAndDelete(id);

//     res.status(200).json({ message: "todo removed" });
//   } catch (err) {
//     res.status(500).json({ message: "failed to delete todo" });
//   }
// };

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Todo.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(400).json({ message: "todo not found" });
    }

    res.status(200).json({ message: "todo delete" });
  } catch (err) {
    res.status(500).json({ message: " failed to delete todo" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { text, completed },
      { new: true } // return updated document
    );

    if (!updatedTodo) {
      // no return above this
      return res.status(404).json({ message: "todo not found" });
    }

    return res.status(200).json({
      message: "todo updated",
      todo: updatedTodo,
    });
  } catch (err) {
    console.error("Update error:", err.message);
    return res.status(500).json({ message: "failed to update" });
  }
};

export const deleteallTodo = async (req, res) => {
  try {
    await Todo.deleteMany({});

    res.status(200).json({ message: "todo deletes all" });
  } catch (err) {
    res.status(500).json({ message: "failed to delete todos" });
  }
};
