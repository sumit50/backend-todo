import Todo from "../models/todo.js";

// REGEX: only alphabets and spaces
const onlyAlphabetsRegex = /^[A-Za-z\s]+$/;

// GET ALL TODOS (USER-SPECIFIC)
export const getTodos = async (req, res) => {
  try {
    const userId = req.user.id;

    const todos = await Todo.find({user: userId});
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({message: "failed to fetch todos"});
  }
};

// ADD TODO WITH DUPLICATE + REGEX CHECK
export const addTodo = async (req, res) => {
  try {
    const {text} = req.body;
    const userId = req.user.id;

    // empty check
    if (!text?.trim()) {
      return res.status(400).json({message: "todo text is required"});
    }

    // regex check (only alphabets)
    if (!onlyAlphabetsRegex.test(text.trim())) {
      return res.status(400).json({
        message: "Todo must contain only alphabets and spaces",
      });
    }

    // duplicate check (user-wise)
    const alreadyCreated = await Todo.findOne({
      text: text.trim(),
      user: userId,
    });

    if (alreadyCreated) {
      return res.status(409).json({message: "Todo already exists"});
    }

    const newTodo = await Todo.create({
      text: text.trim(),
      user: userId,
    });

    return res.status(201).json(newTodo);
  } catch (err) {
    return res.status(500).json({message: "failed to create todo"});
  }
};

// DELETE ONE TODO (USER SAFE)
export const deleteTodo = async (req, res) => {
  try {
    const {id} = req.params;
    const userId = req.user.id;

    const deleted = await Todo.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({message: "todo not found"});
    }

    return res.status(200).json({message: "todo deleted"});
  } catch (err) {
    return res.status(500).json({message: "failed to delete todo"});
  }
};

// UPDATE TODO WITH REGEX
export const updateTodo = async (req, res) => {
  try {
    const {id} = req.params;
    const {text, status} = req.body;
    const userId = req.user.id;

    // if text is being updated, validate it
    if (text && !onlyAlphabetsRegex.test(text.trim())) {
      return res.status(400).json({
        message: "Todo must contain only alphabets and spaces",
      });
    }

    // validate status if provided
    if (status && !["pending", "completed"].includes(status)) {
      return res.status(400).json({
        message: "Status must be either 'pending' or 'completed'",
      });
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      {_id: id, user: userId},
      {
        ...(text && {text: text.trim()}),
        ...(status && {status}),
      },
      {new: true}
    );

    if (!updatedTodo) {
      return res.status(404).json({message: "todo not found"});
    }

    return res.status(200).json({
      message: "todo updated",
      todo: updatedTodo,
    });
  } catch (err) {
    return res.status(500).json({message: "failed to update"});
  }
};

// DELETE ALL TODOS (USER ONLY)
export const deleteallTodo = async (req, res) => {
  try {
    const userId = req.user.id;

    await Todo.deleteMany({user: userId});
    return res.status(200).json({message: "all todos deleted"});
  } catch (err) {
    return res.status(500).json({message: "failed to delete todos"});
  }
};
