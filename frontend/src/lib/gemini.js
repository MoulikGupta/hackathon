import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("Missing VITE_GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// using the preview model for Flash Lite 2.0
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

/**
 * Generates a response from the AI model.
 * @param {string} prompt - The user's message.
 * @param {Array} history - Previous chat messages [{ role: 'user' | 'model', parts: [{ text: string }] }]
 * @returns {Promise<string>} - The AI's response text.
 */
export async function getGeminiResponse(prompt, history = []) {
    try {
        // Filter history: SDK requires the first message to be from 'user'
        // We also need to map our app's role names to SDK's role names if they differ
        // app: 'user' | 'model' -> SDK: 'user' | 'model' (same)
        
        let validHistory = history.filter(msg => msg.role === 'user' || msg.role === 'model');
        
        // Ensure first message is user
        if (validHistory.length > 0 && validHistory[0].role !== 'user') {
            validHistory = validHistory.slice(1);
        }

        const chat = model.startChat({
            history: validHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating AI response:", error);
        return "I'm having trouble connecting to my brain right now. Please try again later.";
    }
}
