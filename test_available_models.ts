import { GoogleGenAI } from '@google/genai';
const apiKey = process.env.GEMINI_API_KEY || "dummy";
const ai = new GoogleGenAI({ apiKey });
async function run() {
  try {
    const response = await ai.models.list();
    for await (const model of response) {
      console.log(model.name);
    }
  } catch (e) {
    console.log("Error listing models:", e.message);
  }
}
run();
