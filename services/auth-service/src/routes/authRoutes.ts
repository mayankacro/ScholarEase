import express from "express";
import { register } from "../controllers/authController";

const router = express.Router();

router.post("/register", register); //ye ek traffic police ki tarah kaam krta h mtlb agr koi POST http://localhost:5000/api/auth/register aaye to register() fucntion chalao --> AuthController

export default router;