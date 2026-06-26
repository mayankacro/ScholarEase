import mongoose from "mongoose";
import Scholarship from "./Scholarship";
 
const documentSchema = new mongoose.Schema(

    {
        studentId:{  //mltb ye document kis student ka hai
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        documentType: {
            type: String,
            required: true,
        },

        scholarshipType:{ //SC, ST, OBC , GENERAL
            type: String,
            required: true,
        },

        fileUrl: {  //Coudinary se jo URL milegi vo yaha save hogi
            type: String,
            required: true,
        },

        status: { // admin ke lie 
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        aiStatus: { //Ai validation ke lie 
            type: String,
            enum: ["pending", "valid", "invalid", "manual_review"],
            default: "pending",
        },

        aiRemarks:{ //ex: like photo blur, Signature missing
            type: String,
            default: "",
        },

        // NAYA FIELD — confidence score store karne ke liye
        aiConfidence: {
            type: Number,
            default: 0,
        },

        // NAYA FIELD — student ko exactly batane ke liye kya karna hai
        actionRequired: {
            type: String,
            enum: ["reupload_clearer_image", "reupload_correct_document", null],
            default: null,
        },

    },

        {
            timestamps: true,
        }

);

const Document = mongoose.model(
    "Document",
    documentSchema
);

export default Document;