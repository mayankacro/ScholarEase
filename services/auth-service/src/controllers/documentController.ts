import { validateDocumentWithAI } from "../services/aiValidationService";
import { Request, Response } from "express";
import Document from "../models/Document";
import User from "../models/User";
import { sendStatusEmail } from "../services/notificationService";
import { sendFinalApplicationEmail } from "../services/notificationService";



export const getMyDocuments = async (req: Request, res: Response) => {

    try {

        const studentId = (req as any).user.userId;

        console.log("Loged in student ID:", studentId);
        const documents = await Document.find({
            studentId,
        });

        console.log("Documents found:", documents);

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

        const student = await User.findById(document.studentId);

        if(student) {
            await sendStatusEmail(
                student.email,
                document.documentType,
             status,
             status === "approved" ? "Your Documents Approved by Admin." : "Your document is rejected by admin. please reupload."
            )
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


export const updateFinalApplicationStatus = async (
    req: Request,
    res: Response
) => {
    try {
        const { studentId } = req.params;
        const { status, remarks } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be approved or rejected",
            });
        }

        if (status === "rejected" && !remarks?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide a rejection reason",
            });
        }

        const student = await User.findOne({
            _id: studentId,
            role: "student",
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        const requiredDocuments = await Document.find({ studentId: student._id }); //why direct studentId use nahi kiya? kyuki studentId string h aur Document.find() ko ObjectId chahiye, isliye student._id use kiya

        if (requiredDocuments.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Student has not uploaded any documents",
            });
        }

        if (
            status === "approved" &&
            requiredDocuments.some((doc) => doc.status !== "approved")
        ) {
            return res.status(400).json({
                success: false,
                message: "Approve all uploaded documents before final approval",
            });
        }

        student.finalApplicationStatus = status;
        student.applicationRemarks = remarks?.trim() || "";

        await student.save();

        await sendFinalApplicationEmail(
    student.email,
    student.name,
    status,
    student.applicationRemarks
);

        return res.status(200).json({
            success: true,
            message: `Application ${status} successfully`,
            student: {
                _id: student._id,
                finalApplicationStatus: student.finalApplicationStatus,
                applicationRemarks: student.applicationRemarks,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update final application status",
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

        const { id } = req.params; //request URL se document id nikalta hai

        const document = await Document.findById(id); //id ki help se mongoDB se document nikal rha h 

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }

        // CHANGE: OCR step hata diya, seedha fileUrl bhej rahe hain
        const aiResponse = await validateDocumentWithAI( //ab ai ko yaha 3 chize bheji ja rhi h
            document.fileUrl,
            document.documentType,
            document.scholarshipType
        );

        console.log("AI Response:", aiResponse); //response string m ata h

      
const parsedResponse = JSON.parse(aiResponse);

const normalizedStatus = String(parsedResponse.status)
    .trim()
    .toLowerCase();


const statusMap: Record<
    string,
    "Pending" | "Valid" | "Invalid" | "Manual_review"
> = {
    pending: "Pending",
    valid: "Valid",
    invalid: "Invalid",
    manual_review: "Manual_review",
};

const mappedStatus = statusMap[normalizedStatus];

if (!mappedStatus) {
    throw new Error(`Unexpected AI status: ${parsedResponse.status}`);
}

document.aiStatus = mappedStatus;


document.aiRemarks = parsedResponse.remarks;
document.aiConfidence = parsedResponse.confidence;


        // NAYA — agar invalid hai, action required set karo
        if (mappedStatus === "Invalid") { //img agr blur h 
            document.actionRequired = parsedResponse.remarks.toLowerCase().includes("blur") || parsedResponse.remarks.toLowerCase().includes("clear")
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

