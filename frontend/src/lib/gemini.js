import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getGeminiResponse(prompt, history = []) {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
        console.error("Missing VITE_GEMINI_API_KEY in environment variables");
        return "I'm incorrectly configured. Please check my API key settings.";
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // using the preview model for Flash Lite 2.0
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite-preview-02-05" });

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
