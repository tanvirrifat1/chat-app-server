import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const geminiModel = genAI.getGenerativeModel({
  // Use 'gemini-2.0-flash' which is the current 2026 standard
  model: 'gemini-2.0-flash',
});
