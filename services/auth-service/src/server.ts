import express from "express";
const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("ScholarEase Auth Service Running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
