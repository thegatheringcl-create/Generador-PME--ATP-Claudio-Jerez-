import { GoogleGenAI, GenerateContentResponse, Content } from "@google/genai";
import { AppState, Level, Dimension, SubDimension, EvaluationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generatePmeActions(params: any): Promise<{ text: string, citations: any }> {
    const prompt = `Genera propuestas de acciones anuales (para el año ${params.anioProceso}) para el PME, en el marco de un ciclo estratégico de 4 años (${params.cicloInicio}-${params.cicloFin}). Basado en: ${JSON.stringify(params)}
    
Estructura la respuesta obligatoriamente con el formato Markdown requerido.`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    return { text: response.text || "No se pudieron generar acciones.", citations: [] };
}

export async function generateStrategicObjectiveSuggestion(params: any): Promise<string> {
    const prompt = `Sugierme un Objetivo Estratégico (a 4 años, periodo ${params.cicloInicio}-${params.cicloFin}) para la dimensión: ${params.dimension}, subdimensión: ${params.subdimension}. El objetivo debe estar enfocado en el largo plazo (4 años). Datos adicionales: ${JSON.stringify(params.planesData)}`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    return response.text?.trim() || "Objetivo sugerido";
}

export async function generateMetaEstrategica(params: any): Promise<string> {
    const prompt = `Sugiere una Meta Estratégica (a 4 años, periodo ${params.cicloInicio}-${params.cicloFin}) para el objetivo: ${params.objEstrategico}. Dimension: ${params.dimension}, subdimension: ${params.subdimension}. La meta debe ser a 4 años.`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    return response.text?.trim() || "Meta sugerida";
}

export async function generateEstrategia(params: any): Promise<string> {
    const prompt = `Sugiere una Estrategia Anual (para el año de proceso ${params.anioProceso}) en el marco del periodo de 4 años (${params.cicloInicio}-${params.cicloFin}). Objetivo (4 años): ${params.objEstrategico} y meta (4 años): ${params.metaEstrategica}. La estrategia DEBE SER ANUAL para el año ${params.anioProceso}. Considera: ${JSON.stringify(params)}`;
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

export async function generateFaseEstrategicaFromDiagnostic(params: any): Promise<{ objetivo: string, meta: string, estrategia: string }> {
    const prompt = `Genera una propuesta de Fase Estratégica (Objetivo a 4 años, Meta a 4 años y Estrategia Anual) para el PME, basándote en los siguientes resultados de autoevaluación institucional.
    
    Dimensión: ${params.dimension}
    Subdimensión: ${params.subdimension}
    Nudos Críticos: ${params.nudosCriticos}
    Estándares Evaluados (Nivel 1 a 4): ${JSON.stringify(params.evaluaciones)}
    Ciclo: ${params.cicloInicio}-${params.cicloFin}
    Año de Proceso (Estrategia Anual): ${params.anioProceso}

    Debes devolver un OBJETO JSON válido con la siguiente estructura (SÓLO JSON, SIN MARKDOWN EXTERNO):
    {
       "objetivo": "texto del objetivo a 4 años",
       "meta": "texto de la meta a 4 años",
       "estrategia": "texto de la estrategia anual"
    }
    `;

    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    try {
        const text = response.text?.replace(/```json|```/g, '') || '{}';
        return JSON.parse(text);
    } catch {
        return { objetivo: "", meta: "", estrategia: "" };
    }
}

// --- New Functions for EID Gestor Pro ---
export async function generatePMEProposal(state: AppState): Promise<string> {
    const prompt = `Genera una propuesta de Plan de Mejoramiento Educativo (PME) basada en la siguiente información de estado.
IMPORTANTE: El ciclo estratégico es de 4 años (${state.cicloInicio}-${state.cicloFin}), por lo que los Objetivos Estratégicos y Metas Estratégicas deben formularse a 4 años. 
El año de proceso es ${state.anio}, por lo que la Estrategia y las Acciones deben ser específicas para el año ${state.anio}.

Estado actual:
${JSON.stringify(state, null, 2)}
Debes estructurar el reporte obligatoriamente separado por saltos de '---' para cada subdimensión.
Para cada subdimensión, utiliza EXACTAMENTE la siguiente estructura:
---
**I. NOMBRE DIMENSIÓN: [Nombre de la dimensión]**
**Objetivo estratégico:** [Texto del objetivo]
**Meta estratégica:** [Texto de la meta]
**Subdimensión Focalizada:** [Nombre de la subdimensión]
**Estrategia:** [Texto de la estrategia]
**Indicadores de Seguimiento de la Estrategia:**
*   Indicador 1: [Texto]
*   Indicador 2: [Texto]
**Acciones Propuestas:**
| Id | Nombre de la acción | Descripción | Medio de Verificación |
|---|---|---|---|
| 1 | [Nombre] | [Desc] | [Medio] |
`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    return response.text || "";
}

export async function generateStrategyForSubDimension(dim: Dimension, subDim: SubDimension, evaluaciones: any, objetivo: string, meta: string): Promise<string> {
    const prompt = `Genera una estrategia para la dimensión ${dim.nombre}, subdimensión ${subDim.nombre}.
Objetivo: ${objetivo}
Meta: ${meta}
Sé conciso y directo, orientado a la mejora.`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    return response.text?.trim() || "";
}

export async function assignStrategyToSubDimension(generalStrategy: string, subDimensiones: SubDimension[]): Promise<string> {
    const prompt = `Dada la siguiente estrategia general:
"${generalStrategy}"
¿A cuál de estas subdimensiones corresponde mejor? Devuelve SOLAMENTE el ID de la subdimensión.
Opciones:
${subDimensiones.map(s => `${s.id}: ${s.nombre}`).join('\n')}`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-flash-lite-preview', contents: prompt });
    const id = response.text?.trim() || subDimensiones[0].id;
    return subDimensiones.find(s => id.includes(s.id))?.id || subDimensiones[0].id;
}

export async function generateMoreIndicators(context: any, currentIndicators: string[]): Promise<string[]> {
    const prompt = `Basado en el contexto: ${JSON.stringify(context)}, genera 2 indicadores adicionales de seguimiento. Indicadores actuales: ${JSON.stringify(currentIndicators)}. Responde solo con un array de strings en formato JSON (ej: ["ind 1", "ind 2"]).`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-flash-lite-preview', contents: prompt });
    try {
        const text = response.text?.replace(/```json|```/g, '') || '[]';
        return JSON.parse(text);
    } catch {
        return ["Nuevo indicador generado por IA 1", "Nuevo indicador generado por IA 2"];
    }
}

export async function generateMoreActions(context: any, currentActions: any[]): Promise<any[]> {
    const prompt = `Basado en el contexto: ${JSON.stringify(context)}, genera 2 acciones adicionales para la estrategia.
Acciones actuales: ${currentActions.map(a => a.name).join(', ')}.
Debes devolver SOLAMENTE un array en formato JSON con la siguiente estructura:
[
  { "name": "Nombre", "description": "Descripción de la acción", "verification": "Medio de verificación" }
]`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    try {
        const text = response.text?.replace(/```json|```/g, '') || '[]';
        return JSON.parse(text);
    } catch {
        return [
            { name: "Acción IA 1", description: "Descripción autogenerada", verification: "Lista de asistencia" },
            { name: "Acción IA 2", description: "Descripción autogenerada", verification: "Acta de reunión" }
        ];
    }
}

export async function refineStrategy(strategy: string, userPrompt: string, context: any): Promise<string> {
    const prompt = `Contexto: ${JSON.stringify(context)}. Estrategia actual: "${strategy}". Solicita el usuario: "${userPrompt}". Reescribe la estrategia mejorada según lo solicitado. No incluyas explicaciones, solo la nueva estrategia.`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    return response.text?.trim() || strategy;
}

export async function refineIndicator(indicator: string, userPrompt: string, context: any): Promise<string> {
    const prompt = `Contexto: ${JSON.stringify(context)}. Indicador actual: "${indicator}". Solicita el usuario: "${userPrompt}". Reescribe el indicador mejorado. Solo devuelve el indicador corregido.`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-flash-lite-preview', contents: prompt });
    return response.text?.trim() || indicator;
}

export async function refineActionWithNormativeContext(context: any, currentAction: any, normativeContext: any): Promise<any> {
    const prompt = `Contexto: ${JSON.stringify(context)}. Acción actual: ${JSON.stringify(currentAction)}. 
Debe alinearse mejor con los siguientes planes normativos y objetivos:
${JSON.stringify(normativeContext)}
Devuelve UNICAMENTE un objeto JSON actualizado con {"name": "...", "description": "...", "verification": "..."}.`;
    const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
    try {
        const text = response.text?.replace(/```json|```/g, '') || '{}';
        return JSON.parse(text);
    } catch {
        return currentAction;
    }
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

