import axios from "axios";
import Scholarship from "../models/Scholarship";

export const validateWithOpenRouter = async (

    documentUrl: string,
    documentType: string,
    scholarshipType: string

) => {
    
    console.log("1. Before API Call");

    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            model: "openai/gpt-oss-120b:free",

            messages: [
                {
                    role: "user",
                    content: `
You are an AI document verification assistant for ScholarEase.

A student uploaded a document.

Document Type: ${documentType}
Scholarship Type: ${scholarshipType}
Document URL: ${documentUrl}

Your job:
1. Determine whether the document type seems appropriate.
2. Check if the document appears usable for scholarship verification.
3. If information is insufficient, recommend manual review.

Respond ONLY in this JSON format:

{
  "status": "valid" or "invalid" or "manual_review",
  "remarks": "short explanation"
}
`
                }
            ]
        },

        {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5000",
                "X-Title": "ScholarEase"
            },

            timeout: 30000
        }
    );

    // console.log("2. After API Call");
    // console.log(response.data);

    // console.log(
    // response.data.choices[0].message.content

    return response.data.choices[0].message.content;
};