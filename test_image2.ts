import { GoogleGenAI } from '@google/genai';
const apiKey = process.env.GEMINI_API_KEY || "dummy";
const ai = new GoogleGenAI({ apiKey });
async function run() {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: "A magical unicorn",
      config: { numberOfImages: 1, aspectRatio: '1:1' }
    });
    console.log("image model success:", response.generatedImages?.[0]?.image?.imageBytes ? "has image" : "no image");
  } catch (e) { console.log(e.message); }
}
run();
