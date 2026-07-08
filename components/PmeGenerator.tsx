
import React, { useState, useMemo, useRef } from 'react';
import { ESTRUCTURA_EID, PLANES_NORMATIVOS } from '../constants';
import { estandaresPME } from '../pme-guides';
import { generatePmeActions, generateStrategicObjectiveSuggestion, generateEstrategia, generateMetaEstrategica, generateFaseEstrategicaFromDiagnostic } from '../services/geminiService';
import type { Message } from '../types';
import MessageBox from './MessageBox';
import Spinner from './Spinner';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, loginWithGoogle, logout } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, limit, getDocFromServer, doc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import AdminPanel from './AdminPanel';

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
    const [evaluacionEstandares, setEvaluacionEstandares] = useState<Record<string, number>>({});
    const [cantidad, setCantidad] = useState<number>(1);
    const [useGoogleSearch, setUseGoogleSearch] = useState<boolean>(true);
    const [showPlanningDates, setShowPlanningDates] = useState<boolean>(false);
    const [refineEstrategiaConceptos, setRefineEstrategiaConceptos] = useState<string>('');
    const [nudosCriticos, setNudosCriticos] = useState<string>('');
    
    // Cycle info
    const [cicloInicio, setCicloInicio] = useState<number>(new Date().getFullYear());
    const [cicloFin, setCicloFin] = useState<number>(new Date().getFullYear() + 3);
    const [anioProceso, setAnioProceso] = useState<number>(new Date().getFullYear());

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGeneratingObjective, setIsGeneratingObjective] = useState<boolean>(false);
    const [isGeneratingMeta, setIsGeneratingMeta] = useState<boolean>(false);
    const [isGeneratingEstrategia, setIsGeneratingEstrategia] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [result, setResult] = useState<ResultState | null>(null);
    const [message, setMessage] = useState<Message | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
    const resultRef = useRef<HTMLDivElement>(null);

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

    // Ensure we load the global year configuration on initial load
    React.useEffect(() => {
        const savedDataStr = localStorage.getItem('eid_app_state_v3');
        if (savedDataStr) {
            try {
                const diagState = JSON.parse(savedDataStr);
                if (diagState.cicloInicio) setCicloInicio(diagState.cicloInicio);
                if (diagState.cicloFin) setCicloFin(diagState.cicloFin);
                if (diagState.anio) setAnioProceso(diagState.anio);
            } catch (e) {
                console.error("Error loading dates from diagState", e);
            }
        }
    }, []);

    // Avoid window.confirm as it can break the browser locker behavior in some sandboxed environments
    const handleReset = () => {
        setDimension('');
        setSubdimension('');
        setObjEstrategico('');
        setMetaEstrategica('');
        setEstrategia('');
        setSelectedPlanes([]);
        setSelectedPlanObjectives({});
        setCustomPlanObjectives({});
        setSelectedEstandares([]);
        setEvaluacionEstandares({});
        setCantidad(1);
        setUseGoogleSearch(false);
        setRefineEstrategiaConceptos('');
        setNudosCriticos('');
        setResult(null);
        setMessage({ type: 'info', text: 'Planificación reiniciada correctamente.' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrint = () => {
        setMessage({ type: 'info', text: 'Abriendo ventana de impresión...' });
        window.print();
    };

    const handleSavePdf = async () => {
        if (!result || !resultRef.current) return;
        
        setIsLoading(true);
        setMessage({ type: 'info', text: 'Generando archivo PDF, por favor espera...' });
        
        try {
            const element = resultRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            // If the content is longer than one page, we might need to handle it.
            // For now, simplicity:
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`PME_Propuesta_${dimension.replace(/\s+/g, '_')}.pdf`);
            
            setMessage({ type: 'success', text: 'PDF generado y descargado exitosamente.' });
        } catch (error) {
            console.error("Error al generar PDF:", error);
            setMessage({ type: 'error', text: 'Error al generar el PDF. Puedes intentar usando el botón Imprimir y seleccionar "Guardar como PDF".' });
        } finally {
            setIsLoading(false);
        }
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
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                setMessage({ type: 'info', text: 'Inicio de sesión cancelado (ventana emergente cerrada).' });
            } else if (error.code === 'auth/cancelled-popup-request') {
                // Secondary error when multiple popups are tried
                return;
            } else {
                setMessage({ type: 'error', text: 'Error al iniciar sesión con Google: ' + (error.message || error) });
            }
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al cerrar sesión.' });
        }
    };

    const handleLoadFromDiagnostic = async () => {
        setMessage(null);
        if (!dimension || !subdimension) {
            setMessage({ type: 'info', text: 'Selecciona una dimensión y subdimensión primero para cargar sus datos.' });
            return;
        }

        const savedDataStr = localStorage.getItem('eid_app_state_v3');
        if (!savedDataStr) {
             setMessage({ type: 'info', text: 'No hay diagnóstico previo guardado. Ve a "EVALUACION INDICADORES DE DESEMPEÑO" para realizarlo.' });
             return;
        }

        try {
            const diagState = JSON.parse(savedDataStr);
            let dimId = '';
            let subDimId = '';

            const foundDim = ESTRUCTURA_EID.find(d => d.nombre.toLowerCase() === dimension.toLowerCase());
            if (foundDim) {
                dimId = foundDim.id;
                const normalizedSearch = subdimension.toLowerCase().replace('del', 'de');
                const foundSub = foundDim.subdimensiones.find(s => s.nombre.toLowerCase().replace('del', 'de') === normalizedSearch);
                if (foundSub) {
                    subDimId = foundSub.id;
                }
            }

            if (!dimId) {
                const dimensionToId: Record<string, string> = {
                    'Liderazgo': 'liderazgo',
                    'Gestión Pedagógica': 'gestion_pedagogica',
                    'Formación y Convivencia': 'formacion_convivencia',
                    'Gestión de Recursos': 'gestion_recursos'
                };
                dimId = dimensionToId[dimension] || '';
            }

            if (dimId) {
                let currentCicloInicio = anioProceso;
                let currentCicloFin = anioProceso + 3;
                let currentAnioProcess = anioProceso;
                let currentNudosCriticos = nudosCriticos;

                if (diagState.cicloInicio) { setCicloInicio(diagState.cicloInicio); currentCicloInicio = diagState.cicloInicio; }
                if (diagState.cicloFin) { setCicloFin(diagState.cicloFin); currentCicloFin = diagState.cicloFin; }
                if (diagState.anio) { setAnioProceso(diagState.anio); currentAnioProcess = diagState.anio; }

                if (diagState.nudosCriticos && diagState.nudosCriticos[dimId]) {
                    currentNudosCriticos = diagState.nudosCriticos[dimId];
                    setNudosCriticos(currentNudosCriticos);
                }

                const loadedEvaluaciones: Record<string, number> = {};
                let currentSelectedEstandares: string[] = [];

                if (diagState.evaluaciones && foundDim) {
                    const subDimDef = foundDim.subdimensiones.find(s => s.id === subDimId);
                    if (subDimDef) {
                        subDimDef.estandares.forEach(stdId => {
                            if (diagState.evaluaciones[stdId]) {
                                loadedEvaluaciones[stdId] = diagState.evaluaciones[stdId].nivel;
                            }
                        });
                        setEvaluacionEstandares(loadedEvaluaciones);
                        currentSelectedEstandares = Object.keys(loadedEvaluaciones).filter(k => loadedEvaluaciones[k] <= 2);
                        setSelectedEstandares(currentSelectedEstandares);
                    }
                }

                setIsGeneratingObjective(true);
                setIsGeneratingMeta(true);
                setIsGeneratingEstrategia(true);
                setIsLoading(true);

                try {
                    const aiResult = await generateFaseEstrategicaFromDiagnostic({
                        dimension,
                        subdimension,
                        nudosCriticos: currentNudosCriticos,
                        evaluaciones: loadedEvaluaciones,
                        cicloInicio: currentCicloInicio,
                        cicloFin: currentCicloFin,
                        anioProceso: currentAnioProcess
                    });

                    if (aiResult.objetivo) setObjEstrategico(aiResult.objetivo);
                    if (aiResult.meta) setMetaEstrategica(aiResult.meta);
                    if (aiResult.estrategia) setEstrategia(aiResult.estrategia);

                    setMessage({ type: 'success', text: `Datos cargados y Propuesta Estratégica generada por IA para ${subdimension}.` });
                } catch (aiError) {
                    console.error("AI Generation failed", aiError);
                    // Fallback to purely loaded data
                    if (diagState.objetivosMetas && diagState.objetivosMetas[dimId]) {
                        const dimData = diagState.objetivosMetas[dimId];
                        if (dimData.objetivo) setObjEstrategico(dimData.objetivo);
                        if (dimData.meta) setMetaEstrategica(dimData.meta);
                        
                        if (subDimId && dimData.estrategiasSubdimensiones && dimData.estrategiasSubdimensiones[subDimId]) {
                            setEstrategia(dimData.estrategiasSubdimensiones[subDimId]);
                        } else if (dimData.estrategia) {
                            setEstrategia(dimData.estrategia);
                        }
                    }
                    setMessage({ type: 'error', text: 'Se cargaron los datos guardados, pero falló la generación automática por IA.' });
                } finally {
                    setIsGeneratingObjective(false);
                    setIsGeneratingMeta(false);
                    setIsGeneratingEstrategia(false);
                    setIsLoading(false);
                }

            } else {
                setMessage({ type: 'error', text: 'No se pudo mapear la dimensión con los datos guardados.' });
            }

        } catch (e) {
            console.error("Error loading diagnostic state", e);
            setMessage({ type: 'error', text: 'Error al procesar los datos de diagnóstico guardados.' });
        }
    };

    const subdimensiones = useMemo(() => {
        if (dimension) {
            const dimObj = ESTRUCTURA_EID.find(d => d.nombre === dimension || d.id === dimension);
            return dimObj ? dimObj.subdimensiones.map(s => s.nombre) : [];
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
    
    const handleApiError = (error: any, context: string) => {
        const errorMessage = (error as Error).message || 'Ocurrió un error desconocido.';
        let displayMessage = `Error al generar ${context}:\n${errorMessage}`;
        
        if (errorMessage.includes('Forbidden') || errorMessage.includes('403') || errorMessage.includes('PERMISSION_DENIED')) {
            displayMessage = `ERROR DE PERMISOS (403): Tu API Key no tiene permisos suficientes para usar esta versión de Gemini o la región está restringida. Verifica que la API de Gemini ("Generative Language API") esté habilitada en tu proyecto de Google Cloud, o utiliza "AI Studio Free Tier".`;
        } else if (errorMessage.includes('Clave de API no configurada') || errorMessage.includes('API key not found')) {
            displayMessage = `ERROR DE CONFIGURACIÓN: No se detectó la clave de API (GEMINI_API_KEY). Asegúrate de añadirla en los ajustes del proyecto (Settings > Secrets) o como Variable de Entorno en tu hosting (Vercel/Netlify).`;
        }
        
        setMessage({ type: 'error', text: displayMessage });
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
            const suggestion = await generateStrategicObjectiveSuggestion({ dimension, subdimension, planesData, cicloInicio, cicloFin, anioProceso });
            setObjEstrategico(suggestion);
        } catch (error) {
            handleApiError(error, 'objetivo estratégico');
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
            const suggestion = await generateMetaEstrategica({ objEstrategico, dimension, subdimension, cicloInicio, cicloFin, anioProceso });
            setMetaEstrategica(suggestion);
        } catch (error) {
            handleApiError(error, 'meta estratégica');
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
            const estandaresContext = selectedEstandares.map(std => {
                const evalNivel = evaluacionEstandares[std];
                const labels = ['Incipiente', 'Débil', 'Satisfactorio', 'Avanzado'];
                const evalText = evalNivel ? ` (Autoevaluación: Nivel ${evalNivel} - ${labels[evalNivel-1]})` : '';
                return `${std}${evalText}`;
            });

            const suggestion = await generateEstrategia({ 
                dimension, 
                subdimension, 
                objEstrategico, 
                metaEstrategica, 
                planesData, 
                estandaresSeleccionados: estandaresContext,
                conceptosRefinamiento: refineEstrategiaConceptos,
                estrategiaActual: estrategia,
                cicloInicio,
                cicloFin,
                anioProceso
            });
            setEstrategia(suggestion);
            setRefineEstrategiaConceptos(''); // Clear after refinement
        } catch (error) {
            handleApiError(error, 'estrategia');
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
            const estandaresContext = selectedEstandares.map(std => {
                const evalNivel = evaluacionEstandares[std];
                const labels = ['Incipiente', 'Débil', 'Satisfactorio', 'Avanzado'];
                const evalText = evalNivel ? ` (Autoevaluación: Nivel ${evalNivel} - ${labels[evalNivel-1]})` : '';
                return `${std}${evalText}`;
            });

            const { text, citations } = await generatePmeActions({
                cantidad: finalCantidad, dimension, subdimension, objEstrategico, metaEstrategica, estrategia, planesData, useGoogleSearch, estandaresSeleccionados: estandaresContext, nudosCriticos, cicloInicio, cicloFin, anioProceso
            });
            setResult({ html: markdownToHtml(text), citations: citations || [] });
        } catch (error) {
            handleApiError(error, 'propuesta de acciones');
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

            {user?.email === 'thegathering.cl@gmail.com' && (
                <AdminPanel adminUid={user.uid} />
            )}

            <h1 className="text-3xl sm:text-4xl font-bold text-center text-pme-primary mb-1">
                PLANIFICADOR PME {anioProceso}
            </h1>
            <p className="text-center font-semibold text-pme-accent text-sm mb-1">
                Ciclo Estratégico: {cicloInicio} - {cicloFin} (Las metas y objetivos son a 4 años, la estrategia es anual)
            </p>
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
                        {ESTRUCTURA_EID.map(dim => <option key={dim.id} value={dim.nombre}>{dim.nombre}</option>)}
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

            {subdimension && (
                <div className="mb-6 flex justify-center no-print">
                    <button 
                        onClick={handleLoadFromDiagnostic}
                        className="px-6 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition shadow-sm border border-blue-200 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">download</span>
                        Cargar Propuesta de Fase Estratégica (Desde Evaluación)
                    </button>
                </div>
            )}

            {subdimension && (estandaresPME as any)[dimension]?.[subdimension] && (
                <div className="mb-6 bg-white border border-gray-200 p-4 rounded-md shadow-sm">
                    <div className="mb-4">
                        <h4 className="text-lg font-bold text-pme-primary flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-pme-accent">assignment_turned_in</span>
                            Autoevaluación de Estándares Indicativos de Desempeño
                        </h4>
                        <p className="text-xs text-gray-500">Evalúa el nivel de desarrollo de tu institución en cada estándar e indica cuáles quieres abordar en tu propuesta PME (Mínimo 1). La IA se basará en estos estándares para enfocar la estrategia y acciones.</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-end mb-2 hidden sm:flex">
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                                {selectedEstandares.length} estándar(es) seleccionado(s)
                            </span>
                        </div>
                        {(estandaresPME as any)[dimension][subdimension].map((std: string, idx: number) => (
                            <div 
                                key={idx} 
                                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded border transition-all ${
                                    selectedEstandares.includes(std) 
                                    ? 'bg-blue-50 border-blue-300' 
                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <label className="flex items-start gap-3 cursor-pointer flex-1 mb-3 sm:mb-0">
                                    <input 
                                        type="checkbox" 
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedEstandares.includes(std)}
                                        onChange={() => handleEstandardToggle(std)}
                                    />
                                    <span className={`text-xs ${selectedEstandares.includes(std) ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>{std}</span>
                                </label>
                                
                                <div className="sm:ml-4 flex flex-col items-start sm:items-end w-full sm:w-auto mt-2 sm:mt-0">
                                    <span className="text-[10px] text-gray-500 font-bold mb-1 ml-7 sm:ml-0">Nivel de Práctica Institucional:</span>
                                    <div className="flex bg-gray-100 rounded p-1 ml-7 sm:ml-0 w-[calc(100%-28px)] sm:w-auto max-w-[320px]">
                                        {[1, 2, 3, 4].map(nivel => {
                                            const labels = ['Incipiente', 'Débil', 'Satisfactorio', 'Avanzado'];
                                            const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
                                            const isSelected = evaluacionEstandares[std] === nivel;
                                            return (
                                                <button 
                                                    key={nivel}
                                                    onClick={() => setEvaluacionEstandares(prev => ({ ...prev, [std]: nivel }))}
                                                    className={`px-2 py-1.5 text-[9px] sm:text-[10px] font-bold rounded-sm transition-all flex-1 text-center ${
                                                        isSelected 
                                                        ? `${colors[nivel-1]} text-white shadow-sm` 
                                                        : 'text-gray-500 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {labels[nivel-1]}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
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
                    {Object.keys(PLANES_NORMATIVOS).map(planKey => {
                        const planObj = PLANES_NORMATIVOS[planKey];
                        return (
                        <label key={planKey} className="flex items-center gap-2 text-sm text-pme-primary">
                            <input type="checkbox" name="planes" value={planKey} checked={selectedPlanes.includes(planKey)} onChange={handlePlanSelection} className="h-4 w-4 rounded border-gray-300 text-pme-secondary focus:ring-pme-secondary"/>
                            {planObj.nombre}
                        </label>
                        );
                    })}
                </div>
            </div>

            {selectedPlanes.length > 0 && !selectedPlanes.includes('No vincular') && <div className="form-group mb-4">
                <label className="block mb-2 font-bold text-pme-primary">6. Objetivos Específicos por Plan (Selecciona uno o más):</label>
                <div className="space-y-3">
                    {selectedPlanes.map(planKey => {
                        const planObj = PLANES_NORMATIVOS[planKey as keyof typeof PLANES_NORMATIVOS];
                        if (!planObj) return null;
                        return (
                        <div key={planKey} className="bg-gray-50 border-l-4 border-pme-accent p-3 rounded-r-md">
                            <label className="block text-sm font-semibold text-pme-accent mb-2">{planObj.nombre}</label>
                            <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-white border border-gray-200 rounded-md">
                                {planObj.objetivos.map((obj, index) => (
                                    <label key={`${planKey}-${index}`} className="flex items-start gap-2 text-xs text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input 
                                            type="checkbox" 
                                            checked={(selectedPlanObjectives[planKey] || []).includes(obj)} 
                                            onChange={() => handleObjectiveToggle(planKey, obj)}
                                            className="mt-0.5 h-3 w-3 rounded border-gray-300 text-pme-accent focus:ring-pme-accent"
                                        />
                                        <span>{obj}</span>
                                    </label>
                                ))}
                                <label className="flex items-center gap-2 text-xs text-pme-accent font-bold cursor-pointer hover:bg-gray-50 p-1 rounded">
                                    <input 
                                        type="checkbox" 
                                        checked={(selectedPlanObjectives[planKey] || []).includes("Otro")} 
                                        onChange={() => handleObjectiveToggle(planKey, "Otro")}
                                        className="h-3 w-3 rounded border-gray-300 text-pme-accent focus:ring-pme-accent"
                                    />
                                    Otro (Especificar manualmente...)
                                </label>
                                {(selectedPlanObjectives[planKey] || []).includes("Otro") && (
                                    <div className="px-2 pb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <textarea 
                                            value={customPlanObjectives[planKey] || ''}
                                            onChange={(e) => setCustomPlanObjectives(prev => ({ ...prev, [planKey]: e.target.value }))}
                                            placeholder="Escribe aquí el objetivo específico..."
                                            className="w-full p-2 text-[10px] border border-orange-200 rounded bg-orange-50/20 focus:ring-pme-accent focus:border-pme-accent h-16 resize-none"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )})}
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
            
            <div className="form-group mb-6 flex flex-wrap items-end justify-between gap-6">
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="cantidad" className="block mb-2 font-bold text-pme-primary">9. Cantidad de Acciones:</label>
                    <input type="number" id="cantidad" value={isNaN(cantidad) ? '' : cantidad} onChange={e => setCantidad(e.target.value === '' ? NaN : parseInt(e.target.value, 10))} min="1" max="5" className="w-full p-2 border border-gray-300 rounded-md focus:ring-pme-secondary focus:border-pme-secondary shadow-sm"/>
                </div>
                
                <div className="flex-1 min-w-[240px]">
                    <div className={`p-4 rounded-xl border-2 transition-all duration-500 cursor-pointer flex flex-col gap-2 ${useGoogleSearch ? 'bg-blue-50 border-blue-400 shadow-md' : 'bg-gray-50 border-gray-200 opacity-80'}`} onClick={() => setUseGoogleSearch(!useGoogleSearch)}>
                        <div className="flex items-center justify-between">
                            <label htmlFor="googleSearch" className="text-sm font-black text-pme-primary flex items-center gap-2 cursor-pointer">
                                AI + GOOGLE SEARCH
                                <span className={`flex h-2 w-2 rounded-full ${useGoogleSearch ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                            </label>
                            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${useGoogleSearch ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${useGoogleSearch ? 'translate-x-5.5' : 'translate-x-0.5'}`}></div>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium">Búsqueda avanzada para fundamentar acciones con evidencia actualizada.</p>
                        <input type="checkbox" id="googleSearch" checked={useGoogleSearch} onChange={e => setUseGoogleSearch(e.target.checked)} className="hidden"/>
                    </div>
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
                 <div id="resultArea" ref={resultRef} className="mt-8 border border-gray-300 rounded-lg bg-white shadow-inner overflow-hidden">
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