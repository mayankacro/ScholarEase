import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY as string
);

export const validateWithGemini = async (
    documentText: string,
    documentType: string,
    scholarshipType: string
) => {

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(`
You are an AI document verifier.

Document Type: ${documentType}
Scholarship Type: ${scholarshipType}

Extracted Text:
${documentText}

The OCR output may contain errors.
Ignore minor OCR mistakes.

Respond ONLY in JSON:

{
    "status": "valid | invalid | manual_review",
    "remarks": "short explanation"
}
`);

    return result.response.text();
};