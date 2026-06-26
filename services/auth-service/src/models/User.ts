import mongoose from "mongoose";

const userschema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true, //har user ki ek apni 1 unique email honi chahiye
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["student", "admin", "officer"],
            default: "student",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userschema);

export default User;