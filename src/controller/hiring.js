import Hiring from "../../models/hiring.js";
export const CreateHiring = async (req, res) => {
  try {
    const {name, age, experience, email} = req.body;

    // Validation
    if (!name || !email || !age || !experience) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create hiring record
    const hiring = await Hiring.create({
      name,
      email,
      age,
      experience,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      hiring: {
        name: hiring.name,
        email: hiring.email,
        age: hiring.age,
        experience: hiring.experience,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
