import { validateDocumentWithAI } from "../services/aiValidationService";
import { Request, Response } from "express";
import Document from "../models/Document";
import { populate } from "dotenv";
import { count } from "node:console";



export const getMyDocuments = async (req: Request, res: Response) => {

    try {

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
export const getAllDocuments = async (req: Request, res: Response) => {

    try {

        const documents = await Document.find()
            .populate("studentId", "name email role"); //populate()-> mtlb admin ko student details bhi mil jaaye

        return res.status(200).json({
            success: true,
            documents,
        })

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failder to fetch Documents",
        });
    }
};


export const updateDocumentStatus = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        const document = await Document.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!document) {
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

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update status",
        });
    }
};



export const getDocumentStats = async (req: Request, res: Response) => {
    try {

        const totalDocuments = await Document.countDocuments();

        const pendingDocuments = await Document.countDocuments({
            status: "pending",
        });

        const approvedDocuments = await Document.countDocuments({
            status: "approved",
        });

        const rejectedDocuments = await Document.countDocuments({
            status: "rejected",
        });

        return res.status(200).json({
            status: true,
            stats: {
                totalDocuments,
                pendingDocuments,
                approvedDocuments,
                rejectedDocuments,
            },
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to Fetch stats",
        });
    }
};




export const validateDocumentAI = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }

        // CHANGE: OCR step hata diya, seedha fileUrl bhej rahe hain
        const aiResponse = await validateDocumentWithAI(
            document.fileUrl,
            document.documentType,
            document.scholarshipType
        );

        console.log("AI Response:", aiResponse);

        const parsedResponse = JSON.parse(aiResponse);

        document.aiStatus = parsedResponse.status;
        document.aiRemarks = parsedResponse.remarks;
        document.aiConfidence = parsedResponse.confidence; // NAYA — confidence bhi save karo

        // NAYA — agar invalid hai, action required set karo
        if (parsedResponse.status === "invalid") {
            document.actionRequired = parsedResponse.remarks.toLowerCase().includes("blur") || 
                                       parsedResponse.remarks.toLowerCase().includes("clear")
                ? "reupload_clearer_image"
                : "reupload_correct_document";
        } else {
            document.actionRequired = null;
        }

        await document.save();

        return res.status(200).json({
            success: true,
            message: "AI validation completed",
            document,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "AI validation failed",
        });
    }
};

