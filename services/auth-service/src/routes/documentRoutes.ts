import express from "express";
import { getMyDocuments } from "../controllers/documentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/my-documents", authMiddleware, getMyDocuments );


export default router;