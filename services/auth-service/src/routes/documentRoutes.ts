import express from "express";
import { getMyDocuments } from "../controllers/documentController";
import { authMiddleware } from "../middleware/authMiddleware";
import { getAllDocuments } from "../controllers/documentController";
import { roleMidddleware } from "../middleware/roleMiddleware";


const router = express.Router();

router.get("/my-documents", authMiddleware, getMyDocuments );

router.get( "/all", authMiddleware, roleMidddleware(["admin"]), getAllDocuments);

export default router;