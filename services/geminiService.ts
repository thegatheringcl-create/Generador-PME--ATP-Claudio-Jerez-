
import { GoogleGenAI, GenerateContentResponse, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { guiaPME, guiaDefiniciones, ejemplosObjetivos, ejemplosEstrategias, estandaresPME, ejemplosRazonamientoIndicadores } from '../pme-guides';

interface PmeActionParams {
    cantidad: number;
    dimension: string;
    subdimension: string;
    objEstrategico: string;
    metaEstrategica: string;
    estrategia: string;
    planesData: { plan: string; objetivos: string[]; }[];
    useGoogleSearch: boolean;
}

interface StrategicObjectiveParams {
    dimension: string;
    subdimension: string;
    planesData: { plan: string; objetivos: string[]; }[];
}

interface EstrategiaParams {
    dimension: string;
    subdimension: string;
    objEstrategico: string;
    metaEstrategica: string;
    planesData: { plan: string; objetivos: string[]; }[];
}


// Initialize the GoogleGenAI client.
// The API key is automatically sourced from the `process.env.API_KEY` environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using robust models for complex educational context generation.
const complexModelsToTry = [
    'gemini-3-pro-preview',
    'gemini-3-flash-preview',
];

// Using fast models for suggestions.
const fastModelsToTry = [
    'gemini-flash-lite-latest',
    'gemini-3-flash-preview',
];


export const generateEstrategia = async (params: EstrategiaParams): Promise<string> => {
    const { dimension, subdimension, objEstrategico, metaEstrategica, planesData } = params;

    const guiaSubdimension = (guiaPME as any)[dimension]?.[subdimension] || "No se encontró guía específica para esta subdimensión.";
    const ejemploSubdimension = (ejemplosEstrategias as any)[dimension]?.[subdimension] || "Implementación de un sistema de acompañamiento docente para fortalecer las capacidades pedagógicas.";
    const estandaresSubdimension = (estandaresPME as any)[dimension]?.[subdimension] || [];

    const planesTextoPrompt = planesData.length > 0 
        ? planesData
            .map(p => `- Plan: "${p.plan}" con los objetivos: ${p.objetivos.map(o => `"${o}"`).join(', ')}`)
            .join("\n            ")
        : "No se vincularon planes normativos específicos.";

    const promptText = `
        Actúa como un experto asesor educacional chileno. Tu tarea es definir una "Estrategia PME" general.

        CONSIDERA LAS SIGUIENTES DEFINICIONES Y GUÍAS OFICIALES:
        1.  **Definición de Estrategia:** ${guiaDefiniciones.estrategia}
        2.  **Guía para la subdimensión seleccionada ("${subdimension}"):** "${guiaSubdimension}"
        3.  **Estándares de Desempeño asociados:** 
            ${estandaresSubdimension.map((s: string) => `- ${s}`).join('\n            ')}
        4.  **Ejemplo de referencia para esta subdimensión:** "${ejemploSubdimension}"

        CRITERIOS DE VALIDACIÓN TÉCNICA (La estrategia debe cumplir con esto):
        - Debe explicarse en términos de sistema.
        - Debe generar un cambio estructural.
        - Debe tener un horizonte anual.
        - Debe ser medible indirectamente mediante indicadores.
        - Debe responder a uno o más de los estándares específicos mencionados arriba.

        Ahora, basándote en esas guías y en el siguiente contexto, redacta la estrategia:

        CONTEXTO ESPECÍFICO:
        1.  **Subdimensión PME a abordar:** "${subdimension}"
        2.  **Objetivo Estratégico a lograr:** "${objEstrategico}"
        3.  **Meta Estratégica (si existe):** "${metaEstrategica || 'No definida'}"
        4.  **Planes y objetivos normativos a articular:**
            ${planesTextoPrompt}

        INSTRUCCIONES FINALES:
        - Redacta una estrategia en 2 o 3 frases que integre todos los elementos del contexto.
        - La estrategia debe ser un puente conceptual entre el objetivo, la meta, los planes normativos y las futuras acciones, alineada con la guía y el ejemplo de la subdimensión.
        - No uses viñetas ni listados. No incluyas títulos.
        
        Redacta la estrategia:
    `;

    let lastError: Error | null = null;
    
     for (const modelName of fastModelsToTry) {
        try {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [{ parts: [{ text: promptText }] }],
                config: {
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
                    ]
                }
            });

            const text = response.text;
            if (text) return text.trim().replace(/^"/, '').replace(/"$/, '');
            throw new Error('La IA devolvió una estrategia vacía.');
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    
    throw lastError || new Error("Todos los modelos de IA fallaron al generar la estrategia.");
};

