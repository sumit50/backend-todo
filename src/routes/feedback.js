import express from "express";
import {addFeedback} from "../../controller/feedback.js";

const router = express.Router();

// register route

router.post("/add-feedback", addFeedback);

//login route

// router.post("/login-user", login);

export default router;
