import express from "express";
import { createChecklistRule, getChecklistRule } from "../controllers/checklistController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMidddleware } from "../middleware/roleMiddleware";


const router = express.Router();

router.post( "/", authMiddleware, roleMidddleware(["admin"]), createChecklistRule);

router.get("/:scholarshipType", getChecklistRule);

export default router;