export const generateStrategicObjectiveSuggestion = async (params: StrategicObjectiveParams): Promise<string> => {
    const { dimension, subdimension, planesData } = params;

    const guiaSubdimension = (guiaPME as any)[dimension]?.[subdimension] || "No se encontró guía específica para esta subdimensión.";
    const ejemploSubdimension = (ejemplosObjetivos as any)[dimension]?.[subdimension] || "Fortalecer las prácticas pedagógicas para mejorar los aprendizajes.";

    const planesTextoPrompt = planesData.length > 0
        ? planesData
            .map(p => `- Plan: "${p.plan}" con los objetivos: ${p.objetivos.map(o => `"${o}"`).join(', ')}`)
            .join("\n")
        : "No se vincularon planes normativos específicos.";

    const promptText = `
        Actúa como un experto asesor educacional en Chile. Tu tarea es redactar una única propuesta para un "Objetivo Estratégico de PME".

        CONSIDERA LAS SIGUIENTES DEFINICIONES Y GUÍAS OFICIALES:
        1.  **Definición de Objetivo Estratégico (OE):** ${guiaDefiniciones.objetivoEstrategico}
        2.  **Guía para la subdimensión seleccionada ("${subdimension}"):** "${guiaSubdimension}"
        3.  **Ejemplo de referencia para esta subdimensión:** "${ejemploSubdimension}"

        Ahora, basándote en esas guías y en el siguiente contexto, redacta el objetivo:
        
        CONTEXTO ESPECÍFICO:
        1.  **Subdimensión PME a abordar:** "${subdimension}"
        2.  **Planes y objetivos normativos a articular:**
            ${planesTextoPrompt}
        
        INSTRUCCIONES FINALES:
        - Genera una sola oración que sirva como objetivo estratégico.
        - El objetivo debe ser aspiracional pero realista.
        - No incluyas títulos, solo el texto del objetivo.
        
        Redacta el objetivo estratégico:
    `;

    let lastError: Error | null = null;
    
    for (const modelName of fastModelsToTry) {
        try {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [{ parts: [{ text: promptText }] }],
                config: {
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
                    ]
                }
            });

            const text = response.text;
            if (text) return text.trim().replace(/^"/, '').replace(/"$/, '');
            throw new Error('La IA devolvió una sugerencia vacía.');
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    
    throw lastError || new Error("Todos los modelos de IA fallaron al generar la sugerencia.");
};


