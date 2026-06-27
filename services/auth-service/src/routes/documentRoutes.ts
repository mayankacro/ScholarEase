import express from "express";
import { getMyDocuments } from "../controllers/documentController";
import { authMiddleware } from "../middleware/authMiddleware";
import { getAllDocuments } from "../controllers/documentController";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { updateDocumentStatus } from "../controllers/documentController";
import { getDocumentStats } from "../controllers/documentController";
import { validateDocumentAI } from "../controllers/documentController";

const router = express.Router();

router.get("/my-documents", authMiddleware, getMyDocuments );

router.get( "/all", authMiddleware, roleMiddleware(["admin"]), getAllDocuments);


router.patch("/:id/status", authMiddleware, roleMiddleware(["admin"]), updateDocumentStatus );


router.get("/stats", authMiddleware, roleMiddleware(["admin"]), getDocumentStats);

router.patch("/:id/validate-ai", authMiddleware, roleMiddleware(["admin"]), validateDocumentAI);


export default router;