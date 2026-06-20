import express from "express";
import { createChecklistRule } from "../controllers/checklistController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMidddleware } from "../middleware/roleMiddleware";


const router = express.Router();

router.post( "/", authMiddleware, roleMidddleware(["admin"]), createChecklistRule);

export default router;
