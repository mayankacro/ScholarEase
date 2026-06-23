import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

export const validateWithGemini = async (
  documentUrl: string
) => {

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const result = await model.generateContent(`
    Analyze this document:
    ${documentUrl}

    Tell whether it looks valid or not.
  `);

  return result.response.text();
};