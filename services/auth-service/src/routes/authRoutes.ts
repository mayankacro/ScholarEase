import express from "express";
import { register, login, profile } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
// import { register, login, profile } from "../controllers/authController";




const router = express.Router();

router.post("/register", register); //ye ek traffic police ki tarah kaam krta h mtlb agr koi POST http://localhost:5000/api/auth/register aaye to register() fucntion chalao --> AuthController
router.post("/login", login);
router.get("/profile", authMiddleware, profile);

router.get("/admin", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
    res.json({
        success: true,
        message: "Welcome Admin",
    });
 }
);

export default router;