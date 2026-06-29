// services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const validateWithGemini = async (
    fileUrl: string,
    documentType: string,
    scholarshipType: string
) => {

    // Step 1 — Cloudinary se image fetch karo, base64 banao
    const imageResponse = await axios.get(fileUrl, { responseType: "arraybuffer" }); //dwloading image from cloudinary
    const base64Image = Buffer.from(imageResponse.data).toString("base64"); //image ko binary se bae64 m conveert kr rha h kyuki gemini ko image format m chahhiye document
    const mimeType = imageResponse.headers["content-type"] as string || "image/jpeg"; //determining whether img/jpeg or image/png

    // Step 2 — Prompt
    const prompt = `
You are a strict document validation system for an Indian scholarship portal.

DOCUMENT TYPE CLAIMED BY STUDENT: ${documentType}
SCHOLARSHIP TYPE: ${scholarshipType}

Carefully look at the attached image and evaluate:
1. Is the image clear and fully readable, or is it blurry, dark, or cropped?
2. Does this image actually show a "${documentType}"? If not, what does it actually look like?
3. Are key details (name, relevant numbers, signature, date) visible and readable?
4. Give a confidence score (0-100) for whether this is a valid, genuine, readable "${documentType}".

Respond ONLY with valid JSON, no markdown formatting, no extra text:
{
  "status": "valid" | "invalid" | "manual_review",
  "remarks": "short clear explanation, max 2 sentences, simple English",
  "confidence": number between 0-100
}

Rules for status:
- "valid" if confidence >= 85 and document type matches and image is clear
- "manual_review" if confidence is between 50-84
- "invalid" if confidence < 50, OR image too blurry to read, OR document type clearly doesn't match
`;

    // Step 3 — Gemini ko image + text dono bhejo
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                mimeType: mimeType,
                data: base64Image,
            },
        },
    ]);

    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json|```/g, "").trim();

    // Validate ki ye actually JSON hai — warna error throw karo taaki orchestrator OpenRouter try kare
    JSON.parse(cleanedText); // agar invalid JSON hai, yahi throw ho jaayega

    return cleanedText;
}; 