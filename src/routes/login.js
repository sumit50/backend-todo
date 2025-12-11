import express from "express";
import {register, login} from "../controller/login.js";

const router = express.Router();

// register route

router.post("/register-user", register);

//login route

router.post("/login-user", login);

export default router;
