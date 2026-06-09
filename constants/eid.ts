import { Level, Dimension, StandardData, ObjectiveMeta } from '../types';
import { DATA_ESTANDARES } from './data_estandares';

export { DATA_ESTANDARES };

export const ESTABLECIMIENTOS = [
  "ESCUELA SAN MIGUEL", "LICEO BICENTENARIO HERMANOS SOTOMAYOR BAEZA", "LICEO BICENTENARIO POLITECNICO",
  "ESCUELA IGNACIO SERRANO MONTANER", "LICEO GABRIELA MISTRAL DE MELIPILLA", "COLEGIO HUILCO ALTO",
  "COLEGIO MONS. JAIME LARRAIN BUNSTER", "ESCUELA SAN JOSE DE LA VILLA", "ESCUELA GRAL. CAROL URZUA",
  "ESCUELA REPUBLICA DEL BRASIL", "COLEGIO POMAIRE", "LICEO POLIV. EL BOLLENAR",
  "ESCUELA SANTA ROSA ESMERALDA", "ESCUELA CLAUDIO ARRAU", "ESCUELA PATRICIO LARRAIN GANDARILLAS",
  "ESCUELA PEDRO MARIN ALEMANY", "ESCUELA BASICA CARMEN BAJO", "ESCUELA RAMON NOGUERA PRIETO",
  "ESCUELA PUANGUE", "ESCUELA LIDIA MATTE HURTADO", "ESCUELA JOSE CAMARENA ESCRIVA",
  "ESCUELA HUECHUN", "ESCUELA RAQUEL FERNANDEZ DE MORANDE", "ESCUELA PADRE ALBERTO HURTADO",
  "ESCUELA BASICA EL PABELLON", "LICEO LOS JAZMINES"
];

export const NIVELES_INFO = {
  [Level.DEBIL]: { 
    label: "Desarrollo Débil", 
    color: "bg-red-500 text-white", 
    hover: "hover:bg-red-600",
    border: "border-red-600", 
    fullColor: "bg-red-500", 
    desc: "El proceso de gestión no se ha implementado o presenta problemas que dificultan el funcionamiento." 
  },
  [Level.INCIPIENTE]: { 
    label: "Desarrollo Incipiente", 
    color: "bg-yellow-400 text-yellow-950", 
    hover: "hover:bg-yellow-500",
    border: "border-yellow-500", 
    fullColor: "bg-yellow-400", 
    desc: "Se implementa de manera asistemática o incompleta, por lo que su funcionalidad es solo parcial." 
  },
  [Level.SATISFACTORIO]: { 
    label: "Desarrollo Satisfactorio", 
    color: "bg-green-500 text-white", 
    hover: "hover:bg-green-600",
    border: "border-green-600", 
    fullColor: "bg-green-600", 
    desc: "Proceso instalado, estable y efectivo, cumple con los procedimientos para ser funcional." 
  },
  [Level.AVANZADO]: { 
    label: "Desarrollo Avanzado", 
    color: "bg-blue-600 text-white", 
    hover: "hover:bg-blue-700",
    border: "border-blue-700", 
    fullColor: "bg-blue-600", 
    desc: "Incluye prácticas institucionalizadas o innovadoras que impactan positivamente." 
  }
};

export const GUIA_ESTRATEGIAS_SUBDIMENSION: Record<string, string> = {
  'lid_sostenedor': 'Focalizar en la responsabilidad del sostenedor, su rendición de cuentas y la comunicación efectiva con las comunidades educativas.',
  'lid_director': 'Centrarse en el liderazgo pedagógico del director, la conducción efectiva del establecimiento y la promoción de altas expectativas.',
  'plan_resultados': 'Enfocarse en la elaboración, monitoreo y uso de datos del plan de mejoramiento para la toma de decisiones informada.',
  'ges_curricular': 'Asegurar la implementación del currículum, la cobertura curricular y el uso de información evaluativa para la retroalimentación.',
  'ges_aula': 'Fortalecer las prácticas pedagógicas en el aula, el uso del tiempo lectivo y la creación de ambientes de aprendizaje estimulantes.',
  'ges_apoyo': 'Mejorar el apoyo al desarrollo integral de los estudiantes, incluyendo el apoyo académico, psicoafectivo y la orientación vocacional.',
  'formacion': 'Promover la formación integral de los estudiantes, el desarrollo de valores, la vida saludable y el pensamiento crítico.',
  'convivencia': 'Fortalecer un ambiente de convivencia escolar positivo, la resolución pacífica de conflictos y el cumplimiento del reglamento interno.',
  'part_democratica': 'Fomentar la participación democrática de la comunidad educativa, el rol del Centro de Estudiantes y la comunicación con las familias.',
  'ges_personal': 'Optimizar la gestión del personal, el desarrollo profesional docente, la evaluación del desempeño y un clima laboral positivo.',
  'ges_financieros': 'Asegurar una gestión eficiente de los recursos financieros, el cumplimiento de la normativa y la rendición de cuentas.',
  'ges_educativos': 'Garantizar la disponibilidad, mantención y uso pedagógico de los recursos educativos, incluyendo infraestructura, equipamiento y CRA.'
};

