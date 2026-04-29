
import { GoogleGenAI, GenerateContentResponse, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { guiaPME, guiaDefiniciones, ejemplosObjetivos, ejemplosEstrategias, estandaresPME, ejemplosRazonamientoIndicadores, modeloEscuelaTotal, codigosRecursosPME } from '../pme-guides';
import { Plan } from '../constants';

interface PmeActionParams {
    cantidad: number;
    dimension: string;
    subdimension: string;
    objEstrategico: string;
    metaEstrategica: string;
    estrategia: string;
    planesData: { plan: string; objetivos: string[]; }[];
    useGoogleSearch: boolean;
    estandaresSeleccionados: string[];
    nudosCriticos?: string;
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
    estandaresSeleccionados: string[];
    conceptosRefinamiento?: string;
    estrategiaActual?: string;
}

interface MetaEstrategicaParams {
    objEstrategico: string;
    dimension: string;
    subdimension: string;
}


// Helper to get a fresh instance of GoogleGenAI with the latest API key
const getAiInstance = () => {
    // In this environment, process.env.GEMINI_API_KEY is the standard way to access the key
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Explicitly check for common "missing key" string representations
    if (!apiKey || apiKey === 'undefined' || apiKey === 'null' || apiKey === '') {
        console.error("ERROR CRÍTICO: No se encontró la clave de API de Gemini. apiKey value:", apiKey);
        throw new Error("Clave de API no configurada. Si estás en AI Studio, ve a Settings y añade GEMINI_API_KEY. Si estás en Vercel, añádela como Variable de Entorno.");
    }
    
    return new GoogleGenAI({ apiKey });
};

/**
 * Helper to call Gemini using the proper SDK v1 structure
 */
const callAi = async (modelName: string, promptText: string, options: { tools?: any[], toolConfig?: any, config?: any, parts?: any[] } = {}) => {
    const ai = getAiInstance();
    const { tools, toolConfig, config, parts } = options;
    
    const contents = parts ? [{ parts }] : [{ parts: [{ text: promptText }] }];
    
    const request: any = {
        model: modelName,
        contents,
        config: {
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
            ],
            ...config
        }
    };

    // Tools must be at the root level, not inside config
    if (tools) request.tools = tools;
    if (toolConfig) request.toolConfig = toolConfig;
    
    return await ai.models.generateContent(request);
};

const formatGeminiError = (error: any): string => {
    if (!error) return 'Todos los modelos fallaron';
    const msg = error.message || String(error);
    if (msg.includes('429') || msg.includes('Quota exceeded') || msg.includes('RESOURCE_EXHAUSTED')) {
        return 'Has alcanzado el límite de consultas gratuitas de la IA por minuto. Por favor, espera unos 30 segundos y vuelve a intentarlo.';
    }
    if (msg.includes('404') || msg.includes('not found')) {
        return 'El modelo de IA seleccionado no está disponible temporalmente.';
    }
    if (msg.includes('API key not valid')) {
        return 'La clave de API de Gemini no es válida. Revisa la configuración.';
    }
    return msg;
};

// Using stable model aliases for reliable performance
const complexModelsToTry = [
    'gemini-3.1-pro-preview',
    'gemini-3-flash-preview',
    'gemini-1.5-pro-latest' // Fallback to 1.5 if 3.x series is unavailable
];

// Using fast models for suggestions
const fastModelsToTry = [
    'gemini-3-flash-preview',
    'gemini-1.5-flash-latest' // Fallback
];


