import { GoogleGenAI } from '@google/genai';
const apiKey = process.env.GEMINI_API_KEY || "dummy";
const ai = new GoogleGenAI({ apiKey });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'imagen-4.0-generate-001',
      contents: "A magical unicorn",
    });
    console.log("image model success");
  } catch (e) { console.log(e.message); }
}
run();
