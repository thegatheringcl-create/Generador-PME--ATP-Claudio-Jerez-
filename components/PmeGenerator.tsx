
import React, { useState, useMemo } from 'react';
import { dataMap, objetivosNormativos, Plan } from '../constants';
import { estandaresPME } from '../pme-guides';
import { generatePmeActions, generateStrategicObjectiveSuggestion, generateEstrategia } from '../services/geminiService';
import type { Message } from '../types';
import MessageBox from './MessageBox';
import Spinner from './Spinner';

// Helper function to parse the structured markdown into styled HTML
function markdownToHtml(markdown: string): string {
    const lines = markdown.split('\n').filter(line => line.trim() && !line.includes('--- INICIO') && !line.includes('--- FIN'));
    let html = '';
    let inTable = false;

    const processCell = (cell: string) => cell.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/<br>/g, '<br/>');

    for (const line of lines) {
        if (line.trim().startsWith('|')) {
            const cells = line.split('|').slice(1, -1).map(c => c.trim());
            if (!inTable) { // Header row
                inTable = true;
                html += '<div class="overflow-x-auto my-4 border border-gray-200 rounded-lg shadow-sm"><table class="w-full text-sm">';
                html += '<thead><tr class="bg-gray-100 text-left">';
                cells.forEach(header => {
                    html += `<th class="p-3 font-bold text-pme-primary uppercase tracking-wider">${processCell(header)}</th>`;
                });
                html += '</tr></thead><tbody>';
            } else if (line.includes('---')) { // Separator
                continue;
            } else { // Body row
                html += '<tr class="border-t border-gray-200 hover:bg-gray-50">';
                cells.forEach(cell => {
                    html += `<td class="p-3 align-top">${processCell(cell)}</td>`;
                });
                html += '</tr>';
            }
        } else {
            if (inTable) { // End of table
                inTable = false;
                html += '</tbody></table></div>';
            }
             if (line.startsWith('# ')) {
                html += `<h1 class="text-2xl font-bold text-white mb-0 p-4 bg-pme-primary rounded-t-lg">${line.substring(2)}</h1>`;
            } else if (line.startsWith('## ')) {
                html += `<h2 class="text-xl font-semibold text-pme-primary mt-6 mb-3 px-4 border-b-2 border-gray-200 pb-2">${line.substring(3)}</h2>`;
            } else if (line.startsWith('### ')) {
                html += `<h3 class="text-lg font-semibold text-pme-accent mt-5 mb-2 px-4">${line.substring(4)}</h3>`;
            }
        }
    }
    if (inTable) {
        html += '</tbody></table></div>';
    }
    return html;
}

interface ResultState {
    html: string;
    citations: any[];
}

