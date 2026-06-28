import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware";
import {uploadDocument} from "../controllers/uploadController"
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = express.Router();

const storage = multer.memoryStorage();  //file -> RAM memory m temporaril save krenge

const upload = multer({ storage }); //multer ko ham bol rhe h ye rule use kre -> jo bhi file aaye use memmory m rkhna 

            // Ab sirf logged-in student hi upload kar payega.
router.post("/", authMiddleware, roleMiddleware(["student"]), upload.single("document"), uploadDocument);

export default router;
