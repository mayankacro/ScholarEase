import mongoose, { mongo, mongoosePopulatedDocumentMarker } from "mongoose";
import Scholarship from "./Scholarship";

const checklistRulSchema = new mongoose.Schema(
    {
        scholarshipType:{
            type: String,
            required: true,
            unique: true,
        },

        requiredDocuments:{
            type: [String],
            required: true,
        },
    },

    {
        timestamps: true,
    }
);

const ChecklistRule = mongoose.model(
    "ChecklistRule",
    checklistRulSchema
);

export default ChecklistRule;