import dotenv from "dotenv";
import express from "express";
import { connect } from "node:http2";
import connectDB from "./config/db";

dotenv.config();

const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

console.log(process.env.MONGO_URL)

app.get("/", (req, res) => {
    res.send("ScholarEase Auth Service Running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
