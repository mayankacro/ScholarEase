import { Request, Response } from "express";
import Document from "../models/Document";
import { populate } from "dotenv";


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



//admin agr student ke saare documnets dekhna chahta h to 
export const getAllDocuments = async ( req: Request, res: Response ) => {

    try {

        const documents = await Document.find()
             .populate("studentId", "name email role"); //populate()-> mtlb admin ko student details bhi mil jaaye

        return res.status(200).json({
            success: true,
            documents,
        })     
        
    } catch (error){

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failder to fetch Documents",
        });
    }
};


export const updateDocumentStatus = async ( req: Request, res: Response ) => {
    try{

        const { id } = req.params;
        const { status } = req.body;

        const document = await Document.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if(!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Document status updated",
            document,
        });

    } catch(error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update status",
        });
    }
};