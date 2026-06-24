import { validateWithGemini } from "./geminiService";
import { validateWithOpenRouter } from "./openRouterService";

export const validateDocumentWithAI = async (
    documentText: any,
    documentType: string,
    scholarshipType: string
) => {

    // 1. Gemini
    try {
        console.log("Trying Gemini...");
        return await validateWithGemini(
                documentText,
                documentType,
                scholarshipType

        );

    } catch (error) {
        console.log("Gemini failed. Trying OpenRouter...");
    }

    // 2. OpenRouter
    try {
        console.log("Trying OpenRouter...");

        return await validateWithOpenRouter(
            documentText,
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