import dotenv from "dotenv";
dotenv.config(); //.env file padho 

import express from "express";
import { connect } from "node:http2";
import connectDB from "./config/db";
import User from "./models/User";
import authRoutes from "./routes/authRoutes";
import checklistRoutes from "./routes/checklistRoutes"
import uploadRoutes from "./routes/uploadRoutes"
import cloudinary from "./config/cloudinary";
import documentRoutes from "./routes/documentRoutes";


const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

// console.log(process.env.MONGO_URL)

app.use(express.json());  //ye line express ko bolti h JSON ko samajh

app.use("/api/auth", authRoutes); // mtlb /api/auth wali request authROutes ko bhejo

app.use("/api/checklist", checklistRoutes);

app.use("/api/upload", uploadRoutes);


app.use("/api/documents", documentRoutes);

// console.log(process.env.CLOUDINARY_CLOUD_NAME);

// console.log(cloudinary.config());

cloudinary.api
   .ping()
   .then(() => console.log("Cloudinary Connected"))
   .catch((err: any) => console.log(err));


// console.log(User.modelName);

app.get("/", (req, res) => {
    res.send("ScholarEase Auth Service Running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
