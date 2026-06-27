import express from "express";
import { createChecklistRule, getChecklistRule } from "../controllers/checklistController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";


const router = express.Router();

router.post( "/", authMiddleware, roleMiddleware(["admin"]), createChecklistRule);

router.get("/:scholarshipType", getChecklistRule);

export default router;
