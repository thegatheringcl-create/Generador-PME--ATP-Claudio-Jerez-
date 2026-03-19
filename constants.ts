
export const dataMap = {
    "Liderazgo": ["Liderazgo del Sostenedor", "Liderazgo del Director", "Planificación y Gestión de Resultados"],
    "Gestión Pedagógica": ["Gestión Curricular", "Enseñanza y Aprendizaje en el Aula", "Apoyo al Desarrollo de los Estudiantes"],
    "Formación y Convivencia": ["Formación", "Convivencia", "Participación y Vida Democrática"],
    "Gestión de Recursos": ["Gestión del Personal", "Gestión de Recursos Financieros", "Gestión de Recursos Educativos"]
};

export enum Plan {
    FORMACION_CIUDADANA = "Plan de Formación Ciudadana",
    SEXUALIDAD_AFECTIVIDAD_GENERO = "Plan de Sexualidad, Afectividad y Género",
    GESTION_APOYO_INCLUSION = "Plan de Gestión y Apoyo a la Inclusión",
    DESARROLLO_PROFESIONAL_DOCENTE = "Plan de Desarrollo Profesional Docente",
    GESTION_CONVIVENCIA = "Plan de Gestión de la Convivencia",
    SEGURIDAD_ESCOLAR_PISE = "Plan Integral de Seguridad Escolar (PISE)"
}

