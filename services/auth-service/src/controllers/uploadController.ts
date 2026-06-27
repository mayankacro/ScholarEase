import {Request, Response} from "express";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";
import Document from "../models/Document";
import { validateDocumentWithAI } from "../services/aiValidationService";

export const uploadDocument = async( req: Request, res: Response) => {

    try {
        
        if (!req.file) { // agr koi file upload nahi hui ho to
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const result = await new Promise<any>((resolve, reject) => { //Cloudinary callback use karta hai -> lekin hum await use krna chahte h -> isliye callback ko promise m convert kia 

            const stream = cloudinary.uploader.upload_stream( //ye cloudinary ko bolta hai -> Main tumhe ek file stream bhejunga. Usse upload kar dena.
                {
                    folder: "ScholarEase", //mtlb scholarEase folder m save kro
                    resource_type: "auto", //or pdf,docx, png jo bhi ho automatic detect kro
                },

                (error: any, result: any) => {  //Cloudinary upload complete hone ke baad ye callback chalega
                    if (error) {
                        reject(error); //if not uploades error  
                    } else {
                        resolve(result); // agr uploaded 
                    }
                }
            );

            streamifier
                .createReadStream(req.file!.buffer) //req.file.buffer -> Ram m rkhu hui file  || createReadStream() -> File ko ek stream me convert karta hai
                //mtlb puri file ek sath nahi bhejenge thoda thoda data bhejenge
                .pipe(stream); //ye chunks cloudinary ko bhej do
            });

        const studentId = (req as any).user.userId;

        const { documentType, scholarshipType } = req.body;

        const document = await Document.create({
            studentId,
            documentType,
            scholarshipType,
            fileUrl: result.secure_url,
        })

        
        try {
            console.log("Auto-triggering AI validation...");

            const aiResponse = await validateDocumentWithAI(
                document.fileUrl,
                document.documentType,
                document.scholarshipType
            );

            console.log("AI Response:", aiResponse);

            const parsedResponse = JSON.parse(aiResponse);

            document.aiStatus = parsedResponse.status;
            document.aiRemarks = parsedResponse.remarks;
            document.aiConfidence = parsedResponse.confidence;

            if (parsedResponse.status === "invalid") {
                document.actionRequired = parsedResponse.remarks.toLowerCase().includes("blur") ||
                                           parsedResponse.remarks.toLowerCase().includes("clear")
                    ? "reupload_clearer_image"
                    : "reupload_correct_document";
            } else {
                document.actionRequired = null;
            }

            await document.save();

        } catch (aiError) {
            // AI fail ho gaya — document already upload ho gaya hai, sirf validation pending rahegi
            console.error("AI validation failed during upload:", aiError);
            document.aiStatus = "pending";
            document.aiRemarks = "AI validation pending — please wait or contact admin.";
            await document.save();
        }
        // ============================================

        return res.status(200).json({
            success: true,
            message: "Document uploaded and validated",
            document, // ab isme aiStatus, aiRemarks turant milenge
        });
        
    } catch (error) {

        console.error(error);
        
        return res.status(500).json({
            success: false,
            message: "Upload Failed"
        });

    }
};