export const generateEstrategia = async (params: EstrategiaParams): Promise<string> => {
    const { dimension, subdimension, objEstrategico, metaEstrategica, planesData, estandaresSeleccionados, conceptosRefinamiento, estrategiaActual } = params;
    const ai = getAiInstance();

    const guiaSubdimension = (guiaPME as any)[dimension]?.[subdimension] || "No se encontró guía específica para esta subdimensión.";
    const ejemploSubdimension = (ejemplosEstrategias as any)[dimension]?.[subdimension] || "Implementación de un sistema de acompañamiento docente para fortalecer las capacidades pedagógicas.";
    
    // Use selected standards if provided, otherwise use all for context but prioritize selected
    const estandaresTexto = estandaresSeleccionados.length > 0
        ? estandaresSeleccionados.map((s: string) => `- ${s}`).join('\n            ')
        : ((estandaresPME as any)[dimension]?.[subdimension] || []).map((s: string) => `- ${s}`).join('\n            ');

    const planesTextoPrompt = planesData.length > 0 
        ? planesData
            .map(p => `- Plan: "${p.plan}" con los objetivos: ${p.objetivos.map(o => `"${o}"`).join(', ')}`)
            .join("\n            ")
        : "No se vincularon planes normativos específicos.";

    const promptText = `
        Actúa como un experto asesor educacional chileno. Tu tarea es ${estrategiaActual ? 'REFINAR o AJUSTAR' : 'definir'} una "Estrategia PME" general para el periodo 2026 en adelante.

        CONSIDERA LAS SIGUIENTES DEFINICIONES Y GUÍAS OFICIALES:
        1.  **Definición de Estrategia:** ${guiaDefiniciones.estrategia}
        2.  **Guía para la subdimensión seleccionada ("${subdimension}"):** "${guiaSubdimension}"
        3.  **Estándares de Desempeño priorizados:** 
            ${estandaresTexto}
        4.  **Ejemplo de referencia para esta subdimensión:** "${ejemploSubdimension}"

        CRITERIOS DE VALIDACIÓN TÉCNICA (La estrategia debe cumplir con esto):
        - Coherencia: Debe estar alineada con el objetivo estratégico y los planes por normativa (SEP/PIE). No debe ser una generalidad.
        - Proporcionalidad: Debe ser una acción o línea de acción que se pueda distribuir de manera equilibrada en el ciclo de mejora, no debe intentar resolver todo a la vez.
        - Factibilidad: Debe ser posible de implementar durante un periodo anual (o menos) con los recursos disponibles. No debe ser una tarea administrativa general.
        - Debe ser un medio para alcanzar el fin (el objetivo), enfocada en un proceso y no solo en un evento.

        Ahora, basándote en esas guías y en el siguiente contexto, redacta la estrategia:

        CONTEXTO ESPECÍFICO:
        1.  **Subdimensión PME a abordar:** "${subdimension}"
        2.  **Objetivo Estratégico a lograr:** "${objEstrategico}"
        3.  **Meta Estratégica (si existe):** "${metaEstrategica || 'No definida'}"
        4.  **Planes y objetivos normativos a articular:**
            ${planesTextoPrompt}
        ${estrategiaActual ? `5. **Estrategia Actual a Refinar:** "${estrategiaActual}"` : ''}
        ${conceptosRefinamiento ? `${estrategiaActual ? '6' : '5'}. **CONCEPTOS O AJUSTES A CONSIDERAR:** "${conceptosRefinamiento}"` : ''}

        INSTRUCCIONES FINALES:
        - Redacta una estrategia en 2 o 3 frases que integre todos los elementos del contexto${conceptosRefinamiento ? ' y los nuevos conceptos solicitados' : ''}.
        - MÁXIMO 500 CARACTERES.
        - La estrategia debe ser un puente conceptual entre el objetivo, la meta, los planes normativos y las futuras acciones, alineada con la guía y el ejemplo de la subdimensión.
        - No uses viñetas ni listados. No incluyas títulos.
        
        ${estrategiaActual ? 'Refina y redacta la nueva estrategia:' : 'Redacta la estrategia:'}
    `;

    let lastError: Error | null = null;
    
     for (const modelName of fastModelsToTry) {
        try {
            const response = await callAi(modelName, promptText);
            const text = response.text;
            if (text) return text.trim().replace(/^"/, '').replace(/"$/, '');
            throw new Error('La IA devolvió una estrategia vacía.');
        } catch (error) {
            console.warn(`Intento fallido con ${modelName}:`, error);
            lastError = error as Error;
            // Si es un error de clave de API, no intentamos otros modelos
            if (lastError.message.includes('API key')) break;
        }
    }
    
    throw lastError || new Error("Todos los modelos de IA fallaron al generar la estrategia.");
};

export const generateMetaEstrategica = async (params: MetaEstrategicaParams): Promise<string> => {
    const { objEstrategico, dimension, subdimension } = params;
    const ai = getAiInstance();

    const promptText = `
        Actúa como un experto asesor educacional en Chile. Tu tarea es redactar una "Meta Estratégica" para un PME del año 2026.
        
        IMPORTANTE: Las metas deben proyectarse para el año 2026 o posterior. Bajo ninguna circunstancia generes metas para años anteriores (como 2024 o 2025).
        
        DEFINICIÓN DE META ESTRATÉGICA (Criterios MARTE):
        Para que la meta sea válida, DEBE cumplir con los criterios MARTE:
        - M (Medible): Tiene un indicador cuantificable (ej: % de logro, N° de...).
        - A (Alcanzable): Es posible de cumplir en 4 años con las capacidades actuales.
        - R (Retador): No es una meta trivial, busca una mejora real de los aprendizajes.
        - T (Temporal): Define un plazo claro (final del ciclo 4 años o monitoreo anual).
        - E (Específico): Es clara, directa y fácil de imaginar sin ambigüedades.
        
        INSTRUCCIONES:
        - Redacta una meta MARTE coherente con el objetivo estratégico proporcionado.
        - Debe redactarse usando la fórmula: [Indicador Cuantitativo] + [Acción realizada] + [Práctica/Procedimiento] + [Contexto de logro] + [Temporalidad].
        - No incluyas títulos ni introducciones. Solo el texto de la meta.
        
        Redacta la meta estratégica:
    `;

    let lastError: Error | null = null;
    for (const modelName of fastModelsToTry) {
        try {
            const response = await callAi(modelName, promptText);
            const text = response.text;
            if (text) return text.trim().replace(/^"/, '').replace(/"$/, '');
        } catch (error) {
            lastError = error as Error;
        }
    }
    throw lastError || new Error("Error al generar la meta estratégica.");
};

