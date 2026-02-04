import { geminiModel } from './chat.constant';

const generateText = async (prompt: string): Promise<string> => {
  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
};
export const ChatService = { generateText };
