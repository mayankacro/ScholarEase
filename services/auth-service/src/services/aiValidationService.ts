import { validateWithGemini } from "./geminiService";
import { validateWithOpenRouter } from "./openRouterService";

export const validateDocumentWithAI = async (
    fileUrl: string,          // CHANGE: documentText nahi, ab fileUrl
    documentType: string,
    scholarshipType: string
) => {

    // 1. Gemini
    try {
        console.log("Trying Gemini...");
        return await validateWithGemini(
            fileUrl,
            documentType,
            scholarshipType
        );

    } catch (error: any) {
        console.log("Gemini failed:", error.message);
        console.log("Trying OpenRouter...");
    }

    // 2. OpenRouter
    try {
        console.log("Trying OpenRouter...");

        return await validateWithOpenRouter(
            fileUrl,
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
        status: "manual_review",   // CHANGE: "pending" nahi, "manual_review" — tera enum match karega
        remarks: "All AI services unavailable. Manual review required.",
        confidence: 0
    });
};