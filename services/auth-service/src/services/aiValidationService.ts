import { validateWithGemini } from "./geminiService";
import { validateWithOpenRouter } from "./openRouterService";

export const validateDocumentWithAI = async (
    documentUrl: string,
    documentType: string,
    scholarshipType: string
) => {

    // 1. Gemini
    try {
        console.log("Trying Gemini...");
        return await validateWithGemini(documentUrl);

    } catch (error) {
        console.log("Gemini failed. Trying OpenRouter...");
    }

    // 2. OpenRouter
    try {
        console.log("Trying OpenRouter...");

        return await validateWithOpenRouter(
            documentUrl,
            documentType,
            scholarshipType
        );

    } catch (error: any) {

        console.log(
            "OpenRouter Error:",
            error.response?.data || error.message
        );
    }

    // 3. Final fallback
    return JSON.stringify({
        status: "pending",
        remarks: "All AI services unavailable. Manual review required."
    });
};