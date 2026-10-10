// services/openRouterService.ts
import axios from "axios";

export const validateWithOpenRouter = async (
    fileUrl: string,
    documentType: string,
    scholarshipType: string
) => {

    const prompt = `
You are a document validation system.
Document type expected: ${documentType}
Scholarship type: ${scholarshipType}

Look at this image and respond ONLY with valid JSON, no markdown:
{
  "status": "valid" | "invalid" | "manual_review",
  "remarks": "short explanation",
  "confidence": number between 0-100
}
`;

    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            model: "openrouter/free", // CHANGE: vision-capable model zaroori hai
            messages: [
                {  
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        { type: "image_url", image_url: { url: fileUrl } }
                    ]
                } 
            ]
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            }
        }
    );

    
const rawText = response.data?.choices?.[0]?.message?.content;

if (typeof rawText !== "string" || !rawText.trim()) {
    console.error(
        "OpenRouter returned unexpected response:",
        JSON.stringify(response.data, null, 2)
    );
    throw new Error("OpenRouter returned no text response");
}

const cleanedText = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
console.log("OpenRouter raw response:", JSON.stringify(rawText));
console.log("OpenRouter cleaned response:", JSON.stringify(cleanedText));

JSON.parse(cleanedText);

return cleanedText;

};