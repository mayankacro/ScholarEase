import express from "express";
import { getMyDocuments } from "../controllers/documentController";
import { authMiddleware } from "../middleware/authMiddleware";
import { getAllDocuments } from "../controllers/documentController";
import { roleMidddleware } from "../middleware/roleMiddleware";
import { updateDocumentStatus } from "../controllers/documentController";
import { getDocumentStats } from "../controllers/documentController";

const router = express.Router();

router.get("/my-documents", authMiddleware, getMyDocuments );

router.get( "/all", authMiddleware, roleMidddleware(["admin"]), getAllDocuments);


router.patch("/:id/status", authMiddleware, roleMidddleware(["admin"]), updateDocumentStatus );


router.get("/stats", authMiddleware, roleMidddleware(["admin"]), getDocumentStats);


export default router;