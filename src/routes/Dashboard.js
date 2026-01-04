import express from "express";
import authMiddleware from "../Middleware/AuthMid.js";
import {getDashboardStats} from "../controller/Dashboard.js";
const router = express.Router();

// GET dashboard stats
router.get("/stats", authMiddleware, getDashboardStats);

export default router;
