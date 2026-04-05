
import React, { useState, useMemo } from 'react';
import { dataMap, objetivosNormativos, Plan } from '../constants';
import { estandaresPME } from '../pme-guides';
import { generatePmeActions, generateStrategicObjectiveSuggestion, generateEstrategia, generateMetaEstrategica } from '../services/geminiService';
import type { Message } from '../types';
import MessageBox from './MessageBox';
import Spinner from './Spinner';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, loginWithGoogle, logout } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, limit, getDocFromServer, doc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

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
    const [customPlanObjectives, setCustomPlanObjectives] = useState<Record<string, string>>({});
    const [selectedEstandares, setSelectedEstandares] = useState<string[]>([]);
    const [cantidad, setCantidad] = useState<number>(1);
    const [useGoogleSearch, setUseGoogleSearch] = useState<boolean>(false);
    const [showPlanningDates, setShowPlanningDates] = useState<boolean>(false);
    const [refineEstrategiaConceptos, setRefineEstrategiaConceptos] = useState<string>('');
    const [nudosCriticos, setNudosCriticos] = useState<string>('');
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGeneratingObjective, setIsGeneratingObjective] = useState<boolean>(false);
    const [isGeneratingMeta, setIsGeneratingMeta] = useState<boolean>(false);
    const [isGeneratingEstrategia, setIsGeneratingEstrategia] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [result, setResult] = useState<ResultState | null>(null);
    const [message, setMessage] = useState<Message | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

    // Auth listener
    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, []);

    // Connection test
    React.useEffect(() => {
        if (isAuthReady) {
            const testConnection = async () => {
                try {
                    await getDocFromServer(doc(db, 'test', 'connection'));
                } catch (error) {
                    if (error instanceof Error && error.message.includes('the client is offline')) {
                        console.error("Please check your Firebase configuration.");
                    }
                }
            };
            testConnection();
        }
    }, [isAuthReady]);

    const handleReset = () => {
        if (window.confirm('¿Estás seguro de que deseas reiniciar toda la planificación? Se perderán todos los datos ingresados y las propuestas generadas.')) {
            setDimension('');
            setSubdimension('');
            setObjEstrategico('');
            setMetaEstrategica('');
            setEstrategia('');
            setSelectedPlanes([]);
            setSelectedPlanObjectives({});
            setCustomPlanObjectives({});
            setSelectedEstandares([]);
            setCantidad(1);
            setUseGoogleSearch(false);
            setRefineEstrategiaConceptos('');
            setNudosCriticos('');
            setResult(null);
            setMessage(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrint = () => {
        setMessage({ type: 'info', text: 'Sugerencia: En la ventana que se abrirá, puedes elegir "Guardar como PDF" para guardar el documento completo.' });
        setTimeout(() => {
            window.print();
        }, 1500);
    };

    const handleSavePdf = () => {
        if (!result) return;
        setMessage({ type: 'info', text: 'Para guardar el documento completo con múltiples hojas, selecciona "Guardar como PDF" en la ventana de impresión.' });
        setTimeout(() => {
            window.print();
        }, 1500);
    };

    const handleSaveToDb = async () => {
        if (!user) {
            setMessage({ type: 'info', text: 'Debes iniciar sesión con Google para guardar en la base de datos.' });
            return;
        }

        if (!result) return;

        setIsSaving(true);
        setMessage(null);

        try {
            const establishment = localStorage.getItem('pme_establishment') || 'No especificado';
            
            await addDoc(collection(db, 'proposals'), {
                userId: user.uid,
                userEmail: user.email,
                establishment,
                dimension,
                subdimension,
                objEstrategico,
                metaEstrategica,
                estrategia,
                nudosCriticos,
                cantidad,
                resultHtml: result.html,
                createdAt: serverTimestamp()
            });

            setMessage({ type: 'success', text: 'Propuesta guardada exitosamente en la base de datos.' });
        } catch (error) {
            console.error('Error saving to Firestore:', error);
            setMessage({ type: 'error', text: 'Error al guardar en la base de datos. Verifica tu conexión.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al iniciar sesión con Google.' });
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al cerrar sesión.' });
        }
    };

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
        setSelectedEstandares([]);
    };

    const handleSubdimensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSubdimension(e.target.value);
        setSelectedEstandares([]);
    };

    const handleEstandardToggle = (std: string) => {
        setSelectedEstandares(prev => {
            if (prev.includes(std)) {
                return prev.filter(s => s !== std);
            }
            return [...prev, std];
        });
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

    const handleGenerateMetaEstrategica = async () => {
        setMessage(null);
        if (!objEstrategico || !dimension || !subdimension) {
            setMessage({ type: 'error', text: 'Por favor, completa dimensión, subdimensión y objetivo estratégico antes de generar la meta.' });
            return;
        }

        setIsGeneratingMeta(true);
        try {
            const suggestion = await generateMetaEstrategica({ objEstrategico, dimension, subdimension });
            setMetaEstrategica(suggestion);
        } catch (error) {
            const errorMessage = (error as Error).message || 'Ocurrió un error desconocido.';
            setMessage({ type: 'error', text: `Error al generar meta:\n${errorMessage}` });
        } finally {
            setIsGeneratingMeta(false);
        }
    };
    
    const handleGenerateEstrategia = async () => {
        setMessage(null);
        const isNoVincular = selectedPlanes.includes('No vincular');
        const hasEstandares = (estandaresPME as any)[dimension]?.[subdimension]?.length > 0;
        
        if (!subdimension || !objEstrategico || 
            (hasEstandares && selectedEstandares.length === 0) ||
            (!isNoVincular && (selectedPlanes.length === 0 || selectedPlanes.some(p => !selectedPlanObjectives[p] || selectedPlanObjectives[p].length === 0)))) {
            setMessage({ type: 'error', text: 'Completa los campos de subdimensión, objetivo, estándares (mínimo 1) y planes antes de generar la estrategia.' });
            return;
        }
        const planesData = isNoVincular ? [] : selectedPlanes.map(plan => ({ 
            plan, 
            objetivos: (selectedPlanObjectives[plan] || []).map(obj => obj === "Otro" ? (customPlanObjectives[plan] || "Objetivo específico a definir") : obj)
        }));
        setIsGeneratingEstrategia(true);
        try {
            const suggestion = await generateEstrategia({ 
                dimension, 
                subdimension, 
                objEstrategico, 
                metaEstrategica, 
                planesData, 
                estandaresSeleccionados: selectedEstandares,
                conceptosRefinamiento: refineEstrategiaConceptos,
                estrategiaActual: estrategia
            });
            setEstrategia(suggestion);
            setRefineEstrategiaConceptos(''); // Clear after refinement
        } catch (error) {
             const errorMessage = (error as Error).message || 'Ocurrió un error desconocido.';
             let displayMessage = `Error al generar estrategia:\n${errorMessage}`;
             if (errorMessage.includes('Forbidden')) {
                 displayMessage = "ERROR: Acceso Prohibido (Forbidden). Esto suele ocurrir si tu API Key de Gemini no tiene permisos para el modelo seleccionado o ha expirado. Por favor, revisa la configuración de tu API Key en los ajustes (Settings > Secrets).";
             }
             setMessage({ type: 'error', text: displayMessage });
        } finally {
            setIsGeneratingEstrategia(false);
        }
    };

    const isEstrategiaButtonDisabled = useMemo(() => {
        const isNoVincular = selectedPlanes.includes('No vincular');
        const hasEstandares = (estandaresPME as any)[dimension]?.[subdimension]?.length > 0;
        return isGeneratingEstrategia || !objEstrategico || !subdimension || 
            (hasEstandares && selectedEstandares.length === 0) ||
            (!isNoVincular && (selectedPlanes.length === 0 || selectedPlanes.some(p => !selectedPlanObjectives[p] || selectedPlanObjectives[p].length === 0)));
    }, [isGeneratingEstrategia, objEstrategico, subdimension, selectedPlanes, selectedPlanObjectives, dimension, selectedEstandares, refineEstrategiaConceptos]);


    const generarPropuesta = async () => {
        setMessage(null);
        setResult(null);

        const isNoVincular = selectedPlanes.includes('No vincular');
        const hasEstandares = (estandaresPME as any)[dimension]?.[subdimension]?.length > 0;
        
        if (!dimension || !subdimension || !estrategia || 
            (hasEstandares && selectedEstandares.length === 0) ||
            (!isNoVincular && (selectedPlanes.length === 0 || selectedPlanes.some(p => !selectedPlanObjectives[p] || selectedPlanObjectives[p].length === 0)))) {
            setMessage({ type: 'error', text: 'Por favor, completa todos los campos requeridos (incluyendo al menos 1 estándar) antes de generar una propuesta.' });
            return;
        }

        const planesData = isNoVincular ? [] : selectedPlanes.map(plan => ({
            plan,
            objetivos: (selectedPlanObjectives[plan] || []).map(obj => obj === "Otro" ? (customPlanObjectives[plan] || "Objetivo específico a definir") : obj)
        }));

        const finalCantidad = isNaN(cantidad) ? 1 : cantidad;
        setIsLoading(true);

        try {
            const { text, citations } = await generatePmeActions({
                cantidad: finalCantidad, dimension, subdimension, objEstrategico, metaEstrategica, estrategia, planesData, useGoogleSearch, estandaresSeleccionados: selectedEstandares, nudosCriticos
            });
            setResult({ html: markdownToHtml(text), citations: citations || [] });
        } catch (error) {
            const errorMessage = (error as Error).message || 'Ocurrió un error desconocido.';
            let displayMessage = `OCURRIÓ UN ERROR:\n${errorMessage}`;
            if (errorMessage.includes('Forbidden')) {
                displayMessage = "ERROR: Acceso Prohibido (Forbidden). Esto suele ocurrir si tu API Key de Gemini no tiene permisos para el modelo seleccionado o ha expirado. Por favor, revisa la configuración de tu API Key en los ajustes (Settings > Secrets).";
            }
            setMessage({ type: 'error', text: displayMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 sm:p-8 relative">
            {/* Planning Dates Banner/Menu */}
            <div className="fixed top-20 right-0 z-50 flex items-start">
                <AnimatePresence>
                    {showPlanningDates && (
                        <motion.div 
                            initial={{ x: 300 }}
                            animate={{ x: 0 }}
                            exit={{ x: 300 }}
                            className="bg-white shadow-2xl border-l-4 border-pme-primary w-72 h-[calc(100vh-120px)] overflow-y-auto p-4 rounded-l-xl"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-pme-primary flex items-center gap-2">
                                    <span className="material-symbols-outlined">calendar_month</span>
                                    Plazos PME 2026
                                </h3>
                                <button onClick={() => setShowPlanningDates(false)} className="text-gray-400 hover:text-pme-danger">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-bold text-blue-700 text-sm mb-1">Fase Estratégica</h4>
                                    <p className="text-xs text-blue-600">22 de diciembre 2025 - 20 de marzo 2026</p>
                                    <p className="text-[10px] mt-1 text-blue-500 italic">Incluye aprobación del sostenedor.</p>
                                </div>
                                
                                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                    <h4 className="font-bold text-green-700 text-sm mb-1">Planificación Anual</h4>
                                    <p className="text-xs text-green-600">23 de marzo - 24 de abril 2026</p>
                                    <p className="text-[10px] mt-1 text-green-500 italic">Incluye aprobación del sostenedor.</p>
                                </div>
                                
                                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <h4 className="font-bold text-yellow-700 text-sm mb-1">Implementación Anual</h4>
                                    <p className="text-xs text-yellow-600">27 de abril - 27 de noviembre 2026</p>
                                    <p className="text-[10px] mt-1 text-yellow-500 italic">Opción "Adelantar" desde el 2 de noviembre.</p>
                                </div>
                                
                                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <h4 className="font-bold text-purple-700 text-sm mb-1">Evaluación</h4>
                                    <p className="text-xs text-purple-600">30 de noviembre - 31 de diciembre 2026</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {!showPlanningDates && (
                    <button 
                        onClick={() => setShowPlanningDates(true)}
                        className="bg-pme-primary text-white p-3 rounded-l-full shadow-lg hover:bg-blue-800 transition-all flex items-center gap-2 group"
                    >
                        <span className="material-symbols-outlined">event_note</span>
                        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-bold">Ver Plazos 2026</span>
                    </button>
                )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-center text-pme-primary mb-1">
                PLANIFICADOR PME 2026
            </h1>
            <p className="text-center text-gray-500 text-xs mb-6 italic">
                Elaborado por claudio.jerez.santis@cormumel.cl
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-6 no-print bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all font-bold text-sm border border-gray-300 shadow-sm"
                >
                    <span className="material-symbols-outlined text-lg">restart_alt</span>
                    Reiniciar (Vaciar Propuestas)
                </button>
                
                <div className="h-8 w-px bg-gray-300 mx-1 hidden sm:block"></div>

                {!user ? (
                    <button 
                        onClick={handleLogin}
                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all font-bold text-sm shadow-sm"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" referrerPolicy="no-referrer" />
                        Iniciar Sesión
                    </button>
                ) : (
                    <div className="flex items-center gap-2 bg-blue-50 text-pme-primary px-3 py-2 rounded-lg border border-blue-200 shadow-sm">
                        <span className="material-symbols-outlined text-sm">account_circle</span>
                        <span className="text-xs font-bold truncate max-w-[100px]">{user.displayName || user.email}</span>
                        <button onClick={handleLogout} className="text-pme-danger hover:text-red-700 ml-1">
                            <span className="material-symbols-outlined text-sm">logout</span>
                        </button>
                    </div>
                )}
                
                <div className="h-8 w-px bg-gray-300 mx-1 hidden sm:block"></div>

                <button 
                    onClick={handleSaveToDb}
                    disabled={isSaving || !user || !result}
                    className="flex items-center gap-2 bg-pme-primary text-white px-4 py-2 rounded-lg hover:bg-pme-primary/90 transition-all font-bold text-sm shadow-md disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
                    title={!user ? "Inicia sesión para guardar" : (!result ? "Genera una propuesta primero" : "Guardar en base de datos")}
                >
                    {isSaving ? <Spinner size="sm" /> : <span className="material-symbols-outlined text-lg">database</span>}
                    Guardar Propuesta
                </button>
                
                <button 
                    onClick={handleSavePdf}
                    disabled={!result || isLoading}
                    className="flex items-center gap-2 bg-pme-danger text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all font-bold text-sm shadow-md disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
                    title={!result ? "Genera una propuesta primero" : "Exportar a PDF"}
                >
                    <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                    Guardar PDF
                </button>
                
                <button 
                    onClick={handlePrint}
                    disabled={!result}
                    className="flex items-center gap-2 bg-pme-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all font-bold text-sm shadow-md disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
                    title={!result ? "Genera una propuesta primero" : "Imprimir propuesta"}
                >
                    <span className="material-symbols-outlined text-lg">print</span>
                    Imprimir
                </button>
            </div>

            <p className="text-center text-gray-500 mb-8 text-sm no-print">
                Sigue los pasos a continuación para generar tus propuestas técnicas.
            </p>

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
                    <select id="subdimension" value={subdimension} onChange={handleSubdimensionChange} disabled={!dimension} className="w-full p-2 border border-gray-300 rounded-md focus:ring-pme-secondary focus:border-pme-secondary disabled:bg-gray-100">
                        <option value="">-- Seleccione --</option>
                        {subdimensiones.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>
            </div>

            {subdimension && (estandaresPME as any)[dimension]?.[subdimension] && (
                <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                    <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">verified</span>
                            Selecciona Estándares de Desempeño (Mínimo 1):
                        </div>
                        <span className="text-[10px] bg-blue-200 px-2 py-0.5 rounded-full">{selectedEstandares.length} seleccionados</span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                        {(estandaresPME as any)[dimension][subdimension].map((std: string, idx: number) => (
                            <label 
                                key={idx} 
                                className={`flex items-start gap-2 p-2 rounded border transition-all cursor-pointer text-[11px] ${
                                    selectedEstandares.includes(std) 
                                    ? 'bg-blue-100 border-blue-400 text-blue-900' 
                                    : 'bg-white border-blue-100 text-blue-700 hover:bg-blue-50'
                                }`}
                            >
                                <input 
                                    type="checkbox" 
                                    className="mt-0.5 h-3 w-3 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                    checked={selectedEstandares.includes(std)}
                                    onChange={() => handleEstandardToggle(std)}
                                />
                                <span>{std}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

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
                <div className="relative">
                    <textarea id="metaEstrategica" value={metaEstrategica} onChange={e => setMetaEstrategica(e.target.value)} placeholder="Ej: Lograr que el 80% de los estudiantes..." className="w-full p-2 border border-gray-300 rounded-md h-20 resize-y focus:ring-pme-secondary focus:border-pme-secondary pr-12"/>
                    <button onClick={handleGenerateMetaEstrategica} disabled={isGeneratingMeta || !objEstrategico} className="absolute top-2 right-2 bg-pme-accent text-white px-2 py-1 rounded-md text-xs font-bold hover:bg-orange-600 transition disabled:bg-gray-400 flex items-center justify-center" title="Generar meta con IA" style={{ height: '24px', width: '30px' }}>
                        {isGeneratingMeta ? <Spinner size="sm" /> : (metaEstrategica ? '🔄' : 'IA')}
                    </button>
                </div>
            </div>
            
            <div className="form-group mb-4">
                <label className="block mb-2 font-bold text-pme-primary">5. Planes Normativos para Articular:</label>
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
                <label className="block mb-2 font-bold text-pme-primary">6. Objetivos Específicos por Plan (Selecciona uno o más):</label>
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
                                {(selectedPlanObjectives[planName] || []).includes("Otro") && (
                                    <div className="px-2 pb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <textarea 
                                            value={customPlanObjectives[planName] || ''}
                                            onChange={(e) => setCustomPlanObjectives(prev => ({ ...prev, [planName]: e.target.value }))}
                                            placeholder="Escribe aquí el objetivo específico..."
                                            className="w-full p-2 text-[10px] border border-orange-200 rounded bg-orange-50/20 focus:ring-pme-accent focus:border-pme-accent h-16 resize-none"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>}

            <div className="form-group mb-6">
                 <label htmlFor="estrategia" className="block mb-2 font-bold text-pme-primary">7. Estrategia PME con IA:</label>
                 <div className="relative">
                     <textarea id="estrategia" value={estrategia} onChange={e => setEstrategia(e.target.value)} placeholder="Define la línea de acción principal..." className="w-full p-2 border border-gray-300 rounded-md h-24 resize-y focus:ring-pme-secondary focus:border-pme-secondary pr-12"/>
                    <button onClick={handleGenerateEstrategia} disabled={isEstrategiaButtonDisabled} className="absolute top-2 right-2 bg-pme-accent text-white px-2 py-1 rounded-md text-xs font-bold hover:bg-orange-600 transition disabled:bg-gray-400 flex items-center justify-center" title="Generar o Refinar estrategia con IA" style={{ height: '24px', width: '30px' }}>
                        {isGeneratingEstrategia ? <Spinner size="sm" /> : (estrategia ? '🔄' : 'IA')}
                    </button>
                 </div>

                 {estrategia && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label htmlFor="refineConceptos" className="block mb-1 text-xs font-bold text-pme-accent">Conceptos o Ajustes a considerar para Refinar:</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                id="refineConceptos"
                                value={refineEstrategiaConceptos}
                                onChange={e => setRefineEstrategiaConceptos(e.target.value)}
                                placeholder="Ej: Enfocar más en convivencia, incluir TIC..."
                                className="flex-1 p-2 text-xs border border-orange-200 rounded-md focus:ring-pme-accent focus:border-pme-accent bg-orange-50/30"
                            />
                            <button 
                                onClick={handleGenerateEstrategia}
                                disabled={isGeneratingEstrategia || !refineEstrategiaConceptos.trim()}
                                className="bg-pme-accent text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-orange-600 transition disabled:bg-gray-300 flex items-center gap-1"
                            >
                                {isGeneratingEstrategia ? <Spinner size="sm" /> : <><span className="material-symbols-outlined text-xs">auto_fix</span> Refinar</>}
                            </button>
                        </div>
                    </div>
                 )}

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

            <div className="form-group mb-6">
                <label htmlFor="nudosCriticos" className="block mb-2 font-bold text-pme-primary">8. Nudos Críticos a considerar:</label>
                <textarea 
                    id="nudosCriticos" 
                    value={nudosCriticos} 
                    onChange={e => setNudosCriticos(e.target.value)} 
                    placeholder="Ej: Bajos resultados en comprensión lectora en 4° básico, necesidad de fortalecer el clima de aula..." 
                    className="w-full p-2 border border-gray-300 rounded-md h-24 resize-y focus:ring-pme-secondary focus:border-pme-secondary"
                />
                <p className="mt-1 text-[10px] text-gray-500 italic">Incluye aquí resultados de aprendizaje prioritarios o focos específicos para que la IA los considere en las acciones.</p>
            </div>

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
                    <label htmlFor="cantidad" className="block mb-2 font-bold text-pme-primary">9. Cantidad de Acciones:</label>
                    <input type="number" id="cantidad" value={isNaN(cantidad) ? '' : cantidad} onChange={e => setCantidad(e.target.value === '' ? NaN : parseInt(e.target.value, 10))} min="1" max="5" className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:ring-pme-secondary focus:border-pme-secondary"/>
                </div>
                <div className="flex items-center gap-2 mt-8">
                     <input type="checkbox" id="googleSearch" checked={useGoogleSearch} onChange={e => setUseGoogleSearch(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-pme-secondary focus:ring-pme-secondary"/>
                    <label htmlFor="googleSearch" className="text-sm font-medium text-pme-primary flex items-center gap-1" title="Fundamenta la respuesta con información actualizada de la web.">
                       Usar Google Search <span className="material-symbols-outlined text-base text-blue-500">google</span>
                    </label>
                </div>
            </div>


            <button 
                onClick={generarPropuesta} 
                disabled={isLoading} 
                className="w-full bg-pme-secondary text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 no-print"
            >
                {isLoading && <Spinner />}
                {isLoading ? 'Generando Propuestas...' : (result ? 'Regenerar Propuesta' : 'Generar Propuestas con IA')}
            </button>

            <div className="mt-8 flex justify-center no-print border-t border-gray-100 pt-8">
                <button 
                    onClick={handleReset}
                    className="flex items-center gap-3 bg-gray-100 text-gray-600 px-8 py-3 rounded-xl hover:bg-gray-200 hover:text-pme-danger transition-all font-bold shadow-sm group"
                >
                    <span className="material-symbols-outlined text-2xl group-hover:rotate-180 transition-transform duration-500">restart_alt</span>
                    <div>
                        <p className="text-sm">Vaciar y Reiniciar Planificación</p>
                        <p className="text-[10px] font-normal opacity-70">Borrar todo e ingresar nueva información</p>
                    </div>
                </button>
            </div>

            {result && (
                 <div id="resultArea" className="mt-8 border border-gray-300 rounded-lg bg-white shadow-inner overflow-hidden">
                    <div className="p-6" dangerouslySetInnerHTML={{ __html: result.html }} />
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

            <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-400 text-xs">
                Copyright Claudio Jerez - 2026
            </footer>
        </div>
    );
}