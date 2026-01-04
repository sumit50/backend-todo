import Feedback from "../models/feedback.js";

export const addFeedback = async (req, res) => {
  try {
    const {name, email, message, age, rating} = req.body;

    // Check if user already submitted feedback
    const existingFeedback = await Feedback.findOne({email: email});

    if (existingFeedback) {
      return res.status(400).json({
        message: "You already submitted feedback",
      });
    }

    // Save to database
    const newFeedback = await Feedback.create({
      name,
      email,
      message,
      age,
      rating,
    });

    // Success response
    res.status(201).json({
      message: "Feedback submitted",
      data: newFeedback,
    });
  } catch (error) {
    console.log("Error:", error);

    // Simple error response
    res.status(500).json({
      message: "Server error",
    });
  }
};
