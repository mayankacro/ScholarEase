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
            model: "google/gemma-4-31b-it:free", // CHANGE: vision-capable model zaroori hai
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

    const rawText = response.data.choices[0].message.content;
    const cleanedText = rawText.replace(/```json|```/g, "").trim();

    JSON.parse(cleanedText); // validate, warna throw hoga aur fallback chalega

    return cleanedText;
};