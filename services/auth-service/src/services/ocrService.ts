// "The system first extracts text from uploaded documents using Tesseract OCR. 
// Since OCR output can contain noise, the extracted text is cleaned 
// and then sent to a multi-provider AI validation layer (Gemini with OpenRouter fallback).
//  The AI analyzes document contents and generates validation remarks, which are stored for admin review."



// The Tesseract package provides an Optical Character Recognition (OCR) engine that reads and extracts text embedded in images and scanned documents. It converts visual text into machine-readable formats.

import Tesseract from "tesseract.js";

export const extractTextfromImage = async (imageUrl: string) => {

    console.log("Starting OCR...");

    const result = await Tesseract.recognize(imageUrl, "eng+hin");

    console.log("EXTREACTED TEXT : ");

    console.log(result.data.text);

    const cleanedText = result.data.text
        .replace(/[^\w\s:/.-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    console.log("CLEANED TEXT:", cleanedText);

    return cleanedText;

  


};