const anioActual = new Date().getFullYear();
const anioSiguiente = anioActual + 1;

const objetivosGenericos = {
  'liderazgo': {
    objetivo: 'Fortalecer el liderazgo directivo y del sostenedor para asegurar la implementación efectiva del PEI y la mejora continua de los resultados educativos en el establecimiento.',
    meta: `Al ${anioSiguiente}, el 100% de los instrumentos de gestión (PEI, PME, RICE) están actualizados y articulados, con un aumento del 15% en la percepción de liderazgo efectivo según encuesta a la comunidad educativa.`,
    estrategia: 'Desarrollo de un sistema de seguimiento y acompañamiento a la gestión directiva, centrado en el análisis de datos para la toma de decisiones pedagógicas y administrativas.'
  },
  'gestion_pedagogica': {
    objetivo: 'Mejorar las prácticas pedagógicas en el aula para elevar los resultados de aprendizaje de todos los estudiantes, con foco en el desarrollo de habilidades del siglo XXI en el establecimiento.',
    meta: `Al ${anioSiguiente}, el 80% de los docentes implementa estrategias de enseñanza diversificadas y evaluadas como efectivas mediante observación de aula, logrando un aumento de 10 puntos en el promedio SIMCE de Lenguaje y Matemática.`,
    estrategia: 'Implementación de un programa de desarrollo profesional docente basado en comunidades de aprendizaje, observación y retroalimentación entre pares, y el uso de metodologías activas.'
  },
  'formacion_convivencia': {
    objetivo: 'Promover un clima de convivencia escolar positivo, inclusivo y participativo que favorezca el desarrollo integral y el bienestar socioemocional de todos los estudiantes del establecimiento.',
    meta: `Al ${anioSiguiente}, disminuir en un 20% los casos de conflicto escolar registrados y aumentar en un 25% la participación estudiantil en actividades extracurriculares, medido a través del registro de convivencia y asistencia.`,
    estrategia: 'Fortalecimiento del plan de gestión de la convivencia escolar, con énfasis en la formación socioemocional, la resolución pacífica de conflictos y la promoción de la participación democrática.'
  },
  'gestion_recursos': {
    objetivo: 'Optimizar la gestión de los recursos humanos, financieros y educativos para asegurar las condiciones óptimas para el desarrollo del proceso de enseñanza-aprendizaje en el establecimiento.',
    meta: `Al ${anioSiguiente}, ejecutar el 95% del presupuesto PME de acuerdo a lo planificado y lograr un 90% de satisfacción del personal respecto a la disponibilidad y estado de los recursos educativos.`,
    estrategia: 'Implementación de un sistema de gestión de recursos eficiente y transparente, que articule las necesidades pedagógicas con la asignación presupuestaria y promueva una cultura de cuidado y buen uso de los recursos.'
  }
};

export const OBJETIVOS_METAS_POR_ESTABLECIMIENTO: Record<string, Record<string, ObjectiveMeta>> = {};
ESTABLECIMIENTOS.forEach(est => {
  OBJETIVOS_METAS_POR_ESTABLECIMIENTO[est] = JSON.parse(JSON.stringify(objetivosGenericos));
});

