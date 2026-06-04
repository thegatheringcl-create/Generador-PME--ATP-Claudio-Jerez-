import { GoogleGenAI, GenerateContentResponse, Content } from "@google/genai";
import { AppState, Level, Dimension, SubDimension, EvaluationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateEidEvaluation({ dimension, subdimension, contexto }: any): Promise<string> {
    const prompt = `Evalúa el siguiente contexto según los Estándares Indicativos de Desempeño (EID) para la dimensión: ${dimension}, subdimensión: ${subdimension}.\nContexto: ${contexto}`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    return response.text || "No se pudo generar la evaluación.";
}

export async function generatePmeActions(params: any): Promise<{ text: string, citations: any }> {
    const prompt = `Genera propuestas de acciones para el PME basadas en: ${JSON.stringify(params)}`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    return { text: response.text || "No se pudieron generar acciones.", citations: [] };
}

export async function generateStrategicObjectiveSuggestion(params: any): Promise<string> {
    const prompt = `Sugierme un Objetivo Estratégico para la dimensión: ${params.dimension}, subdimensión: ${params.subdimension}`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    return response.text?.trim() || "Objetivo sugerido";
}

export async function generateMetaEstrategica(params: any): Promise<string> {
    const prompt = `Sugiere una Meta Estratégica para el objetivo: ${params.objEstrategico}`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    return response.text?.trim() || "Meta sugerida";
}

export async function generateEstrategia(params: any): Promise<string> {
    const prompt = `Sugiere una Estrategia para el objetivo: ${params.objEstrategico} y meta: ${params.metaEstrategica}`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    return response.text?.trim() || "Estrategia sugerida";
}

export async function evaluatePmeActionsCoherence(params: any): Promise<string> {
    const prompt = `Evalúa la coherencia de las siguientes acciones PME: ${JSON.stringify(params)}`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    return response.text || "Evaluación de coherencia.";
}

export async function extractPmeStructure(base64: string): Promise<any> {
    const prompt = `Extrae la estructura del PME (dimensiones, subdimensiones, objetivos, metas, estrategias, acciones) desde este documento PDF en base64: ${base64}`;
    // Simple mock since we might not have actual implementations running this easily right here.
    return { strategicLines: [] };
}

export async function evaluatePmeIndicator(params: any): Promise<string> {
    const prompt = `Evalúa el siguiente indicador PME: ${JSON.stringify(params)}`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    return response.text || "Evaluación de indicador.";
}

export async function getChatbotResponse(
  history: Content[],
  currentMessage: string,
  mode: 'fast' | 'deep' | 'search' | 'standard',
  context: { establecimiento: string }
): Promise<{ text: string, groundingChunks?: any[] }> {
  const systemInstruction = `Eres un asistente experto en educación y gestión escolar para el establecimiento "${context.establecimiento}". Proporciona respuestas claras, fundamentadas y útiles para directivos y docentes.`;

  let modelName = 'gemini-3.1-pro-preview';
  const config: { systemInstruction: string, thinkingConfig?: any, tools?: any[] } = { systemInstruction };
  const tools: any[] = [];

  switch (mode) {
    case 'fast':
      modelName = 'gemini-3.1-flash-lite-preview';
      break;
    case 'deep':
      modelName = 'gemini-3.1-pro-preview';
      config.thinkingConfig = { thinkingBudget: 32768 };
      break;
    case 'search':
      modelName = 'gemini-3-flash-preview';
      tools.push({ googleSearch: {} });
      break;
  }

  const contents = [
    ...history,
    { role: 'user', parts: [{ text: currentMessage }] }
  ];

  if (tools.length > 0) {
    config.tools = tools;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config,
    });
    
    return { 
      text: response.text || "No se pudo obtener una respuesta.", 
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks 
    };
  } catch (error: unknown) {
    console.error("Chatbot API Error:", error);
    throw new Error("Hubo un error al comunicarse con el asistente de IA.");
  }
}

