
import React, { useState } from 'react';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import Spinner from './Spinner';
import MessageBox from './MessageBox';
import type { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { dataMap } from '../constants';
import { estandaresPME } from '../pme-guides';

export default function EvaluadorEid() {
    const [dimension, setDimension] = useState<string>('');
    const [subdimension, setSubdimension] = useState<string>('');
    const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
    const [evaluation, setEvaluation] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<Message | null>(null);

    const handleStandardToggle = (standard: string) => {
        setSelectedStandards(prev => 
            prev.includes(standard) 
                ? prev.filter(s => s !== standard) 
                : [...prev, standard]
        );
    };

    const handleEvaluate = async () => {
        if (!dimension || !subdimension || selectedStandards.length === 0) {
            setMessage({ type: 'error', text: 'Por favor, selecciona dimensión, subdimensión y al menos un estándar.' });
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
                            Actúa como un experto en Estándares Indicativos de Desempeño (EID) de la Agencia de Calidad de la Educación en Chile.
                            Analiza los siguientes estándares seleccionados para la subdimensión "${subdimension}" de la dimensión "${dimension}":
                            
                            ESTÁNDARES SELECCIONADOS:
                            ${selectedStandards.map(s => `- ${s}`).join('\n')}

                            PROPORCIONA UNA EVALUACIÓN QUE INCLUYA:
                            1. Análisis de la importancia de estos estándares para la mejora escolar.
                            2. Propuesta de 3 a 5 acciones concretas para cumplir con estos estándares.
                            3. Sugerencias de indicadores de seguimiento para cada acción.
                            4. Vinculación con el Plan de Mejoramiento Educativo (PME) 2026.

                            FORMATO DE SALIDA: Markdown profesional.
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

            setEvaluation(result.text || 'No se pudo generar el análisis.');
        } catch (error) {
            console.error("Error en Evaluador EID:", error);
            setMessage({ type: 'error', text: 'Error al analizar los estándares. Por favor, intenta de nuevo.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
            <header className="text-center">
                <h2 className="text-2xl font-bold text-pme-primary mb-2 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">analytics</span>
                    Evaluador EID & Propuesta PME Pro
                </h2>
                <p className="text-gray-500 text-sm">Análisis profundo de Estándares Indicativos de Desempeño y propuestas estratégicas.</p>
            </header>

            {message && <MessageBox message={message} />}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Dimensión PME</label>
                        <select 
                            value={dimension}
                            onChange={(e) => {
                                setDimension(e.target.value);
                                setSubdimension('');
                                setSelectedStandards([]);
                            }}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pme-primary outline-none bg-white"
                        >
                            <option value="">Seleccione una dimensión...</option>
                            {Object.keys(dataMap).map(dim => (
                                <option key={dim} value={dim}>{dim}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Subdimensión PME</label>
                        <select 
                            value={subdimension}
                            onChange={(e) => {
                                setSubdimension(e.target.value);
                                setSelectedStandards([]);
                            }}
                            disabled={!dimension}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pme-primary outline-none bg-white disabled:bg-gray-50"
                        >
                            <option value="">Seleccione una subdimensión...</option>
                            {dimension && (dataMap as any)[dimension].map((sub: string) => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {subdimension && (
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700">Estándares de Desempeño a Evaluar (Mínimo 1)</label>
                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
                            {((estandaresPME as any)[dimension]?.[subdimension] || []).map((est: string) => (
                                <label key={est} className="flex items-start gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                                    <input 
                                        type="checkbox"
                                        checked={selectedStandards.includes(est)}
                                        onChange={() => handleStandardToggle(est)}
                                        className="mt-1 h-4 w-4 text-pme-primary rounded border-gray-300 focus:ring-pme-primary"
                                    />
                                    <span className="text-xs text-gray-700 leading-tight">{est}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <button 
                    onClick={handleEvaluate}
                    disabled={isLoading || !subdimension || selectedStandards.length === 0}
                    className="w-full bg-pme-primary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 shadow-md"
                >
                    {isLoading ? <Spinner /> : <span className="material-symbols-outlined">auto_awesome</span>}
                    {isLoading ? 'Analizando...' : 'Generar Análisis y Propuesta EID'}
                </button>
            </div>

            {evaluation && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="text-emerald-800 font-bold mb-4 flex items-center gap-2 border-b border-emerald-200 pb-2">
                        <span className="material-symbols-outlined">fact_check</span>
                        Análisis EID y Propuesta PME
                    </h3>
                    <div className="prose prose-sm max-w-none text-gray-800 markdown-body">
                        <ReactMarkdown>{evaluation}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
}
