
import React, { useState, useRef } from 'react';
import { evaluatePmeActionsCoherence, extractPmeStructure, evaluatePmeIndicator } from '../services/geminiService';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import Spinner from './Spinner';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
    FileText, 
    Printer, 
    Plus, 
    Upload, 
    Trash2, 
    CheckCircle2, 
    FileWarning, 
    Activity, 
    Trophy, 
    Target,
    Settings,
    Users,
    ClipboardCheck,
    SearchCheck,
    Sparkles,
    Download
} from 'lucide-react';

interface ActionLine {
    id: string;
    name: string;
    description: string;
    indicator: string;
    responsibles: string;
    resources: string;
    verificationMeans: string;
    feedback?: any; // Changed to any to store JSON evaluation
    loading?: boolean;
}

interface IndicatorLine {
    id: string;
    name: string;
    description: string;
    feedback?: any;
    loading?: boolean;
}

interface StrategicLine {
    id: string;
    dimension: string;
    subdimension: string;
    oe: string;
    meta: string;
    strategy: string;
    generalIndicators: IndicatorLine[];
    actions: ActionLine[];
}

const RevisorPme: React.FC = () => {
    const [strategicLines, setStrategicLines] = useState<StrategicLine[]>([]);
    const [loadingAll, setLoadingAll] = useState(false);
    const [processingFile, setProcessingFile] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const addStrategicLine = () => {
        setStrategicLines([...strategicLines, { 
            id: crypto.randomUUID(), 
            dimension: '', 
            subdimension: '', 
            oe: '', 
            meta: '', 
            strategy: '', 
            generalIndicators: [
                { id: crypto.randomUUID(), name: '', description: '' }
            ],
            actions: [{ 
                id: crypto.randomUUID(), 
                name: '', 
                description: '', 
                indicator: '', 
                responsibles: '',
                resources: '',
                verificationMeans: ''
            }] 
        }]);
    };

    const removeStrategicLine = (id: string) => {
        setStrategicLines(strategicLines.filter(l => l.id !== id));
    };

    const updateStrategicLine = (id: string, field: keyof StrategicLine, value: string) => {
        setStrategicLines(strategicLines.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    const addActionToLine = (lineId: string) => {
        setStrategicLines(strategicLines.map(l => {
            if (l.id === lineId) {
                return { 
                    ...l, 
                    actions: [...l.actions, { 
                        id: crypto.randomUUID(), 
                        name: '', 
                        description: '', 
                        indicator: '', 
                        responsibles: '',
                        resources: '',
                        verificationMeans: ''
                    }] 
                };
            }
            return l;
        }));
    };

    const removeActionFromLine = (lineId: string, actionId: string) => {
        setStrategicLines(strategicLines.map(l => {
            if (l.id === lineId) {
                return { ...l, actions: l.actions.filter(a => a.id !== actionId) };
            }
            return l;
        }));
    };

    const updateActionInLine = (lineId: string, actionId: string, field: keyof ActionLine, value: string) => {
        setStrategicLines(strategicLines.map(l => {
            if (l.id === lineId) {
                return { 
                    ...l, 
                    actions: l.actions.map(a => a.id === actionId ? { ...a, [field]: value } : a) 
                };
            }
            return l;
        }));
    };

    const addIndicatorToLine = (lineId: string) => {
        setStrategicLines(strategicLines.map(l => {
            if (l.id === lineId) {
                return { 
                    ...l, 
                    generalIndicators: [...l.generalIndicators, { id: crypto.randomUUID(), name: '', description: '' }] 
                };
            }
            return l;
        }));
    };

    const removeIndicatorFromLine = (lineId: string, indicatorId: string) => {
        setStrategicLines(strategicLines.map(l => {
            if (l.id === lineId) {
                return { ...l, generalIndicators: l.generalIndicators.filter(i => i.id !== indicatorId) };
            }
            return l;
        }));
    };

    const updateIndicatorInLine = (lineId: string, indicatorId: string, field: keyof IndicatorLine, value: string) => {
        setStrategicLines(strategicLines.map(l => {
            if (l.id === lineId) {
                return { 
                    ...l, 
                    generalIndicators: l.generalIndicators.map(i => i.id === indicatorId ? { ...i, [field]: value } : i) 
                };
            }
            return l;
        }));
    };

    const handleReviewIndicator = async (lineId: string, indicatorId: string) => {
        const line = strategicLines.find(l => l.id === lineId);
        const indicator = line?.generalIndicators.find(i => i.id === indicatorId);

        if (!line || !indicator) return;
        if (!indicator.name) {
            setError('El indicador debe tener al menos un nombre para ser revisado.');
            return;
        }

        setStrategicLines(prev => prev.map(l => l.id === lineId ? {
            ...l,
            generalIndicators: l.generalIndicators.map(i => i.id === indicatorId ? { ...i, loading: true } : i)
        } : l));

        try {
            const rawFeedback = await evaluatePmeIndicator({
                context: {
                    dimension: line.dimension,
                    subdimension: line.subdimension,
                    oe: line.oe,
                    meta: line.meta,
                    strategy: line.strategy
                },
                indicator: {
                    name: indicator.name,
                    description: indicator.description
                }
            });

            const feedback = typeof rawFeedback === 'string' ? JSON.parse(rawFeedback) : rawFeedback;

            setStrategicLines(prev => prev.map(l => l.id === lineId ? {
                ...l,
                generalIndicators: l.generalIndicators.map(i => i.id === indicatorId ? { ...i, feedback, loading: false } : i)
            } : l));
        } catch (err: any) {
            setError(err.message || 'Error al procesar la revisión del indicador.');
            setStrategicLines(prev => prev.map(l => l.id === lineId ? {
                ...l,
                generalIndicators: l.generalIndicators.map(i => i.id === indicatorId ? { ...i, loading: false } : i)
            } : l));
        }
    };

    const readFileAsBase64 = (file: File): Promise<{ mimeType: string, data: string }> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve({ mimeType: file.type, data: base64String });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Por favor, selecciona un archivo PDF o una imagen (JPG, PNG).');
                return;
            }
            setSelectedFile(file);
            setError(null);
            
            // Auto-process file
            setProcessingFile(true);
            try {
                const base64 = await readFileAsBase64(file);
                const result = await extractPmeStructure(base64);
                
                if (result.strategicLines && result.strategicLines.length > 0) {
                    // Map result to our structure adding IDs
                    const mappedLines = result.strategicLines.map((l: any) => ({
                        ...l,
                        id: crypto.randomUUID(),
                        generalIndicators: (l.generalIndicators || []).map((i: any) => ({ 
                            ...i, 
                            id: crypto.randomUUID() 
                        })),
                        actions: (l.actions || []).map((a: any) => ({ 
                            ...a, 
                            id: crypto.randomUUID(),
                            responsibles: a.responsibles || '',
                            resources: a.resources || '',
                            verificationMeans: a.verificationMeans || ''
                        }))
                    }));
                    setStrategicLines([...strategicLines, ...mappedLines]);
                }
            } catch (err: any) {
                console.error("Error al extraer estructura:", err);
                setError(`Error al extraer la estructura: ${err.message || 'No pudimos procesar el archivo.'}. Por favor, intenta subir otro archivo o ingresa los datos manualmente.`);
            } finally {
                setProcessingFile(false);
            }
        }
    };

    const handleReviewAction = async (lineId: string, actionId: string) => {
        const line = strategicLines.find(l => l.id === lineId);
        const action = line?.actions.find(a => a.id === actionId);

        if (!line || !action) return;
        if (!action.name || !action.description) {
            setError('La acción debe tener al menos nombre y descripción para ser revisada.');
            return;
        }

        setStrategicLines(prev => prev.map(l => l.id === lineId ? {
            ...l,
            actions: l.actions.map(a => a.id === actionId ? { ...a, loading: true } : a)
        } : l));

        try {
            const rawFeedback = await evaluatePmeActionsCoherence({
                context: {
                    dimension: line.dimension,
                    subdimension: line.subdimension,
                    oe: line.oe,
                    meta: line.meta,
                    strategy: line.strategy
                },
                action: {
                    name: action.name,
                    description: action.description,
                    indicator: action.indicator,
                    resources: action.resources,
                    responsibles: action.responsibles,
                    verificationMeans: action.verificationMeans
                },
                existingActions: line.actions.filter(a => a.id !== actionId).map(a => a.name)
            });

            let feedback;
            try {
                feedback = typeof rawFeedback === 'string' ? JSON.parse(rawFeedback) : rawFeedback;
            } catch (pErr) {
                feedback = { 
                    status: 'Error', 
                    evaluation: { 
                        error: { analysis: 'Error al procesar formato JSON de la IA', proposal: rawFeedback } 
                    } 
                };
            }

            setStrategicLines(prev => prev.map(l => l.id === lineId ? {
                ...l,
                actions: l.actions.map(a => a.id === actionId ? { ...a, feedback, loading: false } : a)
            } : l));
        } catch (err: any) {
            setError(err.message || 'Error al procesar la revisión.');
            setStrategicLines(prev => prev.map(l => l.id === lineId ? {
                ...l,
                actions: l.actions.map(a => a.id === actionId ? { ...a, loading: false } : a)
            } : l));
        }
    };

    const handlePrint = () => {
        window.focus();
        window.print();
    };

    const handleSavePdf = async () => {
        if (strategicLines.length === 0 || !resultRef.current) return;
        
        const originalScrollY = window.scrollY;
        window.scrollTo(0, 0);
        
        setLoadingAll(true);
        setError('Generando reporte PDF multi-página. Por favor, espera...');
        
        try {
            const element = resultRef.current;
            // A3 Landscape dimensions in mm: 420 x 297
            const pdf = new jsPDF('l', 'mm', 'a3');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            const canvas = await html2canvas(element, {
                scale: 2, 
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: element.scrollWidth,
            });
            
            // Restore scroll
            window.scrollTo(0, originalScrollY);

            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;
            const imgData = canvas.toDataURL('image/png', 1.0);

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add sequential pages
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            pdf.save(`Revision_PME_Completa_${new Date().toLocaleDateString()}.pdf`);
            setError(null);
        } catch (err: any) {
            console.error("Error al generar PDF:", err);
            window.scrollTo(0, originalScrollY);
            setError('Error al generar el PDF completo. Te recomendamos usar el botón "Imprimir" y seleccionar "Guardar como PDF".');
        } finally {
            setLoadingAll(false);
        }
    };

    const handleReviewAll = async () => {
        setLoadingAll(true);
        setError(null);

        // Validate Impact Indicators
        const strategiesMissingImpact = strategicLines.filter(line => 
            !line.generalIndicators.some(i => i.name.toLowerCase().includes('estudiante') || i.name.toLowerCase().includes('logro') || i.name.toLowerCase().includes('resultado'))
        );

        if (strategiesMissingImpact.length > 0) {
            setError(`Las siguientes estrategias no tienen al menos un indicador de impacto/resultado asociado: ${strategiesMissingImpact.map(l => l.strategy.substring(0, 30) + '...').join(', ')}`);
            setLoadingAll(false);
            return;
        }

        try {
            const indicatorPromises = strategicLines.flatMap(line => 
                line.generalIndicators.map(indicator => handleReviewIndicator(line.id, indicator.id))
            );
            const actionPromises = strategicLines.flatMap(line => 
                line.actions.map(action => handleReviewAction(line.id, action.id))
            );
            await Promise.all([...indicatorPromises, ...actionPromises]);
        } catch (err: any) {
            setError('Error al revisar todas las acciones e indicadores.');
        } finally {
            setLoadingAll(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-pme-primary flex items-center gap-2">
                    <span className="material-symbols-outlined">fact_check</span>
                    Revisor de Coherencia de Acciones PME
                </h2>
                <p className="text-gray-600 mt-2">
                    Carga el reporte de tu escuela para auto-completar la estructura o define manualmente el contexto estratégico y revisa cada acción.
                </p>
                
                <div className="mt-6 flex flex-wrap gap-4 items-center">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={processingFile}
                        className={`text-sm py-2.5 px-6 rounded-xl flex items-center gap-2 border-2 transition-all shadow-sm ${
                            processingFile 
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-wait' 
                                : 'bg-pme-primary border-pme-primary text-white hover:bg-pme-primary/90 hover:scale-[1.02]'
                        }`}
                    >
                        {processingFile ? (
                            <>
                                <Spinner size="sm" />
                                Procesando reporte...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">upload_file</span>
                                Cargar Reporte de la Escuela (PDF/Imagen)
                            </>
                        )}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="application/pdf,image/*" />
                    
                    <button 
                        onClick={addStrategicLine}
                        className="text-sm bg-white border-2 border-pme-secondary text-pme-secondary py-2.5 px-6 rounded-xl font-bold hover:bg-pme-secondary/5 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Agregar Línea Manualmente
                    </button>

                    {strategicLines.length > 0 && (
                        <button 
                            onClick={handleSavePdf}
                            disabled={loadingAll}
                            className="no-print text-sm bg-red-600 text-white border-2 border-red-600 py-2.5 px-6 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">picture_as_pdf</span>
                            Guardar PDF
                        </button>
                    )}

                    {strategicLines.length > 0 && (
                        <button 
                            onClick={handlePrint}
                            className="no-print text-sm bg-slate-800 text-white border-2 border-slate-800 py-2.5 px-6 rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">print</span>
                            Imprimir
                        </button>
                    )}

                    {strategicLines.length > 0 && (
                        <button 
                            onClick={() => setStrategicLines([])}
                            className="text-xs text-red-500 hover:underline"
                        >
                            Limpiar todo
                        </button>
                    )}
                </div>
            </header>

            <div className="space-y-12" ref={resultRef}>
                {strategicLines.length === 0 && !processingFile && (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400 flex flex-col items-center">
                        <span className="material-symbols-outlined text-6xl mb-4 opacity-20">inventory</span>
                        <p className="text-lg font-medium">No hay líneas estratégicas cargadas.</p>
                        <p className="max-w-md mx-auto mt-2">Sube un reporte para que la inteligencia artificial extraiga tus objetivos y acciones automáticamente, o empieza agregando una línea manual.</p>
                    </div>
                )}

                {processingFile && strategicLines.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                        <Spinner size="md" />
                        <p className="text-pme-primary font-bold animate-pulse text-lg tracking-tight">Estamos analizando tu reporte...</p>
                        <p className="text-gray-400 text-sm">Esto puede tardar unos segundos según la longitud del archivo.</p>
                    </div>
                )}

                {strategicLines.map((line, lineIndex) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={line.id} 
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                        {/* Header: Strategic Context */}
                        <div className="bg-slate-800 p-6 text-white">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold flex items-center gap-3">
                                    <span className="bg-white text-slate-800 text-xs w-6 h-6 flex items-center justify-center rounded-full font-black">
                                        {lineIndex + 1}
                                    </span>
                                    CONTEXTO ESTRATÉGICO
                                    <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-400 uppercase tracking-widest font-bold">Invariable</span>
                                </h3>
                                <button 
                                    onClick={() => removeStrategicLine(line.id)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                    title="Remover"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dimensión</label>
                                    <select 
                                        value={line.dimension} 
                                        onChange={(e) => updateStrategicLine(line.id, 'dimension', e.target.value)}
                                        className="w-full text-xs p-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-pme-secondary outline-none appearance-none"
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value="GESTIÓN PEDAGÓGICA">GESTIÓN PEDAGÓGICA</option>
                                        <option value="LIDERAZGO">LIDERAZGO</option>
                                        <option value="CONVIVENCIA EDUCATIVA">CONVIVENCIA EDUCATIVA</option>
                                        <option value="GESTIÓN DE RECURSOS">GESTIÓN DE RECURSOS</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subdimensión</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: Gestión Curricular"
                                        value={line.subdimension} 
                                        onChange={(e) => updateStrategicLine(line.id, 'subdimension', e.target.value)}
                                        className="w-full text-xs p-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-pme-secondary outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Objetivo Estratégico</label>
                                    <textarea 
                                        placeholder="Ingrese el OE..."
                                        value={line.oe} 
                                        onChange={(e) => updateStrategicLine(line.id, 'oe', e.target.value)}
                                        className="w-full text-[11px] p-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-pme-secondary outline-none h-20 resize-none leading-relaxed"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta Estratégica</label>
                                    <textarea 
                                        placeholder="Ingrese la Meta..."
                                        value={line.meta} 
                                        onChange={(e) => updateStrategicLine(line.id, 'meta', e.target.value)}
                                        className="w-full text-[11px] p-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-pme-secondary outline-none h-20 resize-none leading-relaxed"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estrategia</label>
                                    <textarea 
                                        placeholder="Ingrese la Estrategia..."
                                        value={line.strategy} 
                                        onChange={(e) => updateStrategicLine(line.id, 'strategy', e.target.value)}
                                        className="w-full text-[11px] p-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-pme-secondary outline-none h-20 resize-none leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* General Indicators Section */}
                        <div className="p-6 bg-slate-50/50 border-b border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">analytics</span>
                                    Indicadores de Seguimiento Estratégico
                                </h4>
                                <button 
                                    onClick={() => addIndicatorToLine(line.id)}
                                    className="text-[10px] font-bold text-pme-secondary hover:underline flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-xs">add_circle</span>
                                    Agregar Indicador
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="py-2 text-[10px] font-black text-gray-400 uppercase w-1/5">Nombre Indicador</th>
                                            <th className="py-2 text-[10px] font-black text-gray-400 uppercase w-1/5">Descripción</th>
                                            <th className="py-2 text-[10px] font-black text-gray-400 uppercase w-1/4">Análisis y Retroalimentación</th>
                                            <th className="py-2 text-[10px] font-black text-gray-400 uppercase w-1/4">Propuesta de Mejora</th>
                                            <th className="w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {line.generalIndicators.map((indicator) => (
                                            <tr key={indicator.id} className="group hover:bg-white transition-colors">
                                                <td className="py-3 pr-4 align-top">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Ej: % de asistencia"
                                                        value={indicator.name}
                                                        onChange={(e) => updateIndicatorInLine(line.id, indicator.id, 'name', e.target.value)}
                                                        className="w-full text-xs p-2 border border-gray-200 rounded focus:border-pme-secondary outline-none"
                                                    />
                                                </td>
                                                <td className="py-3 pr-4 align-top">
                                                    <textarea 
                                                        placeholder="Cómo se mide..."
                                                        value={indicator.description}
                                                        onChange={(e) => updateIndicatorInLine(line.id, indicator.id, 'description', e.target.value)}
                                                        className="w-full text-[10px] p-2 border border-gray-200 rounded focus:border-pme-secondary outline-none h-16 resize-none"
                                                    />
                                                    <button 
                                                        onClick={() => handleReviewIndicator(line.id, indicator.id)}
                                                        disabled={indicator.loading}
                                                        className="mt-2 text-[9px] font-bold bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 transition-colors flex items-center gap-1"
                                                    >
                                                        {indicator.loading ? <Spinner size="sm" /> : <span className="material-symbols-outlined text-[10px]">auto_fix</span>}
                                                        Revisar Indicador
                                                    </button>
                                                </td>
                                                <td className="py-3 pr-4 align-top">
                                                    {indicator.feedback && (
                                                        <div className="text-[10px] text-slate-600 leading-tight prose prose-sm prose-slate">
                                                            <Markdown>{indicator.feedback.analysis}</Markdown>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 pr-4 align-top">
                                                    {indicator.feedback && (
                                                        <div className="text-[10px] text-pme-primary font-bold leading-tight bg-white p-2 rounded border border-slate-100 shadow-sm prose prose-sm prose-indigo">
                                                            <Markdown>{indicator.feedback.proposal}</Markdown>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 align-top text-center">
                                                    <button 
                                                        onClick={() => removeIndicatorFromLine(line.id, indicator.id)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors mt-2"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">remove_circle</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Actions Review Section */}
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center bg-gray-50 -mx-6 -mt-6 p-6 mb-6">
                                <div>
                                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-pme-secondary">ads_click</span>
                                        ACCIONES (Editable)
                                    </h4>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Ajusta nombres, descripciones, indicadores, responsables y recursos para revisión</p>
                                </div>
                                <button 
                                    onClick={() => addActionToLine(line.id)}
                                    className="text-xs bg-white border border-pme-secondary text-pme-secondary px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-pme-secondary hover:text-white transition-all shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                    Añadir Acción
                                </button>
                            </div>

                            <div className="space-y-8">
                                {line.actions.map((action, actIndex) => (
                                    <div key={action.id} className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                                        {/* Input Fields */}
                                        <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-pme-secondary/10 text-pme-secondary text-[10px] font-black px-2 py-1 rounded">ACCIÓN {actIndex + 1}</span>
                                                </div>
                                                {line.actions.length > 1 && (
                                                    <button onClick={() => removeActionFromLine(line.id, action.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                        <span className="material-symbols-outlined text-lg">delete_forever</span>
                                                    </button>
                                                )}
                                            </div>
                                            
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Nombre de la Acción</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Ej: Implementación de talleres DUA"
                                                    value={action.name} 
                                                    onChange={(e) => updateActionInLine(line.id, action.id, 'name', e.target.value)}
                                                    className="w-full text-sm p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pme-secondary/20 focus:border-pme-secondary outline-none transition-all"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Descripción de la Acción</label>
                                                <textarea 
                                                    placeholder="Detalle los pasos, responsables y metodología..."
                                                    value={action.description} 
                                                    onChange={(e) => updateActionInLine(line.id, action.id, 'description', e.target.value)}
                                                    className="w-full text-sm p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pme-secondary/20 focus:border-pme-secondary outline-none h-28 resize-none transition-all leading-relaxed"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Indicador de Seguimiento</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="% de logro..."
                                                        value={action.indicator} 
                                                        onChange={(e) => updateActionInLine(line.id, action.id, 'indicator', e.target.value)}
                                                        className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pme-secondary/20 focus:border-pme-secondary outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Responsables (Cargo)</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Ej: Jefe de UTP"
                                                        value={action.responsibles} 
                                                        onChange={(e) => updateActionInLine(line.id, action.id, 'responsibles', e.target.value)}
                                                        className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pme-secondary/20 focus:border-pme-secondary outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Recursos</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Ej: SEP, PIE, Propios"
                                                        value={action.resources} 
                                                        onChange={(e) => updateActionInLine(line.id, action.id, 'resources', e.target.value)}
                                                        className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pme-secondary/20 focus:border-pme-secondary outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Medios de Verificación</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Ej: Planificaciones, bitácoras"
                                                        value={action.verificationMeans} 
                                                        onChange={(e) => updateActionInLine(line.id, action.id, 'verificationMeans', e.target.value)}
                                                        className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pme-secondary/20 focus:border-pme-secondary outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => handleReviewAction(line.id, action.id)}
                                                disabled={action.loading || processingFile}
                                                className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                                                    action.loading 
                                                        ? 'bg-gray-100 text-gray-400 cursor-wait' 
                                                        : 'bg-slate-800 text-white hover:bg-slate-900 active:scale-95'
                                                }`}
                                            >
                                                {action.loading ? (
                                                    <Spinner size="sm" />
                                                ) : (
                                                     <>
                                                        <span className="material-symbols-outlined text-sm text-pme-secondary">verified_user</span>
                                                        Validar Coherencia con AI
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* AI Feedback */}
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 h-full flex flex-col shadow-inner relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                <span className="material-symbols-outlined text-6xl text-pme-secondary">psychology</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-pme-secondary animate-pulse"></span>
                                                    Retroalimentación de la IA
                                                </div>
                                                {action.feedback?.status && (
                                                    <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                                                        action.feedback.status === 'Óptimo' ? 'bg-green-100 text-green-700' :
                                                        action.feedback.status === 'Mejorable' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {action.feedback.status}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {action.feedback?.evaluation ? (
                                                <div className="overflow-x-auto custom-scrollbar">
                                                    <table className="w-full text-left border-collapse min-w-[500px]">
                                                        <thead>
                                                            <tr className="border-b border-slate-200">
                                                                <th className="py-2 text-[9px] font-black text-slate-400 uppercase w-1/4">Elemento</th>
                                                                <th className="py-2 text-[9px] font-black text-slate-400 uppercase w-3/8">Análisis y Retroalimentación</th>
                                                                <th className="py-2 text-[9px] font-black text-slate-400 uppercase w-3/8">Propuesta de Mejora</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {[
                                                                { key: 'name', label: 'Nombre' },
                                                                { key: 'description', label: 'Descripción' },
                                                                { key: 'resources', label: 'Recursos' },
                                                                { key: 'verificationMeans', label: 'Medios de Verificación' }
                                                            ].map(({ key, label }) => {
                                                                const evalData = action.feedback.evaluation[key];
                                                                if (!evalData) return null;
                                                                return (
                                                                    <tr key={key} className="hover:bg-slate-100/50 transition-colors">
                                                                        <td className="py-2 pr-2 align-top">
                                                                            <p className="text-[10px] font-bold text-slate-700">{label}</p>
                                                                        </td>
                                                                        <td className="py-2 pr-2 align-top">
                                                                            <div className="text-[10px] text-slate-600 leading-tight font-medium prose prose-sm prose-slate">
                                                                                <Markdown>{evalData.analysis}</Markdown>
                                                                            </div>
                                                                        </td>
                                                                        <td className="py-2 align-top">
                                                                            <div className="text-[10px] text-pme-primary font-bold bg-white/50 p-2 rounded border border-slate-200/50 prose prose-sm prose-indigo">
                                                                                <Markdown>{evalData.proposal}</Markdown>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs text-center p-8 space-y-4">
                                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                        <span className="material-symbols-outlined text-3xl opacity-30">pending_actions</span>
                                                    </div>
                                                    <p className="max-w-[180px]">Esperando validación... Completa los campos y presiona el botón para analizar.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {strategicLines.length > 0 && (
                    <div className="flex flex-col md:flex-row gap-4 pt-10">
                        <button 
                            onClick={handleReviewAll}
                            disabled={loadingAll || processingFile}
                            className={`flex-1 p-6 bg-pme-primary text-white rounded-3xl flex items-center justify-center gap-3 shadow-xl transition-all font-black text-lg ${
                                loadingAll || processingFile ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl'
                            }`}
                        >
                            {loadingAll ? <Spinner size="md" /> : <span className="material-symbols-outlined text-2xl">auto_awesome</span>}
                            REVISAR TODO EL PLAN DE MEJORAMIENTO
                        </button>
                    </div>
                )}
            </div>

            {strategicLines.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 no-print">
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-slate-900 border border-slate-700 text-white p-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md bg-opacity-95"
                    >
                        <div className="px-5 border-r border-slate-700">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">Reporte PME 2026</p>
                            <p className="text-sm font-bold text-white mt-1 leading-none">{strategicLines.length} Líneas Estratégicas</p>
                        </div>
                        
                        <button 
                            onClick={handleSavePdf}
                            disabled={loadingAll}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all font-bold text-xs shadow-lg shadow-red-900/20 active:scale-95 disabled:opacity-50"
                        >
                            {loadingAll ? <Spinner size="sm" /> : <Download className="w-4 h-4" />}
                            Guardar PDF Completo
                        </button>
                        
                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all font-bold text-xs border border-slate-600"
                        >
                            <Printer className="w-4 h-4" />
                            Imprimir
                        </button>

                        {!loadingAll && (
                            <button 
                                onClick={handleReviewAll}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all font-bold text-xs shadow-lg shadow-indigo-900/20 active:scale-95"
                            >
                                <Sparkles className="w-4 h-4" />
                                Validar Todo
                            </button>
                        )}
                    </motion.div>
                </div>
            )}

            {error && (
                <div className="fixed bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-96 p-5 bg-white border-l-4 border-l-red-500 rounded-xl text-slate-800 text-sm flex items-start gap-3 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-5">
                    <span className="material-symbols-outlined text-red-500">warning</span>
                    <div className="flex-1">
                        <p className="font-bold text-red-600 mb-1">Atención</p>
                        <p className="text-xs leading-relaxed">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
                .markdown-body-small {
                    font-size: 10px !important;
                }
                .markdown-body-small p {
                    margin-bottom: 4px !important;
                }
                .markdown-body-small ul, .markdown-body-small ol {
                    padding-left: 12px !important;
                    margin-bottom: 4px !important;
                }
            `}} />
        </div>
    );
};

export default RevisorPme;