export const generateStrategicObjectiveSuggestion = async (params: StrategicObjectiveParams): Promise<string> => {
    const { dimension, subdimension, planesData } = params;
    const ai = getAiInstance();

    const guiaSubdimension = (guiaPME as any)[dimension]?.[subdimension] || "No se encontró guía específica para esta subdimensión.";
    const ejemploSubdimension = (ejemplosObjetivos as any)[dimension]?.[subdimension] || "Fortalecer las prácticas pedagógicas para mejorar los aprendizajes.";

    const planesTextoPrompt = planesData.length > 0
        ? planesData
            .map(p => `- Plan: "${p.plan}" con los objetivos: ${p.objetivos.map(o => `"${o}"`).join(', ')}`)
            .join("\n")
        : "No se vincularon planes normativos específicos.";

    const promptText = `
        Actúa como un experto asesor educacional en Chile. Tu tarea es redactar una única propuesta para un "Objetivo Estratégico de PME" para el año 2026.

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
            const response = await callAi(modelName, promptText);
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
    const { cantidad, dimension, subdimension, objEstrategico, metaEstrategica, estrategia, planesData, useGoogleSearch, estandaresSeleccionados, nudosCriticos } = params;
    
    const estandaresTexto = estandaresSeleccionados && estandaresSeleccionados.length > 0
        ? estandaresSeleccionados.join('; ')
        : ((estandaresPME as any)[dimension]?.[subdimension] || []).join('; ');

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
| **Fecha de Inicio Sugerida** | [Genera aquí una fecha de inicio, ej: Marzo 2026] |
| **Fecha de Término Sugerida** | [Genera aquí una fecha de término, ej: Diciembre 2026] |
| **Medios de Verificación** | 1. [Genera aquí el primer medio de verificación] <br> 2. [Genera aquí el segundo medio de verificación] |
`).join('\n');

    const promptText = `
        Actúa como un experto asesor educacional en Chile, especializado en PME para el ciclo 2026-2029.
        Tu tarea es completar una ficha de Plan de Mejoramiento Educativo (PME) con un enfoque técnico, profesional y alineado con la normativa vigente.
        
        ${useGoogleSearch ? 'IMPORTANTE: Tienes acceso a Google Search. ÚSALO proactivamente para fundamentar tus propuestas con evidencia actualizada sobre estrategias de mejora escolar, marcos para la buena enseñanza y estándares de desempeño del MINEDUC Chile.' : ''}

        IMPORTANTE: Todas las fechas y metas deben ser proyectadas para el año 2026 o posterior.

        DATOS DE CONTEXTO PROPORCIONADOS:
        - Dimensión PME: ${dimension}
        - Subdimensión PME: ${subdimension}
        - Estándares de Desempeño priorizados: ${estandaresTexto}
        - Objetivo Estratégico PME: "${objEstrategico}"
        - Meta Estratégica: "${metaEstrategica || 'Generar una meta SMART basada en el objetivo'}"
        - Estrategia General: "${estrategia}"
        ${nudosCriticos ? `- Nudos Críticos / Focos de Aprendizaje a considerar: "${nudosCriticos}"` : ''}
        - Planes Normativos a Articular:
        ${planesTextoPrompt}
        - Cantidad de Acciones a generar: ${cantidad}

        INSTRUCCIONES PARA LOS INDICADORES:
        Utiliza el siguiente MODELO DE RAZONAMIENTO para formular indicadores que permitan un monitoreo efectivo.
        
        MODELO DE REALIMENTACIÓN E INDICADORES:
        ${ejemplosRazonamientoIndicadores}

        REQUERIMIENTO OBLIGATORIO DE INDICADORES:
        Debes generar 9 indicadores en total (3 por categoría) para la sección de 'Seguimiento a la Estrategia':
        1. **Proceso**: Al menos 3 que midan el cumplimiento de actividades/hitos.
        2. **Resultado**: Al menos 3 que midan cambios en las prácticas o productos intermedios.
        3. **Impacto**: Al menos 3 que midan el efecto final en los aprendizajes o gestión institucional.

        FORMATO DE SALIDA:
        Usa estrictamente la siguiente plantilla Markdown. Sé exhaustivo en las descripciones.

        --- INICIO DE LA PLANTILLA ---

        # I. Dimensión: ${dimension}

        ## Planificación General
        | Campo | Contenido |
        | :--- | :--- |
        | **Objetivo Estratégico** | ${objEstrategico} |
        | **Meta Estratégica** | ${metaEstrategica ? metaEstrategica : '[Genera aquí una meta SMART vinculada al objetivo]'} |
        | **Estrategia** | ${estrategia} |
        | **Subdimensión** | ${subdimension} |

        ## Seguimiento a la Estrategia
        | Tipo de Indicador | Nombre Indicador | Descripción Indicador |
        | :--- | :--- | :--- |
        | **Proceso** | [Nombre] | [Descripción] |
        | **Proceso** | [Nombre] | [Descripción] |
        | **Proceso** | [Nombre] | [Descripción] |
        | **Resultado** | [Nombre] | [Descripción] |
        | **Resultado** | [Nombre] | [Descripción] |
        | **Resultado** | [Nombre] | [Descripción] |
        | **Impacto** | [Nombre] | [Descripción] |
        | **Impacto** | [Nombre] | [Descripción] |
        | **Impacto** | [Nombre] | [Descripción] |

        ## Acciones Propuestas
        ${actionBlocks}
        --- FIN DE LA PLANTILLA ---
    `;
    
    let lastError: Error | null = null;
    for (const modelName of complexModelsToTry) {
        try {
            const response = await callAi(modelName, promptText, {
                tools: useGoogleSearch ? [{ googleSearch: {} }] : []
            });

            const text = response.text;
            if (text) {
                const citations = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
                return { text, citations };
            }
            
            throw new Error('La IA devolvió una respuesta vacía.');

        } catch (error) {
            console.warn(`Intento fallido con ${modelName} (Actions):`, error);
            lastError = error as Error;
            if (lastError.message.includes('API key')) break;
        }
    }

    throw lastError || new Error("El modelo de IA falló al generar las acciones.");
};


