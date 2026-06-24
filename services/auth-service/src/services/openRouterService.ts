import axios from "axios";
import Scholarship from "../models/Scholarship";

export const validateWithOpenRouter = async (

    documentText: string,
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
Extracted Document Text: ${documentText}

The text was extracted using OCR and may contain spelling mistakes, random symbols, and formatting issues.

Ignore OCR noise and focus on meaningful information such as:
- Person names
- Government/institution names
- Dates
- IDs
- Gender
- Official keywords

Your job:
1. Check if the document contains meaningful information.
2. Verify whether the document type seems correct.
3. Detect missing important information.
4. Decide whether the document is valid.




Respond ONLY in this JSON format:

{
  "status": "valid" | "invalid" | "manual_review",
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