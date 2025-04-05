import { Env } from "@env";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(Env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const getAiResponse = async (prompt: string) => {
    const result = await model.generateContent(prompt);
    return result.response;
}