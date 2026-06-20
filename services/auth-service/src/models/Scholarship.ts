import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },

        description:{
            type: String,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        aligibility: {
            type: Number,
            required: true,
        },

        deadline: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["Active", "Closed"],
            default: "active",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Scholarship = mongoose.model(
    "Scholarship",
    scholarshipSchema
);

export default Scholarship;