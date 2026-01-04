import mongoose from "mongoose";

const hiringSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    age: {type: Number, required: true},
    experience: {type: Number, required: true},
  },
  {timestamps: true}
);

export default mongoose.model("Hiring", hiringSchema);
