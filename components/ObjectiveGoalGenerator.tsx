
import React, { useState, useEffect } from 'react';
import { generateSmartObjective, generateSmartGoal, generateSmartActionsAndIndicators, generateObjectiveFromIdeas, combineObjectives } from '../services/geminiService';
import Spinner from './Spinner';
import MessageBox from './MessageBox';
import type { Message } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { dataMap, Plan, objetivosNormativos } from '../constants';
import { estandaresPME } from '../pme-guides';
import ReactMarkdown from 'react-markdown';

export default function ObjectiveGoalGenerator() {
    // Step 0: Plan Normativo State
    const [selectedPlan, setSelectedPlan] = useState<string>('');
    const [selectedNormativeObjectives, setSelectedNormativeObjectives] = useState<string[]>([]);
    const [isCustomObjective, setIsCustomObjective] = useState<boolean>(false);
    const [customObjectiveInput, setCustomObjectiveInput] = useState<string>('');
    const [isLoadingCustomObjective, setIsLoadingCustomObjective] = useState<boolean>(false);

    // Context State
    const [selectedDimension, setSelectedDimension] = useState<string>('');
    const [selectedSubdimension, setSelectedSubdimension] = useState<string>('');
    const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
    
    // Objective Inputs (Step 2)
    const [accion, setAccion] = useState<string>('');
    const [que, setQue] = useState<string>('');
    const [paraQue, setParaQue] = useState<string>('');
    const [como, setComo] = useState<string>('');
    
    // Generation Results
    const [generatedObjective, setGeneratedObjective] = useState<string>('');
    const [objectiveRefinement, setObjectiveRefinement] = useState<string>('');
    
    const [generatedGoal, setGeneratedGoal] = useState<string>('');
    const [goalRefinement, setGoalRefinement] = useState<string>('');
    
    const [generatedActions, setGeneratedActions] = useState<string>('');
    const [actionsRefinement, setActionsRefinement] = useState<string>('');
    
    // Loading States
    const [isLoadingObjective, setIsLoadingObjective] = useState<boolean>(false);
    const [isLoadingGoal, setIsLoadingGoal] = useState<boolean>(false);
    const [isLoadingActions, setIsLoadingActions] = useState<boolean>(false);
    
    const [message, setMessage] = useState<Message | null>(null);

    // Reset subdimension and standards when dimension changes
    useEffect(() => {
        setSelectedSubdimension('');
        setSelectedStandards([]);
    }, [selectedDimension]);

    // Reset standards when subdimension changes
    useEffect(() => {
        setSelectedStandards([]);
    }, [selectedSubdimension]);

    // Auto-select dimension/subdimension based on plan
    useEffect(() => {
        if (selectedPlan === Plan.GESTION_CONVIVENCIA) {
            setSelectedDimension('Formación y Convivencia');
            setSelectedSubdimension('Convivencia');
        } else if (selectedPlan === Plan.DESARROLLO_PROFESIONAL_DOCENTE) {
            setSelectedDimension('Gestión de Recursos');
            setSelectedSubdimension('Gestión del Personal');
        } else if (selectedPlan === Plan.GESTION_APOYO_INCLUSION) {
            setSelectedDimension('Gestión Pedagógica');
            setSelectedSubdimension('Apoyo al Desarrollo de los Estudiantes');
        } else if (selectedPlan === Plan.FORMACION_CIUDADANA) {
            setSelectedDimension('Formación y Convivencia');
            setSelectedSubdimension('Participación y Vida Democrática');
        } else if (selectedPlan === Plan.SEXUALIDAD_AFECTIVIDAD_GENERO) {
            setSelectedDimension('Formación y Convivencia');
            setSelectedSubdimension('Formación');
        }
    }, [selectedPlan]);

    const handleStandardToggle = (standard: string) => {
        setSelectedStandards(prev => 
            prev.includes(standard) 
                ? prev.filter(s => s !== standard) 
                : [...prev, standard]
        );
    };

    const handleNormativeObjectiveToggle = (obj: string) => {
        setSelectedNormativeObjectives(prev => 
            prev.includes(obj) 
                ? prev.filter(o => o !== obj) 
                : [...prev, obj]
        );
    };

    const handleCombineObjectives = async () => {
        if (selectedNormativeObjectives.length === 0) {
            setMessage({ type: 'error', text: 'Por favor, selecciona al menos un objetivo.' });
            return;
        }

        if (selectedNormativeObjectives.length === 1) {
            setGeneratedObjective(selectedNormativeObjectives[0]);
            return;
        }

        setIsLoadingCustomObjective(true);
        setMessage(null);
        try {
            const result = await combineObjectives({
                objectives: selectedNormativeObjectives,
                plan: selectedPlan,
                dimension: selectedDimension,
                subdimension: selectedSubdimension
            });
            setGeneratedObjective(result);
            setIsCustomObjective(false);
        } catch (error) {
            setMessage({ type: 'error', text: (error as Error).message });
        } finally {
            setIsLoadingCustomObjective(false);
        }
    };

    const handleGenerateFromIdeas = async () => {
        if (!customObjectiveInput) {
            setMessage({ type: 'error', text: 'Por favor, escribe tus ideas o nudos críticos.' });
            return;
        }
        setIsLoadingCustomObjective(true);
        setMessage(null);
        try {
            const result = await generateObjectiveFromIdeas({
                ideas: customObjectiveInput,
                plan: selectedPlan,
                dimension: selectedDimension,
                subdimension: selectedSubdimension
            });
            setGeneratedObjective(result);
            setIsCustomObjective(false); // Switch back to show the generated result
        } catch (error) {
            setMessage({ type: 'error', text: (error as Error).message });
        } finally {
            setIsLoadingCustomObjective(false);
        }
    };

    const handleUseNormativeObjective = () => {
        if (selectedNormativeObjectives.length > 0) {
            setGeneratedObjective(selectedNormativeObjectives.join('\n\n'));
        }
    };

    const handleGenerateObjective = async (isRefining = false) => {
        if (!accion || !que || !paraQue || !como || !selectedDimension || !selectedSubdimension) {
            setMessage({ type: 'error', text: 'Por favor, selecciona dimensión/subdimensión y responde todas las preguntas.' });
            return;
        }
        
        setIsLoadingObjective(true);
        setMessage(null);
        try {
            const result = await generateSmartObjective({
                accion,
                que,
                paraQue,
                como,
                dimension: selectedDimension,
                subdimension: selectedSubdimension,
                estandaresSeleccionados: selectedStandards,
                refinement: isRefining ? objectiveRefinement : undefined,
                previousObjective: isRefining ? generatedObjective : undefined
            });
            setGeneratedObjective(result);
            if (isRefining) setObjectiveRefinement('');
        } catch (error) {
            setMessage({ type: 'error', text: (error as Error).message });
        } finally {
            setIsLoadingObjective(false);
        }
    };

    const handleGenerateGoal = async (isRefining = false) => {
        if (!generatedObjective) return;
        
        setIsLoadingGoal(true);
        setMessage(null);
        try {
            const result = await generateSmartGoal({
                objective: generatedObjective,
                dimension: selectedDimension,
                subdimension: selectedSubdimension,
                estandaresSeleccionados: selectedStandards,
                refinement: isRefining ? goalRefinement : undefined,
                previousGoal: isRefining ? generatedGoal : undefined
            });
            setGeneratedGoal(result);
            if (isRefining) setGoalRefinement('');
        } catch (error) {
            setMessage({ type: 'error', text: (error as Error).message });
        } finally {
            setIsLoadingGoal(false);
        }
    };

    const handleGenerateActions = async (isRefining = false) => {
        if (!generatedObjective || !generatedGoal) return;
        
        setIsLoadingActions(true);
        setMessage(null);
        try {
            const result = await generateSmartActionsAndIndicators({
                objective: generatedObjective,
                goal: generatedGoal,
                dimension: selectedDimension,
                subdimension: selectedSubdimension,
                estandaresSeleccionados: selectedStandards,
                refinement: isRefining ? actionsRefinement : undefined,
                previousResult: isRefining ? generatedActions : undefined
            });
            setGeneratedActions(result);
            if (isRefining) setActionsRefinement('');
        } catch (error) {
            setMessage({ type: 'error', text: (error as Error).message });
        } finally {
            setIsLoadingActions(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
            <header className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-pme-primary mb-2">
                    Generador de Objetivos, Metas y Acciones
                </h1>
                <p className="text-gray-500">Planificación estratégica asistida por IA con enfoque en Estándares de Desempeño.</p>
            </header>

            {message && <MessageBox message={message} />}

            {/* Step 0: Plan Normativo */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-indigo-600 p-4 text-white flex items-center gap-2">
                    <span className="material-symbols-outlined">assignment_turned_in</span>
                    <h2 className="font-bold uppercase tracking-wider text-sm">Paso 0: Plan Normativo y Objetivo Base</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">1. Seleccionar Plan Normativo</label>
                            <select 
                                value={selectedPlan}
                                onChange={(e) => {
                                    setSelectedPlan(e.target.value);
                                    setSelectedNormativeObjectives([]);
                                    setIsCustomObjective(false);
                                }}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option value="">Seleccione un plan...</option>
                                {Object.values(Plan).map(plan => (
                                    <option key={plan} value={plan}>{plan}</option>
                                ))}
                            </select>
                        </div>
                        
                        {selectedPlan && (
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700">2. Seleccionar uno o más Objetivos Normativos</label>
                                <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto p-4 border border-gray-100 rounded-lg bg-gray-50">
                                    {(objetivosNormativos as any)[selectedPlan]?.map((obj: string, idx: number) => (
                                        <label 
                                            key={idx} 
                                            className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                                                selectedNormativeObjectives.includes(obj) 
                                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                                                    : 'bg-white border-gray-200 hover:border-indigo-200'
                                            }`}
                                        >
                                            <input 
                                                type="checkbox"
                                                checked={selectedNormativeObjectives.includes(obj)}
                                                onChange={() => handleNormativeObjectiveToggle(obj)}
                                                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm text-gray-700 leading-relaxed">{obj}</span>
                                        </label>
                                    ))}
                                    <button 
                                        onClick={() => setIsCustomObjective(!isCustomObjective)}
                                        className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                                            isCustomObjective 
                                                ? 'bg-indigo-600 text-white border-indigo-600' 
                                                : 'bg-white border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-sm">{isCustomObjective ? 'check_circle' : 'add_circle'}</span>
                                        {isCustomObjective ? 'Personalizar Objetivo Seleccionado' : 'Otro objetivo (Escribir o Generar con IA)'}
                                    </button>
                                </div>

                                {selectedNormativeObjectives.length > 0 && !isCustomObjective && (
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={handleCombineObjectives}
                                            disabled={isLoadingCustomObjective}
                                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md disabled:bg-gray-400"
                                        >
                                            {isLoadingCustomObjective ? <Spinner /> : <span className="material-symbols-outlined">auto_fix</span>}
                                            {selectedNormativeObjectives.length > 1 ? 'Combinar y Generar Objetivo Estratégico' : 'Usar Objetivo Seleccionado'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {selectedPlan === Plan.GESTION_CONVIVENCIA && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3"
                        >
                            <span className="material-symbols-outlined text-amber-600">info</span>
                            <p className="text-xs text-amber-800">
                                <strong>Enfoque Convivencia:</strong> Para este plan, la IA utilizará el <strong>Modelo de Escuela Total</strong> (Promoción, Prevención e Intervención) para fundamentar las propuestas.
                            </p>
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {isCustomObjective && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 pt-4 border-t border-gray-100"
                            >
                                <label className="block text-sm font-bold text-gray-700">Ideas, Conceptos o Nudos Críticos</label>
                                <textarea 
                                    value={customObjectiveInput}
                                    onChange={(e) => setCustomObjectiveInput(e.target.value)}
                                    placeholder="Escribe aquí tus ideas para que la IA genere un objetivo estratégico..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                                />
                                <div className="flex gap-3">
                                    <button 
                                        onClick={handleGenerateFromIdeas}
                                        disabled={isLoadingCustomObjective || !customObjectiveInput}
                                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400"
                                    >
                                        {isLoadingCustomObjective ? <Spinner /> : <span className="material-symbols-outlined">psychology</span>}
                                        Generar Objetivo con IA
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setGeneratedObjective(customObjectiveInput);
                                            setIsCustomObjective(false);
                                        }}
                                        className="px-6 border border-indigo-600 text-indigo-600 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-all"
                                    >
                                        Usar como Objetivo
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Step 1: Context Selection */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gray-800 p-4 text-white flex items-center gap-2">
                    <span className="material-symbols-outlined">settings</span>
                    <h2 className="font-bold uppercase tracking-wider text-sm">Paso 1: Contexto Institucional</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Dimensión PME</label>
                            <select 
                                value={selectedDimension}
                                onChange={(e) => setSelectedDimension(e.target.value)}
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
                                value={selectedSubdimension}
                                onChange={(e) => setSelectedSubdimension(e.target.value)}
                                disabled={!selectedDimension}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pme-primary outline-none bg-white disabled:bg-gray-50"
                            >
                                <option value="">Seleccione una subdimensión...</option>
                                {selectedDimension && (dataMap as any)[selectedDimension].map((sub: string) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedSubdimension && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                        >
                            <label className="block text-sm font-bold text-gray-700">Estándares de Desempeño Asociados (Opcional - Priorizar)</label>
                            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
                                {((estandaresPME as any)[selectedDimension]?.[selectedSubdimension] || []).map((est: string) => (
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
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Step 2: Objective Generation */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-pme-primary p-4 text-white flex items-center gap-2">
                    <span className="material-symbols-outlined">target</span>
                    <h2 className="font-bold uppercase tracking-wider text-sm">Paso 2: Generación de Objetivo</h2>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">¿Cuál es la acción principal? (Verbo en infinitivo)</label>
                            <input 
                                type="text" 
                                value={accion}
                                onChange={(e) => setAccion(e.target.value)}
                                placeholder="Ej: Analizar, Determinar, Diseñar"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pme-secondary outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">¿El Qué? (Fenómeno, producto o resultado)</label>
                            <input 
                                type="text" 
                                value={que}
                                onChange={(e) => setQue(e.target.value)}
                                placeholder="Ej: Los resultados de aprendizaje"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pme-secondary outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">¿El Para qué? (Finalidad o impacto)</label>
                            <input 
                                type="text" 
                                value={paraQue}
                                onChange={(e) => setParaQue(e.target.value)}
                                placeholder="Ej: Para mejorar la toma de decisiones pedagógicas"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pme-secondary outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">¿El Cómo? (Recursos, métodos o estrategias)</label>
                            <input 
                                type="text" 
                                value={como}
                                onChange={(e) => setComo(e.target.value)}
                                placeholder="Ej: Mediante el uso de plataformas digitales"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pme-secondary outline-none"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={() => handleGenerateObjective(false)}
                        disabled={isLoadingObjective || !selectedSubdimension}
                        className="w-full bg-pme-secondary text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 shadow-md"
                    >
                        {isLoadingObjective ? <Spinner /> : <span className="material-symbols-outlined">auto_awesome</span>}
                        {isLoadingObjective ? 'Generando...' : 'Generar Propuesta de Objetivo'}
                    </button>

                    <AnimatePresence>
                        {generatedObjective && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-lg"
                            >
                                <h3 className="text-pme-primary font-bold mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">task_alt</span>
                                    Objetivo Estratégico Generado:
                                </h3>
                                <p className="text-gray-800 leading-relaxed italic font-medium">"{generatedObjective}"</p>
                                
                                <div className="mt-4 pt-4 border-t border-blue-200 flex flex-col gap-3">
                                    <label className="text-xs font-bold text-blue-800 uppercase">Redefinir o ajustar objetivo:</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text"
                                            value={objectiveRefinement}
                                            onChange={(e) => setObjectiveRefinement(e.target.value)}
                                            placeholder="Ej: Hazlo más breve, incluye el foco en inclusión..."
                                            className="flex-1 p-2 text-sm border border-blue-300 rounded-lg outline-none focus:ring-2 focus:ring-pme-secondary"
                                        />
                                        <button 
                                            onClick={() => handleGenerateObjective(true)}
                                            disabled={isLoadingObjective || !objectiveRefinement}
                                            className="bg-pme-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all disabled:bg-gray-400"
                                        >
                                            Refinar
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Step 3: Goal Generation */}
            <AnimatePresence>
                {generatedObjective && (
                    <motion.section 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                    >
                        <div className="bg-pme-accent p-4 text-white flex items-center gap-2">
                            <span className="material-symbols-outlined">flag</span>
                            <h2 className="font-bold uppercase tracking-wider text-sm">Paso 3: Generación de Meta</h2>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <button 
                                onClick={() => handleGenerateGoal(false)}
                                disabled={isLoadingGoal}
                                className="w-full bg-pme-accent text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 shadow-md"
                            >
                                {isLoadingGoal ? <Spinner /> : <span className="material-symbols-outlined">analytics</span>}
                                {isLoadingGoal ? 'Generando...' : 'Generar Meta SMART'}
                            </button>

                            <AnimatePresence>
                                {generatedGoal && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 p-5 bg-orange-50 border border-orange-200 rounded-lg"
                                    >
                                        <h3 className="text-pme-accent font-bold mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">check_circle</span>
                                            Meta Generada:
                                        </h3>
                                        <p className="text-gray-800 leading-relaxed italic font-medium">"{generatedGoal}"</p>
                                        
                                        <div className="mt-4 pt-4 border-t border-orange-200 flex flex-col gap-3">
                                            <label className="text-xs font-bold text-orange-800 uppercase">Refinar meta:</label>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text"
                                                    value={goalRefinement}
                                                    onChange={(e) => setGoalRefinement(e.target.value)}
                                                    placeholder="Ej: Aumenta el porcentaje al 90%, cambia el plazo..."
                                                    className="flex-1 p-2 text-sm border border-orange-300 rounded-lg outline-none focus:ring-2 focus:ring-pme-accent"
                                                />
                                                <button 
                                                    onClick={() => handleGenerateGoal(true)}
                                                    disabled={isLoadingGoal || !goalRefinement}
                                                    className="bg-pme-accent text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all disabled:bg-gray-400"
                                                >
                                                    Refinar
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Step 4: Actions and Indicators */}
            <AnimatePresence>
                {generatedGoal && (
                    <motion.section 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                    >
                        <div className="bg-emerald-600 p-4 text-white flex items-center gap-2">
                            <span className="material-symbols-outlined">list_alt</span>
                            <h2 className="font-bold uppercase tracking-wider text-sm">Paso 4: Acciones e Indicadores</h2>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <button 
                                onClick={() => handleGenerateActions(false)}
                                disabled={isLoadingActions}
                                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 shadow-md"
                            >
                                {isLoadingActions ? <Spinner /> : <span className="material-symbols-outlined">bolt</span>}
                                {isLoadingActions ? 'Generando...' : 'Generar Acciones e Indicadores'}
                            </button>

                            <AnimatePresence>
                                {generatedActions && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 p-6 bg-emerald-50 border border-emerald-200 rounded-lg"
                                    >
                                        <h3 className="text-emerald-800 font-bold mb-4 flex items-center gap-2 border-b border-emerald-200 pb-2">
                                            <span className="material-symbols-outlined">assignment</span>
                                            Propuesta de Acciones e Indicadores:
                                        </h3>
                                        
                                        <div className="prose prose-sm max-w-none text-gray-800 markdown-body">
                                            <ReactMarkdown>{generatedActions}</ReactMarkdown>
                                        </div>
                                        
                                        <div className="mt-8 pt-6 border-t border-emerald-200 flex flex-col gap-3">
                                            <label className="text-xs font-bold text-emerald-800 uppercase">Refinar acciones e indicadores:</label>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text"
                                                    value={actionsRefinement}
                                                    onChange={(e) => setActionsRefinement(e.target.value)}
                                                    placeholder="Ej: Añade una acción sobre capacitación, cambia el indicador de impacto..."
                                                    className="flex-1 p-2 text-sm border border-emerald-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                                                />
                                                <button 
                                                    onClick={() => handleGenerateActions(true)}
                                                    disabled={isLoadingActions || !actionsRefinement}
                                                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all disabled:bg-gray-400"
                                                >
                                                    Refinar
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-pme-primary mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">info</span>
                        Objetivos
                    </h4>
                    <p className="text-[10px] text-gray-500 mb-2 uppercase font-bold">Estructura:</p>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                        <li>Verbo en infinitivo.</li>
                        <li>Qué + Para qué + Cómo.</li>
                        <li>SMART y estratégico.</li>
                    </ul>
                </div>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-pme-accent mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">info</span>
                        Metas
                    </h4>
                    <p className="text-[10px] text-gray-500 mb-2 uppercase font-bold">Requisitos:</p>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                        <li>Cuantificable (%, #).</li>
                        <li>Indicador claro.</li>
                        <li>Plazo definido (2026).</li>
                    </ul>
                </div>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-emerald-600 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">info</span>
                        Indicadores
                    </h4>
                    <p className="text-[10px] text-gray-500 mb-2 uppercase font-bold">Tipos:</p>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                        <li><strong>Seguimiento:</strong> Ejecución.</li>
                        <li><strong>Resultado:</strong> Logro intermedio.</li>
                        <li><strong>Impacto:</strong> Efecto final.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
