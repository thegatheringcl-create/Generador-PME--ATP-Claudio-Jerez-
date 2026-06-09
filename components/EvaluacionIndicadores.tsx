import React, { useState, useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  AppState, 
  Level, 
  EvaluationResult, 
  ObjectiveMeta, 
  PMEAction,
  PMEDimension
} from '../types';
import { 
  ESTABLECIMIENTOS, 
  ESTRUCTURA_EID, 
  DATA_ESTANDARES, 
  NIVELES_INFO,
  OBJETIVOS_METAS_POR_ESTABLECIMIENTO,
  PLANES_NORMATIVOS
} from '../constants/eid';
import { 
  generatePMEProposal, 
  generateStrategyForSubDimension, 
  assignStrategyToSubDimension, 
  generateMoreIndicators, 
  generateMoreActions, 
  refineStrategy, 
  refineActionWithNormativeContext, 
  refineIndicator 
} from '../services/geminiService';
import { AIAssistantSuite } from '../AIAssistants';

const STORAGE_KEY = 'eid_app_state_v3';

export default function EvaluacionIndicadores({ establecimiento }: { establecimiento?: string }) {
  const [state, setState] = useState<AppState>(() => {
    const defaultState: AppState = {
      section: 1,
      establecimiento: establecimiento || '',
      anio: 2025,
      cicloInicio: 2025,
      cicloFin: 2028,
      evaluaciones: {},
      objetivosMetas: {},
      currentStandardId: null,
      evaluating: false,
      nudosCriticos: {},
      objetivosPadem: '',
      mision: '',
      vision: ''
    };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        
        const est = p.establecimiento || establecimiento || '';
        const defaultObjectives = est ? JSON.parse(JSON.stringify(OBJETIVOS_METAS_POR_ESTABLECIMIENTO[est] || {})) : {};
        const savedObjectives = p.objetivosMetas || {};

        for (const dimId in defaultObjectives) {
            if (savedObjectives[dimId]) {
                Object.assign(defaultObjectives[dimId], savedObjectives[dimId]);
            }
        }
        for (const dimId in savedObjectives) {
            if (!defaultObjectives[dimId]) {
                defaultObjectives[dimId] = savedObjectives[dimId];
            }
        }
        
        const loadedState: AppState = { ...defaultState, ...p, establecimiento: est, objetivosMetas: defaultObjectives };
        
        ESTRUCTURA_EID.forEach(dim => {
            if (!loadedState.objetivosMetas[dim.id]) {
                loadedState.objetivosMetas[dim.id] = {
                    objetivo: '', meta: '', estrategia: '', estrategiasSubdimensiones: {}
                };
            }
            if (!loadedState.objetivosMetas[dim.id].estrategiasSubdimensiones) {
                loadedState.objetivosMetas[dim.id].estrategiasSubdimensiones = {};
            }
        });

        return { ...loadedState, evaluating: false, currentStandardId: null };
      }
    } catch (e) { console.error("Error loading state:", e); }
    return defaultState;
  });

  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreparingStrategy, setIsPreparingStrategy] = useState(false);
  
  const [refinementModalInfo, setRefinementModalInfo] = useState<{ dimId: string; subDimId: string; } | null>(null);
  const [refiningStrategyId, setRefiningStrategyId] = useState<string | null>(null);

  useEffect(() => {
    const stateToSave = {
        section: state.section,
        establecimiento: state.establecimiento,
        anio: state.anio,
        cicloInicio: state.cicloInicio,
        cicloFin: state.cicloFin,
        evaluaciones: state.evaluaciones,
        objetivosMetas: state.objetivosMetas,
        nudosCriticos: state.nudosCriticos,
        objetivosPadem: state.objetivosPadem,
        mision: state.mision,
        vision: state.vision
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [state]);

  const nextSection = () => setState(s => ({ ...s, section: Math.min(s.section + 1, 8) }));
  const prevSection = () => setState(s => ({ ...s, section: Math.max(s.section - 1, 1) }));

  const startEvaluation = (id: string) => {
    setState(s => ({ ...s, currentStandardId: id, evaluating: true }));
  };

  const saveEvaluation = (id: string, result: EvaluationResult) => {
    setState(s => ({
      ...s,
      evaluaciones: { ...s.evaluaciones, [id]: result },
      evaluating: false,
      currentStandardId: null
    }));
  };

  const handleReset = () => {
    if (window.confirm("¿Borrar todos los datos?")) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  const handleRestart = () => {
    if (window.confirm("¿Desea reiniciar la evaluación? Se conservará el establecimiento y año, pero se borrarán todas las evaluaciones.")) {
      setState(s => ({
          section: 1,
          establecimiento: s.establecimiento,
          anio: s.anio,
          cicloInicio: s.cicloInicio,
          cicloFin: s.cicloFin,
          evaluaciones: {},
          objetivosMetas: JSON.parse(JSON.stringify(OBJETIVOS_METAS_POR_ESTABLECIMIENTO[s.establecimiento] || {})),
          currentStandardId: null,
          evaluating: false,
          nudosCriticos: {},
          objetivosPadem: '',
          mision: '',
          vision: ''
        }));
      setAiReport(null);
    }
  };
  
  const handleProceedToStrategyPhase = async () => {
      setIsPreparingStrategy(true);
      try {
          const allPromises: Promise<{ dimId: string; subDimId: string; strategy: string; isAssignment: boolean; }>[] = [];
  
          ESTRUCTURA_EID.forEach(dim => {
              const criticalSubDims = dim.subdimensiones.filter(subDim => {
                  const total = subDim.estandares.length;
                  if (total === 0) return false;
                  const criticalCount = subDim.estandares.filter(id => {
                      const ev = state.evaluaciones[id];
                      return ev && (ev.nivel === Level.DEBIL || ev.nivel === Level.INCIPIENTE);
                  }).length;
                  return (criticalCount / total) > 0.5;
              });
  
              if (criticalSubDims.length > 0) {
                  criticalSubDims.forEach(subDim => {
                      const objetivo = state.objetivosMetas[dim.id]?.objetivo || '';
                      const meta = state.objetivosMetas[dim.id]?.meta || '';
                      if (objetivo && meta) {
                          const promise = generateStrategyForSubDimension(dim, subDim, state.evaluaciones, objetivo, meta)
                              .then(strategy => ({ dimId: dim.id, subDimId: subDim.id, strategy, isAssignment: false }));
                          allPromises.push(promise);
                      }
                  });
              } else {
                  const generalStrategy = state.objetivosMetas[dim.id]?.estrategia;
                  if (generalStrategy && dim.subdimensiones.length > 0) {
                      const promise = assignStrategyToSubDimension(generalStrategy, dim.subdimensiones)
                          .then(assignedSubDimId => ({
                              dimId: dim.id,
                              subDimId: assignedSubDimId,
                              strategy: generalStrategy,
                              isAssignment: true
                          }));
                      allPromises.push(promise);
                  }
              }
          });
  
          const results = await Promise.all(allPromises);
          
          setState(s => {
              const newObjetivosMetas = JSON.parse(JSON.stringify(s.objetivosMetas));
              results.forEach(({ dimId, subDimId, strategy, isAssignment }) => {
                  if (subDimId && strategy && !strategy.toLowerCase().includes("error")) {
                      if (!newObjetivosMetas[dimId]) {
                          newObjetivosMetas[dimId] = { ...(s.objetivosMetas[dimId] || { objetivo: '', meta: '', estrategia: '' }) };
                      }
                      if (!newObjetivosMetas[dimId].estrategiasSubdimensiones) {
                          newObjetivosMetas[dimId].estrategiasSubdimensiones = {};
                      }
                      newObjetivosMetas[dimId].estrategiasSubdimensiones[subDimId] = strategy;
                      
                      if (isAssignment) {
                          newObjetivosMetas[dimId].estrategia = ''; 
                      }
                  }
              });
              return { ...s, objetivosMetas: newObjetivosMetas };
          });
  
          nextSection();
  
      } catch (error) {
          console.error("Error preparing strategic phase:", error);
          alert("Hubo un error al preparar la fase estratégica con IA. Por favor, intente de nuevo.");
      } finally {
          setIsPreparingStrategy(false);
      }
  };
  
  const handleStartRefinement = (dimId: string, subDimId: string) => {
    setRefinementModalInfo({ dimId, subDimId });
  };
  
  const handleExecuteRefinement = async (userPrompt: string) => {
    if (!refinementModalInfo) return;

    const { dimId, subDimId } = refinementModalInfo;
    const uniqueId = `${dimId}-${subDimId}`;
    
    setRefiningStrategyId(uniqueId);
    setRefinementModalInfo(null);

    try {
        const dim = ESTRUCTURA_EID.find(d => d.id === dimId);
        const subDim = dim?.subdimensiones.find(s => s.id === subDimId);
        const objectiveMeta = state.objetivosMetas[dimId];
        const originalStrategy = objectiveMeta?.estrategiasSubdimensiones?.[subDimId] || '';

        if (!dim || !subDim || !objectiveMeta) throw new Error("Contexto de refinamiento no encontrado.");

        const newStrategy = await refineStrategy(
            originalStrategy,
            userPrompt,
            {
                dimensionName: dim.nombre,
                subDimensionName: subDim.nombre,
                objective: objectiveMeta.objetivo,
                meta: objectiveMeta.meta
            }
        );
        
        setState(s => {
            const newObjetivosMetas = JSON.parse(JSON.stringify(s.objetivosMetas));
            newObjetivosMetas[dimId].estrategiasSubdimensiones[subDimId] = newStrategy;
            return { ...s, objetivosMetas: newObjetivosMetas };
        });

    } catch (error) {
        console.error("Error during strategy refinement:", error);
        alert("Hubo un error al refinar la estrategia. Intente de nuevo.");
    } finally {
        setRefiningStrategyId(null);
    }
  };

  const totalEstandares = ESTRUCTURA_EID.flatMap(d => d.subdimensiones.flatMap(s => s.estandares)).length;
  const doneEstandares = Object.keys(state.evaluaciones).length;
  const progressPercent = Math.round((doneEstandares / totalEstandares) * 100);

  return (
    <div className="flex flex-col bg-slate-50 text-slate-900 rounded-b-xl border border-t-0 border-gray-200 min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10 w-full overflow-hidden">
        {state.evaluating && state.currentStandardId ? (
          <EvaluationWizard 
            standardId={state.currentStandardId} 
            prevResult={state.evaluaciones[state.currentStandardId]} 
            onSave={saveEvaluation} 
            onCancel={() => setState(s => ({ ...s, evaluating: false }))} 
          />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-full overflow-hidden">
            {state.section === 1 && <Section1 state={state} setState={setState} onNext={nextSection} />}
            {state.section >= 2 && state.section <= 5 && (
              <SectionEvaluation 
                dimIndex={state.section - 2} 
                state={state} 
                onEvaluate={startEvaluation} 
                onNext={nextSection}
                onPrev={prevSection}
              />
            )}
            {state.section === 6 && <Section6 state={state} setState={setState} onNext={handleProceedToStrategyPhase} onPrev={prevSection} isPreparingStrategy={isPreparingStrategy} />}
            {state.section === 7 && <Section7 state={state} setState={setState} onNext={nextSection} onPrev={prevSection} onStartRefinement={handleStartRefinement} refiningStrategyId={refiningStrategyId} />}
            {state.section === 8 && (
              <Section8 
                state={state} 
                aiReport={aiReport} 
                isGenerating={isGenerating} 
                onGenerate={() => {
                  setIsGenerating(true);
                  setAiReport(null);
                  generatePMEProposal(state).then(r => { setAiReport(r); setIsGenerating(false); });
                }} 
                onPrev={prevSection}
              />
            )}
          </div>
        )}
      </main>

       <RefinementModal 
        isOpen={!!refinementModalInfo}
        onClose={() => setRefinementModalInfo(null)}
        onRefine={handleExecuteRefinement}
      />
      
      <AIAssistantSuite establecimiento={state.establecimiento} />

      {!state.evaluating && state.section !== 6 && (
        <footer className="bg-white border-t p-4 no-print relative z-40 rounded-b-xl">
          <div className="container mx-auto flex justify-between items-center px-4 w-full">
            <button 
              onClick={prevSection} 
              disabled={state.section === 1}
              className="flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-6 md:py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition disabled:opacity-30 text-xs md:text-sm"
            >
              <LucideIcons.ChevronLeft size={16}/> Atrás
            </button>
            <div className="hidden md:flex gap-2">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full ${state.section === i ? 'bg-blue-600 scale-125' : 'bg-slate-200'}`}/>
              ))}
            </div>
            <button 
              onClick={state.section === 6 ? handleProceedToStrategyPhase : nextSection} 
              disabled={state.section === 8 || (state.section === 1 && !state.establecimiento) || isPreparingStrategy}
              className="flex items-center gap-1 md:gap-2 px-4 py-1.5 md:px-8 md:py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition disabled:opacity-30 text-xs md:text-sm"
            >
              {isPreparingStrategy ? (
                <>
                  <LucideIcons.Loader size={16} className="animate-spin" />
                  <span className="hidden sm:inline">Generando...</span>
                </>
              ) : (
                <>
                  <span>Siguiente</span>
                  <LucideIcons.ChevronRight size={16}/>
                </>
              )}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

const Section1: React.FC<{ state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; onNext: () => void }> = ({ state, setState, onNext }) => {
  const handleEstablecimientoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEstablecimiento = e.target.value;
    setState(s => ({ 
      ...s, 
      establecimiento: newEstablecimiento,
      objetivosMetas: newEstablecimiento ? JSON.parse(JSON.stringify(OBJETIVOS_METAS_POR_ESTABLECIMIENTO[newEstablecimiento] || {})) : {},
      evaluaciones: {},
      section: 1 
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 hidden sm:block"><LucideIcons.School size={40}/></div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">EID Gestor Pro</h2>
            <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1 mb-2">Sección 1: Establecimiento y Año</p>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Establecimiento Educacional</label>
            <select 
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:ring-0 transition font-bold text-slate-700 text-sm md:text-base outline-none appearance-none"
              value={state.establecimiento}
              onChange={handleEstablecimientoChange}
            >
              <option value="">Seleccione un establecimiento...</option>
              {ESTABLECIMIENTOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Año de Inicio del Ciclo</label>
              <input 
                type="number"
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 font-bold text-slate-700 text-sm md:text-base outline-none"
                value={state.cicloInicio}
                onChange={e => {
                  const inicio = parseInt(e.target.value);
                  setState(s => ({ ...s, cicloInicio: inicio, cicloFin: inicio + 3 }));
                }}
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Año de Término del Ciclo</label>
              <input 
                type="number"
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 font-bold text-slate-700 text-sm md:text-base outline-none"
                value={state.cicloFin}
                onChange={e => setState(s => ({ ...s, cicloFin: parseInt(e.target.value) }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Año del Proceso (Estrategia Anual)</label>
            <input 
              type="number"
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 font-bold text-slate-700 text-sm md:text-base outline-none"
              value={state.anio}
              onChange={e => setState(s => ({ ...s, anio: parseInt(e.target.value) }))}
            />
          </div>
          <button 
            onClick={onNext}
            disabled={!state.establecimiento}
            className="w-full py-4 sm:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-base sm:text-lg shadow-xl transition-all disabled:opacity-50 mt-4"
          >
            INICIAR AUTOEVALUACIÓN
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionEvaluation: React.FC<{ dimIndex: number; state: AppState; onEvaluate: (id: string) => void; onNext: () => void; onPrev: () => void }> = ({ dimIndex, state, onEvaluate, onNext, onPrev }) => {
  const dim = ESTRUCTURA_EID[dimIndex];
  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto pb-10">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className={`p-3 sm:p-4 bg-${dim.color}-50 text-${dim.color}-600 rounded-2xl`}>
            {React.createElement(LucideIcons[dim.icon as keyof typeof LucideIcons] as React.ComponentType<{ size: number }>, { size: 24 })}
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 uppercase tracking-tighter max-w-[200px] sm:max-w-md truncate">{dim.nombre}</h2>
            <p className="text-slate-400 font-bold text-[10px] sm:text-xs tracking-wider">Evaluación Detallada</p>
          </div>
        </div>
        <div className="text-left sm:text-right hidden sm:block">
          <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
            {dim.subdimensiones.flatMap(s => s.estandares).filter(id => !!state.evaluaciones[id]).length} <span className="text-lg text-slate-400">/ {dim.subdimensiones.flatMap(s => s.estandares).length}</span>
          </div>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Estándares Listos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 w-full">
        {dim.subdimensiones.map(sub => (
          <div key={sub.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden w-full">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
              <h3 className="font-black text-xs sm:text-sm text-slate-500 uppercase tracking-widest truncate">{sub.nombre}</h3>
            </div>
            <div className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
              {sub.estandares.map(id => {
                const ev = state.evaluaciones[id];
                const data = DATA_ESTANDARES[id];
                const nivelInfo = ev ? NIVELES_INFO[ev.nivel] : null;
                
                return (
                  <button 
                    key={id}
                    onClick={() => onEvaluate(id)}
                    className={`group relative p-4 sm:p-5 rounded-2xl border-2 text-left transition-all ${nivelInfo ? `${nivelInfo.fullColor} text-white border-transparent` : 'bg-white border-slate-100 hover:border-blue-200'} w-full flex flex-col justify-between`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full ${nivelInfo ? 'bg-black/20' : 'bg-slate-100 text-slate-500'} ${!nivelInfo && 'group-hover:bg-blue-100 group-hover:text-blue-700'}`}>{id}</span>
                      {ev && <LucideIcons.CheckCircle size={16} className="text-white"/>}
                    </div>
                    <p className="text-xs sm:text-sm font-bold leading-snug line-clamp-3 sm:line-clamp-4 mt-auto">
                      {data ? data.nombre : `Estándar ${id}`}
                    </p>
                    <div className={`mt-3 text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${nivelInfo ? 'text-white/80' : 'text-blue-500 group-hover:text-blue-700'}`}>
                      {ev ? nivelInfo.label : 'Evaluar ahora'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Section6: React.FC<{ state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; onNext: () => void; onPrev: () => void; isPreparingStrategy: boolean; }> = ({ state, setState, onNext, onPrev, isPreparingStrategy }) => (
  <div className="max-w-5xl mx-auto space-y-8 w-full pb-12">
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100">
      <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-6 sm:mb-8 flex items-center gap-3">
        <LucideIcons.BarChart3 className="text-blue-600 w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"/> Diagnóstico Estratégico {state.anio}
      </h2>
      <div className="overflow-x-auto border-2 border-slate-100 rounded-2xl w-full scrollbar-hide mb-10">
        <table className="w-full text-left text-xs sm:text-sm font-medium whitespace-nowrap md:whitespace-normal">
          <thead className="bg-slate-50 border-b-2 border-slate-100 text-[9px] sm:text-[10px] font-black uppercase text-slate-400">
            <tr>
              <th className="p-3 sm:p-4">Dimensión / Subdimensión</th>
              <th className="p-3 sm:p-4 text-center">Débil</th>
              <th className="p-3 sm:p-4 text-center">Incipiente</th>
              <th className="p-3 sm:p-4 text-center">Satisfactorio</th>
              <th className="p-3 sm:p-4 text-center">Avanzado</th>
            </tr>
          </thead>
          <tbody>
            {ESTRUCTURA_EID.map(dim => (
              <React.Fragment key={dim.id}>
                <tr className="bg-slate-100/50 font-black text-slate-700 border-t border-slate-200">
                  <td colSpan={5} className="p-2 sm:p-3 text-[10px] sm:text-xs uppercase tracking-wider">{dim.nombre}</td>
                </tr>
                {dim.subdimensiones.map(subDim => {
                   const counts = subDim.estandares.reduce((acc: Record<Level, number>, id: string) => {
                    const ev = state.evaluaciones[id];
                    if (ev) acc[ev.nivel]++;
                    return acc;
                  }, { [Level.DEBIL]: 0, [Level.INCIPIENTE]: 0, [Level.SATISFACTORIO]: 0, [Level.AVANZADO]: 0 });
                  const total = subDim.estandares.length;
                  const criticalCount = counts[Level.DEBIL] + counts[Level.INCIPIENTE];
                  const isCritical = total > 0 && (criticalCount / total) > 0.5;

                  return (
                    <tr key={subDim.id} className={`hover:bg-slate-50 transition border-b border-slate-100 last:border-0 ${isCritical ? 'bg-red-50/30' : 'bg-white'}`}>
                      <td className="p-3 sm:p-4 pl-4 sm:pl-8 text-slate-600 truncate max-w-[150px] sm:max-w-none" title={subDim.nombre}>{subDim.nombre}</td>
                      <td className={`p-3 sm:p-4 text-center font-black ${counts[Level.DEBIL] > 0 ? 'text-red-500' : 'text-slate-300'}`}>{counts[Level.DEBIL]}</td>
                      <td className={`p-3 sm:p-4 text-center font-black ${counts[Level.INCIPIENTE] > 0 ? 'text-amber-500' : 'text-slate-300'}`}>{counts[Level.INCIPIENTE]}</td>
                      <td className={`p-3 sm:p-4 text-center font-black ${counts[Level.SATISFACTORIO] > 0 ? 'text-emerald-500' : 'text-slate-300'}`}>{counts[Level.SATISFACTORIO]}</td>
                      <td className={`p-3 sm:p-4 text-center font-black ${counts[Level.AVANZADO] > 0 ? 'text-blue-500' : 'text-slate-300'}`}>{counts[Level.AVANZADO]}</td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-6 border-t border-slate-200 space-y-8">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">Conclusiones Finales del Diagnóstico</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-2">MISIÓN DE LA ESCUELA</label>
            <textarea
              className="w-full p-4 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none shadow-sm"
              placeholder="Ingrese la misión del establecimiento..."
              value={state.mision}
              onChange={e => setState(s => ({ ...s, mision: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-2">VISIÓN DE LA ESCUELA</label>
            <textarea
              className="w-full p-4 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none shadow-sm"
              placeholder="Ingrese la visión del establecimiento..."
              value={state.vision}
              onChange={e => setState(s => ({ ...s, vision: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-2">OBJETIVOS DEL PADEM</label>
          <textarea
            className="w-full p-4 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none shadow-sm"
            placeholder="Ingrese los Objetivos del PADEM..."
            value={state.objetivosPadem}
            onChange={e => setState(s => ({ ...s, objetivosPadem: e.target.value }))}
          />
        </div>

        <div className="pt-4 space-y-6">
          <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">NUDOS CRÍTICOS POR DIMENSIÓN</h4>
          
          {ESTRUCTURA_EID.map(dim => (
            <div key={dim.id}>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">{dim.nombre}</label>
              <textarea
                className="w-full p-4 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none shadow-sm"
                placeholder={`Nudos críticos identificados en ${dim.nombre}...`}
                value={state.nudosCriticos[dim.id] || ''}
                onChange={e => {
                  const val = e.target.value;
                  setState(s => ({
                    ...s,
                    nudosCriticos: {
                      ...s.nudosCriticos,
                      [dim.id]: val
                    }
                  }));
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center pt-10 no-print">
        <button onClick={onPrev} className="px-6 py-3 border rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition">Atrás</button>
        <button 
          onClick={onNext}
          disabled={isPreparingStrategy}
          className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          {isPreparingStrategy ? (
            <>
              <LucideIcons.Loader size={18} className="animate-spin" />
              Generando Estrategias con IA...
            </>
          ) : (
             <>
              <LucideIcons.Sparkles size={18} />
              Cargar Fase Estratégica PME
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);

const Section7: React.FC<{ 
  state: AppState; 
  setState: React.Dispatch<React.SetStateAction<AppState>>; 
  onNext: () => void; 
  onPrev: () => void;
  onStartRefinement: (dimId: string, subDimId: string) => void;
  refiningStrategyId: string | null;
}> = ({ state, setState, onStartRefinement, refiningStrategyId }) => {
  const baseObjective: ObjectiveMeta = { objetivo: '', meta: '', estrategia: '', estrategiasSubdimensiones: {} };

  const handleStrategyChange = (dimId: string, subDimId: string, value: string) => {
    setState(s => {
      const newObjetivosMetas = JSON.parse(JSON.stringify(s.objetivosMetas));
      if (!newObjetivosMetas[dimId].estrategiasSubdimensiones) {
        newObjetivosMetas[dimId].estrategiasSubdimensiones = {};
      }
      newObjetivosMetas[dimId].estrategiasSubdimensiones[subDimId] = value;
      return { ...s, objetivosMetas: newObjetivosMetas };
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 w-full">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 md:space-y-8 border border-slate-100">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
          <LucideIcons.Target className="text-pink-500 w-6 h-6 flex-shrink-0"/> Fase Estratégica PME {state.anio}
        </h2>
        {ESTRUCTURA_EID.map(dim => {
            const subDimensionsWithStrategies = dim.subdimensiones.filter(
                subDim => state.objetivosMetas[dim.id]?.estrategiasSubdimensiones?.[subDim.id]
            );

          return (
            <div key={dim.id} className="p-4 sm:p-8 bg-slate-50/50 rounded-2xl border-2 border-slate-200 space-y-5 sm:space-y-6">
              <h3 className="font-black text-sm sm:text-base uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
                 <LucideIcons.LayoutTemplate size={18} className="text-slate-400 flex-shrink-0" />
                 {dim.nombre}
              </h3>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Objetivo Estratégico</label>
                <textarea 
                  className="w-full p-4 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] sm:min-h-[100px] resize-none shadow-sm"
                  value={state.objetivosMetas[dim.id]?.objetivo || ''}
                  placeholder="Defina el objetivo estratégico aquí..."
                  onChange={e => setState(s => ({ ...s, objetivosMetas: { ...s.objetivosMetas, [dim.id]: { ...(s.objetivosMetas[dim.id] || baseObjective), objetivo: e.target.value } } }))}
                />
              </div>
              <div className="pt-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Meta Estratégica</label>
                <textarea
                  className="w-full p-4 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 min-h-[80px] resize-none shadow-sm"
                  value={state.objetivosMetas[dim.id]?.meta || ''}
                  placeholder="Defina la meta aquí..."
                  onChange={e => setState(s => ({ ...s, objetivosMetas: { ...s.objetivosMetas, [dim.id]: { ...(s.objetivosMetas[dim.id] || baseObjective), meta: e.target.value } } }))}
                />
              </div>
              
              {subDimensionsWithStrategies.length > 0 ? (
                <div className="space-y-4 pt-4 border-t border-slate-200 border-dashed">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Estrategias Focalizadas</p>
                  {subDimensionsWithStrategies.map(subDim => {
                    const uniqueId = `${dim.id}-${subDim.id}`;
                    const isRefiningThis = refiningStrategyId === uniqueId;
                    return (
                      <div key={subDim.id} className="relative group">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                          <label className="block text-xs font-bold text-indigo-700 leading-tight">
                            {subDim.nombre}
                          </label>
                          <button
                            onClick={() => onStartRefinement(dim.id, subDim.id)}
                            disabled={isRefiningThis}
                            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:text-indigo-800 rounded-lg transition disabled:opacity-50"
                          >
                            {isRefiningThis ? (
                                <LucideIcons.Loader size={14} className="animate-spin" />
                            ) : (
                                <LucideIcons.Sparkles size={14} />
                            )}
                            <span>Refinar con IA</span>
                          </button>
                        </div>
                        <textarea
                          disabled={isRefiningThis}
                          className={`w-full p-4 text-sm bg-indigo-50/30 border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 min-h-[100px] resize-none shadow-sm transition-all ${isRefiningThis ? 'opacity-50' : 'text-slate-700'}`}
                          value={state.objetivosMetas[dim.id]?.estrategiasSubdimensiones?.[subDim.id] || ''}
                          onChange={e => handleStrategyChange(dim.id, subDim.id, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-200 border-dashed">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Estrategia General</label>
                  <textarea
                    className="w-full p-4 text-sm bg-indigo-50/30 border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none shadow-sm text-slate-700 text-left"
                    value={state.objetivosMetas[dim.id]?.estrategia || ''}
                    placeholder="Estrategia general para la dimensión..."
                    onChange={e => setState(s => ({ ...s, objetivosMetas: { ...s.objetivosMetas, [dim.id]: { ...(s.objetivosMetas[dim.id] || baseObjective), estrategia: e.target.value } } }))}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Section8: React.FC<{ state: AppState; aiReport: string | null; isGenerating: boolean; onGenerate: () => void; onPrev: () => void }> = ({ state, aiReport, isGenerating, onGenerate }) => (
  <div className="max-w-7xl mx-auto pb-12 w-full px-2">
    <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 md:p-12 border border-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Propuesta PME {state.anio}</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <LucideIcons.Bot size={14} className="text-blue-500"/> Generado por IA
          </p>
        </div>
        <div className="w-full md:w-auto">
          <button 
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-black text-sm md:text-base transition-all flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50"
          >
            {isGenerating ? <LucideIcons.Loader className="animate-spin" size={20}/> : <LucideIcons.Sparkles size={20}/>}
            {aiReport ? 'Regenerar Propuesta' : 'Generar Propuesta'}
          </button>
        </div>
      </div>
      <div className="min-h-[400px] w-full">
        {isGenerating && (
           <div className="flex flex-col items-center justify-center text-center py-24 opacity-70">
            <LucideIcons.BrainCircuit size={64} className="mb-6 text-blue-500 animate-pulse"/>
            <p className="text-lg font-black uppercase tracking-widest text-slate-600">Procesando y Estructurando Propuesta...</p>
          </div>
        )}
        {!isGenerating && aiReport ? (
          <PMEProposalRenderer report={aiReport} />
        ) : !isGenerating && (
          <div className="flex flex-col items-center justify-center text-center py-24 opacity-30">
            <LucideIcons.FileText size={64} className="mb-6 text-slate-600"/>
            <p className="text-lg font-black uppercase tracking-widest text-slate-600">El PME generado se mostrará aquí</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const EvaluationWizard: React.FC<{ standardId: string; prevResult?: EvaluationResult; onSave: (id: string, result: EvaluationResult) => void; onCancel: () => void }> = ({ standardId, prevResult, onSave, onCancel }) => {
  const data = DATA_ESTANDARES[standardId] || { nombre: standardId, descripcion: "", problemasDebil:[], problemasIncipientes:[], criteriosSatisfactorios:[], situacionesAvanzado:[] };
  
  const [checks, setChecks] = useState({
    weak: prevResult?.checksWeak || {},
    incipient: prevResult?.checksIncipiente || {},
    sat: prevResult?.checksSat || {},
    adv: prevResult?.checksAdv || {}
  });

  const toggle = (t: 'weak' | 'incipient' | 'sat' | 'adv', i: number) => {
    setChecks(p => ({ ...p, [t]: { ...p[t], [i]: !p[t][i] } }));
  };

  const count = (o: any) => Object.values(o).filter(Boolean).length;
  const cw = count(checks.weak);
  const cs = count(checks.sat);
  const ca = count(checks.adv);
  const ts = data.criteriosSatisfactorios.length;
  
  const cumpleSatisfactorio = ts > 0 && cs === ts;

  let finalLevel: Level;
  if (cumpleSatisfactorio) {
    finalLevel = ca > 0 ? Level.AVANZADO : Level.SATISFACTORIO;
  } else {
    finalLevel = cw > 0 ? Level.DEBIL : Level.INCIPIENTE;
  }

  const handleSave = () => {
    onSave(standardId, { 
      nivel: finalLevel, 
      fecha: new Date().toISOString(), 
      checksWeak: checks.weak, 
      checksIncipiente: checks.incipient, 
      checksSat: checks.sat, 
      checksAdv: checks.adv, 
      counts: { 
        weak: count(checks.weak), 
        incipiente: count(checks.incipient), 
        sat: cs, 
        adv: ca, 
        totalSat: ts 
      } 
    });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
      <div className="bg-slate-900 p-6 sm:p-8 text-white flex justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg shrink-0">{standardId}</div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight sm:pr-8">{data.nombre}</h2>
        </div>
        <button onClick={onCancel} className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors self-start shrink-0"><LucideIcons.X size={20}/></button>
      </div>
      <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex gap-4 items-start">
        <LucideIcons.Info className="text-blue-500 mt-1 flex-shrink-0" size={24}/>
        <p className="text-slate-700 text-sm italic font-medium leading-relaxed uppercase">{data.descripcion}</p>
      </div>

      <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
        <div className="bg-white border text-sm sm:text-base border-emerald-200 shadow-sm p-5 sm:p-8 rounded-2xl relative overflow-hidden">
<h3 className="font-black text-emerald-800 text-base sm:text-lg mb-2">PASOS 1 y 2: Nivel Satisfactorio</h3>
          <p className="text-xs sm:text-sm text-emerald-700 mb-6 font-medium bg-emerald-50 inline-block px-3 py-1 rounded-md">Marque los criterios cumplidos. Debe alcanzar el 100% para este nivel.</p>
          <div className="space-y-4">
            {data.criteriosSatisfactorios.map((txt, i) => (
              <label key={`sat-${i}`} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 cursor-pointer transition border border-slate-200 hover:border-emerald-200">
                <input type="checkbox" checked={!!checks.sat[i]} onChange={() => toggle('sat', i)} className="mt-0.5 h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500 shrink-0" />
                <span className="text-sm font-medium leading-tight text-slate-700">{txt}</span>
              </label>
            ))}
          </div>
          <div className="mt-6 text-right font-black text-emerald-800 bg-emerald-100 inline-block float-right px-4 py-2 rounded-lg text-sm">
            {cs} / {ts} criterios logrados
          </div>
        </div>

        {!cumpleSatisfactorio && (
          <div className="animate-in fade-in duration-500 border border-slate-200 shadow-sm p-5 sm:p-8 rounded-2xl bg-white">
<h3 className="font-black text-slate-800 text-base sm:text-lg mb-2">PASO 3a: Niveles Débil e Incipiente</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 font-medium">Si no alcanzó el 100% de satisfactorio, analice los problemas. **Basta uno del nivel Débil para esa clasificación.**</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-red-50/50 p-4 sm:p-6 rounded-2xl border border-red-100">
                <h4 className="font-black text-red-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><LucideIcons.AlertTriangle size={18}/> Dificultades Críticas</h4>
                {data.problemasDebil.map((txt, i) => (
                  <label key={`weak-${i}`} className="flex items-start gap-3 p-3 mb-3 rounded-xl bg-white hover:bg-red-50 cursor-pointer transition border border-red-100 shadow-sm">
                    <input type="checkbox" checked={!!checks.weak[i]} onChange={() => toggle('weak', i)} className="mt-1 h-4 w-4 rounded text-red-600 focus:ring-red-500 shrink-0" />
                    <span className="text-xs font-medium text-slate-700 leading-snug">{txt}</span>
                  </label>
                ))}
              </div>
              <div className="bg-amber-50/50 p-4 sm:p-6 rounded-2xl border border-amber-100">
                <h4 className="font-black text-amber-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><LucideIcons.AlertCircle size={18}/> Dificultades Leves</h4>
                {data.problemasIncipientes.map((txt, i) => (
                  <label key={`incipient-${i}`} className="flex items-start gap-3 p-3 mb-3 rounded-xl bg-white hover:bg-amber-50 cursor-pointer transition border border-amber-100 shadow-sm">
                    <input type="checkbox" checked={!!checks.incipient[i]} onChange={() => toggle('incipient', i)} className="mt-1 h-4 w-4 rounded text-amber-500 focus:ring-amber-500 shrink-0" />
                    <span className="text-xs font-medium text-slate-700 leading-snug">{txt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {cumpleSatisfactorio && (
          <div className="animate-in fade-in duration-500 bg-sky-50/50 border border-sky-200 shadow-sm p-5 sm:p-8 rounded-2xl">
              <h3 className="font-black text-sky-800 text-base sm:text-lg mb-2 flex items-center gap-2"><LucideIcons.Medal size={20}/> PASO 3b: Nivel Avanzado</h3>
            <p className="text-xs sm:text-sm text-sky-700 mb-6 font-medium">Cumplido el nivel satisfactorio, verifique prácticas de nivel avanzado (opcional).</p>
            <div className="space-y-4">
              {data.situacionesAvanzado.map((txt, i) => (
                <label key={`adv-${i}`} className="flex items-start gap-4 p-4 rounded-xl bg-white hover:bg-sky-50 cursor-pointer transition border border-sky-100 shadow-sm">
                  <input type="checkbox" checked={!!checks.adv[i]} onChange={() => toggle('adv', i)} className="mt-1 h-5 w-5 rounded text-sky-600 focus:ring-sky-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 leading-tight">{txt}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-10 bg-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 rounded-b-3xl">
        <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white/10 rounded-2xl flex-1 w-full md:w-auto">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${NIVELES_INFO[finalLevel].fullColor} flex items-center justify-center text-white shadow-lg shrink-0 flex-col`}><LucideIcons.BarChart2 size={24}/></div>
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Nivel Alcanzado</p>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-white">{NIVELES_INFO[finalLevel].label}</h3>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button onClick={onCancel} className="px-6 py-4 text-white/60 font-bold hover:text-white transition w-full sm:w-auto">Cancelar</button>
          <button 
            onClick={handleSave}
            className="px-8 py-4 bg-white text-slate-900 rounded-xl font-black text-sm sm:text-base shadow-xl hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 w-full sm:w-auto"
          >
            <LucideIcons.Save size={20}/> Guardar Evaluación
          </button>
        </div>
      </div>
    </div>
  );
};


const RefinementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onRefine: (prompt: string) => void;
}> = ({ isOpen, onClose, onRefine }) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRefine(prompt || 'Genera una alternativa a la estrategia actual, enfocada en innovación pedagógica y mejora medible.');
    setPrompt('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-slate-200">
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><LucideIcons.Sparkles size={24}/></div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">Refinar Estrategia</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Con Inteligencia Artificial</p>
                </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><LucideIcons.X size={20}/></button>
        </div>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Describe qué aspecto de la estrategia te gustaría cambiar. Deja en blanco para recibir una propuesta alternativa optimizada al contexto general.
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none mb-6 placeholder:text-slate-400 font-medium"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ejemplo: Hazla más orientada a la contención emocional de básica..."
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition shadow-lg flex items-center gap-2">
              <LucideIcons.Wand2 size={16}/> Aplicar Refinamiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PMEProposalRenderer: React.FC<{ report: string }> = ({ report }) => {
  const [structuredReport, setStructuredReport] = useState<PMEDimension[]>([]);
  const [loadingState, setLoadingState] = useState<{ type: string; id: string | null }>({ type: '', id: null });
  const [normativeModalInfo, setNormativeModalInfo] = useState<{ dimIndex: number; subDimIndex: number; actionIndex: number; } | null>(null);
  const [strategyRefinementInfo, setStrategyRefinementInfo] = useState<{ dimIndex: number; subDimIndex: number; } | null>(null);
  const [refiningStrategyId, setRefiningStrategyId] = useState<string | null>(null);
  const [indicatorRefinementInfo, setIndicatorRefinementInfo] = useState<{ dimIndex: number; subDimIndex: number; indicatorIndex: number } | null>(null);
  const [refiningIndicatorId, setRefiningIndicatorId] = useState<string | null>(null);
  
  const handleUpdate = (updater: (draft: PMEDimension[]) => void) => {
    setStructuredReport(current => {
      const draft: PMEDimension[] = JSON.parse(JSON.stringify(current));
      updater(draft);
      return draft;
    });
  };

  useEffect(() => {
    if (report) {
      const allDimensionsMap = new Map<string, { id: string, subDimensions: Map<string, string> }>();
      ESTRUCTURA_EID.forEach(dim => {
        const subDimMap = new Map<string, string>();
        dim.subdimensiones.forEach(sub => subDimMap.set(sub.nombre, sub.id));
        allDimensionsMap.set(dim.nombre, { id: dim.id, subDimensions: subDimMap });
      });

      const sections = report.split('---').filter(s => s.trim() !== '');
      const parsedDimensions: PMEDimension[] = [];

      for (const section of sections) {
        const dimMatch = section.match(/\*\*I\. NOMBRE DIMENSIÓN: (.*?)\*\*/);
        if (!dimMatch) continue;
        const dimensionName = dimMatch[1].trim();
        
        const objective = section.match(/\*\*Objetivo estratégico:\*\* (.*)/)?.[1].trim() || 'N/A';
        const meta = section.match(/\*\*Meta estratégica:\*\* (.*)/)?.[1].trim() || 'N/A';
        const subDimensionName = section.match(/\*\*Subdimensión Focalizada:\*\* (.*)/)?.[1].trim() || 'N/A';
        const strategy = section.match(/\*\*Estrategia:\*\* (.*)/)?.[1].trim() || 'N/A';

        const indicatorsMatch = section.match(/\*\*Indicadores de Seguimiento de la Estrategia:\*\*\s*\n\s*\*   Indicador 1: (.*?)\n\s*\*   Indicador 2: (.*?)$/ms);
        const indicators = indicatorsMatch ? [indicatorsMatch[1].trim(), indicatorsMatch[2].trim()].filter(Boolean) : [];

        const actions: PMEAction[] = [];
        const actionsSectionMatch = section.match(/\*\*Acciones Propuestas:\*\*(.*)/s);
        if (actionsSectionMatch?.[1]) {
            const tableContent = actionsSectionMatch[1];
            const dataRows = tableContent.split('\n').map(r => r.trim()).filter(r => r.startsWith('|') && !r.includes(':---') && !/nombre de la acci[oó]n/i.test(r));
            for (const row of dataRows) {
                const cells = row.split('|').map(cell => cell.trim().replace(/\*\*/g, ''));
                if (cells.length > 3 && cells[1] && cells[2] && cells[3]) {
                    const verificationItems = cells[3].split('\n').map(v => v.trim().replace(/^-/, '').trim()).filter(Boolean);
                    verificationItems.push("Informe Técnico de la Acción");
                    const finalVerification = verificationItems.map((item, index) => `${index + 1}. ${item}`).join('\n');

                    actions.push({ name: cells[1], description: cells[2], verification: finalVerification, normativeLinks: {} });
                }
            }
        }
        
        const subDimensionId = allDimensionsMap.get(dimensionName)?.subDimensions.get(subDimensionName) || 'unknown';
        
        let existingDim = parsedDimensions.find(d => d.name === dimensionName);
        if (!existingDim) {
          const dimInfo = ESTRUCTURA_EID.find(d => d.nombre === dimensionName);
          existingDim = {
            name: dimensionName, objective, meta, subDimensions: [], 
            icon: dimInfo?.icon, color: dimInfo?.color,
          };
          parsedDimensions.push(existingDim);
        }

        existingDim.subDimensions.push({ id: subDimensionId, name: subDimensionName, strategy, indicators, actions });
      }
      setStructuredReport(parsedDimensions);
    }
  }, [report]);

  const handleUpdateIndicator = (dimIndex: number, subDimIndex: number, indicatorIndex: number, value: string) => {
    handleUpdate(draft => {
      draft[dimIndex].subDimensions[subDimIndex].indicators[indicatorIndex] = value;
    });
  };

  const handleDeleteIndicator = (dimIndex: number, subDimIndex: number, indicatorIndex: number) => {
    handleUpdate(draft => {
      draft[dimIndex].subDimensions[subDimIndex].indicators.splice(indicatorIndex, 1);
    });
  };

  const handleAddIndicator = async (dimIndex: number, subDimIndex: number) => {
    const dimension = structuredReport[dimIndex];
    const subDimension = dimension.subDimensions[subDimIndex];
    if (subDimension.indicators.length >= 6) return;

    const uniqueId = `${dimIndex}-${subDimIndex}-indicator`;
    setLoadingState({ type: 'add_indicator', id: uniqueId });

    try {
      const context = { dimensionName: dimension.name, subDimensionName: subDimension.name, strategy: subDimension.strategy };
      const newIndicators = await generateMoreIndicators(context, subDimension.indicators);
      handleUpdate(draft => {
        const currentIndicators = draft[dimIndex].subDimensions[subDimIndex].indicators;
        newIndicators.forEach((ind: string) => {
          if (!currentIndicators.includes(ind) && currentIndicators.length < 6) {
            currentIndicators.push(ind);
          }
        });
      });
    } catch (error) {
      alert("No se pudieron generar más indicadores.");
    } finally {
      setLoadingState({ type: '', id: null });
    }
  };

    const handleExecuteIndicatorRefinement = async (userPrompt: string) => {
      if (!indicatorRefinementInfo) return;
      const { dimIndex, subDimIndex, indicatorIndex } = indicatorRefinementInfo;
      const uniqueId = `${dimIndex}-${subDimIndex}-${indicatorIndex}-indicator`;
      setRefiningIndicatorId(uniqueId);
      setIndicatorRefinementInfo(null);

      try {
          const dimension = structuredReport[dimIndex];
          const subDimension = dimension.subDimensions[subDimIndex];
          const originalIndicator = subDimension.indicators[indicatorIndex];
          const context = {
              dimensionName: dimension.name,
              subDimensionName: subDimension.name,
              strategy: subDimension.strategy
          };
          const newIndicator = await refineIndicator(originalIndicator, userPrompt, context);
          
          handleUpdate(draft => {
              draft[dimIndex].subDimensions[subDimIndex].indicators[indicatorIndex] = newIndicator;
          });
      } catch (error) {
          console.error("Error refining indicator in Section 8:", error);
          alert("Hubo un error al refinar el indicador.");
      } finally {
          setRefiningIndicatorId(null);
      }
  };

  const handleUpdateAction = (dimIndex: number, subDimIndex: number, actionIndex: number, field: keyof PMEAction, value: string) => {
    handleUpdate(draft => {
      (draft[dimIndex].subDimensions[subDimIndex].actions[actionIndex] as any)[field] = value;
    });
  };

  const handleDeleteAction = (dimIndex: number, subDimIndex: number, actionIndex: number) => {
    handleUpdate(draft => {
      draft[dimIndex].subDimensions[subDimIndex].actions.splice(actionIndex, 1);
    });
  };

  const handleAddAction = async (dimIndex: number, subDimIndex: number) => {
    const dimension = structuredReport[dimIndex];
    const subDimension = dimension.subDimensions[subDimIndex];
    if (subDimension.actions.length >= 5) return;

    const uniqueId = `${dimIndex}-${subDimIndex}-action`;
    setLoadingState({ type: 'add_action', id: uniqueId });

    try {
      const context = { dimensionName: dimension.name, subDimensionName: subDimension.name, strategy: subDimension.strategy };
      const newActionsRaw = await generateMoreActions(context, subDimension.actions);
      const newActions = newActionsRaw.map((a: any) => {
        const verificationItems = a.verification.split('\n').map((v: string) => v.trim().replace(/^-/, '').trim()).filter(Boolean);
        verificationItems.push("Informe Técnico de la Acción");
        const finalVerification = verificationItems.map((item: string, index: number) => `${index + 1}. ${item}`).join('\n');
        return { ...a, verification: finalVerification, normativeLinks: {} };
      });

      handleUpdate(draft => {
        const currentActions = draft[dimIndex].subDimensions[subDimIndex].actions;
        if (currentActions.length < 5) {
          currentActions.push(...newActions);
        }
      });
    } catch (error) {
      alert("No se pudieron generar más acciones.");
    } finally {
      setLoadingState({ type: '', id: null });
    }
  };

  const handleRefineAction = async (dimIndex: number, subDimIndex: number, actionIndex: number) => {
    const uniqueId = `${dimIndex}-${subDimIndex}-${actionIndex}`;
    setLoadingState({ type: 'refine_action', id: uniqueId });

    try {
      const dimension = structuredReport[dimIndex];
      const subDimension = dimension.subDimensions[subDimIndex];
      const actionToRefine = subDimension.actions[actionIndex];

      if (!actionToRefine.normativeLinks || Object.keys(actionToRefine.normativeLinks).length === 0) {
        alert("Vincule al menos un plan normativo antes de refinar.");
        return;
      }

      const context = {
        dimensionName: dimension.name,
        subDimensionName: subDimension.name,
        objective: dimension.objective,
        meta: dimension.meta,
        strategy: subDimension.strategy
      };
      const currentAction = { name: actionToRefine.name, description: actionToRefine.description, verification: actionToRefine.verification };
      const normativeContext = Object.entries(actionToRefine.normativeLinks).map(([planId, objectives]) => ({
        planName: (PLANES_NORMATIVOS as any)[planId]?.nombre || planId,
        objectives: objectives as string[],
      }));

      const refinedAction = await refineActionWithNormativeContext(context, currentAction, normativeContext);
      
      handleUpdate(draft => {
        const action = draft[dimIndex].subDimensions[subDimIndex].actions[actionIndex];
        action.name = refinedAction.name;
        action.description = refinedAction.description;
        
        const verificationItems = refinedAction.verification.split('\n').map((v: string) => v.trim().replace(/^-/, '').trim()).filter(Boolean);
        verificationItems.push("Informe Técnico de la Acción");
        action.verification = verificationItems.map((item: string, index: number) => `${index + 1}. ${item}`).join('\n');
      });

    } catch (error) {
      console.error("Error refining action:", error);
      alert("Hubo un error al refinar la acción con IA. Intente de nuevo.");
    } finally {
      setLoadingState({ type: '', id: null });
    }
  };

  const handleSaveNormativeLinks = (links: Record<string, string[]>) => {
    if (!normativeModalInfo) return;
    const { dimIndex, subDimIndex, actionIndex } = normativeModalInfo;
    handleUpdate(draft => {
      draft[dimIndex].subDimensions[subDimIndex].actions[actionIndex].normativeLinks = links;
    });
    setNormativeModalInfo(null);
  };
  
  const handleExecuteStrategyRefinement = async (userPrompt: string) => {
      if (!strategyRefinementInfo) return;
      const { dimIndex, subDimIndex } = strategyRefinementInfo;
      const uniqueId = `${dimIndex}-${subDimIndex}-strategy`;
      setRefiningStrategyId(uniqueId);
      setStrategyRefinementInfo(null);

      try {
          const dimension = structuredReport[dimIndex];
          const subDimension = dimension.subDimensions[subDimIndex];
          const context = {
              dimensionName: dimension.name,
              subDimensionName: subDimension.name,
              objective: dimension.objective,
              meta: dimension.meta
          };
          const newStrategy = await refineStrategy(subDimension.strategy, userPrompt, context);
          
          handleUpdate(draft => {
              draft[dimIndex].subDimensions[subDimIndex].strategy = newStrategy;
          });
      } catch (error) {
          console.error("Error refining strategy in Section 8:", error);
          alert("Hubo un error al refinar la estrategia.");
      } finally {
          setRefiningStrategyId(null);
      }
  };
  
  const currentActionForModal = normativeModalInfo ? structuredReport[normativeModalInfo.dimIndex]?.subDimensions[normativeModalInfo.subDimIndex]?.actions[normativeModalInfo.actionIndex] : null;

  if (structuredReport.length === 0) return null;

  return (
    <>
      <div className="space-y-12">
        {structuredReport.map((dimension, dimIndex) => (
          <div key={dimIndex} className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
            <div className="flex items-center gap-4 pb-4 mb-6 border-b-2 border-slate-100">
              {dimension.icon && React.createElement(LucideIcons[dimension.icon as keyof typeof LucideIcons] as any, { size: 28, className: dimension.color ? `text-${dimension.color}-600` : 'text-slate-500' })}
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 uppercase">{dimension.name}</h2>
            </div>
             <div className="bg-slate-50 p-5 sm:p-6 rounded-xl space-y-4 mb-8 border border-slate-100">
                <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><LucideIcons.Flag size={14} className="text-blue-500"/> Objetivo Estratégico</h4>
                    <p className="text-sm font-medium text-slate-700 bg-white p-3 rounded-lg border border-slate-100">{dimension.objective}</p>
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><LucideIcons.TrendingUp size={14} className="text-pink-500"/> Meta Estratégica</h4>
                    <p className="text-sm font-medium text-slate-700 bg-white p-3 rounded-lg border border-slate-100">{dimension.meta}</p>
                </div>
            </div>

            {dimension.subDimensions.map((sub, subDimIndex) => {
              const uniqueId = `${dimIndex}-${subDimIndex}`;
              const isRefiningThis = refiningStrategyId === `${uniqueId}-strategy`;
              return (
                <div key={subDimIndex} className="mt-8 border-t border-slate-200 pt-8 pl-0 sm:pl-4 border-l-0 sm:border-l-4 sm:border-l-slate-200">
                  <div className="bg-white border-2 border-blue-100 p-5 sm:p-8 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <LucideIcons.Target className="text-blue-600"/>
                        <p className="text-sm font-black text-blue-900 uppercase tracking-wide">Foco: {sub.name}</p>
                    </div>
                    <div className="mt-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-3 border-b border-blue-50 pb-3">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Estrategia Implementada</h4>
                            <button onClick={() => setStrategyRefinementInfo({ dimIndex, subDimIndex })} disabled={isRefiningThis} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition disabled:opacity-50 self-start sm:self-auto">
                                {isRefiningThis ? <LucideIcons.Loader size={14} className="animate-spin" /> : <LucideIcons.Wand2 size={14} />}
                                <span>Mejorar con IA</span>
                            </button>
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl">{sub.strategy}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-slate-50 p-5 sm:p-8 rounded-2xl border border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b border-slate-200 pb-4 gap-4">
                        <h3 className="text-base font-black text-slate-800 uppercase flex items-center gap-2">
                           <LucideIcons.Activity size={18} className="text-slate-500"/>
                           Indicadores de Medición
                        </h3>
                        <button onClick={() => handleAddIndicator(dimIndex, subDimIndex)} disabled={loadingState.type === 'add_indicator' || sub.indicators.length >= 6} className="bg-white border border-slate-200 flex items-center gap-2 px-4 py-2 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 hover:text-slate-900 transition disabled:opacity-50 self-start sm:self-auto shadow-sm">
                            {loadingState.type === 'add_indicator' && loadingState.id === `${uniqueId}-indicator` ? <LucideIcons.Loader size={16} className="animate-spin" /> : <LucideIcons.Plus size={16} />}
                            Añadir Indicador
                        </button>
                    </div>
                    <ul className="space-y-3">
                      {sub.indicators.map((indicator, indicatorIndex) => {
                         const indicatorUniqueId = `${dimIndex}-${subDimIndex}-${indicatorIndex}-indicator`;
                         const isRefiningThisIndicator = refiningIndicatorId === indicatorUniqueId;
                        return (
                        <li key={indicatorIndex} className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-200 transition group shadow-sm">
                          <div className="bg-blue-50 p-2 rounded-lg text-blue-500 flex-shrink-0 mt-0.5"><LucideIcons.LineChart size={16}/></div>
                          <div className="flex-grow w-full overflow-hidden">
                             <EditableField value={indicator} onSave={newValue => handleUpdateIndicator(dimIndex, subDimIndex, indicatorIndex, newValue)} className="text-sm font-medium text-slate-700 leading-snug break-words" />
                          </div>
                          <div className="flex sm:flex-col lg:flex-row items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition shrink-0 pl-2">
                             <button onClick={() => setIndicatorRefinementInfo({ dimIndex, subDimIndex, indicatorIndex })} disabled={isRefiningThisIndicator} className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition" title="Refinar indicador">
                                {isRefiningThisIndicator ? <LucideIcons.Loader size={16} className="animate-spin"/> : <LucideIcons.Wand2 size={16} />}
                            </button>
                            <button onClick={() => handleDeleteIndicator(dimIndex, subDimIndex, indicatorIndex)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition" title="Eliminar indicador">
                                <LucideIcons.Trash2 size={16} />
                            </button>
                          </div>
                        </li>
                      )})}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                        <h3 className="text-base sm:text-lg font-black text-slate-800 uppercase flex items-center gap-2">
                           <LucideIcons.ListChecks size={20} className="text-slate-600"/> Plan de Acciones
                        </h3>
                         <button onClick={() => handleAddAction(dimIndex, subDimIndex)} disabled={loadingState.type === 'add_action' || sub.actions.length >= 5} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-black transition disabled:opacity-50 self-start sm:self-auto shadow-md">
                           {loadingState.type === 'add_action' && loadingState.id === `${uniqueId}-action` ? <LucideIcons.Loader size={18} className="animate-spin" /> : <LucideIcons.Plus size={18} />}
                           Crear Nueva Acción
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                          {sub.actions.map((action, actionIndex) => {
                            const actionUniqueId = `${dimIndex}-${subDimIndex}-${actionIndex}`;
                            const isArticulated = action.normativeLinks && Object.keys(action.normativeLinks).length > 0;
                            const isLoading = loadingState.id === actionUniqueId;

                            return (
                            <div key={actionIndex} className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-5 sm:p-6 group hover:border-slate-200 transition">
                              
                              <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-100">
                                  <div className="font-black text-base text-slate-800 flex-grow w-full">
                                    <EditableField value={action.name} onSave={newValue => handleUpdateAction(dimIndex, subDimIndex, actionIndex, 'name', newValue)} className="bg-slate-50 border border-slate-100 hover:border-blue-200" />
                                  </div>
                                  <button onClick={() => handleDeleteAction(dimIndex, subDimIndex, actionIndex)} className="text-slate-300 hover:bg-red-50 hover:text-red-500 p-2 rounded-lg transition shrink-0 no-print">
                                      <LucideIcons.Trash2 size={18} />
                                  </button>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                 <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><LucideIcons.AlignLeft size={14}/> Descripción</h4>
                                    <EditableField value={action.description} onSave={newValue => handleUpdateAction(dimIndex, subDimIndex, actionIndex, 'description', newValue)} className="text-sm text-slate-600 bg-slate-50 border border-slate-100 min-h-[100px] hover:border-blue-200 leading-relaxed font-medium block" />
                                 </div>
                                 <div className="flex flex-col gap-6">
                                     <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><LucideIcons.CheckSquare size={14}/> Verificación</h4>
                                        <EditableField value={action.verification} onSave={newValue => handleUpdateAction(dimIndex, subDimIndex, actionIndex, 'verification', newValue)} className="text-sm text-slate-600 bg-slate-50 border border-slate-100 hover:border-blue-200 leading-relaxed font-medium block h-auto min-h-[60px]" />
                                     </div>
                                     <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 flex-grow pt-4">
                                        <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
                                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Planes Normativos Vinculados</h4>
                                            {isArticulated && (
                                                <button onClick={() => setNormativeModalInfo({ dimIndex, subDimIndex, actionIndex })} className="text-xs text-blue-600 font-bold hover:underline">Editar</button>
                                            )}
                                        </div>
                                         <div className="w-full">
                                            {isArticulated ? (
                                                <div className="space-y-4">
                                                    {Object.entries(action.normativeLinks ?? {}).map(([planId, objectives]: [string, string[]]) => (
                                                        (objectives.length > 0) && (
                                                            <div key={planId} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5"><LucideIcons.BookMarked size={12} className="text-blue-500"/> {(PLANES_NORMATIVOS as any)[planId]?.nombre || planId}</p>
                                                                <ul className="text-xs text-slate-500 font-medium pl-1 border-l-2 border-slate-200 space-y-1.5 ml-2">
                                                                    {objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                                                                </ul>
                                                            </div>
                                                        )
                                                    ))}
                                                    <div className="pt-2 no-print flex justify-end">
                                                        <button onClick={() => handleRefineAction(dimIndex, subDimIndex, actionIndex)} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition bg-slate-900 text-white hover:bg-black disabled:opacity-50 shadow-md">
                                                            {loadingState.type === 'refine_action' && isLoading ? <LucideIcons.Loader size={14} className="animate-spin"/> : <LucideIcons.Sparkles size={14}/>}
                                                            <span>Optimizar Acción con IA</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="py-4 flex flex-col items-center justify-center text-center">
                                                    <LucideIcons.Link2 size={24} className="text-slate-300 mb-2"/>
                                                    <p className="text-xs text-slate-500 font-medium mb-4">Esta acción no está articulada a PME/Normativa.</p>
                                                    <button onClick={() => setNormativeModalInfo({ dimIndex, subDimIndex, actionIndex })} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100 transition shadow-sm">
                                                        <LucideIcons.Plus size={14}/> Articular Planes
                                                    </button>
                                                </div>
                                            )}
                                         </div>
                                     </div>
                                 </div>
                              </div>
                            </div>
                          )})}
                    </div>
                  </div>
                </div>
              )})}
          </div>
        ))}
      </div>

      <RefinementModal 
        isOpen={!!strategyRefinementInfo}
        onClose={() => setStrategyRefinementInfo(null)}
        onRefine={handleExecuteStrategyRefinement}
      />

      <IndicatorRefinementModal 
        isOpen={!!indicatorRefinementInfo}
        onClose={() => setIndicatorRefinementInfo(null)}
        onRefine={handleExecuteIndicatorRefinement}
      />

      {normativeModalInfo && currentActionForModal && (
        <NormativeLinkModal 
          isOpen={!!normativeModalInfo}
          onClose={() => setNormativeModalInfo(null)}
          onSave={handleSaveNormativeLinks}
          action={currentActionForModal}
        />
      )}
    </>
  );
};


const EditableField: React.FC<{ value: string; onSave: (newValue: string) => void; className?: string; }> = ({ value, onSave, className }) => {
    const fieldRef = useRef<HTMLDivElement>(null);

    const handleBlur = () => {
        if (fieldRef.current) {
            onSave(fieldRef.current.innerText);
        }
    };
    
    useEffect(() => {
        if (fieldRef.current && fieldRef.current.innerText !== value) {
            fieldRef.current.innerText = value;
        }
    }, [value]);

    return (
        <div
            ref={fieldRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            className={`p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white rounded-xl break-words whitespace-pre-wrap max-w-full overflow-hidden block ${className || ''}`}
            dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br />') }}
        />
    );
};

const IndicatorRefinementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onRefine: (prompt: string) => void;
}> = ({ isOpen, onClose, onRefine }) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRefine(prompt || 'Genera una alternativa a este indicador para que sea más medible y realista en un año escolar.');
    setPrompt('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-200">
         <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><LucideIcons.Target size={24}/></div>
            <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Refinar Indicador</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sugerencia con IA</p>
            </div>
        </div>
        <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
            Puedes indicarle a la IA qué quieres cambiar (ej. "enfócalo en asistencia", "hazlo cualitativo"). Si lo dejas en blanco, optimizará su redacción general.
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-28 resize-none mb-6 font-medium text-slate-700"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Instrucciones para generar un nuevo indicador..."
          />
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition shadow-sm">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition shadow-lg flex items-center gap-2">
              <LucideIcons.Wand2 size={16}/> Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NormativeLinkModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (links: Record<string, string[]>) => void;
    action: PMEAction;
}> = ({ isOpen, onClose, onSave, action }) => {
    const [selection, setSelection] = useState<Record<string, string[]>>(action.normativeLinks || {});

    const handlePlanToggle = (planId: string) => {
        setSelection(current => {
            const newSelection = { ...current };
            if (newSelection[planId]) {
                delete newSelection[planId];
            } else {
                if (Object.keys(newSelection).length < 3) {
                    newSelection[planId] = [];
                } else {
                    alert("Puede seleccionar un máximo de 3 planes normativos.");
                }
            }
            return newSelection;
        });
    };

    const handleObjectiveToggle = (planId: string, objective: string) => {
        setSelection(current => {
            const newSelection = { ...current };
            const objectives = newSelection[planId] || [];
            if (objectives.includes(objective)) {
                newSelection[planId] = objectives.filter(o => o !== objective);
            } else {
                if (objectives.length < 2) {
                    newSelection[planId] = [...objectives, objective];
                } else {
                    alert("Puede seleccionar un máximo de 2 objetivos por plan.");
                }
            }
            return newSelection;
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-8 bg-slate-900 border-b border-slate-800 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-xl md:text-2xl font-black flex items-center gap-3">
                            <LucideIcons.Network className="text-blue-500" /> Articular Acción
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">Conecta esta acción con hasta 3 planes nacionales.</p>
                    </div>
                   <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition text-slate-300"><LucideIcons.X size={20}/></button>
                </div>
                
                <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-grow bg-slate-50">
                    <p className="text-sm font-bold text-slate-600 bg-white p-4 items-center rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
                        <LucideIcons.Info size={16} className="inline mr-2 text-blue-500"/>
                        Seleccione el Plan Transversal y marque hasta 2 objetivos críticos por plan.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(PLANES_NORMATIVOS).map(([planId, planData]: [string, any]) => {
                        const isSelected = !!selection[planId];
                        return (
                        <div key={planId} className={`p-5 rounded-2xl border-2 transition-all ${isSelected ? 'bg-white border-blue-500 shadow-md ring-4 ring-blue-50' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-colors"
                                    checked={isSelected}
                                    onChange={() => handlePlanToggle(planId)}
                                />
                                <span className={`font-black uppercase text-xs tracking-wider transition ${isSelected ? 'text-blue-900' : 'text-slate-600 group-hover:text-slate-800'}`}>
                                    {planData.nombre}
                                </span>
                            </label>
                            
                            {isSelected && (
                                <div className="mt-4 pl-4 md:pl-6 space-y-3 border-l-[3px] border-blue-100 py-2 animate-in slide-in-from-top-2 duration-300">
                                    {planData.objetivos.map((obj: string, index: number) => {
                                        const objSelected = selection[planId]?.includes(obj);
                                        return (
                                        <label key={index} className={`flex items-start gap-3 cursor-pointer p-2 rounded-xl transition ${objSelected ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                                            <input
                                                type="checkbox"
                                                className="mt-0.5 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 shrink-0"
                                                checked={objSelected}
                                                onChange={() => handleObjectiveToggle(planId, obj)}
                                            />
                                            <span className={`text-xs leading-relaxed font-medium font-inter ${objSelected ? 'text-blue-900 font-bold' : 'text-slate-600'}`}>{obj}</span>
                                        </label>
                                    )})}
                                </div>
                            )}
                        </div>
                    )})}
                    </div>
                </div>
                <div className="p-6 bg-white border-t border-slate-200 flex justify-end gap-4 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition">Cancelar</button>
                    <button onClick={() => onSave(selection)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-black transition shadow-xl flex items-center justify-center gap-2">
                        <LucideIcons.Save size={18}/> Validar Articulación
                    </button>
                </div>
            </div>
        </div>
    );
};
