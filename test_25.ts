import { GoogleGenAI } from '@google/genai';
const apiKey = process.env.GEMINI_API_KEY || "dummy";
const ai = new GoogleGenAI({ apiKey });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Hi",
    });
    console.log("2.5-flash success");
  } catch (e) { console.log(e.message); }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: "Hi",
    });
    console.log("2.5-pro success");
  } catch (e) { console.log(e.message); }
}
run();