export const generateSmartObjective = async (params: {
    accion: string;
    que: string;
    paraQue: string;
    como: string;
    dimension?: string;
    subdimension?: string;
    estandaresSeleccionados?: string[];
    refinement?: string;
    previousObjective?: string;
}): Promise<string> => {
    const { accion, que, paraQue, como, dimension, subdimension, estandaresSeleccionados, refinement, previousObjective } = params;
    const ai = getAiInstance();

    const isConvivencia = dimension === "Formación y Convivencia" && subdimension === "Convivencia";
    const escuelaTotalContext = isConvivencia ? `
        MODELO DE ESCUELA TOTAL (Para Convivencia):
        ${JSON.stringify(modeloEscuelaTotal, null, 2)}
        Utiliza este modelo para fundamentar el objetivo si es pertinente.
    ` : '';

    const estandaresTexto = estandaresSeleccionados && estandaresSeleccionados.length > 0
        ? `ESTÁNDARES ASOCIADOS:\n${estandaresSeleccionados.map(s => `- ${s}`).join('\n')}`
        : '';

    const promptText = `
        Actúa como un experto asesor educacional chileno. Tu tarea es redactar un "Objetivo Estratégico" siguiendo la estructura fundamental y los criterios SMART.

        ${escuelaTotalContext}

        ESTRUCTURA FUNDAMENTAL:
        - Verbo en infinitivo: Define la acción principal (ej. Analizar, Determinar, Diseñar).
        - El "Qué": El fenómeno, producto o resultado concreto que se desea alcanzar.
        - El "Para qué" (Finalidad): El propósito o impacto que se busca.
        - El "Mediante" (Cómo): Los recursos, métodos o estrategias para lograrlo.

        CARACTERÍSTICAS SMART:
        - Específicos: Claros y precisos.
        - Medibles: Permiten evaluar el avance.
        - Alcanzables: Posibles de cumplir.
        - Realistas/Relevantes: Pertinentes al contexto.
        - Temporales: Acotados a un periodo de tiempo (asume periodo PME 2026).

        DATOS PROPORCIONADOS POR EL USUARIO:
        1. Acción (Verbo): ${accion}
        2. Qué: ${que}
        3. Para qué: ${paraQue}
        4. Cómo: ${como}
        ${dimension ? `5. Dimensión: ${dimension}` : ''}
        ${subdimension ? `6. Subdimensión: ${subdimension}` : ''}
        ${estandaresTexto}

        ${previousObjective ? `OBJETIVO ANTERIOR: "${previousObjective}"` : ''}
        ${refinement ? `REFINAMIENTO SOLICITADO: "${refinement}"` : ''}

        INSTRUCCIONES:
        - Redacta un único párrafo fluido que integre estos 4 elementos.
        - Asegúrate de que comience con el verbo en infinitivo.
        - Debe sonar profesional, técnico y coherente con el contexto escolar chileno.
        - No incluyas títulos ni etiquetas, solo el texto del objetivo.
    `;

    let lastError: Error | null = null;
    for (const modelName of fastModelsToTry) {
        try {
            const response = await callAi(modelName, promptText);
            const text = response.text;
            if (text) return text.trim().replace(/^"/, '').replace(/"$/, '');
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    throw new Error(`Error al generar el objetivo SMART: ${formatGeminiError(lastError)}`);
};

export const generateObjectiveFromIdeas = async (params: {
    ideas: string;
    plan?: string;
    dimension?: string;
    subdimension?: string;
}): Promise<string> => {
    const { ideas, plan, dimension, subdimension } = params;
    const ai = getAiInstance();

    const isConvivencia = (dimension === "Formación y Convivencia" && subdimension === "Convivencia") || plan === Plan.GESTION_CONVIVENCIA;
    const escuelaTotalContext = isConvivencia ? `
        MODELO DE ESCUELA TOTAL (Para Convivencia):
        ${JSON.stringify(modeloEscuelaTotal, null, 2)}
        Asegúrate de que el objetivo sea coherente con este modelo si aplica (Niveles 1, 2 o 3).
    ` : '';

    const promptText = `
        Actúa como un experto asesor educacional chileno. Tu tarea es redactar un "Objetivo Estratégico" para un PME a partir de las siguientes ideas, conceptos o nudos críticos:
        
        ${escuelaTotalContext}

        IDEAS/CONCEPTOS: "${ideas}"
        ${plan ? `PLAN NORMATIVO: ${plan}` : ''}
        ${dimension ? `DIMENSIÓN: ${dimension}` : ''}
        ${subdimension ? `SUBDIMENSIÓN: ${subdimension}` : ''}

        INSTRUCCIONES:
        - Redacta un único objetivo estratégico fluido.
        - Debe seguir la estructura: Verbo en infinitivo + Qué + Para qué + Cómo.
        - Debe ser SMART y coherente con el contexto escolar chileno.
        - No incluyas títulos ni etiquetas, solo el texto del objetivo.
    `;

    let lastError: Error | null = null;
    for (const modelName of fastModelsToTry) {
        try {
            const response = await callAi(modelName, promptText);
            const text = response.text;
            if (text) return text.trim().replace(/^"/, '').replace(/"$/, '');
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    throw new Error(`Error al generar el objetivo a partir de ideas: ${formatGeminiError(lastError)}`);
};

export const combineObjectives = async (params: {
    objectives: string[];
    plan: string;
    dimension: string;
    subdimension: string;
}): Promise<string> => {
    const { objectives, plan, dimension, subdimension } = params;
    const ai = getAiInstance();

    const isConvivencia = (dimension === "Formación y Convivencia" && subdimension === "Convivencia") || plan === Plan.GESTION_CONVIVENCIA;
    const escuelaTotalContext = isConvivencia ? `
        MODELO DE ESCUELA TOTAL (Para Convivencia):
        ${JSON.stringify(modeloEscuelaTotal, null, 2)}
        Asegúrate de que el objetivo sea coherente con este modelo si aplica (Niveles 1, 2 o 3).
    ` : '';

    const objectivesList = objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n');

    const promptText = `
        Actúa como un experto asesor educacional chileno. El usuario ha seleccionado los siguientes objetivos normativos/base para su PME:
        
        ${objectivesList}

        ${escuelaTotalContext}

        Contexto Institucional:
        - Plan: ${plan}
        - Dimensión: ${dimension}
        - Subdimensión: ${subdimension}

        TAREA:
        Tu misión es COMBINAR e INTEGRAR estos objetivos en un único "Objetivo Estratégico" potente y coherente.
        
        REQUISITOS TÉCNICOS:
        1. Estructura: Debe comenzar con un verbo en infinitivo fuerte.
        2. Componentes: Debe incluir el Qué, Para qué y el Cómo (estrategia).
        3. Estilo: Lenguaje técnico pedagógico chileno, profesional y sintético.
        4. SMART: Debe ser un objetivo para el periodo PME (asume 2026).
        
        No menciones que estás combinando objetivos, simplemente entrega el texto del nuevo objetivo estratégico resultante.
    `;

    let lastError: Error | null = null;
    for (const modelName of fastModelsToTry) {
        try {
            const response = await callAi(modelName, promptText);
            const text = response.text;
            if (text) return text.trim().replace(/^"/, '').replace(/"$/, '');
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    throw new Error(`No se pudieron combinar los objetivos: ${formatGeminiError(lastError)}`);
};

export const generateSmartGoal = async (params: {
    objective: string;
    dimension?: string;
    subdimension?: string;
    estandaresSeleccionados?: string[];
    refinement?: string;
    previousGoal?: string;
}): Promise<string> => {
    const { objective, dimension, subdimension, estandaresSeleccionados, refinement, previousGoal } = params;
    const ai = getAiInstance();

    const isConvivencia = dimension === "Formación y Convivencia" && subdimension === "Convivencia";
    const escuelaTotalContext = isConvivencia ? `
        MODELO DE ESCUELA TOTAL (Para Convivencia):
        ${JSON.stringify(modeloEscuelaTotal, null, 2)}
        Asegúrate de que la meta sea coherente con este modelo si aplica.
    ` : '';

    const promptText = `
        Actúa como un experto asesor educacional chileno. Tu tarea es redactar una "Meta" basada en un objetivo estratégico, siguiendo el modelo SMART.

        ${escuelaTotalContext}

        ESTRUCTURA PARA REDACTAR UNA META:
        - Verbo en infinitivo: Acción a realizar (ej. Aumentar, Reducir, Lograr).
        - Indicador: Qué se va a medir (ej. 5 kilos, 10% de ventas, un puesto gerencial).
        - Contexto/Propósito: Por qué o para qué.
        - Plazo: Cuándo debe estar lista (ej. para diciembre de 2026).

        OBJETIVO DE REFERENCIA:
        "${objective}"
        ${dimension ? `Dimensión: ${dimension}` : ''}
        ${subdimension ? `Subdimensión: ${subdimension}` : ''}

        ${previousGoal ? `META ANTERIOR: "${previousGoal}"` : ''}
        ${refinement ? `REFINAMIENTO SOLICITADO: "${refinement}"` : ''}

        INSTRUCCIONES:
        - Redacta una meta específica y cuantificable que permita medir el cumplimiento del objetivo.
        - Debe incluir un indicador numérico o porcentual claro.
        - Debe tener un plazo definido (asume 2026).
        - No incluyas títulos ni etiquetas, solo el texto de la meta.
    `;

    let lastError: Error | null = null;
    for (const modelName of fastModelsToTry) {
        try {
            const response = await callAi(modelName, promptText);
            const text = response.text;
            if (text) return text.trim().replace(/^"/, '').replace(/"$/, '');
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    throw new Error(`Error al generar la meta SMART: ${formatGeminiError(lastError)}`);
};

export const generateSmartActionsAndIndicators = async (params: {
    objective: string;
    goal: string;
    dimension: string;
    subdimension: string;
    estandaresSeleccionados: string[];
    refinement?: string;
    previousResult?: string;
}): Promise<string> => {
    const { objective, goal, dimension, subdimension, estandaresSeleccionados, refinement, previousResult } = params;
    const ai = getAiInstance();

    const isConvivencia = dimension === "Formación y Convivencia" && subdimension === "Convivencia";
    const escuelaTotalContext = isConvivencia ? `
        MODELO DE ESCUELA TOTAL (Para Convivencia):
        ${JSON.stringify(modeloEscuelaTotal, null, 2)}
        Las acciones e indicadores deben estar alineados con este modelo (Niveles 1, 2 o 3 según corresponda al objetivo).
    ` : '';

    const estandaresTexto = estandaresSeleccionados.map(s => `- ${s}`).join('\n');

    const promptText = `
        Actúa como un experto asesor educacional chileno. Tu tarea es generar una propuesta de ACCIONES e INDICADORES para un PME.

        ${escuelaTotalContext}

        CONTEXTO:
        - Objetivo Estratégico: "${objective}"
        - Meta: "${goal}"
        - Dimensión: ${dimension}
        - Subdimensión: ${subdimension}
        - Estándares Priorizados:
        ${estandaresTexto}

        ${previousResult ? `PROPUESTA ANTERIOR: "${previousResult}"` : ''}
        ${refinement ? `REFINAMIENTO SOLICITADO: "${refinement}"` : ''}

        REQUERIMIENTOS:
        1. Genera una lista de 3 a 5 ACCIONES concretas para lograr el objetivo.
        2. Genera TRES (3) INDICADORES específicos:
           - 1 Indicador de SEGUIMIENTO (Proceso): Mide el avance en la ejecución.
           - 1 Indicador de RESULTADO: Mide el logro inmediato o intermedio.
           - 1 Indicador de IMPACTO: Mide el efecto final en el propósito estratégico.

        GUÍA PARA INDICADORES:
        ${ejemplosRazonamientoIndicadores}

        INSTRUCCIONES DE FORMATO:
        - Usa Markdown.
        - Sé técnico, preciso y coherente con el contexto escolar chileno.
        - No incluyas introducciones innecesarias.

        Genera la propuesta:
    `;

    let lastError: Error | null = null;
    for (const modelName of complexModelsToTry) {
        try {
            const response = await callAi(modelName, promptText);
            const text = response.text;
            if (text) return text.trim();
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    throw new Error(`Error al generar acciones e indicadores: ${formatGeminiError(lastError)}`);
};

export const generateAnnualPlan = async (params: {
    level: string;
    subject: string;
    objectives: string[];
}) => {
    const promptText = `Eres un experto en diseño curricular, neurociencias aplicadas a la educación y Diseño Universal para el Aprendizaje (DUA).
        
        Tu tarea es crear un PLAN ANUAL DE ESTUDIOS para el nivel "${params.level}" en la asignatura "${params.subject}".
        
        Los Objetivos de Aprendizaje (OA) seleccionados son:
        ${params.objectives.join('\n')}
        
        Debes entregar una respuesta en formato JSON con la siguiente estructura:
        {
            "units": [
                {
                    "number": 1,
                    "name": "Nombre de la Unidad",
                    "months": ["MARZO", "ABRIL"],
                    "objectives": [
                        {
                            "id": "OA X",
                            "description": "Descripción del OA",
                            "evaluationIndicators": ["Indicador 1", "Indicador 2"]
                        }
                    ]
                }
            ]
        }
        
        Consideraciones importantes:
        1. Distribuye los OA de forma lógica entre MARZO y NOVIEMBRE.
        2. Crea indicadores de evaluación precisos y observables para cada OA.
        3. El nombre de la unidad debe ser motivador y relacionado con los OA.
        4. Aplica principios de neurociencia (atención, memoria, emoción) y DUA (múltiples formas de representación, acción y expresión, y compromiso).`;

    const response = await callAi('gemini-3-flash-preview', promptText, {
        config: { responseMimeType: 'application/json' }
    });

    return JSON.parse(response.text || '{}');
};

export const generateUnitPlan = async (params: {
    level: string;
    subject: string;
    unitName: string;
    objectives: any[];
    numClasses: number;
}) => {
    const promptText = `Eres un experto en planificación pedagógica, neurociencias y DUA.
        
        Crea un PLAN DE UNIDAD DIARIO para la unidad "${params.unitName}" del nivel "${params.level}" en "${params.subject}".
        La unidad tiene ${params.numClasses} clases.
        
        Objetivos de la unidad:
        ${params.objectives.map(o => `${o.id}: ${o.description}`).join('\n')}
        
        Debes entregar una respuesta en formato JSON con la siguiente estructura:
        {
            "classes": [
                {
                    "number": 1,
                    "objective": "Objetivo de la clase",
                    "situation": {
                        "start": "Descripción del inicio (activación de conocimientos previos)",
                        "development": "Descripción del desarrollo (situación de aprendizaje)",
                        "end": "Descripción del cierre (proceso de metacognición)"
                    },
                    "resources": ["Recurso 1", "Recurso 2"],
                    "startQuestions": ["Pregunta 1", "Pregunta 2"],
                    "endQuestions": ["Pregunta 1", "Pregunta 2"]
                }
            ]
        }
        
        Consideraciones:
        1. Cada clase debe tener un objetivo claro y alineado con los OA de la unidad.
        2. La situación de aprendizaje debe ser estructurada (Inicio, Desarrollo, Cierre).
        3. Incluye preguntas de activación de conocimientos previos para el inicio.
        4. Incluye preguntas de metacognición para el cierre.
        5. Aplica DUA y Neurociencias en cada actividad.`;

    const response = await callAi('gemini-3-flash-preview', promptText, {
        config: { responseMimeType: 'application/json' }
    });

    return JSON.parse(response.text || '{}');
};

/**
 * Realiza una revisión técnica de coherencia, pertinencia y calidad de un PME.
 * Proporciona feedback basado en los estándares del MINEDUC.
 * Puede recibir texto plano o datos de archivo (base64).
 */
export const evaluatePmeCoherence = async (params: {
    planData?: string;
    fileData?: { mimeType: string, data: string };
}): Promise<string> => {
    const { planData, fileData } = params;
    const ai = getAiInstance();

    // Contexto enriquecido con las guías del sistema
    const systemContext = `
        Utiliza el siguiente marco normativo y técnico para tu evaluación:
        - Estándares Indicativos de Desempeño: ${JSON.stringify(estandaresPME)}
        - Definiciones Técnicas (OE y Estrategia): ${JSON.stringify(guiaDefiniciones)}
        - Enfoque por Dimensiones: ${JSON.stringify(guiaPME)}
    `;

    const promptText = `
        Actúa como un experto Auditor y Asesor Técnico Pedagógico del Ministerio de Educación de Chile. 
        Tu tarea es realizar una REVISIÓN TÉCNICA DE COHERENCIA Y CALIDAD de un Plan de Mejoramiento Educativo (PME).

        MARCO TÉCNICO DE REFERENCIA:
        ${systemContext}

        CONSIDERA LOS SIGUIENTES CRITERIOS DE EVALUACIÓN:
        1. **Coherencia Horizontal:** ¿El Objetivo Estratégico responde a las necesidades de la Dimensión/Subdimensión? ¿La Estrategia es un puente efectivo entre el Objetivo y las Acciones?
        2. **Pertinencia:** ¿Las acciones son adecuadas para alcanzar las metas propuestas?
        3. **Calidad de Acciones:** ¿Las acciones son concretas, tienen responsables claros, plazos realistas y medios de verificación que permitan evidenciar el logro?
        4. **Articulación Normativa:** ¿Se integran correctamente los planes obligatorios (SEP, PIE, Convivencia, etc.)?
        5. **Indicadores:** ¿Los indicadores de Proceso, Resultado e Impacto son SMART y permiten medir efectivamente el progreso?

        ${planData ? `DATA DEL PLAN A REVISAR:\n${planData}` : 'Analiza el documento o imagen adjunta que contiene el reporte de planificación.'}

        INSTRUCCIONES DE SALIDA:
        Genera un informe estructurado en Markdown con las siguientes secciones:
        
        # Informe de Revisión Técnica PME 2026
        
        ## 1. Análisis de Coherencia Estratégica
        [Evalúa si el objetivo, meta y estrategia están alineados con los Estándares Indicativos de Desempeño. Usa un semáforo virtual: 🔴 Crítico, 🟡 En proceso, 🟢 Óptimo]

        ## 2. Evaluación de Acciones e Indicadores
        [Analiza si las acciones son suficientes y si los indicadores miden lo que se pretende de acuerdo a la lógica de Proceso/Resultado/Impacto.]

        ## 3. Fortalezas del Plan
        [Menciona al menos 3 puntos positivos alineados a las buenas prácticas del PME.]

        ## 4. Debilidades y Nudos Críticos
        [Identifica posibles fallos, falta de claridad o incumplimiento de definiciones técnicas.]

        ## 5. Recomendaciones de Mejora (Feedback accionable)
        [Entrega sugerencias concretas para refinar el plan y asegurar que cumpla con los estándares del MINEDUC.]

        Usa un lenguaje técnico-pedagógico constructivo, profesional y preciso.
    `;

    const parts: any[] = [{ text: promptText }];
    if (fileData) {
        parts.push({
            inlineData: {
                mimeType: fileData.mimeType,
                data: fileData.data
            }
        });
    }

    let lastError: Error | null = null;
    for (const modelName of complexModelsToTry) {
        try {
            const response = await callAi(modelName, promptText, { parts });
            const text = response.text;
            if (text) return text.trim();
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    throw new Error(`Error al realizar la revisión del PME: ${formatGeminiError(lastError)}`);
};

/**
 * Helper to clean Markdown JSON blocks if present and parse.
 */
const parseCleanJson = (text: string) => {
    try {
        // Remove markdown code blocks and any leading/trailing noise
        const cleaned = text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("Error parsing JSON:", text);
        // If it still fails, try to find a JSON object in the string
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch (e2) {
                throw new Error("Respuesta de IA con formato inválido.");
            }
        }
        throw e;
    }
};

/**
 * Realiza una revisión técnica de una ACCIÓN específica de un PME, comparándola con su contexto estratégico.
 */
export const evaluatePmeActionsCoherence = async (params: {
    context: {
        dimension: string;
        subdimension: string;
        oe: string;
        meta: string;
        strategy: string;
    };
    action: {
        name: string;
        description: string;
        indicator: string;
        resources: string;
        responsibles?: string;
        verificationMeans?: string;
    };
    existingActions?: string[];
}): Promise<any> => {
    const { context, action, existingActions = [] } = params;
    const ai = getAiInstance();

    const promptText = `
        Actúa como un experto Auditor Técnico Pedagógico del Ministerio de Educación de Chile, especialista en Planificación Estratégica PME 2026.
        Tu tarea es realizar una revisión técnica exhaustiva de una ACCIÓN y sus componentes, comparándolos con su contexto estratégico.

        CONTEXTO ESTRATÉGICO:
        - Dimensión: ${context.dimension}
        - Subdimensión: ${context.subdimension}
        - OE: "${context.oe}"
        - Meta: "${context.meta}"
        - Estrategia: "${context.strategy}"

        COMPONENTES DE LA ACCIÓN A EVALUAR:
        1. Nombre: "${action.name}"
        2. Descripción: "${action.description}"
        3. Recursos: "${action.resources}"
        4. Medios de Verificación: "${action.verificationMeans || 'No especificado'}"
        
        ACCIONES YA EXISTENTES EN LA ESTRATEGIA (NO PROPONGAS ESTAS MISMAS):
        ${existingActions.map(a => `- ${a}`).join('\n')}

        INSTRUCCIONES DE EVALUACIÓN:
        Para cada componente (excepto fechas), proporciona:
        - Análisis y Retroalimentación: Identifica aspectos a mejorar, falta de coherencia o debilidades técnicas.
        - Propuesta de Mejora: Indica cómo solucionar los problemas identificados, propón redacciones alternativas o da ejemplos concretos.
        IMPORTANTE: Verifica si la acción es redundante respecto a las acciones ya existentes mencionadas arriba. Si lo es, retroalimenta sobre la redundancia y propón un enfoque distinto o complementario que aporte valor, en lugar de replicar lo que ya existe.

        FORMATO DE SALIDA (ESTRICTAMENTE JSON):
        {
          "status": "Crítico" | "Mejorable" | "Óptimo",
          "evaluation": {
            "name": { "analysis": "...", "proposal": "..." },
            "description": { "analysis": "...", "proposal": "..." },
            "resources": { "analysis": "...", "proposal": "..." },
            "verificationMeans": { "analysis": "...", "proposal": "..." }
          }
        }
    `;

    let lastError: Error | null = null;
    for (const modelName of fastModelsToTry) {
        try {
            const response = await callAi(modelName, promptText, {
                config: { responseMimeType: "application/json" }
            });
            const text = response.text;
            return parseCleanJson(text || '{}');
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    throw new Error(`Error al revisar la acción: ${formatGeminiError(lastError)}`);
};

/**
 * Realiza una revisión técnica de un INDICADOR de seguimiento estratégico.
 */
export const evaluatePmeIndicator = async (params: {
    context: {
        dimension: string;
        subdimension: string;
        oe: string;
        meta: string;
        strategy: string;
    };
    indicator: {
        name: string;
        description: string;
    };
}): Promise<any> => {
    const { context, indicator } = params;
    const ai = getAiInstance();

    const promptText = `
        Actúa como un experto Auditor Técnico Pedagógico especialista en PME 2026.
        Tu tarea es revisar la calidad y pertinencia de un INDICADOR DE SEGUIMIENTO estratégico.

        CONTEXTO:
        - Meta Estratégica: "${context.meta}"
        - Estrategia: "${context.strategy}"

        INDICADOR A EVALUAR:
        - Nombre: "${indicator.name}"
        - Descripción: "${indicator.description}"

        MARCO DE REFERENCIA PME:
        El indicador puede ser:
        - Insumo: Recurso o condición inicial.
        - Resultado: Cambio en prácticas pedagógicas (gestión docente).
        - Impacto: Cambio significativo en aprendizajes (estudiantes).
        
        INSTRUCCIONES:
        Proporciona un análisis crítico y una propuesta de mejora siguiendo estrictamente el formato JSON.
        - Análisis y Retroalimentación:
          1. Evalúa si el indicador es coherente con la Meta y Estrategia.
          2. IMPORTANTE: No penalices los indicadores de "Impacto" (resultados de estudiantes) si son adecuados para medir la meta. Los indicadores de impacto son válidos y necesarios.
          3. Evalúa si es cuantificable y pertinente.
        - Propuesta de Mejora: Sugerencia de redacción técnica (ej. "% de estudiantes...", "% de docentes...", "N° de talleres realizados").

        FORMATO DE SALIDA (ESTRICTAMENTE JSON):
        {
          "analysis": "...",
          "proposal": "..."
        }
    `;

    let lastError: Error | null = null;
    for (const modelName of fastModelsToTry) {
        try {
            const response = await callAi(modelName, promptText, {
                config: { responseMimeType: "application/json" }
            });
            return parseCleanJson(response.text || '{}');
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    throw new Error(`Error al revisar el indicador: ${formatGeminiError(lastError)}`);
};

/**
 * Extrae la estructura estratégica de un documento PME (PDF o Imagen) para pre-llenar el revisor.
 */
export const extractPmeStructure = async (fileData: { mimeType: string, data: string }) => {
    const ai = getAiInstance();
    const promptText = `
        Analiza el documento o imagen adjunta que contiene un reporte de planificación PME (Chile 2026).
        Tu tarea es EXTRAER la estructura estratégica para pre-llenar un formulario técnico.

        TEN EN CUENTA LOS EJES PRIORITARIOS 2026:
        - Fortalecimiento de los aprendizajes.
        - Convivencia educativa y salud mental.
        - Asistencia y revinculación escolar.

        REFERENCIA DE CÓDIGOS DE RECURSOS:
        ${JSON.stringify(codigosRecursosPME)}

        BUSCA ELEMENTOS CLAVE:
        - Dimensiones y Subdimensiones.
        - Objetivos Estratégicos (OE) - El Destino.
        - Metas Estratégicas - La Medida.
        - Estrategias anuales - El Camino.
        - Acciones - Los Pasos.
        - Indicadores de Seguimiento Estratégico (CLUSTERED TABLE): En este reporte, los indicadores suelen aparecer todos juntos en una tabla inicial con columnas "Dimensión", "Estrategia", "Indicador" y "Descripción Indicador". Debes mapear cada indicador a su respectiva Estrategia y Dimensión.
        - Recursos - Financiamiento (SEP, PIE, etc.).

        NOTA SOBRE MODELO ESCUELA TOTAL:
        Si el documento menciona niveles de acción (Promocional, Focalizado, Individual), agrúpalos dentro de la descripción o nombre de la acción correspondiente.

        ESTRUCTURA DE DATOS REQUERIDA:
        1. Identifica la tabla de INDICADORES agrupados por Estrategia/Dimensión.
        2. Identifica las ACCIONES que pertenecen a cada Estrategia.
        3. Genera un objeto consolidado para cada "Línea Estratégica" (Dimensión + Estrategia).

        FORMATO DE SALIDA (ESTRICTAMENTE JSON):
        {
          "strategicLines": [
            {
              "dimension": "NOMBRE_DIMENSION (Ej: GESTIÓN PEDAGÓGICA)",
              "subdimension": "Nombre Subdimensión",
              "oe": "Texto del Objetivo Estratégico",
              "meta": "Texto de la Meta Estratégica",
              "strategy": "Texto de la Estrategia",
              "generalIndicators": [
                {
                  "name": "Nombre de Indicador de Seguimiento de la Estrategia",
                  "description": "Cómo se medirá"
                }
              ],
              "actions": [
                {
                  "name": "Nombre Acción",
                  "description": "Descripción Detallada",
                  "resources": "Recursos",
                  "verificationMeans": "Medios de Verificación"
                }
              ]
            }
          ]
        }

        Si no encuentras algún campo, es obligatorio usar un string vacío (""). No uses null ni undefined. No añadas notas o explicaciones fuera del JSON. Todo el texto debe ser parte de la estructura JSON. Es CRÍTICO que la respuesta sea un objeto JSON válido y completo.
    `;

    const parts: any[] = [
        { text: promptText },
        { inlineData: { mimeType: fileData.mimeType, data: fileData.data } }
    ];

    let lastError: Error | null = null;
    for (const modelName of complexModelsToTry) {
        try {
            const response = await callAi(modelName, promptText, {
                config: {
                    responseMimeType: "application/json",
                    temperature: 0.1
                },
                parts
            });

            const text = response.text;
            if (text) return parseCleanJson(text);
        } catch (error: any) {
            console.error(`Error al extraer estructura con ${modelName}:`, error);
            // Handle common error formats
            let errorMessage = error.message || 'Error desconocido';
            if (error.status === 403 || errorMessage.includes('Forbidden')) {
                errorMessage = "Acceso denegado (Forbidden). Es posible que la clave de API no tenga permisos para este modelo o el servicio esté restringido.";
            }
            lastError = new Error(errorMessage);
        }
    }
    throw new Error(`Error de IA al extraer la estructura: ${lastError ? lastError.message : 'Error desconocido'}`);
};