export const objetivosNormativos = {
    [Plan.FORMACION_CIUDADANA]: [
        "a) Promover la comprensión y análisis del concepto de ciudadanía y los derechos y deberes asociados a ella, entendidos estos en el marco de una república democrática, con el propósito de formar una ciudadanía activa en el ejercicio y cumplimiento de estos derechos y deberes.",
        "b) Fomentar en los estudiantes el ejercicio de una ciudadanía crítica, responsable, respetuosa, abierta y creativa.",
        "c) Promover el conocimiento, comprensión y análisis del Estado de Derecho y de la institucionalidad local, regional y nacional, y la formación de virtudes cívicas en los estudiantes.",
        "d) Promover el conocimiento, comprensión y compromiso de los estudiantes con los derechos humanos reconocidos en la Constitución Política de la República y en los tratados internacionales suscritos y ratificados por Chile, con especial énfasis en los derechos del niño.",
        "e) Fomentar en los estudiantes la valoración de la diversidad social y cultural del país.",
        "f) Fomentar la participación de los estudiantes en temas de interés público.",
        "g) Garantizar el desarrollo de una cultura democrática y ética en la escuela.",
        "h) Fomentar una cultura de la transparencia y la probidad.",
        "i) Fomentar en los estudiantes la tolerancia y el pluralismo."
    ],
    [Plan.SEXUALIDAD_AFECTIVIDAD_GENERO]: [
        "(a) Reconocer y aceptar la identidad personal como seres sexuados y sexuales, considerando las características propias de cada etapa del ciclo vital.",
        "(b) Comprender que el ejercicio de la sexualidad debe ser libre, consciente y respetuoso, rechazando toda forma de coerción, violencia o discriminación.",
        "(c) Valorar el componente afectivo en las relaciones interpersonales, estableciendo vínculos basados en el respeto mutuo, la equidad, los derechos humanos y el bien común.",
        "(d) Establecer relaciones equitativas y respetuosas dentro del ámbito familiar y de pareja, promoviendo una comunicación efectiva, el cuidado mutuo y la corresponsabilidad, sin distinción de género ni edad.",
        "(e) Identificar y valorar las características y funciones del propio cuerpo, promoviendo una autoestima positiva, el autocuidado y la prevención de situaciones de abuso o violencia sexual.",
        "(f) Desarrollar pensamiento crítico frente a creencias, normas y conductas relacionadas con la sexualidad, adoptando actitudes positivas y responsables hacia el ejercicio de la sexualidad y las relaciones afectivas.",
        "(g) Tomar decisiones responsables respecto al ejercicio de la sexualidad, considerando su proyecto de vida y los riesgos asociados a embarazos no planificados, ITS y VIH/SIDA, mediante el conocimiento de mecanismos de prevención, transmisión y cuidado."
    ],
    [Plan.GESTION_APOYO_INCLUSION]: [
        "1. Garantizar condiciones de acceso, acogida y permanencia para todos los estudiantes, con especial atención a quienes presentan barreras al aprendizaje y la participación.",
        "2. Promover la interacción sistemática entre estudiantes diversos, asegurando su presencia significativa en todas las actividades pedagógicas y de vida escolar.",
        "3. Revisar y adaptar los instrumentos de gestión institucional (PEI, Reglamento Interno, Manual de Convivencia, Plan de Formación Ciudadana) para eliminar prácticas discriminatorias y favorecer una cultura de inclusión.",
        "4. Construir conocimiento integral, actualizado y contextualizado sobre cada estudiante, considerando su historia escolar, ritmos de aprendizaje, intereses, fortalezas, contexto socioafectivo y valoración subjetiva de su experiencia educativa.",
        "5. Fomentar procesos de reflexión crítica entre los equipos docentes y directivos que permitan identificar y cuestionar estereotipos, sesgos o prácticas de etiquetado que limiten las oportunidades de aprendizaje.",
        "6. Incorporar procedimientos y diagnósticos que valoren las potencialidades de los estudiantes, superando enfoques centrados en el déficit.",
        "7. Adaptar el currículum, metodologías y estrategias de enseñanza a la diversidad de ritmos, estilos, culturas, necesidades e intereses de los estudiantes, garantizando trayectorias de aprendizaje significativas y pertinentes.",
        "8. Incorporar la diversidad cultural, étnica, de género, religiosa, lingüística y territorial en los contenidos, proyectos y celebraciones escolares.",
        "9. Generar espacios sistemáticos de colaboración interdisciplinaria para la toma de decisiones pedagógicas y de convivencia en función de las trayectorias y contextos de los estudiantes.",
        "10. Diseñar e implementar protocolos inclusivos de atención a la diversidad, tales como: inducción de estudiantes nuevos, apoyo a estudiantes con bajo rendimiento, retención de estudiantes embarazadas o en situación de riesgo.",
        "11. Incorporar criterios inclusivos en la evaluación del aprendizaje, asegurando que ésta sea formativa, contextualizada y adaptada a los diferentes perfiles de los estudiantes.",
        "12. Promover procesos de autoevaluación institucional participativa que consideren el enfoque de inclusión en el marco del Ciclo de Mejoramiento Educativo.",
        "13. Generar condiciones para la implementación gradual y progresiva del enfoque inclusivo, articulando acciones de corto, mediano y largo plazo desde los planes anuales y estratégicos.",
        "14. Desarrollar acciones de formación continua dirigidas a todos los actores de la comunidad educativa para fortalecer sus capacidades inclusivas y su comprensión crítica de la diversidad."
    ],
    [Plan.DESARROLLO_PROFESIONAL_DOCENTE]: [
        "1. Fortalecer las competencias pedagógicas de los docentes para diseñar e implementar estrategias de enseñanza inclusivas, como el Diseño Universal para el Aprendizaje (DUA), que respondan a la diversidad del aula y promuevan el avance de todos los estudiantes.",
        "2. Desarrollar capacidades para el análisis crítico y reflexivo de la práctica docente, mediante instancias de observación de aula, coenseñanza y retroalimentación entre pares, favoreciendo un aprendizaje organizacional colaborativo.",
        "3. Consolidar el uso de evidencias pedagógicas (evaluaciones, planificaciones, resultados de aprendizaje, etc.) para identificar brechas de aprendizaje y ajustar las prácticas docentes en función de los objetivos del PME.",
        "4. Implementar comunidades profesionales de aprendizaje (CPA) que promuevan el diálogo pedagógico, la sistematización de experiencias y el desarrollo conjunto de soluciones a desafíos pedagógicos.",
        "5. Incorporar estrategias de evaluación formativa y retroalimentación efectiva como herramientas claves para mejorar la enseñanza y los aprendizajes en el aula.",
        "6. Fomentar el liderazgo pedagógico de los equipos directivos y técnicos, fortaleciendo sus capacidades para coordinar, monitorear y acompañar los procesos de desarrollo profesional.",
        "7. Ampliar el conocimiento disciplinar y curricular de los docentes, especialmente en aquellas áreas identificadas como críticas en el diagnóstico institucional y los resultados de aprendizaje de los estudiantes.",
        "8. Promover la utilización de recursos pedagógicos y tecnológicos pertinentes al contexto educativo, para enriquecer las estrategias didácticas y facilitar el aprendizaje autónomo y colaborativo de los estudiantes.",
        "9. Asegurar la planificación, implementación y evaluación sistemática de las actividades de desarrollo profesional, considerando la disponibilidad de recursos, el calendario escolar y las prioridades institucionales.",
        "10. Evaluar el impacto del plan de desarrollo profesional en los aprendizajes de los estudiantes, mediante mecanismos formativos, sumativos y de resultados, ajustando las estrategias cuando sea necesario."
    ],
    [Plan.GESTION_CONVIVENCIA]: [
        "1. Fomentar una convivencia basada en el respeto y el buen trato entre todos los miembros de la comunidad educativa, promoviendo ambientes afectivos, seguros y propicios para el aprendizaje y desarrollo personal.",
        "2. Promover una cultura escolar inclusiva, valorando la diversidad y asegurando el respeto irrestricto por la dignidad de cada persona.",
        "3. Desarrollar una participación democrática y colaborativa en la vida escolar, fortaleciendo el sentido de pertenencia, corresponsabilidad y ciudadanía activa.",
        "4. Favorecer la resolución dialogada y pacífica de los conflictos, mediante la implementación de estrategias preventivas y restaurativas.",
        "5. Articular el PGCE con los principales instrumentos de gestión institucional, promoviendo una visión coherente, sistémica y formativa de la convivencia escolar.",
        "6. Fortalecer las capacidades del equipo de convivencia escolar y del conjunto de la comunidad educativa, para gestionar de manera efectiva los procesos asociados a la convivencia."
    ],
    [Plan.SEGURIDAD_ESCOLAR_PISE]: [
        "Desarrollar una cultura de autocuidado y prevención de riesgos.",
        "Implementar y difundir protocolos de actuación ante emergencias.",
        "Asegurar condiciones de seguridad en la infraestructura y equipamiento.",
        "Capacitar a la comunidad educativa en primeros auxilios y seguridad."
    ]
};
