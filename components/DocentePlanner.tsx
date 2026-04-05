
import React, { useState, useEffect } from 'react';
import { learningObjectivesData, Level, Nucleus, LearningObjective } from '../constants/learningObjectives';
import { db, auth } from '../firebase';
import { doc, setDoc, onSnapshot, collection } from 'firebase/firestore';

const MONTHS = ['MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE'];

type PlanningState = {
    [key: string]: { // level-nucleus-oaId
        [month: string]: 'P' | 'E' | 'N' | '';
    }
};

export default function DocentePlanner() {
    const [selectedLevel, setSelectedLevel] = useState<Level>(learningObjectivesData[0]);
    const [selectedNucleus, setSelectedNucleus] = useState<Nucleus>(learningObjectivesData[0].nuclei[0]);
    const [planning, setPlanning] = useState<PlanningState>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) return;

        const docRef = doc(db, 'docente_planning', auth.currentUser.uid);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setPlanning(docSnap.data() as PlanningState);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error loading planning:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleCell = async (oaId: string, month: string) => {
        if (!auth.currentUser) return;

        const key = `${selectedLevel.name}-${selectedNucleus.name}-${oaId}`;
        const currentVal = planning[key]?.[month] || '';
        
        // Cycle: '' -> 'P' -> 'E' -> 'N' -> ''
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

        try {
            await setDoc(doc(db, 'docente_planning', auth.currentUser.uid), newPlanning);
        } catch (error) {
            console.error("Error saving planning:", error);
        }
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
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
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

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-pme-primary text-white">
                                <th className="p-4 font-bold text-sm sticky left-0 bg-pme-primary z-10 min-w-[300px]">Objetivo de Aprendizaje</th>
                                {MONTHS.map(month => (
                                    <th key={month} className="p-4 font-bold text-xs text-center min-w-[80px]">{month}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedNucleus.objectives.map((oa, idx) => (
                                <tr key={oa.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="p-4 border-b border-gray-100 sticky left-0 bg-inherit z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-pme-secondary mb-1">{oa.id}</span>
                                            <span className="text-sm text-gray-800 leading-relaxed">{oa.description}</span>
                                        </div>
                                    </td>
                                    {MONTHS.map(month => {
                                        const key = `${selectedLevel.name}-${selectedNucleus.name}-${oa.id}`;
                                        const status = planning[key]?.[month] || '';
                                        return (
                                            <td key={month} className="p-2 border-b border-gray-100 text-center">
                                                <button
                                                    onClick={() => toggleCell(oa.id, month)}
                                                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold transition-all hover:scale-110 ${getStatusColor(status)}`}
                                                    title={`Click para cambiar estado: ${status || 'Ninguno'}`}
                                                >
                                                    {status}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-pme-secondary">info</span>
                    Leyenda de Estados
                </h3>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">P</div>
                        <span className="text-sm text-gray-600">Planificado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-green-100 border border-green-200 flex items-center justify-center text-green-700 font-bold text-xs">E</div>
                        <span className="text-sm text-gray-600">Ejecutado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-red-100 border border-red-200 flex items-center justify-center text-red-700 font-bold text-xs">N</div>
                        <span className="text-sm text-gray-600">No Ejecutado</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
