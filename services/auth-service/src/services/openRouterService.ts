
import axios from "axios";

export const validateWithOpenRouter = async (
    fileUrl: string,
    documentType: string,
    scholarshipType: string
) => {
    try {
        // Step 1: Download document from Cloudinary
        const fileResponse = await axios.get(fileUrl, {
            responseType: "arraybuffer",
            timeout: 20000,
        });

        const base64File = Buffer.from(fileResponse.data).toString("base64");

       
const contentType = fileResponse.headers["content-type"];

const mimeType =
    typeof contentType === "string"
        ? contentType.split(";")[0]?.trim().toLowerCase() ||
          "application/octet-stream"
        : "application/octet-stream";


        const isPdf = mimeType === "application/pdf";
        const isImage = ["image/jpeg", "image/png", "image/webp"].includes(
            mimeType
        );

        if (!isPdf && !isImage) {
            throw new Error(`Unsupported document type: ${mimeType}`);
        }

        console.log("OpenRouter file type:", mimeType);

        // Step 2: Validation prompt
        const prompt = `
You are a strict document validation system for an Indian scholarship portal.

DOCUMENT TYPE CLAIMED BY STUDENT: ${documentType}
SCHOLARSHIP TYPE: ${scholarshipType}

Inspect the supplied document carefully.

1. Is it readable, clear, and complete?
2. Does it match the claimed document type?
3. Are important details visible and readable?
4. Give a confidence score from 0 to 100.

Respond ONLY with valid JSON:
{
  "status": "Valid" | "Invalid" | "Manual_review",
  "remarks": "Short explanation, maximum 2 sentences, simple English",
  "confidence": 0
}

Rules:
- Valid: confidence >= 85, correct document type, and readable.
- Manual_review: confidence between 50 and 84.
- Invalid: confidence < 50, unreadable document, or clearly wrong document type.
- Never claim authenticity can be proven from appearance alone.
`;

        // Step 3: Build content according to file type
        const fileContent = isPdf
            ? {
                  type: "file",
                  file: {
                      filename: "scholarship-document.pdf",
                      file_data: `data:application/pdf;base64,${base64File}`,
                  },
              }
            : {
                  type: "image_url",
                  image_url: {
                      url: `data:${mimeType};base64,${base64File}`,
                  },
              };

        // Step 4: Call OpenRouter
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openrouter/free",
                messages: [
                    {
                        role: "user",
                        content: [ 
                            { type: "text", text: prompt },
                            fileContent,
                        ],
                    },
                ],
                temperature: 0,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 60000,
            }
        );

        // Step 5: Extract response
        const rawText = response.data?.choices?.[0]?.message?.content;

        if (typeof rawText !== "string" || !rawText.trim()) {
            console.error(
                "OpenRouter response:",
                JSON.stringify(response.data, null, 2)
            );
            throw new Error("OpenRouter returned no text response");
        }

        // Step 6: Parse and validate JSON
        const cleanedText = rawText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleanedText);

        const allowedStatuses = ["Valid", "Invalid", "Manual_review"];

        if (
            !allowedStatuses.includes(parsed.status) ||
            typeof parsed.remarks !== "string" ||
            typeof parsed.confidence !== "number" ||
            parsed.confidence < 0 ||
            parsed.confidence > 100
        ) {
            throw new Error("OpenRouter returned an invalid validation result");
        }

        return JSON.stringify(parsed);
    } catch (error: any) {
        console.error(
            "OpenRouter validation failed:",
            JSON.stringify(
                error.response?.data || { message: error.message },
                null,
                2
            )
        );

        throw error;
    }
};
