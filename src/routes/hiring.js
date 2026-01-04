import express from "express";
import {CreateHiring} from "../../controller/hiring.js";

const router = express.Router();

router.post("/add-hiring", CreateHiring);

export default router;