export const generatePmeActions = async (params: PmeActionParams): Promise<{ text: string, citations: any[] | undefined }> => {
    const { cantidad, dimension, subdimension, objEstrategico, metaEstrategica, estrategia, planesData, useGoogleSearch } = params;

    const estandaresSubdimension = (estandaresPME as any)[dimension]?.[subdimension] || [];

    const planesTextoPrompt = planesData.length > 0
        ? planesData
            .map(p => `- Plan: "${p.plan}" con los objetivos: ${p.objetivos.map(o => `"${o}"`).join(', ')}`)
            .join("\n")
        : "No se vincularon planes normativos específicos.";

    const actionBlocks = Array.from({ length: cantidad }, (_, i) => `
### Acción ${i + 1}: [Genera aquí un nombre claro y conciso para la acción ${i + 1}]
| Campo | Descripción |
| :--- | :--- |
| **Descripción de la Acción** | [Genera aquí una descripción detallada de la acción ${i + 1}, incluyendo pasos, recursos y vinculación normativa.] |
| **Planes Normativos Asociados** | ${planesData.length > 0 ? planesData.map(p => p.plan).join(', ') : 'Ninguno'} |
| **Fecha de Inicio Sugerida** | [Genera aquí una fecha de inicio, ej: Marzo 2025] |
| **Fecha de Término Sugerida** | [Genera aquí una fecha de término, ej: Diciembre 2025] |
| **Medios de Verificación** | 1. [Genera aquí el primer medio de verificación] <br> 2. [Genera aquí el segundo medio de verificación] |
`).join('\n');

    const promptText = `
        Actúa como un experto asesor educacional en Chile, especializado en PME.
        Tu tarea es completar una ficha de Plan de Mejoramiento Educativo. Si se solicita, usa Google Search para obtener información actualizada y fundamentada.

        DATOS DE CONTEXTO PROPORCIONADOS:
        - Dimensión PME: ${dimension}
        - Subdimensión PME: ${subdimension}
        - Estándares de Desempeño: ${estandaresSubdimension.join('; ')}
        - Objetivo Estratégico PME: "${objEstrategico}"
        - Meta Estratégica: "${metaEstrategica || 'Generar una meta SMART basada en el objetivo'}"
        - Estrategia General: "${estrategia}"
        - Planes Normativos a Articular:
        ${planesTextoPrompt}
        - Cantidad de Acciones a generar: ${cantidad}

        INSTRUCCIONES PARA LOS INDICADORES:
        Utiliza el siguiente MODELO DE RAZONAMIENTO para formular los indicadores. Los indicadores de Proceso/Resultado miden ejecución y uso, mientras que los de Impacto miden el efecto real en el propósito estratégico (aprendizajes, clima, etc.).

        MODELO DE RAZONAMIENTO Y EJEMPLOS:
        ${ejemplosRazonamientoIndicadores}

        REQUERIMIENTO OBLIGATORIO:
        Debes generar como MÍNIMO TRES (3) indicadores por cada categoría en la sección de 'Seguimiento a la Estrategia' (9 indicadores en total):
        1. **Indicadores de Proceso (Seguimiento)**: Al menos 3. Miden el avance en la ejecución de las acciones y el cumplimiento de lo planificado (Nivel de implementación).
        2. **Indicadores de Resultado**: Al menos 3. Miden los cambios intermedios en las prácticas pedagógicas o de gestión. Permiten observar si la ejecución está generando transformaciones relevantes.
        3. **Indicadores de Impacto**: Al menos 3. Miden el cambio significativo, final y verificable que la estrategia produce en los aprendizajes de los estudiantes o en la gestión institucional, en coherencia con el objetivo estratégico.

        INSTRUCCIONES GENERALES:
        1.  **Completa la Ficha:** Rellena TODOS los campos de la plantilla. Sé técnico, preciso y coherente con los Estándares de Desempeño.
        2.  **Meta Estratégica:** Si el usuario proporcionó una meta ("${metaEstrategica}"), úsala. Si no, genera una meta SMART y concisa vinculada al objetivo.
        3.  **Formato de Salida:** Usa estrictamente el siguiente formato Markdown.

        --- INICIO DE LA PLANTILLA ---

        # I. Dimensión: ${dimension}

        ## Planificación General
        | Campo | Contenido |
        | :--- | :--- |
        | **Objetivo Estratégico** | ${objEstrategico} |
        | **Meta Estratégica** | ${metaEstrategica ? metaEstrategica : '[Genera aquí una meta SMART y concisa vinculada al objetivo]'} |
        | **Estrategia** | ${estrategia} |
        | **Subdimensión** | ${subdimension} |

        ## Seguimiento a la Estrategia
        | Tipo de Indicador | Nombre Indicador | Descripción Indicador |
        | :--- | :--- | :--- |
        | **Proceso** | [Indicador Proceso 1] | [Descripción] |
        | **Proceso** | [Indicador Proceso 2] | [Descripción] |
        | **Proceso** | [Indicador Proceso 3] | [Descripción] |
        | **Resultado** | [Indicador Resultado 1] | [Descripción] |
        | **Resultado** | [Indicador Resultado 2] | [Descripción] |
        | **Resultado** | [Indicador Resultado 3] | [Descripción] |
        | **Impacto** | [Indicador Impacto 1] | [Descripción] |
        | **Impacto** | [Indicador Impacto 2] | [Descripción] |
        | **Impacto** | [Indicador Impacto 3] | [Descripción] |

        ## Acciones Propuestas
        ${actionBlocks}
        --- FIN DE LA PLANTILLA ---
    `;
    
    let lastError: Error | null = null;
    const modelForActions = useGoogleSearch ? 'gemini-3-flash-preview' : complexModelsToTry[0];
    const config = {
        tools: useGoogleSearch ? [{googleSearch: {}}] : [],
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
        ]
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: modelForActions,
            contents: [{ parts: [{ text: promptText }] }],
            config: config
        });

        const text = response.text;
        if (text) {
            const citations = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            return { text, citations };
        }
        
        throw new Error('La IA devolvió una respuesta vacía.');

    } catch (error) {
        console.error(`Error con el modelo ${modelForActions}:`, error);
        lastError = error as Error;
    }

    throw lastError || new Error("El modelo de IA falló. Por favor, inténtalo de nuevo más tarde.");
};

export const generateImage = async (prompt: string, aspectRatio: string): Promise<{ imageUrl: string | null; text: string | null }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: { aspectRatio }
            }
        });

        let imageUrl: string | null = null;
        let text: string | null = null;

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64EncodeString: string = part.inlineData.data;
                imageUrl = `data:image/png;base64,${base64EncodeString}`;
            } else if (part.text) {
                text = part.text;
            }
        }
        
        if (!imageUrl) {
            throw new Error(text || "No se pudo generar la imagen.");
        }

        return { imageUrl, text };
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
};