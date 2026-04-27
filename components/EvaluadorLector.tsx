
import React, { useState } from 'react';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import Spinner from './Spinner';
import MessageBox from './MessageBox';
import type { Message } from '../types';
import ReactMarkdown from 'react-markdown';

export default function EvaluadorLector() {
    const [textToEvaluate, setTextToEvaluate] = useState<string>('');
    const [evaluation, setEvaluation] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<Message | null>(null);

    const handleEvaluate = async () => {
        if (!textToEvaluate.trim()) {
            setMessage({ type: 'error', text: 'Por favor, ingresa un texto para evaluar.' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey || apiKey === 'undefined' || apiKey === 'null') {
                throw new Error("Clave de API no configurada en los ajustes del proyecto.");
            }

            const genAI = new GoogleGenAI({ apiKey });
            const prompt = `
                            Actúa como un experto en evaluación de la comprensión lectora en Chile.
                            Analiza el siguiente texto y proporciona una evaluación detallada que incluya:
                            1. Nivel de complejidad (adecuado para qué curso).
                            2. Análisis de vocabulario y estructuras gramaticales.
                            3. Sugerencias de preguntas de comprensión (Literal, Inferencial y Crítica).
                            4. Propuestas de actividades para fortalecer la comprensión de este texto.

                            TEXTO A EVALUAR:
                            "${textToEvaluate}"
                        `;

            const result = await genAI.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: [{ parts: [{ text: prompt }] }],
                config: {
                    safetySettings: [
                        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
                    ]
                }
            });

            setEvaluation(result.text || 'No se pudo generar la evaluación.');
        } catch (error) {
            console.error("Error en Evaluador Lector:", error);
            setMessage({ type: 'error', text: 'Error al evaluar el texto. Por favor, intenta de nuevo.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
            <header className="text-center">
                <h2 className="text-2xl font-bold text-pme-primary mb-2 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">menu_book</span>
                    Evaluador Lector IA
                </h2>
                <p className="text-gray-500 text-sm">Analiza textos y genera estrategias de comprensión lectora.</p>
            </header>

            {message && <MessageBox message={message} />}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
                <label className="block text-sm font-bold text-gray-700">Texto a Evaluar</label>
                <textarea 
                    value={textToEvaluate}
                    onChange={(e) => setTextToEvaluate(e.target.value)}
                    placeholder="Pega aquí el texto, cuento o fragmento que deseas analizar..."
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pme-primary outline-none min-h-[200px] text-sm"
                />
                <button 
                    onClick={handleEvaluate}
                    disabled={isLoading || !textToEvaluate.trim()}
                    className="w-full bg-pme-primary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 shadow-md"
                >
                    {isLoading ? <Spinner /> : <span className="material-symbols-outlined">analytics</span>}
                    {isLoading ? 'Analizando...' : 'Evaluar Texto con IA'}
                </button>
            </div>

            {evaluation && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="text-pme-primary font-bold mb-4 flex items-center gap-2 border-b border-blue-200 pb-2">
                        <span className="material-symbols-outlined">fact_check</span>
                        Resultado del Análisis
                    </h3>
                    <div className="prose prose-sm max-w-none text-gray-800 markdown-body">
                        <ReactMarkdown>{evaluation}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
}
