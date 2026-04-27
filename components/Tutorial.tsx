
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronRight, ChevronLeft, X, CheckCircle2 } from 'lucide-react';

interface Step {
    title: string;
    description: string;
    icon: string;
}

const steps: Step[] = [
    {
        title: "1. Dimensión y Subdimensión",
        description: "Comienza seleccionando la Dimensión de Gestión (ej. Gestión Pedagógica) y luego la Subdimensión específica que deseas abordar.",
        icon: "category"
    },
    {
        title: "2. Objetivo Estratégico",
        description: "Escribe tu objetivo o haz clic en el botón 'IA' para que la inteligencia artificial te sugiera uno basado en tu selección previa.",
        icon: "target"
    },
    {
        title: "3. Meta Estratégica",
        description: "Define qué quieres lograr de forma cuantitativa (ej. 'Lograr que el 80% de los estudiantes...').",
        icon: "trending_up"
    },
    {
        title: "4. Planes Normativos",
        description: "Vincula tu acción con planes como PIE, Convivencia Escolar o PME. Esto es fundamental para la articulación institucional.",
        icon: "account_tree"
    },
    {
        title: "5. Objetivos por Plan",
        description: "Para cada plan seleccionado, elige los objetivos específicos. Debes completar este paso antes de generar la estrategia.",
        icon: "checklist"
    },
    {
        title: "6. Estrategia PME",
        description: "Describe cómo lograrás el objetivo. El botón 'IA' redactará una estrategia basada en los planes y objetivos seleccionados anteriormente.",
        icon: "psychology"
    },
    {
        title: "7. Generar Acciones",
        description: "Elige cuántas propuestas quieres (1-5) y activa 'Google Search' si quieres que la IA use información actualizada de la web.",
        icon: "auto_awesome"
    },
    {
        title: "8. Revisar y Exportar",
        description: "¡Listo! Revisa las propuestas generadas en la tabla. Puedes regenerarlas si necesitas más opciones.",
        icon: "description"
    }
];

export default function Tutorial() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsOpen(false);
            setCurrentStep(0);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <>
            {/* Floating Button - Moved to bottom-left to avoid chatbot overlap */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-40 bg-pme-accent text-white rounded-full p-4 shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-pme-accent focus:ring-offset-2 flex items-center gap-2"
                aria-label="Ver tutorial"
            >
                <HelpCircle size={24} />
                <span className="hidden sm:inline font-bold">Guía de Uso</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative pointer-events-auto border border-gray-200"
                        >
                            {/* Header - Drag Handle */}
                            <div className="bg-pme-primary p-4 text-white flex justify-between items-center select-none">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <span className="material-symbols-outlined">{steps[currentStep].icon}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold leading-tight">Guía Interactiva</h2>
                                        <p className="text-[10px] text-white/60 uppercase tracking-widest">Puedes arrastrar esta ventana</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/70 hover:text-white transition-colors p-2 pointer-events-auto"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-1.5 bg-gray-100 flex">
                                {steps.map((_, idx) => (
                                    <div 
                                        key={idx}
                                        className={`h-full transition-all duration-300 ${
                                            idx <= currentStep ? 'bg-pme-secondary' : 'bg-transparent'
                                        }`}
                                        style={{ width: `${100 / steps.length}%` }}
                                    />
                                ))}
                            </div>

                            {/* Content */}
                            <div className="p-8 min-h-[200px] flex flex-col justify-center text-center">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h3 className="text-2xl font-bold text-pme-primary mb-4">
                                        {steps[currentStep].title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {steps[currentStep].description}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    className={`flex items-center gap-1 font-medium transition-colors ${
                                        currentStep === 0 ? 'text-gray-300' : 'text-gray-500 hover:text-pme-primary'
                                    }`}
                                >
                                    <ChevronLeft size={20} />
                                    Anterior
                                </button>

                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    {currentStep + 1} / {steps.length}
                                </div>

                                <button
                                    onClick={nextStep}
                                    className="flex items-center gap-2 bg-pme-secondary text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg active:scale-95"
                                >
                                    {currentStep === steps.length - 1 ? (
                                        <>
                                            Finalizar
                                            <CheckCircle2 size={20} />
                                        </>
                                    ) : (
                                        <>
                                            Siguiente
                                            <ChevronRight size={20} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
