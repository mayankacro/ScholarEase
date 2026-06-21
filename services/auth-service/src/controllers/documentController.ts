import { Request, Response } from "express";
import Document from "../models/Document";

export const getMyDocuments = async ( req: Request, res: Response) => {

    try{

        const studentId = (req as any).user.userId;

        const documents = await Document.find({
            studentId,
        });

        return res.status(200).json({
            success: true,
            documents,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch documents",
        });
    }
};