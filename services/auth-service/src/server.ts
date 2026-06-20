import dotenv from "dotenv";
import express from "express";
import { connect } from "node:http2";
import connectDB from "./config/db";
import User from "./models/User";
import authRoutes from "./routes/authRoutes";
import checklistRoutes from "./routes/checklistRoutes"

dotenv.config(); //.env file padho 

const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

// console.log(process.env.MONGO_URL)

app.use(express.json());  //ye line express ko bolti h JSON ko samajh

app.use("/api/auth", authRoutes); // mtlb /api/auth wali request authROutes ko bhejo

app.use("/api/checklist", checklistRoutes);

console.log(User.modelName);

app.get("/", (req, res) => {
    res.send("ScholarEase Auth Service Running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
