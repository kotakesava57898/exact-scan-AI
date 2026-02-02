
import { GoogleGenAI, Type } from "@google/genai";
import { ComparisonResult } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';

export const analyzeComparison = async (
  imageBase64: string,
  notepadText: string
): Promise<ComparisonResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const systemInstruction = `You are a world-class document auditor specializing in 100% accuracy for OCR and text verification.
Your task is to compare the TEXT in the provided IMAGE (Reference) against the TEXT from the NOTEPAD file (Candidate).

You must perform a deep scan to find every minor error:
1. Spelling and character mismatches.
2. Punctuation errors (commas, periods, quotes).
3. Missing or extra words.
4. Formatting issues: Line breaks must match the image exactly.
5. Special characters.
6. Spacing: Extra spaces between words or inconsistent paragraph gaps.

OUTPUT REQUIREMENTS for 'errors' list:
- For 'errorInNotepad' and 'correctVersion', show ONLY the specific word or punctuation mark that is wrong. DO NOT show the entire sentence.
- Example: If the notepad says "The quick brwn fox" and the image says "The quick brown fox", the error is: errorInNotepad: "brwn", correctVersion: "brown".
- Provide the line number from the NOTEPAD file where the error occurs.

OUTPUT REQUIREMENTS for 'correctedText':
- Provide the full text corrected based on the image.
- Match the image's original line breaks EXACTLY.
- Have NO empty lines (double spaces) between paragraphs.
- Be formatted as a clean, continuous block of lines.

Return the response in JSON format.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/png",
            data: imageBase64.split(',')[1] || imageBase64
          }
        },
        {
          text: `Compare this image text against the following notepad content and find all discrepancies:\n\nNOTEPAD CONTENT:\n${notepadText}`
        }
      ]
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          errors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                lineNumber: { type: Type.NUMBER },
                errorInNotepad: { type: Type.STRING, description: 'The specific erroneous word or character only.' },
                correctVersion: { type: Type.STRING, description: 'The specific correct word or character only.' },
                category: { type: Type.STRING, description: 'spelling, punctuation, missing, extra, formatting, other' }
              },
              required: ['lineNumber', 'errorInNotepad', 'correctVersion', 'category']
            }
          },
          correctedText: { 
            type: Type.STRING,
            description: 'The full text corrected based on the image, matching original line breaks exactly, with no spaces between paragraphs.'
          }
        },
        required: ['errors', 'correctedText']
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI service.");
  }

  return JSON.parse(response.text.trim()) as ComparisonResult;
};
