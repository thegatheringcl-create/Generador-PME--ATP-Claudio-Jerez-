
import { GoogleGenAI, GenerateContentResponse, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { guiaPME, guiaDefiniciones, ejemplosObjetivos, ejemplosEstrategias, estandaresPME, ejemplosRazonamientoIndicadores, modeloEscuelaTotal } from '../pme-guides';
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
    // Intentamos todas las combinaciones posibles para no fallar
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || 
                   (process.env.GEMINI_API_KEY as string) ||
                   (process.env.VITE_GEMINI_API_KEY as string);
    
    if (!apiKey) {
        console.error("ERROR CRÍTICO: No se encontró VITE_GEMINI_API_KEY en Vercel.");
        throw new Error("Error de configuración: Por favor, asegúrate de haber agregado VITE_GEMINI_API_KEY en los ajustes de Vercel.");
    }
    
    return new GoogleGenAI({ apiKey });
};

// Using robust models for complex educational context generation.
const complexModelsToTry = [
    'gemini-3.1-pro-preview',
    'gemini-3-flash-preview',
    'gemini-3.1-flash-preview',
];

// Using fast models for suggestions.
const fastModelsToTry = [
    'gemini-3-flash-preview',
    'gemini-3.1-flash-preview',
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
        - Debe explicarse en términos de sistema.
        - Debe generar un cambio estructural.
        - Debe tener un horizonte anual.
        - Debe ser medible indirectamente mediante indicadores.
        - Debe responder directamente a los estándares priorizados mencionados arriba.

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

export const generateMetaEstrategica = async (params: MetaEstrategicaParams): Promise<string> => {
    const { objEstrategico, dimension, subdimension } = params;
    const ai = getAiInstance();

    const promptText = `
        Actúa como un experto asesor educacional en Chile. Tu tarea es redactar una "Meta Estratégica" para un PME del año 2026.
        
        IMPORTANTE: Las metas deben proyectarse para el año 2026 o posterior. Bajo ninguna circunstancia generes metas para años anteriores (como 2024 o 2025).
        
        DEFINICIÓN DE META ESTRATÉGICA:
        Es la expresión cuantitativa o cualitativa de lo que se pretende lograr en un periodo determinado (generalmente 4 años o anual). Debe ser SMART: Específica, Medible, Alcanzable, Relevante y con un Tiempo determinado.
        
        CONTEXTO:
        - Dimensión: ${dimension}
        - Subdimensión: ${subdimension}
        - Objetivo Estratégico: "${objEstrategico}"
        
        INSTRUCCIONES:
        - Redacta una meta SMART que sea coherente con el objetivo estratégico proporcionado.
        - Debe ser una sola oración o un párrafo muy breve.
        - No incluyas títulos ni introducciones. Solo el texto de la meta.
        
        Redacta la meta estratégica:
    `;

    let lastError: Error | null = null;
    for (const modelName of fastModelsToTry) {
        try {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [{ parts: [{ text: promptText }] }],
            });
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
    const { cantidad, dimension, subdimension, objEstrategico, metaEstrategica, estrategia, planesData, useGoogleSearch, estandaresSeleccionados, nudosCriticos } = params;
    const ai = getAiInstance();

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
        Actúa como un experto asesor educacional en Chile, especializado en PME para el año 2026.
        Tu tarea es completar una ficha de Plan de Mejoramiento Educativo. Si se solicita, usa Google Search para obtener información actualizada y fundamentada.

        IMPORTANTE: Todas las fechas y metas deben ser para el año 2026 o posterior. No menciones años anteriores.

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
        ${nudosCriticos ? '2.  **FOCO EN NUDOS CRÍTICOS:** Asegúrate de que las acciones propuestas aborden directamente los nudos críticos o focos de aprendizaje mencionados anteriormente.' : ''}
        ${nudosCriticos ? '3' : '2'}.  **Meta Estratégica:** Si el usuario proporcionó una meta ("${metaEstrategica}"), úsala. Si no, genera una meta SMART y concisa vinculada al objetivo.
        ${nudosCriticos ? '4' : '3'}.  **Formato de Salida:** Usa estrictamente el siguiente formato Markdown.

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
        | **Proceso** | Propuesta de Indicador de Proceso 1 | [Descripción] |
        | **Proceso** | Propuesta de Indicador de Proceso 2 | [Descripción] |
        | **Proceso** | Propuesta de Indicador de Proceso 3 | [Descripción] |
        | **Resultado** | Propuesta de Indicador de resultado 1 | [Descripción] |
        | **Resultado** | Propuesta de Indicador de resultado 2 | [Descripción] |
        | **Resultado** | Propuesta de Indicador de resultado 3 | [Descripción] |
        | **Impacto** | Propuesta de Indicador de Impacto 1 | [Descripción] |
        | **Impacto** | propuesta de Indicador de Impacto 2 | [Descripción] |
        | **Impacto** | propuesta de Indicador de Impacto 3 | [Descripción] |

        ## Acciones Propuestas
        ${actionBlocks}
        --- FIN DE LA PLANTILLA ---
    `;
    
    let lastError: Error | null = null;
    const modelForActions = complexModelsToTry[0];
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
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [{ parts: [{ text: promptText }] }],
            });
            const text = response.text;
            if (text) return text.trim().replace(/^"/, '').replace(/"$/, '');
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    throw new Error(`Error al generar el objetivo SMART: ${lastError?.message || 'Todos los modelos fallaron'}`);
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
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [{ parts: [{ text: promptText }] }],
            });
            const text = response.text;
            if (text) return text.trim().replace(/^"/, '').replace(/"$/, '');
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    throw new Error(`Error al generar el objetivo a partir de ideas: ${lastError?.message || 'Todos los modelos fallaron'}`);
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
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [{ parts: [{ text: promptText }] }],
            });
            const text = response.text;
            if (text) return text.trim().replace(/^"/, '').replace(/"$/, '');
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    throw new Error(`No se pudieron combinar los objetivos: ${lastError?.message || 'Todos los modelos fallaron'}`);
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
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [{ parts: [{ text: promptText }] }],
            });
            const text = response.text;
            if (text) return text.trim().replace(/^"/, '').replace(/"$/, '');
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    throw new Error(`Error al generar la meta SMART: ${lastError?.message || 'Todos los modelos fallaron'}`);
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
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [{ parts: [{ text: promptText }] }],
            });
            const text = response.text;
            if (text) return text.trim();
        } catch (error) {
            console.error(`Error con el modelo ${modelName}:`, error);
            lastError = error as Error;
        }
    }
    throw new Error(`Error al generar acciones e indicadores: ${lastError?.message || 'Todos los modelos fallaron'}`);
};
