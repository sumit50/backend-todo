import express from "express";
import {authMiddleware} from "../../middleware/AuthMid.js";

import {register, login, getDashboardStats} from "../../controller/user.js";

const router = express.Router();

// REGISTER
router.post("/register-user", register);

// LOGIN
router.post("/login-user", login);

// DASHBOARD STATS (protected)
router.get("/getDashboardStats", authMiddleware, getDashboardStats);

export default router;
