
import React, { useState, useEffect, useRef } from 'react';
import { learningObjectivesData, Level, Nucleus, LearningObjective } from '../constants/learningObjectives';
import { db, auth } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { generateAnnualPlan, generateUnitPlan } from '../services/geminiService';
import Spinner from './Spinner';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const MONTHS = ['MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE'];

type PlanningState = {
    [key: string]: { // level-nucleus-oaId
        [month: string]: 'P' | 'E' | 'N' | '';
    }
};

interface AnnualPlan {
    units: {
        number: number;
        name: string;
        months: string[];
        objectives: {
            id: string;
            description: string;
            evaluationIndicators: string[];
        }[];
    }[];
}

interface UnitPlan {
    classes: {
        number: number;
        objective: string;
        situation: {
            start: string;
            development: string;
            end: string;
        };
        resources: string[];
        startQuestions: string[];
        endQuestions: string[];
    }[];
}

export default function DocentePlanner() {
    const [selectedLevel, setSelectedLevel] = useState<Level>(learningObjectivesData[0]);
    const [selectedNucleus, setSelectedNucleus] = useState<Nucleus>(learningObjectivesData[0].nuclei[0]);
    const [planning, setPlanning] = useState<PlanningState>({});
    const [selectedOAs, setSelectedOAs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGeneratingAnnual, setIsGeneratingAnnual] = useState(false);
    const [annualPlan, setAnnualPlan] = useState<AnnualPlan | null>(null);
    const [selectedUnitForDaily, setSelectedUnitForDaily] = useState<number | null>(null);
    const [editingUnit, setEditingUnit] = useState<number | null>(null);
    const [numClasses, setNumClasses] = useState(4);
    const [isGeneratingUnit, setIsGeneratingUnit] = useState(false);
    const [unitPlan, setUnitPlan] = useState<UnitPlan | null>(null);
    
    const annualPlanRef = useRef<HTMLDivElement>(null);
    const unitPlanRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const docRef = doc(db, 'docente_planning', user.uid);
                const unsubscribeSnap = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setPlanning(data.planning || {});
                        setSelectedOAs(data.selectedOAs || []);
                        setAnnualPlan(data.annualPlan || null);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error loading planning:", error);
                    setLoading(false);
                });
                return () => unsubscribeSnap();
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const saveToFirebase = async (updates: any) => {
        if (!auth.currentUser) return;
        try {
            const docRef = doc(db, 'docente_planning', auth.currentUser.uid);
            await setDoc(docRef, updates, { merge: true });
        } catch (error) {
            console.error("Error saving to Firebase:", error);
        }
    };

    const toggleCell = async (oaId: string, month: string) => {
        const key = `${selectedLevel.name}-${selectedNucleus.name}-${oaId}`;
        const currentVal = planning[key]?.[month] || '';
        
        let nextVal: 'P' | 'E' | 'N' | '' = '';
        if (currentVal === '') nextVal = 'P';
        else if (currentVal === 'P') nextVal = 'E';
        else if (currentVal === 'E') nextVal = 'N';
        else nextVal = '';

        const newPlanning = {
            ...planning,
            [key]: {
                ...(planning[key] || {}),
                [month]: nextVal
            }
        };

        setPlanning(newPlanning);
        await saveToFirebase({ planning: newPlanning });
    };

    const toggleOASelection = (oaId: string) => {
        const key = `${selectedLevel.name}-${selectedNucleus.name}-${oaId}`;
        setSelectedOAs(prev => {
            const newSelection = prev.includes(key) 
                ? prev.filter(id => id !== key) 
                : [...prev, key];
            saveToFirebase({ selectedOAs: newSelection });
            return newSelection;
        });
    };

    const handleGenerateAnnualPlan = async () => {
        if (selectedOAs.length === 0) return;
        
        setIsGeneratingAnnual(true);
        try {
            const objectivesToPlan = selectedNucleus.objectives
                .filter(oa => selectedOAs.includes(`${selectedLevel.name}-${selectedNucleus.name}-${oa.id}`))
                .map(oa => `${oa.id}: ${oa.description}`);

            const plan = await generateAnnualPlan({
                level: selectedLevel.name,
                subject: selectedNucleus.name,
                objectives: objectivesToPlan
            });

            setAnnualPlan(plan);
            await saveToFirebase({ annualPlan: plan });
        } catch (error) {
            console.error("Error generating annual plan:", error);
        } finally {
            setIsGeneratingAnnual(false);
        }
    };

    const handleGenerateUnitPlan = async (unit: any) => {
        setIsGeneratingUnit(true);
        try {
            const plan = await generateUnitPlan({
                level: selectedLevel.name,
                subject: selectedNucleus.name,
                unitName: unit.name,
                objectives: unit.objectives,
                numClasses
            });
            setUnitPlan(plan);
        } catch (error) {
            console.error("Error generating unit plan:", error);
        } finally {
            setIsGeneratingUnit(false);
        }
    };

    const exportToPDF = async (elementRef: React.RefObject<HTMLDivElement>, filename: string) => {
        if (!elementRef.current) return;
        const canvas = await html2canvas(elementRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'P': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'E': return 'bg-green-100 text-green-700 border-green-200';
            case 'N': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-transparent border-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pme-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-8">
            {/* Header & Selectors */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-pme-primary mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined">calendar_month</span>
                    Planificador Docente Pro AI
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nivel / Curso</label>
                        <select 
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pme-primary outline-none transition-all"
                            value={selectedLevel.name}
                            onChange={(e) => {
                                const level = learningObjectivesData.find(l => l.name === e.target.value);
                                if (level) {
                                    setSelectedLevel(level);
                                    setSelectedNucleus(level.nuclei[0]);
                                }
                            }}
                        >
                            {learningObjectivesData.map(l => (
                                <option key={l.name} value={l.name}>{l.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Núcleo / Asignatura</label>
                        <select 
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pme-primary outline-none transition-all"
                            value={selectedNucleus.name}
                            onChange={(e) => {
                                const nucleus = selectedLevel.nuclei.find(n => n.name === e.target.value);
                                if (nucleus) setSelectedNucleus(nucleus);
                            }}
                        >
                            {selectedLevel.nuclei.map(n => (
                                <option key={n.name} value={n.name}>{n.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* OA Table with Selection */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Objetivos de Aprendizaje</h3>
                    <button 
                        onClick={handleGenerateAnnualPlan}
                        disabled={selectedOAs.length === 0 || isGeneratingAnnual}
                        className="bg-pme-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:bg-gray-300"
                    >
                        {isGeneratingAnnual ? <Spinner /> : <span className="material-symbols-outlined">auto_fix</span>}
                        Crear Plan Anual de Estudios
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-pme-primary text-white">
                                <th className="p-4 font-bold text-sm text-center w-12">Sel.</th>
                                <th className="p-4 font-bold text-sm sticky left-0 bg-pme-primary z-10 min-w-[300px]">Objetivo de Aprendizaje</th>
                                {MONTHS.map(month => (
                                    <th key={month} className="p-4 font-bold text-xs text-center min-w-[80px]">{month}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedNucleus.objectives.map((oa, idx) => {
                                const key = `${selectedLevel.name}-${selectedNucleus.name}-${oa.id}`;
                                const isSelected = selectedOAs.includes(key);
                                return (
                                    <tr key={oa.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="p-4 text-center border-b border-gray-100">
                                            <input 
                                                type="checkbox" 
                                                checked={isSelected}
                                                onChange={() => toggleOASelection(oa.id)}
                                                className="w-5 h-5 text-pme-primary rounded focus:ring-pme-primary"
                                            />
                                        </td>
                                        <td className="p-4 border-b border-gray-100 sticky left-0 bg-inherit z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-pme-secondary mb-1">{oa.id}</span>
                                                <span className="text-sm text-gray-800 leading-relaxed">{oa.description}</span>
                                            </div>
                                        </td>
                                        {MONTHS.map(month => {
                                            const status = planning[key]?.[month] || '';
                                            return (
                                                <td key={month} className="p-2 border-b border-gray-100 text-center">
                                                    <button
                                                        onClick={() => toggleCell(oa.id, month)}
                                                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold transition-all hover:scale-110 ${getStatusColor(status)}`}
                                                    >
                                                        {status}
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Annual Plan Result */}
            {annualPlan && (
                <div className="space-y-6" ref={annualPlanRef}>
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <div className="flex justify-between items-center mb-8 no-print">
                            <h3 className="text-2xl font-bold text-pme-primary flex items-center gap-2">
                                <span className="material-symbols-outlined">description</span>
                                Plan Anual de Estudios Generado
                            </h3>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => exportToPDF(annualPlanRef, 'Plan_Anual.pdf')}
                                    className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-red-700 transition-all"
                                >
                                    <span className="material-symbols-outlined">picture_as_pdf</span>
                                    PDF
                                </button>
                                <button 
                                    onClick={() => window.print()}
                                    className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all"
                                >
                                    <span className="material-symbols-outlined">print</span>
                                    Imprimir
                                </button>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {annualPlan.units.map((unit) => (
                                <div key={unit.number} className="border border-gray-200 rounded-2xl overflow-hidden">
                                    <div className="bg-pme-secondary p-4 text-white flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <h4 className="font-bold">Unidad {unit.number}: {unit.name}</h4>
                                            <button 
                                                onClick={() => setEditingUnit(unit.number)}
                                                className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-1 rounded flex items-center gap-1 transition-all no-print"
                                            >
                                                <span className="material-symbols-outlined text-[12px]">edit</span>
                                                Seleccionar OAs
                                            </button>
                                        </div>
                                        <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
                                            {unit.months.join(', ')}
                                        </span>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {unit.objectives.map((obj, oIdx) => (
                                            <div key={oIdx} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <p className="text-sm font-bold text-pme-primary mb-2">{obj.id}: {obj.description}</p>
                                                <div className="ml-4">
                                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Indicadores de Evaluación:</p>
                                                    <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                                                        {obj.evaluationIndicators.map((ind, iIdx) => (
                                                            <li key={iIdx}>{ind}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-4 no-print">
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm font-bold text-gray-700">Clases:</label>
                                                <input 
                                                    type="number" 
                                                    value={numClasses}
                                                    onChange={(e) => setNumClasses(parseInt(e.target.value))}
                                                    className="w-16 p-2 border border-gray-300 rounded-lg text-center"
                                                />
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    setSelectedUnitForDaily(unit.number);
                                                    handleGenerateUnitPlan(unit);
                                                }}
                                                className="bg-pme-accent text-white px-6 py-2 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center gap-2"
                                            >
                                                {isGeneratingUnit && selectedUnitForDaily === unit.number ? <Spinner /> : <span className="material-symbols-outlined">event_note</span>}
                                                Crear Plan de Unidad Diario
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para editar OAs de una unidad */}
            {editingUnit !== null && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-pme-primary">Seleccionar Objetivos</h3>
                                <p className="text-sm text-gray-500">Unidad {editingUnit}: {annualPlan?.units.find(u => u.number === editingUnit)?.name}</p>
                            </div>
                            <button onClick={() => setEditingUnit(null)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {selectedNucleus.objectives
                                .filter(oa => selectedOAs.includes(`${selectedLevel.name}-${selectedNucleus.name}-${oa.id}`))
                                .map(oa => {
                                    const isChecked = annualPlan?.units.find(u => u.number === editingUnit)?.objectives.some(o => o.id === oa.id);
                                    return (
                                        <label key={oa.id} className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer border-2 transition-all ${isChecked ? 'border-pme-primary bg-blue-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                                            <div className="mt-1">
                                                <input 
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        if (!annualPlan) return;
                                                        const newUnits = annualPlan.units.map(u => {
                                                            if (u.number === editingUnit) {
                                                                const objectives = e.target.checked
                                                                    ? [...u.objectives, { id: oa.id, description: oa.description, evaluationIndicators: [] }]
                                                                    : u.objectives.filter(o => o.id !== oa.id);
                                                                return { ...u, objectives };
                                                            }
                                                            return u;
                                                        });
                                                        const newPlan = { ...annualPlan, units: newUnits };
                                                        setAnnualPlan(newPlan);
                                                        saveToFirebase({ annualPlan: newPlan });
                                                    }}
                                                    className="w-5 h-5 text-pme-primary rounded focus:ring-pme-primary"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-pme-primary">{oa.id}</p>
                                                <p className="text-xs text-gray-700 leading-relaxed">{oa.description}</p>
                                            </div>
                                        </label>
                                    );
                                })
                            }
                        </div>
                        
                        <div className="mt-8">
                            <button 
                                onClick={() => setEditingUnit(null)}
                                className="w-full bg-pme-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-opacity-90 transition-all"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Daily Unit Plan Modal/Section */}
            {unitPlan && (
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6" ref={unitPlanRef}>
                    <div className="flex justify-between items-center no-print">
                        <h3 className="text-2xl font-bold text-pme-accent flex items-center gap-2">
                            <span className="material-symbols-outlined">list_alt</span>
                            Plan de Unidad Diario (Neurociencias & DUA)
                        </h3>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => exportToPDF(unitPlanRef, 'Plan_Unidad_Diario.pdf')}
                                className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-red-700 transition-all"
                            >
                                <span className="material-symbols-outlined">picture_as_pdf</span>
                                PDF
                            </button>
                            <button 
                                onClick={() => window.print()}
                                className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all"
                            >
                                <span className="material-symbols-outlined">print</span>
                                Imprimir
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {unitPlan.classes.map((cls) => (
                            <div key={cls.number} className="border-2 border-orange-100 rounded-2xl overflow-hidden bg-white">
                                <div className="bg-orange-500 p-4 text-white font-bold flex justify-between">
                                    <span>Clase {cls.number}</span>
                                    <span className="text-xs uppercase tracking-widest">Enfoque DUA</span>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h5 className="text-sm font-bold text-orange-800 mb-1">Objetivo de la Clase:</h5>
                                        <p className="text-sm text-gray-700 italic">"{cls.objective}"</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                            <h6 className="text-xs font-bold text-blue-800 uppercase mb-2 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">login</span> Inicio
                                            </h6>
                                            <p className="text-xs text-gray-600 mb-3">{cls.situation.start}</p>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-blue-700">Activación:</p>
                                                <ul className="list-disc list-inside text-[10px] text-gray-500">
                                                    {cls.startQuestions.map((q, i) => <li key={i}>{q}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                            <h6 className="text-xs font-bold text-green-800 uppercase mb-2 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">play_arrow</span> Desarrollo
                                            </h6>
                                            <p className="text-xs text-gray-600">{cls.situation.development}</p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                            <h6 className="text-xs font-bold text-purple-800 uppercase mb-2 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">logout</span> Cierre
                                            </h6>
                                            <p className="text-xs text-gray-600 mb-3">{cls.situation.end}</p>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-purple-700">Metacognición:</p>
                                                <ul className="list-disc list-inside text-[10px] text-gray-500">
                                                    {cls.endQuestions.map((q, i) => <li key={i}>{q}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <h6 className="text-xs font-bold text-gray-700 uppercase mb-2">Recursos Necesarios:</h6>
                                        <div className="flex flex-wrap gap-2">
                                            {cls.resources.map((res, i) => (
                                                <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                                                    {res}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

