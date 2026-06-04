export enum Level {
  DEBIL = 'DEBIL',
  INCIPIENTE = 'INCIPIENTE',
  SATISFACTORIO = 'SATISFACTORIO',
  AVANZADO = 'AVANZADO'
}

export interface EvaluationResult {
  nivel: Level;
  fecha: string;
  checksWeak: Record<number, boolean>;
  checksIncipiente: Record<number, boolean>;
  checksSat: Record<number, boolean>;
  checksAdv: Record<number, boolean>;
  counts: {
    weak: number;
    incipiente: number;
    sat: number;
    adv: number;
    totalSat: number;
  };
}

export interface Message {
  type: 'success' | 'error' | 'info';
  text: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'model' | 'system' | 'assistant';
  content?: string;
  text?: string;
  parts?: { text: string }[];
  timestamp?: number;
}

export interface ObjectiveMeta {
  objetivo: string;
  meta: string;
  // Almacena la estrategia general de la dimensión (precargada)
  estrategia: string; 
  // Almacena estrategias específicas generadas por IA para subdimensiones críticas
  estrategiasSubdimensiones?: Record<string, string>; // Key: subDimensionId
}

export interface SubDimension {
  id: string;
  nombre: string;
  estandares: string[];
}

export interface Dimension {
  id: string;
  nombre: string;
  icon: string;
  color: string;
  subdimensiones: SubDimension[];
}

export interface StandardData {
  id: string;
  nombre: string;
  descripcion: string;
  problemasDebil: string[];
  problemasIncipientes: string[];
  criteriosSatisfactorios: string[];
  situacionesAvanzado: string[];
}

export interface AppState {
  section: number; // 1 to 8
  establecimiento: string;
  anio: number;
  evaluaciones: Record<string, EvaluationResult>;
  objetivosMetas: Record<string, ObjectiveMeta>;
  currentStandardId: string | null;
  evaluating: boolean;
  nudosCriticos: Record<string, string>;
  objetivosPadem: string;
  mision: string;
  vision: string;
}

// --- Interfaces for Structured PME Report ---
export interface PMEAction {
  name: string;
  description: string;
  verification: string;
  normativeLinks?: Record<string, string[]>; // { PLAN_ID: [objetivo1, objetivo2] }
}

export interface PMESubDimension {
  id: string; 
  name: string;
  strategy: string;
  indicators: string[];
  actions: PMEAction[];
}

export interface PMEDimension {
  id?: string;
  name: string;
  objective: string;
  meta: string;
  subDimensions: PMESubDimension[];
  icon?: string;
  color?: string;
}