export default function PmeGenerator() {
    const [dimension, setDimension] = useState<string>('');
    const [subdimension, setSubdimension] = useState<string>('');
    const [objEstrategico, setObjEstrategico] = useState<string>('');
    const [metaEstrategica, setMetaEstrategica] = useState<string>('');
    const [estrategia, setEstrategia] = useState<string>('');
    const [selectedPlanes, setSelectedPlanes] = useState<string[]>([]);
    const [selectedPlanObjectives, setSelectedPlanObjectives] = useState<Record<string, string[]>>({});
    const [cantidad, setCantidad] = useState<number>(1);
    const [useGoogleSearch, setUseGoogleSearch] = useState<boolean>(false);
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGeneratingObjective, setIsGeneratingObjective] = useState<boolean>(false);
    const [isGeneratingEstrategia, setIsGeneratingEstrategia] = useState<boolean>(false);
    const [result, setResult] = useState<ResultState | null>(null);
    const [message, setMessage] = useState<Message | null>(null);

    const subdimensiones = useMemo(() => {
        if (dimension && dataMap[dimension as keyof typeof dataMap]) {
            return dataMap[dimension as keyof typeof dataMap];
        }
        return [];
    }, [dimension]);

    const handleDimensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDimension = e.target.value;
        setDimension(newDimension);
        setSubdimension('');
    };

    const handlePlanSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setMessage(null);
        let newSelectedPlanes = [...selectedPlanes];

        if (value === 'No vincular') {
            if (checked) {
                setSelectedPlanes(['No vincular']);
                setSelectedPlanObjectives({});
            } else {
                setSelectedPlanes([]);
            }
            return;
        }

        if (checked) {
            newSelectedPlanes = newSelectedPlanes.filter(p => p !== 'No vincular');
            newSelectedPlanes.push(value);
        } else {
            newSelectedPlanes = newSelectedPlanes.filter(plan => plan !== value);
            const newObjectives = { ...selectedPlanObjectives };
            delete newObjectives[value];
            setSelectedPlanObjectives(newObjectives);
        }
        setSelectedPlanes(newSelectedPlanes);
    };

    const handleObjectiveToggle = (planName: string, objective: string) => {
        setSelectedPlanObjectives(prev => {
            const currentObjectives = prev[planName] || [];
            if (currentObjectives.includes(objective)) {
                return { ...prev, [planName]: currentObjectives.filter(o => o !== objective) };
            } else {
                return { ...prev, [planName]: [...currentObjectives, objective] };
            }
        });
    };
    
    const handleGenerateStrategicObjective = async () => {
        setMessage(null);
        const isNoVincular = selectedPlanes.includes('No vincular');
        if (!subdimension || (!isNoVincular && (selectedPlanes.length === 0 || selectedPlanes.some(p => !selectedPlanObjectives[p] || selectedPlanObjectives[p].length === 0)))) {
            setMessage({ type: 'error', text: 'Por favor, selecciona subdimensión, al menos un plan y sus objetivos (o selecciona "No vincular").' });
            return;
        }

        const planesData = isNoVincular ? [] : selectedPlanes.map(plan => ({ plan, objetivos: selectedPlanObjectives[plan] || [] }));
        setIsGeneratingObjective(true);
        try {
            const suggestion = await generateStrategicObjectiveSuggestion({ dimension, subdimension, planesData });
            setObjEstrategico(suggestion);
        } catch (error) {
             const errorMessage = (error as Error).message || 'Ocurrió un error desconocido.';
             setMessage({ type: 'error', text: `Error al generar sugerencia:\n${errorMessage}` });
        } finally {
            setIsGeneratingObjective(false);
        }
    };
    
    const handleGenerateEstrategia = async () => {
        setMessage(null);
        const isNoVincular = selectedPlanes.includes('No vincular');
        if (!subdimension || !objEstrategico || (!isNoVincular && (selectedPlanes.length === 0 || selectedPlanes.some(p => !selectedPlanObjectives[p] || selectedPlanObjectives[p].length === 0)))) {
            setMessage({ type: 'error', text: 'Completa los campos de subdimensión, objetivo y planes antes de generar la estrategia.' });
            return;
        }
        const planesData = isNoVincular ? [] : selectedPlanes.map(plan => ({ plan, objetivos: selectedPlanObjectives[plan] || [] }));
        setIsGeneratingEstrategia(true);
        try {
            const suggestion = await generateEstrategia({ dimension, subdimension, objEstrategico, metaEstrategica, planesData });
            setEstrategia(suggestion);
        } catch (error) {
             const errorMessage = (error as Error).message || 'Ocurrió un error desconocido.';
             setMessage({ type: 'error', text: `Error al generar estrategia:\n${errorMessage}` });
        } finally {
            setIsGeneratingEstrategia(false);
        }
    };

    const isEstrategiaButtonDisabled = useMemo(() => {
        const isNoVincular = selectedPlanes.includes('No vincular');
        return isGeneratingEstrategia || !objEstrategico || !subdimension || (!isNoVincular && (selectedPlanes.length === 0 || selectedPlanes.some(p => !selectedPlanObjectives[p] || selectedPlanObjectives[p].length === 0)));
    }, [isGeneratingEstrategia, objEstrategico, subdimension, selectedPlanes, selectedPlanObjectives]);


    const generarPropuesta = async () => {
        setMessage(null);
        setResult(null);

        const isNoVincular = selectedPlanes.includes('No vincular');
        if (!dimension || !subdimension || !estrategia || (!isNoVincular && (selectedPlanes.length === 0 || selectedPlanes.some(p => !selectedPlanObjectives[p] || selectedPlanObjectives[p].length === 0)))) {
            setMessage({ type: 'error', text: 'Por favor, completa todos los campos requeridos antes de generar una propuesta.' });
            return;
        }

        const planesData = isNoVincular ? [] : selectedPlanes.map(plan => ({
            plan,
            objetivos: (selectedPlanObjectives[plan] || []).map(obj => obj === "Otro" ? "Objetivo específico a definir por la IA según contexto" : obj)
        }));

        const finalCantidad = isNaN(cantidad) ? 1 : cantidad;
        setIsLoading(true);

        try {
            const { text, citations } = await generatePmeActions({
                cantidad: finalCantidad, dimension, subdimension, objEstrategico, metaEstrategica, estrategia, planesData, useGoogleSearch
            });
            setResult({ html: markdownToHtml(text), citations: citations || [] });
        } catch (error) {
            const errorMessage = (error as Error).message || 'Ocurrió un error desconocido.';
            setMessage({ type: 'error', text: `OCURRIÓ UN ERROR:\n${errorMessage}` });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-pme-primary mb-8">
                Generador de Acciones PME (IA)
            </h1>

            {message && <MessageBox message={message} />}

            <div className="grid md:grid-cols-2 gap-6 mb-4">
                 <div>
                    <label htmlFor="dimension" className="block mb-2 font-bold text-pme-primary">1. Dimensión de Gestión:</label>
                    <select id="dimension" value={dimension} onChange={handleDimensionChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-pme-secondary focus:border-pme-secondary">
                        <option value="">-- Seleccione --</option>
                        {Object.keys(dataMap).map(dim => <option key={dim} value={dim}>{dim}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="subdimension" className="block mb-2 font-bold text-pme-primary">2. Subdimensión:</label>
                    <select id="subdimension" value={subdimension} onChange={e => setSubdimension(e.target.value)} disabled={!dimension} className="w-full p-2 border border-gray-300 rounded-md focus:ring-pme-secondary focus:border-pme-secondary disabled:bg-gray-100">
                        <option value="">-- Seleccione --</option>
                        {subdimensiones.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>
            </div>

            <div className="form-group mb-6">
                <label htmlFor="objEstrategico" className="block mb-2 font-bold text-pme-primary">3. Objetivo Estratégico (PME):</label>
                 <div className="relative">
                    <textarea id="objEstrategico" value={objEstrategico} onChange={e => setObjEstrategico(e.target.value)} placeholder="Ej: Mejorar la comprensión lectora..." className="w-full p-2 border border-gray-300 rounded-md h-24 resize-y focus:ring-pme-secondary focus:border-pme-secondary pr-12"/>
                    <button onClick={handleGenerateStrategicObjective} disabled={isGeneratingObjective || (selectedPlanes.length === 0 && !selectedPlanes.includes('No vincular')) || !subdimension} className="absolute top-2 right-2 bg-pme-accent text-white px-2 py-1 rounded-md text-xs font-bold hover:bg-orange-600 transition disabled:bg-gray-400 flex items-center justify-center" title="Generar sugerencia con IA" style={{ height: '24px', width: '30px' }}>
                        {isGeneratingObjective ? <Spinner size="sm" /> : 'IA'}
                    </button>
                </div>
            </div>

            <div className="form-group mb-6">
                <label htmlFor="metaEstrategica" className="block mb-2 font-bold text-pme-primary">4. Meta Estratégica:</label>
                <textarea id="metaEstrategica" value={metaEstrategica} onChange={e => setMetaEstrategica(e.target.value)} placeholder="Ej: Lograr que el 80% de los estudiantes..." className="w-full p-2 border border-gray-300 rounded-md h-20 resize-y focus:ring-pme-secondary focus:border-pme-secondary"/>
            </div>
            
            <div className="form-group mb-6">
                 <label htmlFor="estrategia" className="block mb-2 font-bold text-pme-primary">5. Estrategia PME:</label>
                 <div className="relative">
                     <textarea id="estrategia" value={estrategia} onChange={e => setEstrategia(e.target.value)} placeholder="Define la línea de acción principal..." className="w-full p-2 border border-gray-300 rounded-md h-24 resize-y focus:ring-pme-secondary focus:border-pme-secondary pr-12"/>
                    <button onClick={handleGenerateEstrategia} disabled={isEstrategiaButtonDisabled} className="absolute top-2 right-2 bg-pme-accent text-white px-2 py-1 rounded-md text-xs font-bold hover:bg-orange-600 transition disabled:bg-gray-400 flex items-center justify-center" title="Generar estrategia con IA" style={{ height: '24px', width: '30px' }}>
                        {isGeneratingEstrategia ? <Spinner size="sm" /> : (estrategia ? '🔄' : 'IA')}
                    </button>
                 </div>
                 <div className="mt-2 p-2 bg-orange-50 border border-orange-100 rounded text-[10px] text-orange-800">
                    <p className="font-bold mb-1">Criterios de Validación Técnica de la Estrategia:</p>
                    <ul className="grid grid-cols-2 gap-x-4">
                        <li>• Se explica en términos de sistema.</li>
                        <li>• Genera un cambio estructural.</li>
                        <li>• Tiene un horizonte anual.</li>
                        <li>• Es medible mediante indicadores.</li>
                    </ul>
                 </div>
            </div>

            <div className="form-group mb-4">
                <label className="block mb-2 font-bold text-pme-primary">6. Planes Normativos para Articular:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-pme-light p-4 rounded-md">
                    <label className="flex items-center gap-2 text-sm text-pme-primary font-bold">
                        <input type="checkbox" name="planes" value="No vincular" checked={selectedPlanes.includes('No vincular')} onChange={handlePlanSelection} className="h-4 w-4 rounded border-gray-300 text-pme-danger focus:ring-pme-danger"/>
                        No vincular
                    </label>
                    {Object.values(Plan).map(plan => (
                        <label key={plan} className="flex items-center gap-2 text-sm text-pme-primary">
                            <input type="checkbox" name="planes" value={plan} checked={selectedPlanes.includes(plan)} onChange={handlePlanSelection} className="h-4 w-4 rounded border-gray-300 text-pme-secondary focus:ring-pme-secondary"/>
                            {plan}
                        </label>
                    ))}
                </div>
            </div>

            {selectedPlanes.length > 0 && !selectedPlanes.includes('No vincular') && <div className="form-group mb-4">
                <label className="block mb-2 font-bold text-pme-primary">7. Objetivos Específicos por Plan (Selecciona uno o más):</label>
                <div className="space-y-3">
                    {selectedPlanes.map(planName => (
                        <div key={planName} className="bg-gray-50 border-l-4 border-pme-accent p-3 rounded-r-md">
                            <label className="block text-sm font-semibold text-pme-accent mb-2">{planName}</label>
                            <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-white border border-gray-200 rounded-md">
                                {objetivosNormativos[planName as keyof typeof objetivosNormativos].map((obj, index) => (
                                    <label key={`${planName}-${index}`} className="flex items-start gap-2 text-xs text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input 
                                            type="checkbox" 
                                            checked={(selectedPlanObjectives[planName] || []).includes(obj)} 
                                            onChange={() => handleObjectiveToggle(planName, obj)}
                                            className="mt-0.5 h-3 w-3 rounded border-gray-300 text-pme-accent focus:ring-pme-accent"
                                        />
                                        <span>{obj}</span>
                                    </label>
                                ))}
                                <label className="flex items-center gap-2 text-xs text-pme-accent font-bold cursor-pointer hover:bg-gray-50 p-1 rounded">
                                    <input 
                                        type="checkbox" 
                                        checked={(selectedPlanObjectives[planName] || []).includes("Otro")} 
                                        onChange={() => handleObjectiveToggle(planName, "Otro")}
                                        className="h-3 w-3 rounded border-gray-300 text-pme-accent focus:ring-pme-accent"
                                    />
                                    Otro (Especificar manualmente...)
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>}

            {subdimension && (estandaresPME as any)[dimension]?.[subdimension] && (
                <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                    <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">verified</span>
                        Estándares de Desempeño (Referencia para la IA):
                    </h4>
                    <ul className="list-disc list-inside text-xs text-blue-700 space-y-1">
                        {(estandaresPME as any)[dimension][subdimension].map((std: string, idx: number) => (
                            <li key={idx}>{std}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mb-6 bg-gray-50 border border-gray-200 p-4 rounded-md">
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-pme-accent">info</span>
                    Guía Técnica de Indicadores:
                </h4>
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="text-xs">
                        <p className="font-bold text-pme-primary mb-1">1. Proceso (Seguimiento)</p>
                        <p className="text-gray-600">Mide el avance en la ejecución y el cumplimiento de lo planificado.</p>
                    </div>
                    <div className="text-xs">
                        <p className="font-bold text-pme-primary mb-1">2. Resultado</p>
                        <p className="text-gray-600">Mide cambios intermedios en prácticas pedagógicas o de gestión.</p>
                    </div>
                    <div className="text-xs">
                        <p className="font-bold text-pme-primary mb-1">3. Impacto</p>
                        <p className="text-gray-600">Mide el cambio significativo en los aprendizajes o gestión institucional.</p>
                    </div>
                </div>
            </div>
            
            <div className="form-group mb-6 flex items-center justify-between gap-4">
                <div>
                    <label htmlFor="cantidad" className="block mb-2 font-bold text-pme-primary">8. Cantidad de Acciones:</label>
                    <input type="number" id="cantidad" value={isNaN(cantidad) ? '' : cantidad} onChange={e => setCantidad(e.target.value === '' ? NaN : parseInt(e.target.value, 10))} min="1" max="5" className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:ring-pme-secondary focus:border-pme-secondary"/>
                </div>
                <div className="flex items-center gap-2 mt-8">
                     <input type="checkbox" id="googleSearch" checked={useGoogleSearch} onChange={e => setUseGoogleSearch(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-pme-secondary focus:ring-pme-secondary"/>
                    <label htmlFor="googleSearch" className="text-sm font-medium text-pme-primary flex items-center gap-1" title="Fundamenta la respuesta con información actualizada de la web.">
                       Usar Google Search <span className="material-symbols-outlined text-base text-blue-500">google</span>
                    </label>
                </div>
            </div>


            <button onClick={generarPropuesta} disabled={isLoading} className="w-full bg-pme-secondary text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                {isLoading && <Spinner />}
                {isLoading ? 'Generando Propuestas...' : (result ? 'Regenerar Propuesta' : 'Generar Propuestas con IA')}
            </button>
            
            {result && (
                 <div id="resultArea" className="mt-8 border border-gray-300 rounded-lg bg-white shadow-inner overflow-hidden">
                    <div dangerouslySetInnerHTML={{ __html: result.html }} />
                    {result.citations.length > 0 && (
                        <div className="p-4 bg-pme-light border-t border-gray-200">
                            <h4 className="font-bold text-pme-primary mb-2">Fuentes Web (Google Search):</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {result.citations.map((citation, index) => (
                                    <li key={index} className="text-sm">
                                        <a href={citation.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {citation.web.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}