export const PLANES_NORMATIVOS: Record<string, any> = {
  "PME": {
    nombre: "Plan de Mejoramiento Educativo (PME)",
    objetivos: [
      "Mejorar la calidad de los aprendizajes de todos los estudiantes.",
      "Fortalecer las competencias de los docentes y directivos.",
      "Promover la convivencia escolar y la formación ciudadana.",
      "Optimizar el uso de los recursos para el logro de los objetivos."
    ]
  },
  "PIE": {
    nombre: "Programa de Integración Escolar (PIE)",
    objetivos: [
      "Asegurar el acceso y participación de estudiantes con Necesidades Educativas Especiales (NEE).",
      "Proporcionar apoyos especializados para el progreso en los aprendizajes de estudiantes con NEE.",
      "Promover estrategias de diversificación de la enseñanza en el aula.",
      "Fortalecer la colaboración entre docentes de aula regular y especialistas."
    ]
  },
  "PDC": {
    nombre: "Plan de Gestión de la Convivencia Escolar",
    objetivos: [
      "Promover un clima escolar positivo y de buen trato.",
      "Prevenir toda forma de violencia y acoso escolar.",
      "Desarrollar habilidades socioemocionales y de resolución pacífica de conflictos.",
      "Involucrar a toda la comunidad educativa en la promoción de la convivencia."
    ]
  },
  "PFC": {
    nombre: "Plan de Formación Ciudadana",
    objetivos: [
      "Fomentar el ejercicio de una ciudadanía crítica, responsable y participativa.",
      "Promover el conocimiento y respeto de los Derechos Humanos.",
      "Desarrollar la comprensión del sistema democrático y sus instituciones.",
      "Estimular la participación de los estudiantes en asuntos de interés público."
    ]
  },
  "PSI": {
      nombre: "Plan de Sexualidad, Afectividad y Género",
      objetivos: [
          "Promover una educación sexual integral y basada en el respeto.",
          "Desarrollar la afectividad y las relaciones interpersonales saludables.",
          "Fomentar la equidad de género y la prevención de la violencia de género.",
          "Entregar información científica y actualizada sobre sexualidad."
      ]
  }
};

export const ESTRUCTURA_EID: Dimension[] = [
  {
    id: 'liderazgo', nombre: 'Liderazgo', icon: 'Users', color: 'blue',
    subdimensiones: [
      { id: 'lid_sostenedor', nombre: 'Liderazgo del Sostenedor', estandares: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6'] },
      { id: 'lid_director', nombre: 'Liderazgo del Director', estandares: ['2.1', '2.2', '2.3', '2.4', '2.5'] },
      { id: 'plan_resultados', nombre: 'Planificación y Gestión de Resultados', estandares: ['3.1', '3.2', '3.3'] }
    ]
  },
  {
    id: 'gestion_pedagogica', nombre: 'Gestión Pedagógica', icon: 'BookOpen', color: 'pink',
    subdimensiones: [
      { id: 'ges_curricular', nombre: 'Gestión Curricular', estandares: ['4.1', '4.2', '4.3', '4.4', '4.5'] },
      { id: 'ges_aula', nombre: 'Enseñanza y aprendizaje en el aula', estandares: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6'] },
      { id: 'ges_apoyo', nombre: 'Apoyo al desarrollo de los estudiantes', estandares: ['6.1', '6.2', '6.3', '6.4', '6.5'] }
    ]
  },
  {
    id: 'formacion_convivencia', nombre: 'Formación y Convivencia', icon: 'Heart', color: 'orange',
    subdimensiones: [
      { id: 'formacion', nombre: 'Formación', estandares: ['7.1', '7.2', '7.3', '7.4', '7.5'] },
      { id: 'convivencia', nombre: 'Convivencia', estandares: ['8.1', '8.2', '8.3', '8.4', '8.5', '8.6'] },
      { id: 'part_democratica', nombre: 'Participación y Vida Democrática', estandares: ['9.1', '9.2', '9.3', '9.4', '9.5'] }
    ]
  },
  {
    id: 'gestion_recursos', nombre: 'Gestión de Recursos', icon: 'Settings', color: 'green',
    subdimensiones: [
      { id: 'ges_personal', nombre: 'Gestión de Personal', estandares: ['10.1', '10.2', '10.3', '10.4', '10.5'] },
      { id: 'ges_financieros', nombre: 'Gestión de Recursos Financieros', estandares: ['11.1', '11.2', '11.3', '11.4'] },
      { id: 'ges_educativos', nombre: 'Gestión de Recursos Educativos', estandares: ['12.1', '12.2', '12.3'] }
    ]
  }
];
