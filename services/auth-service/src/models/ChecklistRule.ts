import mongoose, { mongo, mongoosePopulatedDocumentMarker } from "mongoose";
import Scholarship from "./Scholarship";

const checklistRulSchema = new mongoose.Schema(
    {
        ScholarshipType:{
            type: String,
            required: true,
            unique: true,
        },

        requiredDocmunets:{
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