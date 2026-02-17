import { GoogleGenerativeAI } from "@google/generative-ai";
// import 'dotenv/config'; // removed for test execution

// You might need to install dotenv if not present, or just hardcode for testing if env not loaded
const API_KEY = process.env.VITE_GEMINI_API_KEY || "AIzaSyDi54TmVXe_gRhMjUgAjLup1JMSH_L9uRM"; 

console.log("Testing API Key:", API_KEY ? "Present" : "Missing");

async function test() {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const modelName = "gemini-2.5-flash-lite"; // User requested model
        console.log(`Testing model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Success! Response:", response.text());
    } catch (error) {
        console.error("Error testing Gemini:", error.message);
        if (error.status === 404) console.error("Hint: Model not found. Check the model name.");
        if (error.status === 403) console.error("Hint: API Key invalid or location not supported.");
    }
}

test();
