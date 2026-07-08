import { StandardData } from '../types';

export const DATA_ESTANDARES: Record<string, StandardData> = {
  // ==========================================
  // DIMENSIÓN: LIDERAZGO
  // ==========================================
  "1.1": {
    id: "1.1",
    nombre: "Responsabilidad del Sostenedor sobre PEI, desempeño y normativa.",
    descripcion: "EL SOSTENEDOR SE RESPONSABILIZA POR EL DESARROLLO DEL PROYECTO EDUCATIVO INSTITUCIONAL, EL DESEMPEÑO Y EL CUMPLIMIENTO DE LA NORMATIVA VIGENTE DE LOS ESTABLECIMIENTOS A SU CARGO.",
    problemasDebil: [
      "El sostenedor no da cuenta pública anual o entrega resultados incorrectos.",
      "Rara vez visita los establecimientos ni supervisa el PEI o normativa."
    ],
    problemasIncipientes: [
      "El Proyecto Educativo es vago y orienta débilmente el quehacer.",
      "Las cuentas públicas son incompletas y la visita o supervisión es ocasional."
    ],
    criteriosSatisfactorios: [
      "Asume responsabilidad final y da cuenta pública anual general de resultados.",
      "Visita periódicamente para supervisar el desempeño (PEI, Simce, matrícula)."
    ],
    situacionesAvanzado: [
      "Institucionaliza procedimientos y publica documentos completos sobre desempeño anual.",
      "Monitorea constantemente indicadores extra (convivencia, exalumnos, encuestas)."
    ]
  },
  "1.2": {
    id: "1.2",
    nombre: "Distribución de funciones de apoyo centralizadas y delegadas.",
    descripcion: "EL SOSTENEDOR DEFINE FORMALMENTE LAS FUNCIONES QUE ASUMIRÁ CENTRALIZADAMENTE Y AQUELLAS QUE DELEGARÁ A LOS EQUIPOS DIRECTIVOS.",
    problemasDebil: [
      "No define funciones de anticipación ni los recursos financieros.",
      "Se producen confusiones y no cumple la entrega de recursos comprometidos."
    ],
    problemasIncipientes: [
      "Define recursos delegados pero de forma tardía o no documentada.",
      "El apoyo entregado presenta vacíos o duplicación de funciones de gestión."
    ],
    criteriosSatisfactorios: [
      "Define anticipadamente por escrito los recursos delegados y el apoyo centralizado.",
      "Entrega los recursos y el apoyo en los plazos estipulados de forma oportuna."
    ],
    situacionesAvanzado: [
      "Equipos directivos y sostenedor revisan y evalúan periódicamente (semestralmente) la delegación de funciones.",
      "Se anticipa a las necesidades comprometiendo fondos y humanos proactivamente."
    ]
  },
  "1.3": {
    id: "1.3",
    nombre: "Comunicación de altas expectativas, metas e incentivación.",
    descripcion: "EL SOSTENEDOR COMUNICA ALTAS EXPECTATIVAS A LOS DIRECTORES, LES ESTABLECE METAS DESAFIANTES Y EVALÚA SU DESEMPEÑO.",
    problemasDebil: [
      "Fija metas de bajo impacto y tolera resultados deficientes sin exigir mejoras.",
      "No establece plazos, produce micromanejo o no evalúa el desempeño del director."
    ],
    problemasIncipientes: [
      "Sus expectativas son altibajas, y las metas no contemplan todas las áreas.",
      "Existen confusiones en el espacio de autonomía de directores; evaluaciones irregulares."
    ],
    criteriosSatisfactorios: [
      "Motiva a directores y establece en convenio de desempeño metas desafiantes en plazos definidos.",
      "Garantiza claridad en el rol y autonomía directiva, retroalimentando anualmente."
    ],
    situacionesAvanzado: [
      "Promueve la excelencia y el liderazgo, estableciendo metas intermedias.",
      "Ajusta los roles según necesidades detectadas y propone planes de mejora continua."
    ]
  },
  "1.4": {
    id: "1.4",
    nombre: "Implementación oportuna de cambios estructurales vitales.",
    descripcion: "EL SOSTENEDOR INTRODUCE DE MANERA OPORTUNA LOS CAMBIOS ESTRUCTURALES NECESARIOS PARA ASEGURAR LA VIABILIDAD DEL ESTABLECIMIENTO.",
    problemasDebil: [
      "No advierte riesgos internos ni externos; omite la consulta al Consejo Escolar.",
      "Implementa cambios irreflexivos que ponen en riesgo al establecimiento o su viabilidad."
    ],
    problemasIncipientes: [
      "Reacciona tardíamente ante problemas como la caída de matrícula o desfinanciamiento.",
      "Instaura medidas que solo alivian crisis superficialmente sin informar debidamente."
    ],
    criteriosSatisfactorios: [
      "Identifica tempranamente pérdidas y riesgos (financieros o académicos), consultando al Consejo Escolar.",
      "Efectúa cierres, fusiones o giros requeridos asegurando comunicación transparente con todos."
    ],
    situacionesAvanzado: [
      "Prepara con anticipación los cambios mayores, buscando tendencias internacionales eficaces.",
      "Logra comprensión y participación profunda en las bases durante transiciones delicadas."
    ]
  },
  "1.5": {
    id: "1.5",
    nombre: "Generación de canales fluidos de comunicación con la red y el estado.",
    descripcion: "EL SOSTENEDOR GENERA CANALES FLUIDOS DE COMUNICACIÓN CON LOS DIRECTORES Y COMUNIDADES EDUCATIVAS, Y CON INSTITUCIONES DEL ESTADO.",
    problemasDebil: [
      "Es inubicable y comunica nulas directrices claras durante crisis institucionales.",
      "Ignora mandatos e instituciones ministeriales, y no acuerda protocolos de comunicación base."
    ],
    problemasIncipientes: [
      "Sus respuestas a emergencias llegan tardiamente agravando el pánico o frustración.",
      "Mantiene una comunicación laxa fallando en articular y unificar discursos ante la autoridad."
    ],
    criteriosSatisfactorios: [
      "Visita, responde, sostiene canales de reportabilidad expeditos con docentes y apoderados.",
      "Articula sinérgicamente con Mineduc, Seremi y Superintendencia y responde citaciones prestamente."
    ],
    situacionesAvanzado: [
      "Prioriza reuniones en terreno, instala canales modernos e intercambios directos.",
      "Visita y experimenta la realidad local, mejorando la operatividad de sus enlaces institucionales."
    ]
  },
  "1.6": {
    id: "1.6",
    nombre: "Aseguramiento del funcionamiento en red o mediante redes conjuntas.",
    descripcion: "EL SOSTENEDOR SE ASEGURA DE QUE LOS ESTABLECIMIENTOS A SU CARGO FUNCIONEN EN RED, PROCURANDO ESTABLECER ALIANZAS CON OTROS SIMILARES.",
    problemasDebil: [
      "Aíslan la escuela y desaprovechan vínculos pedagógicos territoriales.",
      "Pierden economías de escala conjuntas por carencia u omisión de pactos interescolares."
    ],
    problemasIncipientes: [
      "Efectúa compras masivas con otros bajo simple ahorro omitiendo ejes de capacitación y perfeccionamiento.",
      "Intercambia esporádicamente acciones pedagógicas sin sentar una trazabilidad profunda."
    ],
    criteriosSatisfactorios: [
      "Sistematiza reuniones conjuntas inter-escuelas unificando buenas prácticas y recursos didácticos.",
      "Gestiona beneficios administrativos: capacitaciones centralizadas, licitaciones magnas o asesorías legales grupales."
    ],
    situacionesAvanzado: [
      "Institucionaliza redes informáticas y de cooperación que superan a los individuos liderantes.",
      "Monitorea el logro que estas mega alianzas otorgan verificando mejoras tangibles para el PEI."
    ]
  },
  
  // Liderazgo del Director
  "2.1": {
    id: "2.1",
    nombre: "Foco en resultados académicos y liderazgo pedagógico del director.",
    descripcion: "EL DIRECTOR CENTRA SU GESTIÓN EN EL LOGRO DE LOS OBJETIVOS ACADÉMICOS Y FORMATIVOS DEL ESTABLECIMIENTO, Y SE RESPONSABILIZA POR SUS RESULTADOS.",
    problemasDebil: [
      "Destina casi todo el tiempo a temas puramente administrativos y está desconectado del aula.",
      "No protege los tiempos de enseñanza, permitiendo interrupciones o cambios de focos diarios."
    ],
    problemasIncipientes: [
      "Planifica pero fracasa ejecutando, delegando excesivamente sus seguimientos curriculares.",
      "Brinda informes muy limitados a la comunidad educativa centrados solo en éxitos breves."
    ],
    criteriosSatisfactorios: [
      "Destina la mayor parte de su tiempo priorizando la vigilancia del aprendizaje formativo.",
      "Distribuye tiempos y funciones dando cuenta cabal de los indicadores internos y externos a su sostenedor."
    ],
    situacionesAvanzado: [
      "Se documenta perpetuamente y difunde el estado del manual en investigación de nuevas prácticas mundiales.",
      "Presenta informes modélicos de alta fiabilidad evidenciando la evolución de todas sus áreas directivas."
    ]
  },
  "2.2": {
    id: "2.2",
    nombre: "Conducción efectiva del funcionamiento general formativo.",
    descripcion: "EL DIRECTOR CONDUCE DE MANERA EFECTIVA EL FUNCIONAMIENTO GENERAL DEL ESTABLECIMIENTO.",
    problemasDebil: [
      "Ausencia de un trabajo conjunto, falta exigencia del cumplimiento y prima la lentitud gerencial.",
      "Toma de decisiones extremadamente reaccionaria que margina los problemas vitales hasta una crisis."
    ],
    problemasIncipientes: [
      "Delega el grueso sin supervisar resultados, o comunica la política institucional sin persuadir motivación.",
      "Tarda en advertir desviaciones de procesos que funcionaban inicialmente."
    ],
    criteriosSatisfactorios: [
      "Convoca, aúna y transparenta mediante metas públicas un seguimiento con toda la directiva de apoyo.",
      "Posee alta capacidad mediadora, detecta urgencias rápidamente y soluciona asertivamente nudos operativos."
    ],
    situacionesAvanzado: [
      "Anticipa los obstáculos y firma hitos de compromiso concretos con apoderados o docentes implicados.",
      "Institucionaliza y delega efectivamente áreas permitiendo un ecosistema preventivo proactivo."
    ]
  },
  "2.3": {
    id: "2.3",
    nombre: "Cultura de altas expectativas frente a la comunidad escolar.",
    descripcion: "EL DIRECTOR INSTAURA UNA CULTURA DE ALTAS EXPECTATIVAS Y MOVILIZA A LA COMUNIDAD EDUCATIVA HACIA LA MEJORA CONTINUA.",
    problemasDebil: [
      "Actúa complacientemente atrubuyendo siempre el mal rindo a cunas socioculturales estigmatizadas.",
      "Presenta resignación y victimismo ante un grupo vulnerable sin intentar quebrar sus paradigmas."
    ],
    problemasIncipientes: [
      "Da mensajes retóricos de autosuperación que carecen de prácticas exigentes aplicadas día a día.",
      "Atiende problemáticas vistosas y obvia buscar los fallos continuos de la malla sistémica interna."
    ],
    criteriosSatisfactorios: [
      "Cree fehacientemente en lograr saltos pedagógicos integrando metas ambiciosas y premiando progresos.",
      "Transmite convicción constante y prioriza atacar de raíz las deficiencias pedagógicas del alumnado base."
    ],
    situacionesAvanzado: [
      "Implanta planes integrales como ferias de talento y charlas exitosas con egresados inspiracionales.",
      "Articula que todo el sistema hable en positivo sobre el avance, cimentando una tenacidad admirable grupal"
    ]
  },
  "2.4": {
    id: "2.4",
    nombre: "Instauración del compromiso profesional en el profesorado.",
    descripcion: "EL DIRECTOR INSTAURA EN EL PERSONAL UNA CULTURA DE COMPROMISO Y COLABORACIÓN CON LA TAREA EDUCATIVA.",
    problemasDebil: [
      "Tolerancia al ausentismo, el aislamiento de docentes en sus islas sin trabajo colaborativo cruzado.",
      "Los consejos o reuniones son netamente secretarios, aburridos sin tocar temas didácticos de fondo."
    ],
    problemasIncipientes: [
      "Baja consistencia en exigir mejoras metodológicas e intercambios sólo puntuales u obligados.",
      "Solo algunos estamentos logran sinergia en pro del estudiante sin lograr estandarizar en todo el bloque."
    ],
    criteriosSatisfactorios: [
      "Instala dinámicas seguras y permanentes de coevaluación y construcción didáctica entre pares.",
      "Se reconoce el mérito de educadores proactivos y crea un verdadero sistema colaborativo empático."
    ],
    situacionesAvanzado: [
      "Cuenta con redes virtuales (plataformas) plenas para intercambio profundo de acervos didácticos intraescuela.",
      "Brinda autonomías y presupuestos a la experimentación innovadora elevando el prestigio técnico personal."
    ]
  },
  "2.5": {
    id: "2.5",
    nombre: "Ambiente cultural y académicamente estimulante.",
    descripcion: "EL DIRECTOR INSTAURA UN AMBIENTE CULTURAL Y ACADÉMICAMENTE ESTIMULANTE.",
    problemasDebil: [
      "Recinto parco y aburrido donde sólo prima transcribir, ausente de matices artísticos o literarios expansivos.",
      "Conversaciones meramente burocráticas minimizando discusiones literarias, científicas o sociales nutridas."
    ],
    problemasIncipientes: [
      "Aplica pinceladas en efemérides pero carece de mantención activa; pasillos vacíos de trabajo escolar rico.",
      "Rutas de intercambio frívolo y ocasional, sin fomento asiduo al debate profundo con pupilos o guías."
    ],
    criteriosSatisfactorios: [
      "Revitaliza las dependencias con exposiciones ricas, certámenes literarios y clubes forjadores temáticos constantes.",
      "Informa temas vigentes, motiva visitas, invita figuras a expander fronteras académicas."
    ],
    situacionesAvanzado: [
      "Consolida pactos con recintos culturales externos y difunde alta apropiación identitaria literaria.",
      "Genera redes de podcast y diarios interactivos propios, anclando a toda la comunidad en un fervor creativo constante."
    ]
  },

  // Planificación y Gestión de Resultados
  "3.1": {
    id: "3.1",
    nombre: "Elaboración reflexiva de un plan de mejoramiento escolar guiado por el PEI.",
    descripcion: "EL DIRECTOR ELABORA UN PLAN DE MEJORAMIENTO DE ACUERDO CON EL PROYECTO EDUCATIVO INSTITUCIONAL.",
    problemasDebil: [
      "No existe un PME real, todo es reactivo y operado bajo el azar. Autoevaluación informal por capricho directivo.",
      "Plantamientos o intenciones sin plazos, metas abstractas infundadas irreales, nadie rinde metas concretas."
    ],
    problemasIncipientes: [
      "Autodiagnósticos parciales obviando indicadores de desarrollo y solo midiendo escasa estadística.",
      "Confeccionan PEI con ciertos índices de medición pero limitados y apartan de consulta a los consejos."
    ],
    criteriosSatisfactorios: [
      "Ejecuta autoevaluación formal, integra balances Simce, personal, convivencia; derivando un PME sensato, medible.",
      "Genera tablas y delega responsabilidades con tiempo y un presupuesto nítido preacordado de consulta a consejos."
    ],
    situacionesAvanzado: [
      "Emplea tableros de gestión sofisticados (Dashboards), cruza Big-data educacional aplicando técnica FODA precisa.",
      "Documenta e institucionaliza los períodos de levantamiento participativo masivo."
    ]
  },
  "3.2": {
    id: "3.2",
    nombre: "Monitoreo y evaluación del grado de avance del plan e inserción de medidas ajustativas.",
    descripcion: "EL DIRECTOR MONITOREA LA IMPLEMENTACIÓN DEL PLAN DE MEJORAMIENTO, EVALÚA EL CUMPLIMIENTO DE METAS Y REALIZA ADECUACIONES.",
    problemasDebil: [
      "No lo asumen. El PME es un documento para archivo. Carecen de revisión semestral o anual formativa.",
      "Las acciones planificadas cambian violentamente perdiendo todo el sentido macro original del escrito."
    ],
    problemasIncipientes: [
      "Atienden únicamente algunas metas muy evidentes y reaccionan erráticamente debilitando lo exigido.",
      "Evalúan anualmente mediante meras percepciones y lo infirman pobre o sesgadamente al equipo general."
    ],
    criteriosSatisfactorios: [
      "Observan y reportan en ruta mensual o trimestral, corrigen déficits in situ salvaguardando recursos inamovibles.",
      "Divulgan oficialmente si los logros del PME van acordes a calendario o si se retrasaron analizando los escollos."
    ],
    situacionesAvanzado: [
      "Establecen rendición expedita periódica cruzando la evidencia con los encargados tácticos para reformular de base todo error material palpable, informando con gráficos potentes sobre qué ha escalado y porqué."
    ]
  },
  "3.3": {
    id: "3.3",
    nombre: "Sistematización y correlación continua de datos relevantes para directrices.",
    descripcion: "EL DIRECTOR Y EL EQUIPO DIRECTIVO SISTEMATIZAN CONTINUAMENTE LOS DATOS RELEVANTES DE LA GESTIÓN ESCOLAR Y LOS UTILIZAN.",
    problemasDebil: [
      "Información disgregada manual con extravíos vitales impidiendo dar luces al seguimiento.",
      "El instinto intuitivo reemplaza crónicamente al dato empírico frente a apuros formativos."
    ],
    problemasIncipientes: [
      "Colección central de algunas áreas (sólo notas), omitiendo variables exógenas e informes socioemocionales de gran influjo.",
      "No existe analítica. Poseen las cifras pero no las correlacionan adecuadamente limitando la predicción o mejora."
    ],
    criteriosSatisfactorios: [
      "Las carpetas digitales reúnen matrículas, repitencias, informes MINEDUC, encuestas focales de satisfacción, promedios SIMCE y retención vitalizando con gráficos un panorama del año integralmente cruzado para aplicar focos remediales preclaros."
    ],
    situacionesAvanzado: [
      "Bases de datos pulidas y depuradas, midiendo variables colaterales amplias. Comparan sus matrices con referentes externos modelo evaluando qué faltó, emitiendo recomendaciones y divulgando de manera prístina hallazgos cruciales."
    ]
  },

  // ==========================================
  // DIMENSIÓN: GESTIÓN PEDAGÓGICA
  // ==========================================
  // Gestión Curricular
  "4.1": {
    id: "4.1",
    nombre: "Diseño, implementación y monitoreo curricular según normativas Bases nacionales.",
    descripcion: "COORDINAN LA IMPLEMENTACIÓN EFECTIVA DE LAS BASES CURRICULARES Y PROGRAMAS DE ESTUDIO.",
    problemasDebil: [
      "Las horas lectivas están trazadas bajo meros encajes horarios del profesor y obvian la priorización alumno.",
      "Desconocimiento total de las pautas del ministerio en base a apoyos vetustos de manuales o guías de mercado."
    ],
    problemasIncipientes: [
      "Hay esbozos de revisión en ciertos ramos pero omiten arte, historia, música y otros donde no recae el test Simce.",
      "No supervisan las coberturas programadas dejando brechas letales a fin de año en aprendizajes centrales."
    ],
    criteriosSatisfactorios: [
      "Organiza bloques de estudio razonables con el cansancio cognitivo y se ciñe a exigencias Mineduc actualizadas profundas.",
      "Garantizan el empoderamiento del currículum al educador y establecen hojas de ruta (cobertura) mes a mes auditando los OA ganizados versus los trazados de la malla."
    ],
    situacionesAvanzado: [
      "Instrumental superior como Gantt dinámicas cruzando las redes entre maestros promoviendo interdisciplinareidad rotunda anual."
    ]
  },
  "4.2": {
    id: "4.2",
    nombre: "Transmisión y control formal de lineamientos comunes entre la docencia.",
    descripcion: "ACUERDAN CON LOS DOCENTES LINEAMIENTOS PEDAGÓGICOS COMUNES PARA LA EFECTIVIDAD DEL CURRÍCULUM.",
    problemasDebil: [
      "Incoherencia absoluta, docentes parcelan metodologías, de modo que pasar de un ciclo al superior implica desconcierto absoluto del alumno frente al formato laboral en las tareas, lecturas o pruebas."
    ],
    problemasIncipientes: [
      "Se imparten reglamentos didácticos verbales y difusos, de manera que la base en Lenguaje cumple, mas en Ciencias aplican algo abismalmente distante para resolver el conflicto sin existir una transversalidad en cómo desarrollar el aprender global del infante allí dentro."
    ],
    criteriosSatisfactorios: [
      "Pactan acuerdos en ejes magnos: Método lector unificado, políticas de indagación o guías de pruebas uniformes donde lo común trasciende al individuo e incorpora un estilo propio de casa matriz."
    ],
    situacionesAvanzado: [
      "Cuentan con bitácoras manuales explícitas de casa; innovación metódica, investigación entre bloques docentes por sobre la media aplicando dinámicas cruzadas y TIC avanzadas de consenso en un 100%."
    ]
  },
  "4.3": {
    id: "4.3",
    nombre: "Gestión sistemática y supervisión de las planificaciones del aula.",
    descripcion: "EL EQUIPO DIRECTIVO GESTIONA LA ELABORACIÓN DE PLANIFICACIONES QUE CONTRIBUYEN A LA CONDUCCIÓN EFECTIVA DE LOS PROCESOS.",
    problemasDebil: [
      "Clases azarosas improvisadas por inasistencia de programaciones escritas; ignorancia a lo preaprendido saltando al vacío y causando desajuste y desgano.",
      "UTP firma sin cuestionar o revisar perdiendo totalmente el insumo."
    ],
    problemasIncipientes: [
      "Ausencia de estandarización calendárica dejando unidades sin anclajes lógicos. Exclusión de métodos de evaluación de calidad en las cartas elaboradas, retrocesos por mera supervisión aleatoria somera."
    ],
    criteriosSatisfactorios: [
      "Conducción y exigencia férrea en el encuadre temporo-espacial donde los Aprendizajes Claves se ciñen y los docentes ajustan planillas por bloque; retroalimentaciones de UTP donde guían y mejoran profundamente cada deficiencia programada para su inmediata mejora de foco real y asertivo antes del aula propiamente tal."
    ],
    situacionesAvanzado: [
      "Modelación hiper-organizada generando planes macro de áreas múltiples, intercambio y foros cruzados permitiendo mentoraje al practicante y fortaleciendo a todo el ciclo de una visión compartida pre-impartición de unidades base conjuntas."
    ]
  },
  "4.4": {
    id: "4.4",
    nombre: "Monitoreo y acompañamiento asertivo al docente en aula para la optimización.",
    descripcion: "ACOMPAÑAN A LOS DOCENTES MEDIANTE LA OBSERVACIÓN Y RETROALIMENTACIÓN DE CLASES.",
    problemasDebil: [
      "Ausencia de observación in situ. Clima inquisidor y peyorativo si la visitan, socavando el pilar empático formador."
    ],
    problemasIncipientes: [
      "Esporádicas y vagas vistas panorámicas sin focus en un área débil o fallida, sin reflexiones al final, lo cual vuelve inocua a la evaluación e infiere desorientación táctica futura para solucionar déficits arraigados del método enseñado al chico allí sentado."
    ],
    criteriosSatisfactorios: [
      "Acuerdos y pautas (como MBP) previas, se ejecutan observaciones intensivas o relámpago focalizadas apoyando las debilidades y cimentando un diálogo post-visita rico en crítica constructiva documentando mejoras medibles pactadas individual y amablemente."
    ],
    situacionesAvanzado: [
      "Generan filmaciones consentidas del aula. Usan profesores modelos para mentorear deficiencias (cuestores), anidando en una escuela viva autocrítica pero altamente profesional e incisivamente autoexigente sin fricciones, cultivando una empatía técnica fenomenal transversal en el grupo formativo del lugar en sí."
    ]
  },
  "4.5": {
    id: "4.5",
    nombre: "Dirección asertiva del sistema general escolar de evaluación y sus implicancias tácticas.",
    descripcion: "COORDINAN UN PROCESO EFECTIVO DE EVALUACIÓN Y MONITOREO DE LOS APRENDIZAJES PARA LA TOMA DE DECISIONES.",
    problemasDebil: [
      "Descoordinación temporal colapsando al alumno (5 pruebas en dos días). Ciego en análisis táctico de las brechas finales sin re-articulación."
    ],
    problemasIncipientes: [
      "Agendamientos precarios sin foco normativo y donde los datos recabados en los semestres se obvian y si son aplicados es en remediales vagos pre-Simce y carentes del análisis base para reconducir a alumnos lentos en los tiempos indicados de rigor al fallo del infante allí existente y a ser solventado pronto en sí."
    ],
    criteriosSatisfactorios: [
      "Excelente distribución calendárica notificada a padres y apoderados, se evitan errores de prueba gracias a revisión técnica de ítemes y se toman las actas métricas evaluando y cruzando variables para redestinar tiempo de clase, cambiar método enseñado o implementar un remedial con apoyo externo a la brevedad si procediese para un caso grave reportado del cruce de datos así."
    ],
    situacionesAvanzado: [
      "Las familias son partícipes del proceso formándolas como ente responsable paralelo para fomentar avance externo al bloque horario, los indicadores detectados son transparentados generando programas sistematizados locales exitosos para apalear crisis con plataformas robustas en línea automatizando métricas de forma sobresalientemente rápida para solventar."
    ]
  },

  // Enseñanza y Aprendizaje
  "5.1": {
    id: "5.1",
    nombre: "Direccionamiento central en las metas aludidas explícitas de la currícula.",
    descripcion: "LOS DOCENTES CENTRAN SUS CLASES EN LOS OBJETIVOS DE APRENDIZAJE ESTIPULADOS, CON MANEJO RIGUROSO.",
    problemasDebil: [
      "Clases desvinculadas de la métrica Base; graves errores referenciales que arrastran de concepto e invalidan todo esfuerzo cognitivo futuro enseñado allí y confunden gravemente al infante con imprecisiones mayúsculas de corte fundacional didáctico en su formación respectiva de aquel entonces en sí mismo y la disciplina impartida allí propiamente."
    ],
    problemasIncipientes: [
      "Poco rigor. Se salta partes. Se dictan pero se dejan en abandono. El docente duda de sí mismo en tópicos algo difíciles generando brechas obvias de foco inestable en los estudiantes ante el objetivo final aludido al principio de base para esa unidad de la semana curricular indicada."
    ],
    criteriosSatisfactorios: [
      "Dominio férreo, clase con una fluidez técnica impecable guiando, moldeando, parcelando la materia idóneamente de forma precisa de modo tal que las interacciones del alumnado evidencian dominio propio de la habilidad propuesta. Rigor que amolda cada objetivo a situaciones conectivas claras de conocimiento al alumno dictado así integralmente."
    ],
    situacionesAvanzado: [
      "Logran la transferencia multidimensional asombrosa, simplificando complejísimas habilidades a nivel comprensible primario y conectándolas a saberes exógenos dando un crisol fenomenal del conocimiento global. Estudiantes elaboran conexiones por sí solos activamente."
    ]
  },
  "5.2": {
    id: "5.2",
    nombre: "Tácticas estimulantes, activas e inductivas eficaces de la enseñanza in situ.",
    descripcion: "LOS DOCENTES USAN ESTRATEGIAS EFECTIVAS DE ENSEÑANZA-APRENDIZAJE PARA EL LOGRO DE LOS OBJETIVOS.",
    problemasDebil: [
      "Dictado árido de monólogo; pasividad sepulcral en bancos, asilamiento y limitación del análisis cerebral con clases fútiles nulas de cierre que no resumen o comprueban si hubo aprendizaje real mínimo en esa hora invertida."
    ],
    problemasIncipientes: [
      "Moderan y explican narrando levemente interactivamente pero abusando de guías fácticas y ejercicios memorísticos en la pizarra carentes de un anclaje vivencial que permita integrar con fuerza la conceptualidad vista en base de cierre muy simple inoficioso."
    ],
    criteriosSatisfactorios: [
      "Generan controversia, uso de esquematizaciones fuertes y debaten. El niño procesa cognitivamente investigando o escribiendo respuestas que consolidan su pensamiento propio. Exigencia continua de tareas activas variando de ritmo logrando cierres que resumen los hitos angulares de cada encuentro dictatorial de enseñanza."
    ],
    situacionesAvanzado: [
      "Estrategias tipo clase-invertida, debates encendidos o foros argumentativos, proyectos de largo espectro sumatorio a lo teórico, uso masivo y excelso de elementos multimodales atrayentes donde los jóvenes se sumergen, critican y lideran la asimilación global reflexiva y propositiva del material enseñado a un nivel soberbio total allí expuesto de gran valor final."
    ]
  },
  "5.3": {
    id: "5.3",
    nombre: "Forja incisiva de vínculos socio afectivos positivos para amparar el aprender.",
    descripcion: "LOS DOCENTES ESTABLECEN VÍNCULOS PEDAGÓGICOS POSITIVOS Y GENERAN MOTIVACIÓN POR LA ASIGNATURA.",
    problemasDebil: [
      "Muecas irritadas, indiferencia con rezagados, burla, y un clima hostil soporífero desprovisto de motivación, o sea, los jóvenes duermen o se angustian frente al docente en clases letárgicas o amenazantes puramente punitivas inútilmente fallidas."
    ],
    problemasIncipientes: [
      "Apatía evidente en tópicos donde se lee textual pero interacciones tibias sin llegar a cautivar y diferencias injustas con quienes rinden menos y desvío de interés atencional crónico marcado durante las explicaciones básicas de la sala de cátedra base habitual rutinaria."
    ],
    criteriosSatisfactorios: [
      "Transmite pasión por los datos de ramos impartidos cautivando mediante anécdotas o humor idóneo asertivo propiciando relaciones inclusivas profundas atentas respondiendo inclusivamente, marcando ritmo asertivo vigoroso, empatizando pero sin soltar el norte disciplinar del foco general guiado con respeto pleno e irrestricto valorativo de cada actor presente allí mismo siempre de manera constante en la unidad descrita."
    ],
    situacionesAvanzado: [
      "El maestro se vuelve referente de admiración y un estandarte; crea y experimenta y trae expertos ajenos forjando salidas a zonas o un bagaje inmenso que apasiona al estudiante a buscar más contenido en su hora libre porque valora inconmensurablemente la materia del aula misma impartida integral y formativamente genial ahí mismo."
    ]
  },
  "5.4": {
    id: "5.4",
    nombre: "Acompañamiento integral, feedback y medición sumativa-formativa perenne.",
    descripcion: "LOS DOCENTES MONITOREAN EL APRENDIZAJE DE SUS ESTUDIANTES Y LES ENTREGAN RETROALIMENTACIÓN CONSTANTE.",
    problemasDebil: [
      "Abandonan la atención dictando sólo el papel, ausencia de pautas o rúbricas de ayuda impidiendo que asimile la validez de cómo él hizo las cosas, reprenden, no valoran éxitos generando apatía endémica fatal sin medir progresión intrínseca real."
    ],
    problemasIncipientes: [
      "Miran de lejos sin interactuar del todo a todos por igual deteniéndose solo en problemas supremos, alaban poco lo merecedor frente a los reincidentes bajos logrando nulos avances al obviar el progreso modesto paulatino e importante también exigidamente aquí mismo de manera superficial esporádicamente ocasional y pobre así vista generalmente en la labor diaria."
    ],
    criteriosSatisfactorios: [
      "Detecta precozmente y circula, asiste induciendo la autoexplicación o rectificación, elogia al esfuerzo personal sostenido y entrega retroalimentación individual y minuciosa marcando de buena fe los rumbos a ajustar y dotándoles rúbricas clarificantes pre-test u obra entregada."
    ],
    situacionesAvanzado: [
      "Anotación metódica asombrosa usando matrices propias corrigiendo ensayos marcando el margen constructivo motivante de cada joven y celebrándolo inclusivamente ante sus mentores directos de casa elevando su autoestima escolar por sobre el nivel y fortaleciendo enormemente su autoimagen en pos del afán formativo estricto globalizado."
    ]
  },
  "5.5": {
    id: "5.5",
    nombre: "Responsabilización estudiantil incisiva y fomentación del estudio no tutorado.",
    descripcion: "LOS DOCENTES SE ASEGURAN DE QUE TODOS SUS ESTUDIANTES TRABAJEN EN CLASES Y PROMUEVEN EL ESTUDIO INDEPENDIENTE.",
    problemasDebil: [
      "Descontrol y distracciones. Permisividad ante copiado o desgano fatal; se exime al niño de responsabilidad dándole plazos absurdos premiando al holgazán afectando a toda la célula formativa escolar negativamente sin remedio alguno al respecto."
    ],
    problemasIncipientes: [
      "Se trabaja parcialmente o solo en ratos por imposiciones del docente, pocas interpelaciones autónomas del material obligando al alumno a pensar sin apoyos, perdonazos injustos limitando su rigor exigido o la capacidad formativa responsable de su madurez mental propia."
    ],
    criteriosSatisfactorios: [
      "Exigencia implacable positiva del seguimiento y enfoque total del quehacer; enseñanza de mapas, lectura propia y técnicas de acervo intelectual logrando pulir estudiantes comprometidos contra retrasos plagiados u holgazanerías bajo reglas intachablemente formales pero motivadoras que encauzan de lleno al muchacho."
    ],
    situacionesAvanzado: [
      "Acuerdos unificadores en todos donde la máquina funciona automática con pupilos dedicados indagando por su cuenta, elaborando sin exigencias imperantes ya internalizando la disciplina y premiándoles con autonomía por mérito excepcional constante fomentado e instituido férreamente allí mismo todo el tiempo por él."
    ]
  },
  "5.6": {
    id: "5.6",
    nombre: "Optimización y administración férrea del espacio cronológico lectivo basal.",
    descripcion: "LOS DOCENTES HACEN USO EFECTIVO DEL TIEMPO DE CLASES PARA QUE ESTE SE DESTINE AL PROCESO DE ENSEÑANZA.",
    problemasDebil: [
      "Interrupciones perversas al aprendizaje. El teléfono suena o charlan, clases nulas de control o disociación. Rutinas burocráticas abismales para tomar base asfixiando hasta treinta minutos de inicio."
    ],
    problemasIncipientes: [
      "Incoherentes logrando la atención al explicar pero erráticos frente al control de grupos o disrupciones cortas de pasillo, mala estimación que condena al final agolpando y cortando lo central debido a impuntualidades de trámite de inicio y pasividades en transiciones internas ahí puestas a la vista de manera deficiente."
    ],
    criteriosSatisfactorios: [
      "Lidera con ritmo impecable evitando fugas, ritos preestablecidos de control u orden velocísimo, materiales pre-dispuestos; transiciones fluídamente seguras que eximen a las parálisis muertas para asentar conocimiento el cien por ciento y con márgenes perfectos finalizando lo indicado por planificación inicial a pulso estricto constante."
    ],
    situacionesAvanzado: [
      "Comunidad totalmente automatizada por asimilación. Alumnos abriendo textos solos, organizando todo proactivamente sin orden previa consolidando pautas de tiempo tan rigurosas que aprovechan el espacio de asimilación un ciento por ciento siempre frente al encuadramiento guiado por su instructor modélico allí puesto."
    ]
  },

  // Apoyo Estudiantil
  "6.1": {
    id: "6.1",
    nombre: "Detección prematura a estudiantes descendidos o con NEE articulando sostén.",
    descripcion: "IDENTIFICAN TEMPRANAMENTE A ESTUDIANTES CON VACÍOS DE APRENDIZAJE Y ARTICULAN LOS APOYOS.",
    problemasDebil: [
      "Invisibilizan al niño con deudas, lo apartan al rincón sin apoyo, postergando o profundizando su marginación terminal y dejándolo al desquite sumativo desalmado a fin de tranco provocando su frustración sin gestionar apoyo al especialista alguno frente al panorama así allí explicitado inefectivamente."
    ],
    problemasIncipientes: [
      "Actuación inercial al agravarse la cota o en años avanzados obviando pautas de diagnóstico preliminares tempranas y donde las dotaciones extras se reducen a pocas interacciones sin perito avalado y entregas arcaicas que repiten mecánicas frustradas no dando pie asertivamente resolutivo allí mismo eficientemente."
    ],
    criteriosSatisfactorios: [
      "Análisis profundo precoz. Sistematización de evaluaciones sumativas, inasistencias y signos psicopedagógicos implementando andamiajes de tutores o repasos serios; integran programas en colaboración a sostenedor conectando un abanico diagnóstico formal solvente y rápido atajando a gran escala la merma en progresión real al menor."
    ],
    situacionesAvanzado: [
      "Detección predictiva inicial (evalúan a ingresos). Tienen horas bloque docentes específicas solo para nivelación y si tras evaluar intervenciones no dan, viran drásticamente con innovación metódica para resguardar a como dé sitio al infante."
    ]
  },
  "6.2": {
    id: "6.2",
    nombre: "Estimulación y afianzamiento formal a sujetos académicamente superdotados o de interés divergente.",
    descripcion: "IMPLEMENTAN ESTRATEGIAS EFECTIVAS PARA POTENCIAR A ESTUDIANTES CON INTERESES DIVERSOS Y Y HABILIDADES DESTACADAS.",
    problemasDebil: [
      "Castran la diferencia, unifican al que es veloz al nivel inferior para 'nivelar', ignoran e imponen ramos limitados con indiferencia ante aptitudes formidables ajenas."
    ],
    problemasIncipientes: [
      "Privilegian un área típica (las ciencias). Si un chico sobresale en arte o música u oficio, lo pasan de lado. Reforzan poco al sobresaliente científico de vez en vez."
    ],
    criteriosSatisfactorios: [
      "Amplifican toda esfera vital (deportes, talleres coro, robótica) motivándolos y dando alas a cada joven; instalan retos o tutelan foros de investigación ampliando márgenes que impulsan a indagar en sus talentos."
    ],
    situacionesAvanzado: [
      "Redes con PENTA UC y Olimpiadas magnas. Organizan semilleros conectando talentos a estratos de academia mayor abriendo abanicos extraordinarios al desempeño formativo vocacional asimismado en el espacio de estudio del joven allí."
    ]
  },
  "6.3": {
    id: "6.3",
    nombre: "Identificación de trastornos psico sociales vulneratorios e implementación de paliativos.",
    descripcion: "IDENTIFICAN Y APOYAN A LOS ESTUDIANTES QUE PRESENTAN DIFICULTADES SOCIALES, AFECTIVAS Y CONDUCTUALES.",
    problemasDebil: [
      "Inobservancia letal de los problemas relacionales, confidencialidades abusadas, no existe psicólogo allí, desparramo frente a alertas primicias ignoradas por desidia e incompetencia directiva grave."
    ],
    problemasIncipientes: [
      "Soliloquios intermitentes con el mal. Se observa el problema evidente y desbordado para informar al apoderado pero el orientador existe en un plano ilusorio sin horario y sin derivaciones certeras o fichas clínicas anticuadas o en la nada del papeleo escolar vago y tardío."
    ],
    criteriosSatisfactorios: [
      "Fichas completas revisadas con equipo orientador que previene e interviene prestando apoyo en redes clínicas externas si asuela violencias o drogas. Apoderado y alumno son contenidos en pláticas preventivas o resolutivas inmediatas sistemáticas allí en la unidad integral provista del grupo directriz eficientemente dotado al respecto."
    ],
    situacionesAvanzado: [
      "Digitalización protocolar confidencial altísima gestionando peritos o de antemano un marco blindador contra adicciones o vulneraciones intrafamiliares capacitando y monitoreando asiduamente lo que rige tras aturar problemáticas sin desbocarse a fallos de contención extrema formativa de largo plazo."
    ]
  },
  "6.4": {
    id: "6.4",
    nombre: "Mecanismos protectores y preventivos de contención hacia la deserción escolar prematura.",
    descripcion: "IMPLEMENTAN ESTRATEGIAS EFECTIVAS PARA EVITAR LA DESERCIÓN ESCOLAR.",
    problemasDebil: [
      "Dejan marchar a los chicos en riesgo al ignorar las causas madres por nula responsabilidad o carencia de factores perceptivos del peligro de renuncia inactiva total del infante al ente educativo fallando íntegramente allí y no asumiendo posturas aliviadoras previas a ello."
    ],
    problemasIncipientes: [
      "Contención paliativa. Intentan asir a los alumnos al borde del cierre y lo remedian levemente con meros retos retóricos u oficios limitándole un apoyo robusto de largo plazo lo que genera abandono irremediablemente previsible a futuro allí mismo sin tapujos de manera evidente a ojos cerrados."
    ],
    criteriosSatisfactorios: [
      "Alarma precoz anti asuente, embarazo, fracaso o letargo cognitivo. Mallas de contención focal de tutoreo, reenganche motivacional formativo, integración del padre y seguimiento psicosocial a rajatablas logrando retrotraer variables del peligro hacia el foco sano educacional global."
    ],
    situacionesAvanzado: [
      "Revisión aguda de lo periférico: escaso control paternal o faenas laborales del niño previsorias logrando interceptarlo. Si en caso límite huyera, se sigue su trascurso a posteriori atrayéndolo redituable y certeramente midiendo acosos encubiertos de modo implacablemente certero previsor y activo pro el beneficio vital formativo del ente joven ahí mismo."
    ]
  },
  "6.5": {
    id: "6.5",
    nombre: "Forja y amparo fundamental activo de la interculturalidad con énfasis inclusivos de base.",
    descripcion: "INCORPORAN UN ENFOQUE INCLUSIVO E INTERCULTURAL PARA ASEGURAR EL DESARROLLO DE DISTINTAS CULTURAS.",
    problemasDebil: [
      "Miopía racista excluyente ignoradora del valor cultural distinto desvinculada al infante migrado propiciando humillación silenciosa o impositiva hacia su ethos formador original base allí presente en sala al marginarlo del trato igualitario natural u oprobio discriminatorio silenciosamente instituido y tolerado allí en efecto."
    ],
    problemasIncipientes: [
      "Cosmovisión folclórica esporádica (feriados, bailes) carente del profundo sentido formativo asimétrico y sin protocolos integradores reales ni capacitaciones de inserción validadas allí a los migrantes careciendo la médula vital formadora respetuosa integral de equidad total y justa en la casa en sí u obvia superficial del ambiente escolar cotidiano en curso continuo."
    ],
    criteriosSatisfactorios: [
      "Diagnósticos primigenios plenos que evalúan a los migrantes y abordan al personal a disolver estereotipos nefastos forjando un mural valórico donde en lo curricular rige asiduamente el respeto activo por la etnia diversa y dota a educadores del tacto humanístico imperante necesario y fundamental a ser impartido de plano a los menores en toda charla allí efectuada de rigor."
    ],
    situacionesAvanzado: [
      "Estandarizan de facto en PEI un ideario macro donde apoderados exógenos o pares rigen el control y monitorean activamente. Integran entes Mineduc externos para capacitar y pulir enfoques dotándole al recinto el sello del respeto multinacional o inclusivo ejemplificando en red sus prácticas magistrales en ese terreno a los demás sin par igual de manera modélica y formativa excelsa preeminente."
    ]
  },

  // ==========================================
  // DIMENSIÓN: FORMACIÓN Y CONVIVENCIA
  // ==========================================
  // Formación
  "7.1": {
    id: "7.1",
    nombre: "Planificación integral y monitorización de iniciativas valóricas PEI.",
    descripcion: "EL EQUIPO DIRECTIVO PLANIFICA Y MONITOREA PROGRAMAS E INICIATIVAS PARA LA FORMACIÓN INTEGRAL DE ACUERDO AL PEI.",
    problemasDebil: [
      "La meta formativa PEI es papel muerto. Ni transversaliza las acciones ni valora el progreso no-pedagógico.",
      "Ausencia de evaluación de lo que hacen, provocando una escuela vacía de valores medibles."
    ],
    problemasIncipientes: [
      "Declaman ciertos valores peisísticos pero divorciados del currículo transversal real diario de los cursos.",
      "Ejecutan ferias o salidas mermadas sin revisión o asidero de impacto formativo hacia el infante en cuestión."
    ],
    criteriosSatisfactorios: [
      "Enjambre formativo integral (charlas, retiros, foros) evaluado anualmente a todo orden. Valores y PEI fluyen transversalizados por los docentes diariamente guiados con rúbricas de conducta."
    ],
    situacionesAvanzado: [
      "Institucionalizado a un grado de independencia total de los docentes. Directivos asimilan lo que no funcionó, ajustan en semestre las mallas de crecimiento integral de cada niño o grupo ahí medible y solvente."
    ]
  },
  "7.2": {
    id: "7.2",
    nombre: "Orientación activa, protección confidencial y tutoría firme por parte del profesor jefe.",
    descripcion: "EL PROFESOR JEFE ACOMPAÑA ACTIVAMENTE A LOS ESTUDIANTES DE SU CURSO Y LOS ORIENTA.",
    problemasDebil: [
      "Distanciamiento nocivo; abandono de rol protector y orientador mediando conflictos u orientando familiarmente.",
      "Transgrede la confidencia o juzga sin asidero asestando el caos en rumbos críticos irreparables en el aula."
    ],
    problemasIncipientes: [
      "Acompaña desganado y si lo hace se afana por desbordes magnos de problema obviando lo formativo basal diario.",
      "Tratos meramente informativos con padres y rige el RICE de memoria ocasional para reprender ahí en sala desprolijamente."
    ],
    criteriosSatisfactorios: [
      "Liderazgo vinculante donde averigua realidades, fomenta empatía inclusiva mutua del grupo, y deriva crisis asertivamente.",
      "Atento, retroalimenta a padres de forma cálida, apoya integralmente las asambleas, y orienta sexual y afectivamente en conjunto directriz a todo evento de manera sostenida al progreso socio afectivo general del muchacho ahí."
    ],
    situacionesAvanzado: [
      "Inspiración referencial. Vela al modo extremo llevando bitácoras históricas socioemocionales de altísimo rendimiento donde anticipa deslices formativos, retroalimentando en horas libres con apoderados logrando cimentar confianza extraordinaria blindada ahí de lleno permanente al bienestar del joven íntegramente allí en todo sentido."
    ]
  },
  "7.3": {
    id: "7.3",
    nombre: "Expectativas ambiciosas a los educandos y guiamiento vocacional laboral efectivo pleno.",
    descripcion: "TRANSMITEN ALTAS EXPECTATIVAS A LOS ESTUDIANTES Y LOS APOYAN EN LA TOMA DE DECISIONES DE FUTURO.",
    problemasDebil: [
      "Imposición de techos fútiles bajo sesgo sociocultural. Inducción al desgano castrando los ánimos o perfiles del niño allí.",
      "Guían ciegamente sugiriendo carreras vagas ignorando si existe apoyo becario, anclándoselos al rincón sin norte seguro orientador general."
    ],
    problemasIncipientes: [
      "Generalidades de que 'se puede'. Retórica tibia pero sesgada levemente en género al momento de orientar sus pasiones allí impartidas de modo soso al cierre de etapa terminal media sin acompañar con redes fácticas palpables de orientación educacional vocacional allí al egreso inminente formal en su egresión final."
    ],
    criteriosSatisfactorios: [
      "Empujan a los alumnos y los convencen de que el éxito se basa en su esfuerzo mediante charlas u orientadores fijos apoyando proyectos de vocación tempranos disolviendo temores y anidando al apoderado hacia ferias o test variados allí aplicados fuertemente en curso al alumno todo así formativamente sin pausas a ello para evitar deserción del espíritu forjador y guiador final ahí."
    ],
    situacionesAvanzado: [
      "Charlas de ex alumnos triunfantes. Refutación férrea del arquetipo sexista de carrera. Generación y gestión de pasantías con apoyo irrestricto transversalizado por árbol familiar orientando y canalizando ayudas técnicas asombrosas previsorias adelantadas modelables así íntegramente a cada cual pertinentemente en la orientación vocacional superior a futuro en pos de su destino venidero."
    ]
  },
  "7.4": {
    id: "7.4",
    nombre: "Modelación íntegra de autodefensa biológica, recreación sana y erradicación del riesgo adolescente.",
    descripcion: "PROMUEVEN HÁBITOS DE VIDA SALUDABLE Y CONDUCTAS DE AUTOCUIDADO.",
    problemasDebil: [
      "Comedor insano a destajo y fomento del rincón pasivo en desmedro de la oxigenación motora necesaria del joven.",
      "Ciega inoservancia e impavidez directiva ante adicciones extremas facilitadas por recovecos o tratos nulos orientativos de cuidado psico biológico vital al alumnado indefenso expuesto ahí mismo en el patio sin contención orientativa de preaviso formal preventivo."
    ],
    problemasIncipientes: [
      "Campaña o rito esporádico deportivo. Retan y observan drogas o sexo de lejos con pálidos y tardíos regaños disuasivos y obvian los patrones diarios saludables como parte del alma formadora diaria limitando a esporádico discurso genérico de salud e impartido de manera pobre, sosa u olvidadiza al chico allí."
    ],
    criteriosSatisfactorios: [
      "Construyen ecosistemas del deporte inter curso u ollas nutricias; fomento firme anti droga-ITS procreando charlas expertas de red y tutoreos sexuales maduros atajantes o derivadores efectivos frente al peligro asumiendo posturas serias integradas con familias permanentemente atentas durante todo el ciclo lectivo asertivo ahí puesto a control activo permanente por el bloque maestro involucrado de lleno formativamente ahí mismo a tope de recursos."
    ],
    situacionesAvanzado: [
      "Encuestas a ciego anuales revelando mapas de conductas sexuales y adicciones barriales armando cortapisas protocolizadas contra los asedios de crisis precoz forjando murallas formidables apoyadas exógenamente orientativas prevencionales extraordinarias modélicas que desarticulan o apoyan patologías arraigadas o nacientes proactivamente velando por ellos perennemente en todo estrato."
    ]
  },
  "7.5": {
    id: "7.5",
    nombre: "Imbricación de la matriz familiar escolar retroalimentando fluidamente las tácticas pedagógicas PEI.",
    descripcion: "El EQUIPO DIRECTIVO Y DOCENTE PROMUEVE DE MANERA ACTIVA LA INVOLUCRACIÓN FAMILIAR EN EL PROCESO ESTUDIANTIL.",
    problemasDebil: [
      "Muros amurallados contra el entorno filial, invisibilización paterna ni información básica entregable de progreso asilando al sistema e imposibilitando la alianza requerida para avanzar impidiendo sin tapujos apoyos logísticos formativos o reuniones con ellos a tope y apartándolos del nexo escolar allí vigente de ordinario sin norte ahí."
    ],
    problemasIncipientes: [
      "Llamados esporádicos y reactivos punitivos o de paseos o avisos de notas en frío; intentan apelar pero sin sostener asambleas masivas nutridas disociándolos de manera general pasiva de lo medular de sus educandos."
    ],
    criteriosSatisfactorios: [
      "Escuelas vivas para padres. Intercambio fluido con manual normado. Alianzas de guía desde modelamiento positivo atrayendo masivamente a las sedes escolares asamblearias logrando un compromiso unívoco, transparente en notas o avances para aunar metodologías con las madres/padres activamente asertivamente y logrando mejoras notables allí."
    ],
    situacionesAvanzado: [
      "Evaluación bidireccional: la familia encuestada provee visiones, se apropian materialmente y ajustan tácticas a razón de ese eco logrado; comunicación multicanal asertiva modernísima acoplando a los cuidadores integralmente transformándolos en pilar coligante formidable hacia la escuela propiamente tal en función continua de progreso."
    ]
  },

  // Convivencia
  "8.1": {
    id: "8.1",
    nombre: "Garantía de civilidad empática o respeto transversal estandarizado comunitario absoluto en recinto.",
    descripcion: "EL EQUIPO DIRECTIVO Y DOCENTE MODELAN Y ASEGURAN UN AMBIENTE DE AMABILIDAD Y RESPETO.",
    problemasDebil: [
      "Omisión total frente al agravio o insulto intraescuela disolviendo todo protocolo pacífico en sala, ignorando naturalizadas mofas letales o tolerando abusos docentes ante inferiores de aula sin amonestar gravísima falla cívica ética esencial del educador allí descrita sin duda y con consecuencias atroces afectivas diarias permanentes ahí adentro del aula incontrolable o ruda y agresivamente instaurada."
    ],
    problemasIncipientes: [
      "Retan a unos pocos, pero son asistemáticos en la fiscalización disciplinaria. El respeto se declama pero los docentes entre ellos en sala rinden mal modelamiento obviando enseñar tácticas cívicas a la plebe de cómo destrabar choques y minimizando ocasionalmente conflictos subyacentes."
    ],
    criteriosSatisfactorios: [
      "Trato amable formal perenne de buenos días; forja transversalizada para debatir sosegadamente y ser asertivos al disentir impidiendo de raíz la descalificación brutal y forjando talleres de empatía y comunicación cívica para todos previendo roces letales a corto plazo amparados bajo el pacto institucional modélico al instante siempre con ahínco moral implacable y amable del todo presente por la labor educativa del docente superior que rige."
    ],
    situacionesAvanzado: [
      "Campaña o programas ultra sistematizados de amabilidad estandarizada por Mineduc o propios. Roles in situ, fomento de valores cívicos ejemplares donde los docentes ensayan, modelan proactivamente las actitudes cívicas o empáticas en caso de asimetrías y todo el ente institucional rebosa cultura cívica ejemplarizante pulcra intachable formativa y moral allí de preeminencia valiosísima educativa de fondo."
    ]
  },
  "8.2": {
    id: "8.2",
    nombre: "Previsión anti-discriminatoria irrestricta u homofóbica y asimilación pluri diversa armónica base.",
    descripcion: "VALORAN LA DIVERSIDAD Y EQUIDAD, PREVINIENDO EXPRESAMENTE LA DISCRIMINACIÓN.",
    problemasDebil: [
      "Docencia machista y denigradora imponiendo arquetipos atroces; marginan grupos no tolerados amartillando burla o segregando en actos diarios explícitos desregulados a total la base convivencial diversa y humanísticamente debida en recintos educativos contemporáneos allí de modo nefasto y retrógrada fallido éticamente por completo asestando brechas hirientes graves incontrolables a la pauta formadora nacional."
    ],
    problemasIncipientes: [
      "Charlas de equidad vacías carentes de asimetría corregida post aula aludiendo ocasionalmente por regaño a faltas intolerantes puntuales o bien, las acciones promotoras se apartan a una plática al semestre sin el rigor de asimilación para todo el cuerpo profesoral logrando vacíos cínicos frente al joven a educar en el convivir amplio natural tolerante o asilados ahí en sala y tolerando el desquite segregador."
    ],
    criteriosSatisfactorios: [
      "Correcciones transversales inminentes frenando actitudes segregacionistas. Fomento activo insertando a legados literarios de mujeres equitativamente, charlas donde se empatiza frente a la etnia o sexo diferente resguardando un asidero valórico irrestricto parejo y fomentando las alianzas donde tolerar de manera respetuosa se instaura orgánicamente al recinto previendo fracturas."
    ],
    situacionesAvanzado: [
      "Uso de matrices (sociogramas) identificantes de zonas acosadas de antemano actuando profilácticamente. Personal que frena cualquier conato homofóbico/segregador intencionalizando la empatía radical y ejemplarizando una cultura de cobijo modélica de clase avanzada internacional donde todos velan bajo reglas justas."
    ]
  },
  "8.3": {
    id: "8.3",
    nombre: "Instauración o difusión de parámetros y regulaciones disciplinarias RICE obligatorias.",
    descripcion: "DIFUNDE Y EXIGE EL CUMPLIMIENTO DEL REGLAMENTO DE CONVIVENCIA CON NORMAS DE VIDA EN COMÚN.",
    problemasDebil: [
      "Arbitrariedades de sanción inasibles o lenguaje borroso en RICE, el cual pocos conocen. Castigos fútiles desconectados de la falta descrita violando procedimientos cautelares asestando nulo crecimiento formativo o jurídico al penalizado ahí o eximiendo al violento sin justificar equidad alguna en sala en la administración disciplinaria interna ahí impuesta falsamente fallida totalmente al deber del centro respectivo allí en función propia inútilmente actuada."
    ],
    problemasIncipientes: [
      "Escrito profundo pero no distribuido u olvidado luego de la copia a inicio de año y donde los profes miden diferente frente a una fuga, premiando o sancionando disímilmente sin equidad base del reglamento que supuestamente ordena sus rangos provocando desasosiego o descrédito global al documento sancionatorio en sí."
    ],
    criteriosSatisfactorios: [
      "Firmas obligatorias en sitio y foro de difusión anual intensa a papás. Aplicación equilibrada transversal justa de sanciones medidas y formativas resguardando todos el RICE. Promoción metódica socializadora al alumnado previendo crisis disciplinarias atajadas al unísono parejo y formalmente estipulado a ojos ciegos de equidad irrestricta a quien rompe el pacto vital en aula o escuela presente."
    ],
    situacionesAvanzado: [
      "Redacción pedagógica atractiva del RICE preacordada asambleariamente, con un mapeaje o registro unificado y automatizado on-line donde el monitorio disciplinario avanza y retroalimenta al equipo sobre si amainó el déficit en acosos midiendo o no o reajustando la regla anualmente para optimizar la cultura regente en base empírica estricta probada ahí a fondo."
    ]
  },
  "8.4": {
    id: "8.4",
    nombre: "Armonización de procedimientos formativos didácticos internos para fluidez lectiva y orden de la cátedra base.",
    descripcion: "ACUERDAN REGLAS Y PROCEDIMIENTOS PARA FACILITAR EL DESARROLLO DE LAS ACTIVIDADES PEDAGÓGICAS.",
    problemasDebil: [
      "Caos al timbre de aula impartida, nula organización para ir a baño o recoger tarea y los profes omiten coordinar lo mínimo instaurado causando un despilfarro abismal descontrolado del tiempo formativo ahí al estar disociada la táctica grupal de comportamiento regido en aula frente a una enseñanza pulcra mínima de gestión escolar operativa in situ inhabilitante total a mediano corto plazo en todo evento allí inamoviblemente en detrimento pedagógico formativo."
    ],
    problemasIncipientes: [
      "Disputas y vacíos procedimentales al ser poco coherentes. Los lineamientos los asumen dos profes pero cinco toleran que se salgan u ordenen como quieran generando una cultura inconstante confusa e inoperante que retarda transiciones y genera fallos inestables o merma de minutos a impartir la materia oficial debido al letargo organizacional subyacente básico del establecimiento escindido ineficiente así aquí a medias expuesto y mal afianzado globalmente."
    ],
    criteriosSatisfactorios: [
      "Crean rutinas (lista rápida, roles fijos al limpiar el pizarrón), unificadas, repetidas todo inicio de año modeladas y pactadas forjando que asambleas de recreo e ingreso formen bloques pacíficos rápidos instituyendo orden interno que facilita a tope la efectividad del aprendizaje global por estar todo pulcramente coordinado preestablecidamente ahí estipulado."
    ],
    situacionesAvanzado: [
      "Autocontrol absoluto. El muchacho asimiló sus labores orgánicas tan excelentemente que el docente interviene mínimo. Estandarizan manuales fijos revisados asiduamente re-ajustando transiciones o dinámicas de modo preeminente optimizadamente automatizando al máximo sin robotizar las buenas costumbres instituidas en aula magistralmente organizadas formativamente."
    ]
  },
  "8.5": {
    id: "8.5",
    nombre: "Blindaje de espacios e integridad biosocial o protocolar infaltable a cada ente educativo allí adyacente u en ruta al establecimiento propiamente dicho en si a cargo en general todo el tiempo de horario de colegio establecido formalmente y regulado por ley a nivel basal e institucional del plantel formador respectivo a cargo obligatoriamente todo el día de asistencia de alumnos y docentes en sala y sus flancos.",
    descripcion: "RESGUARDA LA INTEGRIDAD FÍSICA Y PSICOLÓGICA DE LOS ESTUDIANTES DURANTE LA JORNADA ESCOLAR MÁXIMA.",
    problemasDebil: [
      "Supervisión ausente permitiendo escapes mortales, robos o infiltrados; indolencia crasa frente al acosador avalando insinuaciones físicas, abusos sin atajo o denegación protocolar y abandono irrestricto punible en caso de vulneraciones graves letales."
    ],
    problemasIncipientes: [
      "Focos ciegos de baño. Medidas de cuidado leves carentes de asimetría formal o preaviso y protocolos estancados solo aplicables sin asimilar previas sospechas marginando la acción al borde preventivo en una suerte de tibieza administrativa fáctica en vez de reaccionar anticipando de lleno la patología asoladora grave interna al bloque educacional general."
    ],
    criteriosSatisfactorios: [
      "Sellado o atención porteril irrestricta unificando rondas activas. Fomento del autocuidado contra signos acosadores sexuales con canal comunicativo seguro y derivante, accionando la matriz institucional (fiscal) proactivamente cuidando a las partes protegiendo en base a la línea dictatorial o estatal legalmente forjada impidiendo toda calamidad al alumnado."
    ],
    situacionesAvanzado: [
      "Perímetro y trayectos de ruta seguros y anexados a entes de orden. Cultura profiláctica generalizada proautocuidado dotándoles de empuje valórico proactivo de salud (seminarios, prevenciones, comités, etc) cruzando matrices pre evaluadas corrigiendo brechas normativamente excelsas intachables formativamente admirables ahí."
    ]
  },
  "8.6": {
    id: "8.6",
    nombre: "Abordamiento implacable correctivo u orientativo frente a crisis por transgresiones graves a la sana interrelación.",
    descripcion: "ABORDAN DECIDIDAMENTE LAS CONDUCTAS QUE ATENTAN CONTRA LA SANA CONVIVENCIA.",
    problemasDebil: [
      "Faltas impunes avaladas. El 'bullying' o vandalismo se ignora y se disfraza o sobrereacciona violentamente expulsando irreflexivamente a capricho sin investigar o dar cauce formativo, abocándose a reñir sin sentido e incurrir o propiciar más mofa o caos letal vengador sin herramientas de asimilación institucional inerme frente al problema ahí descontrolado irresoluble."
    ],
    problemasIncipientes: [
      "Miran mofas pero aplican retóricas ocasionales sin la derivación, y las pautas no se sostienen lo que permite regaños laxos a transgresores duros carentes de re encuadre o reparación social al vejado."
    ],
    criteriosSatisfactorios: [
      "Erradicación proactiva del silencio y complicidad. Identifican las faltas a cabalidad informando e imponiendo re enmienda reparatoria mediada a victimario e informada al papá de manera perenne e igual para calar hondo el cambio conductual mediante intervenciones justas del todo estipuladas y ejecutadas con valentía formativa total allí expuesta implacablemente con prudencia."
    ],
    situacionesAvanzado: [
      "Involucramiento activo redituable; los culpados construyen proyectos solidarios subsanando o entendiendo sus vicios de acoso concientizando su labor. La escuela diagnostica focos previos extirpando encubrimientos anónimos implementando un marco formativo anti pánico y protector modelo ejemplar en asertividad educacional integral en la zona sin dubitar ni flaquear a la regla ética magna forjada desde siempre."
    ]
  },

  // Participación
  "9.1": {
    id: "9.1",
    nombre: "Consolidación identitaria emotiva u apego fundacional general de base institucional a la raíz formadora en sí u orgullo respectivo comunitario escolar de alto arraigo identitario positivo o de honorífica representatividad preeminente formal a todo nivel interno externo general en toda área representativa del grupo formativo escolar presente de lleno globalmente.",
    descripcion: "EL EQUIPO DIRECTIVO Y LOS DOCENTES PROMUEVEN EL SENTIDO DE PERTENENCIA Y PARTICIPACIÓN AL PROYECTO.",
    problemasDebil: [
      "Desvalorización a sus emblemas, un clima lúgubre focalizado a fallos, no instan comunidad alguna ni involucran el sentir mutuo asilándolo o amargando el entorno institucional allí tristemente mal amparado en general causando desidia apática fatal con desgano identitario en toda hora."
    ],
    problemasIncipientes: [
      "Actos de himnos fríos donde la asimilación o el vínculo no rebalsa lo burocrático; asambleas u opiniones solicitadas no rinden asidero real impidiendo empoderar a la comunidad general hacia el afán del núcleo original dictatorial formador ahí."
    ],
    criteriosSatisfactorios: [
      "Entusiasmo identitario activo. Relato empoderador ensalzante movilizando el PEI y las celebraciones, atrayendo a las familias de modo acogedor u abriendo actividades que los cohesionan férreamente empujando la valía por la casa de estudio y pidiéndoles su aporte asertivo directo en labores conjuntas formativas del colegio propio suyo todo el tiempo presente siempre con fervor general global."
    ],
    situacionesAvanzado: [
      "Autoevaluaciones plenas que consolidan mallas participativas, donde la identidad trasunta por nexos exalumnos, asambleístas formadores en pro del respeto o proyectos de filigrana modélica que ancla una estima honorífica insuperable inter pares formativamente hablando ahí expuesto siempre maravillosamente de modo excelso vital permanente siempre."
    ]
  },
  "9.2": {
    id: "9.2",
    nombre: "Inculcación de la eco filantropía u filiación responsable pro sociedad y el activismo del entorno medio del grupo base ciudadano a forjar en aras de cuidar y responsabilizarse civil y ecológicamente por las tareas urgentes del mundo o entorno a salvaguardar con ímpetu u aportación general formativa.",
    descripcion: "EL PERSONAL PROMUEVE ENTRE LOS ESTUDIANTES EL SENTIDO DE RESPONSABILIDAD CON EL MEDIO Y LA SOCIEDAD.",
    problemasDebil: [
      "Desidia irrestricta asimilada avalando botar el mugrero en salones, nula labor ecológica u humanitaria forjando el cinismo o egocentrismo pasivo letal ciudadano donde importan nada como estamento u orientadores fallidos integrales al momento en la comunidad base escolar deficiente ahí generalizada."
    ],
    problemasIncipientes: [
      "Reflexiones vagas retóricas pero asumen poca práctica pro sociedad obviando rutinas solidarias diarias, centrando en una campaña mínima de turno esporádica desprovista del apego o concientización base permanente a seguir en la asimilación ecologista social interna del alumno promedio normal allí presente esporádicamente superficial."
    ],
    criteriosSatisfactorios: [
      "Accionar metódico solidario, campañas, debates ecológicos analizando al prójimo. Ejemplaridad total minimizando huella del plantel y fomentando a la acción vecinal real de cuidado al mundo por y mediante actos u estilos asilados al programa formador en si."
    ],
    situacionesAvanzado: [
      "Alianzas y convenios forestadores u eco campañas de redes proactivas barriales gestionadas donde el plantel brilla por liderazgo de su masa forjadora o su estamento promotor integral cívico inmejorable atañendo a todos y por todo en general al servicio de base social magna formativa suprema general."
    ]
  },
  "9.3": {
    id: "9.3",
    nombre: "Garantía de libre pluralidad de juicios analíticos amparados bajo el argumento o apertura crítica reflexiva tolerante y propositiva dialógica de excelencia interrelacional profunda formadora cívicamente hablando sin represión inútil previa amparada lógicamente en base fundamentada respetuosamente de excelencia al debatir y opinar en salas a fondo y de manera preestablecidamente proactiva y orientada didácticamente sin cesar la interacción.",
    descripcion: "FOMENTAN ENTRE LOS ESTUDIANTES LA EXPRESIÓN DE OPINIONES, DELIBERACIÓN Y EL DEBATE FUNDAMENTADO.",
    problemasDebil: [
      "Castran y repelen al juicio, obligan a responder en corto, imponen monopolio sin el menor intercambio acallando al discrepante e impidiendo la oratoria o descalificando falazmente asestando brechas antipedagógicas graves en los educandos inhabilitándolos reflexiva y cívicamente de base forjadora letal."
    ],
    problemasIncipientes: [
      "Debaten pero sin reglas argumentativas tolerando regaños o burlas mientras difieren; abren turnos pero no consolidan oratorias estructuradas por lo que la opinión no cala educativamente de manera real a largo plazo ni es sistemáticamente aludida en todas las clases dictadas de manera pareja o sostenida formativamente allí siempre en todo ramo o bloque ahí al instante deficiente."
    ],
    criteriosSatisfactorios: [
      "Habilidades in situ, uso exaustivo del foro reglado animando la tolerancia donde el fundamento prela por sobre la ofensa. Estimulan la lectura pre-analítica instruyéndolos a convencer o diferir bajo asideros fuertes de empatía lógica u argumentativa excelsa pro-constructiva sana diaria de verdad."
    ],
    situacionesAvanzado: [
      "Talleres de oratoria de campeonato; modelamiento absoluto respetuoso transversal de interpares promoviéndolo en plataformas de red y abriendo redes argumentativas inter escuelas con un asidero y finura en todo foro impensada para la media regional modélica y formativa sin igual excepcionalísima íntegra."
    ]
  },
  "9.4": {
    id: "9.4",
    nombre: "Promulgación u apoyo fáctico proselitista formativo hacia la masa de alumnos autogestionada organizativamente en pos plural o cívico amparando y potenciado logísticamente directivas y centros del muchacho en recintos sin bloqueamientos castradores pro fomento demócrata puro de base a enseñar con la práctica inminente ahí diaria in situ general e ininterrumpida ahí al instante u ordinario formal base formador.",
    descripcion: "PROMUEVEN FORMACIÓN DEMOCRÁTICA MEDIANTE EL APOYO AL CENTRO DE ALUMNOS Y DIRECTIVAS DE CURSO.",
    problemasDebil: [
      "Se opone e inhabilita las votaciones cerrando agendas, obstaculiza toda unión de estudiantes o avala fraudes sin regañarlos propiciando fisuras o desbandes donde reinan directrices anárquicas pasivas u obvias mermas de representatividad cívica democrática letales u olvidadas al debe general formador de manera penosa anti valórico fatal institucionalmente hablando allí para ellos de forma asiladamente autocrática."
    ],
    problemasIncipientes: [
      "Apoyo pasivo y difuso; no le estorba pero carece de afán motivacional para fomentar campañas plurales ricas reduciendo a facilitación efímera o inconsistente el uso pro centro o reuniones limitando el tiempo operativo restándole fuerza agrupadora institucional al educando en cuestión sin fin proactivo real ahí mismo."
    ],
    criteriosSatisfactorios: [
      "Asumen la directiva como pilar representativo de base guiándolo integralmente, otorgan tiempo o foros propiciando campañas impolutas justas y equitativas; acompañan asambleas instalando rituales o asesorías en donde la masa se autogestiona ordenadamente amparados y apoyados a tiempo formativo completo siempre en aula y directriz central general continua."
    ],
    situacionesAvanzado: [
      "Infraestructura dada, calendarios fijos formales. Empoderamiento orgánico de la masa. Las directivas rigen y obran con finanzas logrando una madurez que nutre a nivel país la praxis base formadora republicana lograda asombrosamente in house como parte de la cotidianidad de la magna escuela modelo ahí descrita y vivida excepcionalmente a cabalidad plena."
    ]
  },
  "9.5": {
    id: "9.5",
    nombre: "Encauzamiento sistémico participador generalizado o promovedor general hacia los núcleos formativos, redes u estamentos asamblearios intraescuela de base donde su contribución empodere u optimice de modo retroalimentativo firme o enraizado vital u activamente integral asimiladora en los foros correspondientes al centro base educativo a mejorar allí cotidianamente u operativamente ahí sin trabas al respecto formador o de seguimiento continuo general del desarrollo en bloque participativo.",
    descripcion: "PROMUEVE LA PARTICIPACIÓN ACTIVA DE LOS ESTAMENTOS PARA APOYAR EL DESARROLLO DEL PEI.",
    problemasDebil: [
      "Aislamiento informativo absolutista no llamando al Consejo Escolar ni a los profes asilados marginándoles de decisiones centrales operativas obstaculizando su retroalimentador norte limitante deficiente y letargo administrativo antidemócrata."
    ],
    problemasIncipientes: [
      "Citaciones erráticas al comité o si invita las decisiones yacen tomadas de antemano careciendo o obviando la asimilación del otro o marginando la operatividad real en su asamblea base allí ineficaz de plano superficial al trato institucional ordinario en asamblea o consultiva base para justificar acto público inútil efímeramente allí forjado a vistas."
    ],
    criteriosSatisfactorios: [
      "Instala canales plenos (cartas, on-line), estimula al Consejo amparado a normatividad, pregunta y dota de asimilación e integra realidades u opiniones recogiendo inquietudes dotándole valía cooperativa real al profesorado u apoderado general que obra a la mano pro activamente asertivamente y logísticamente con fluidez formativa ahí expuesto y avalado así a lo normado estatuido positivamente general."
    ],
    situacionesAvanzado: [
      "Crean plataformas o subcomités por áreas temáticas que canalizan unificadamente a cada estamento desvirtuando a una dirección que manda y creando un ecosistema que gobierna a nivel parejo con reglas justas y retroalimenta al reglamento de asiduidad forjadora comunitaria de altísimo nivel formativo admirada modélicamente fuera y retro exigente asombrosamente."
    ]
  },

  // ==========================================
  // DIMENSIÓN: GESTIÓN DE RECURSOS
  // ==========================================
  // Gestión de Personal
  "10.1": {
    id: "10.1",
    nombre: "Organización de los aspectos administrativos del personal.",
    descripcion: "DEFINEN CARGOS Y RESPONSABILIDADES ADECUADAS E IMPLEMENTAN.",
    problemasDebil: [
      "Superposición de áreas o vacíos y confusiones de los quehaceres base por no formalizar funciones.",
      "Atrasos previsionales o pago de sueldos; ausencia de sustituciones para ausentismos causando clases perdidas."
    ],
    problemasIncipientes: [
      "Cargos medios estipulados pero los transversales no tanto causando duplicación organizativa o roce táctico.",
      "Las planillas y supervisión horaria carecen de celeridad o los reemplazos se efectúan asistemáticamente y mal."
    ],
    criteriosSatisfactorios: [
      "Organigramas oficiales, horarios exigidos puntualmente mediante marcadores de registro sistemático formales.",
      "Cubre faltas docentiles vía pre asignación asidua y los deberes y pagos fluyen transparentes operados en tiempo ley base inamoviblemente bien."
    ],
    situacionesAvanzado: [
      "Actualizan logísticas mediante revisiones anuales o inducciones a transparentar descuentos financieros.",
      "Contrataciones exclusivas libres de bloque rotatorio dispuestas solo al reemplazo optimizando a nivel 100% todo agujero forzoso ahí provocado por la enfermedad o falta temporal del guía maestro al punto."
    ]
  },
  "10.2": {
    id: "10.2",
    nombre: "Estrategias para contar con personal idóneo y competente.",
    descripcion: "IMPLEMENTA ESTRATEGIAS PARA ATRAER, ROTAR, ELEGIR Y SOSTENER PERSONAL ADECUADO.",
    problemasDebil: [
      "Contratan por pituto carentes de perfiles evaluativos estipulados obviando la retención u atraimiento de idóneos puros a la plaza en si desmantelando méritos base.",
      "Desvinculaciones apuradas que arriesgan estabilidad o sin marco justo al trato al salir de modo paupérrimo desolador allí deficiente a nivel jurídico u ordinario de ley al trabajador u alumnado en peligro de interrupción mal encausada."
    ],
    problemasIncipientes: [
      "La atracción se limita a perfiles vagamente redactados. La selección consta de revisar un pobre currículo superficial asilado de preevaluación docentil o de entrevistas probadas reales y efectivas in situ en la clase.",
      "Analiza al rotador pero es reactivamente inútil al frenar fugas ni provisiona justicieramente con rapidez las finalizaciones."
    ],
    criteriosSatisfactorios: [
      "Técnicas de búsqueda rigurosidad: demostración empírica test u entrevistas compuestas; fomento atrayente ofreciendo buenas condiciones o incentivos atractivos logrando consolidar al recurso idóneo a retener al evaluar fugas previsorias justas de regla legal y amparando la continuidad y blindaje de menores infaltables en urgencia o perversión si hubiese del profesional sacado inminentemente."
    ],
    situacionesAvanzado: [
      "Generan alianzas formadoras practicantes en donde anclan recursos o provisión a indemnizaciones previas. Anticipan al profesional a egresar previniendo e integrando pruebas psicométricas u análisis casos logrando personal del más alto calibre formativo existente."
    ]
  },
  "10.3": {
    id: "10.3",
    nombre: "Evaluación y retroalimentación del desempeño del personal.",
    descripcion: "SE ANALIZA Y EVALÚA EL DESEMPEÑO DEL DIRECTIVO PROFESOR Y EMPLEADOS PARA MEJORAR PRÁCTICAS.",
    problemasDebil: [
      "Ausencia evaluativa autónoma; rigiéndose solo a bases del estado o informales o a pautas secretas dadas subjetivamente o nulas.",
      "Ocultación o nula corrección asertiva solo apuntando a represión de faltas sin aval formativo re directriz evaluado ahí ciego total."
    ],
    problemasIncipientes: [
      "Baja rigurosidad a pautas de poca arista. Evaluación temporal única anual de lenta entrega sin metas pactadas para redestinar mejoras o re enseñar las competencias puestas ahí deficientemente a relucir en papel formativo pobre del equipo sin provecho real a largo plazo ni constancia útil preeminente de mejora en curso normal del bloque docente a liderar allí mal forjado a pulso vago y escaso."
    ],
    criteriosSatisfactorios: [
      "Elaboran matrices, informan y asumen correcciones semestrales abordando aristas sociales y pedagógicas con rúbricas difundidas de antemano que guían al evaluado al progreso donde el director asume y compromete lazos documentables resolutivamente asertivos de la deficiencia allí impuesta para reparar y apoyar la debilidad manifiesta mostrada empíricamente y evaluada cabalmente pro activa y formadora positiva y asertivamente allí a tope de rigor profesional continuo asistemáticamente bueno y firme siempre en curso anual respectivo."
    ],
    situacionesAvanzado: [
      "Plataformas IT evaluativas integrando sellos institucionales al parámetro medidor. Entrevistas de inicio y fomento de pactos superatorios al año logrando de manera transversal consolidar el monitoreo auto sostenido constante de modo hiper riguroso modélico asertivamente genial para afinar aptitudes extraordinarias a su personal a cargo y optimizar talento permanentemente."
    ]
  },
  "10.4": {
    id: "10.4",
    nombre: "Gestión del desarrollo profesional y técnico del personal según necesidades del PEI.",
    descripcion: "EL SOSTENEDOR GESTIONA EL DESARROLLO PROFESIONAL Y TÉCNICO SEGÚN PRIORIDADES DEFINIDAS.",
    problemasDebil: [
      "Ausencia de inducciones a novatos o forzamiento a aprender por descarte o intuición. Financiamiento cero a capacitaciones o elección errática inútil para la malla base allí necesitada en forma paupérrima deficiente e improcedente formadora en todo rango inefectiva e ignorante al profesional."
    ],
    problemasIncipientes: [
      "Inducción rápida o papel al paso pero carente de tutor. Financian pocos cupos de avance u orientan la especialización lejos de debilidades reales marcadas o recaban si gustó el curso de manera superficial o banal de charlas al egreso informalmente así a solas en lo pobre formativamente visto a la capacitación al plantel."
    ],
    criteriosSatisfactorios: [
      "El PEI se afianza y el Mineduc se guía elaborando un plan macro priorizado formal diagnosticado u evaluando al personal para enviar o dar becas de seminarios, acompañamiento formal al novel; con rúbrica post curso que evalúa cuán útil fue para el aula la materia expuesta o traída a relucir formativamente forjando de lleno la especialización útil institucional."
    ],
    situacionesAvanzado: [
      "Se institucionaliza las sesiones virtuales, monitores mentores del plantel guían a los practicantes o apoyos exógenos avanzados, promoviendo en encuestas de alumno el impacto formativo del profe egresado del curso capacitador elevándole y garantizándole en asambleas todo progreso extraordinario o apoyándole logísticamente financieramente a becas o especialidades modélicas magíster, etc, formadoras del acervo intelectual supremo magno general."
    ]
  },
  "10.5": {
    id: "10.5",
    nombre: "Promoción activa y armónica de clima laboral positivo generalizado entre adultos.",
    descripcion: "EL EQUIPO DIRECTIVO PROMUEVE UN CLIMA LABORAL POSITIVO EN TODOS LOS ESTRATOS.",
    problemasDebil: [
      "No vigilan el caos de rivalidades y naturalizan aislamientos laborales impidiendo todo incentivo mermando la moral de la sala docentes asestando roces peyorativos mal encauzados omitiendo espacios del descanso forjando amargura en todos ignorando toda resolución formativa del ámbito empleado al tope deficiente así u inhabilitando por todo afán general el sentido de trabajo mancomunado feliz u pacífico allí dentro permanentemente inoperativo nefasto."
    ],
    problemasIncipientes: [
      "Premiación esporádica e injusta para ciertos preferidos; reaccionaria actitud de corrección si aflora roce crítico careciendo al amparo al diálogo previo, proveyendo al docente pero eximiendo al resto ignorando rutinas integrales formativas saludables al empleado común desmotivando asiladamente a niveles de apoyo logístico a pesar del bienestar retórico proclamado de baja eficacia."
    ],
    criteriosSatisfactorios: [
      "Diagnósticos de ambiente, frenan discordias interviniendo raudos o mediando acudiendo al empoderamiento, organizan festividades afianzativas solidarias inclusivas igualitarias u otorgan salas limpias de buen comer amparando un respeto exento de agobio logístico dándoles lugar seguro eximiendo estrés o discriminaciones y asertivamente promoviendo el reconocimiento grupal formativo e impulsor a desafíos valiosos que eleven autoestimas a niveles de alta funcionalidad amigable del ente trabajador ahí asiduo."
    ],
    situacionesAvanzado: [
      "Apoyo de prevención al estrés (yoga institucional), descuentos en salud y planes, asimilación inclusiva de decisiones reconociendo por servicio de modo solemne intachable cimentando foros y medidas paritarias donde se implementan ajustes constantes anuales erradicando molestias de forma proactiva empática del nivel más superior posible entre la masa laboral formativa allí instituida."
    ]
  },

  // Recursos Financieros
  "11.1": {
    id: "11.1",
    nombre: "Gestión de la matrícula y la asistencia de los estudiantes.",
    descripcion: "EL SOSTENEDOR GESTIONA LA MATRÍCULA Y LA ASISTENCIA EVITANDO DESERCIONES O MALA GESTIÓN.",
    problemasDebil: [
      "No controlan matrículas permitiendo pérdida continua y desorden ineficiente del registro asiduo del SIGE u similar. Culpan de apáticos al exógeno de su ruina o descuidan al padre restándole atención básica."
    ],
    problemasIncipientes: [
      "Llaman, pero de forma discontinua abandonando a los ausentes; asimilan listados errados y promueven escasamente si hay mermas no atacando de fondo la retención. "
    ],
    criteriosSatisfactorios: [
      "Manejo de causes que atraen y retienen infaltablemente atajando roces de convivencia; supervisión implacable diaria normada o sorteada para asegurar dineros o la retención que amerita. Llamados al momento asertivamente guiados."
    ],
    situacionesAvanzado: [
      "Forjan encuestas del padre atrayendo proactividad para anclar identidad previniendo de raíz su escape; entregan recursos compensatorios fácticos locales y tienen un perito ad-hoc de auditoría de matriculación pulcra irrestricta a control normado constante."
    ]
  },
  "11.2": {
    id: "11.2",
    nombre: "Asignación presupuestaria sustentable y control de cuentas claras a todo estado subvencional institucional de cargo general regido anualmente o mensualmente en bitácora transparente pública auditable internamente y exógenamente amparado formal base ahí indispensable estatuido al marco fáctico y orgánico ley correspondiente así a cada caso general de gasto u ingreso ahí.",
    descripcion: "EL SOSTENEDOR ASEGURA LA SUSTENTABILIDAD FINANCIERA MIDIENDO GASTOS Y CONTROLANDO CUENTAS.",
    problemasDebil: [
      "Ingresos caducos, pierden subvenciones o elaboran listas sin plazos obvios de prioridades omitiendo al consejo y forjando reparaciones graves a futuro por falta de control de gastos ordinario al recabar el inventario de mantención desasido allí."
    ],
    problemasIncipientes: [
      "Miran listas anuales desprovistas de desglose de meses, dilatan decisiones provocando tramos donde gastan erróneo o se rinde cuenta atrasada esporádica e inconclusamente de estado de rendición mayor sin rigurosidad interna u olvidadiza al detalle formador alusivo central."
    ],
    criteriosSatisfactorios: [
      "Mensualización contable perfecta auditada. Comprometen compras asiduas, promueven ahorros o uso racional, y reasignan de inmediato las emergencias. Todo de forma transparente logrando cumplir subvención ley (SEP u otras) en tiempo sin sanción alguna u objeción en rendimientos formales y priorizando la decisión de comunidad base asertivamente dotada al rubro."
    ],
    situacionesAvanzado: [
      "Devuelven remanentes premiando ahorro local, implementan ratios económicos de excelencia contable de auditorías intachables analizando ratios por alumno y prediciendo entradas estimadas exógenas cruzando proyecciones con un contador de planta superior resguardador intachable de matriz de fondo."
    ]
  },
  "11.3": {
    id: "11.3",
    nombre: "Aseguramiento íntegro de cumplir la normativa vigente y eludir contingencias fácticas o de multa y sanciones previas informadas.",
    descripcion: "EL EQUIPO DIRECTIVO Y SOSTENEDORES CUMPLEN CON LA NORMATIVA VIGENTE DE FORMA ASEGURADA.",
    problemasDebil: [
      "Ignorancia fatal en decretos o dictámenes lo cual recae en acciones ilegales impunes asiduamente sancionadas por Mineduc en repetidas veces sin modificar conductas pasándose de modo impasible al marco de ley estipulante."
    ],
    problemasIncipientes: [
      "Normas conocidas a medias. Cierta difusión pero sin repaso o fiscalización a personal de cómo no romper leyes; no documentan con eficacia qué proceso corregir para evitar re-sanción de la superintendencia fallando ocasionalmente en los procesos vulnerados ahí mismo."
    ],
    criteriosSatisfactorios: [
      "Constante chequeo de sitio web de la superintendencia. Socialización del marco ley al plantel responsabilizando con base u metas y aplicando férreos controles a los procesos para impedir por completo de manera sistematizada la falta anterior impidiendo multas y erradicando procesos fallidos desde la supervisión constante ahí dispuesta al efecto."
    ],
    situacionesAvanzado: [
      "Pactan asesoría jurídica externa; sintetizan de manera didáctica manuales para impedir desconocimiento de legalidad y acudan en frente a cualquier dudo previniendo de raíz posibles asomos de desapegos estatuidos modélicamente de modo intachable en ley resuelta anticipando proyectos normados que vayan surgiendo externamente formales al futuro general en curso o avance estatutario nacional."
    ]
  },
  "11.4": {
    id: "11.4",
    nombre: "Conocimiento, vinculación e implementación fáctica de programas, fondos e instituciones exógenos de asistencia y alianza al fortalecimiento institucional base PEI.",
    descripcion: "CONOCEN REDES, PROGRAMAS DE ASISTENCIA Y LOS USAN PARA POTENCIAR EL PEI.",
    problemasDebil: [
      "Ausencia de alianzas. Todo financiamiento se reduce a la subvención simple perdiendo inyecciones formidables; o se meten en cuanto fondo asoma desviando metas docentes por dinero e informan engaños si se rinde cuentas ahí desprovistos calitativamente de moral u objetividad útil formativa gravemente irresponsables."
    ],
    problemasIncipientes: [
      "Conectan esporádicamente o postulan tarde perdiéndolos; si los atrapan, recogen la ayuda desmidiendo la operatividad al PEI sino a meramente tapar un hoyo u desarticular sin monitoreo al final el verdadero uso en aula y olvidan las alianzas en asistemática ineficacia organizacional."
    ],
    criteriosSatisfactorios: [
      "Acople inteligente: analizan convocatorias en base a su déficit; atraen postulaciones proactivas ordenadas encuestas en evaluación constante post término para reasegurar rumbos validando las redes formadoras de manera sistemática, asertiva legalizada transparente acoplando al ecosistema ayudas gubernamentales plenas bien asestadas logísticamente rindiendo finanzas correctísimamente siempre al marco pertinente ahí provocado al recurso base estricto y riguroso a cumplir satisfactoriamente por todos."
    ],
    situacionesAvanzado: [
      "Poseen matrices de marcos de lógico al evaluar externalidades de red e institucionalizan pactos formidables macro como exalumnos o centros PENTA evitando agobio rotatorio u instaurando ligares duraderos en tiempo que trascienden e incorporan herramientas altísimamente dotadas institucionalmente en bien del currículo y formación general global superior modelo asimilado allí."
    ]
  },

  // Recursos Educativos
  "12.1": {
    id: "12.1",
    nombre: "Mantención proactiva resguardada a la base infraestructural y aseo general dotado operativamente de forma higiénico útil en amparo didáctico educacional general a lo dispuesto formal de clases óptimas base fundamental al respecto formativo allí permanente.",
    descripcion: "SE ASEGURAN DE MANTENER LA INFRAESTRUCTURA, ASEO E HIGIENE EN BUEN ESTADO.",
    problemasDebil: [
      "Ruina escolar: vidrios rotos o desaseos crónicos repulsivos permitiendo estragos y destrozos avalados de alumnos sin instaurar el más básico marco limpio pernicioso formacional asilando al ornato como irrelevante o imposibilitando la adquisición general en rincones caóticos donde no se prioriza ni se acucia a reponer material perdido o falto craso."
    ],
    problemasIncipientes: [
      "Aseo intermitente; hay basuras focales que quedan de vez en vez o pinturas o videncias arruinadas de tiempo medió obviando la prolijidad exigente u descuidando registros y la concientización del alumnado para no destruir careciendo u apurando solo lo más urgente pero tardíamente en reparación sin estandarización pre dictada."
    ],
    criteriosSatisfactorios: [
      "Recintos impecables y dotados. Registros al día preasignado logísticamente comprados. Cultura instalada fáctica instruyendo la mantención pro alumnos y carteles asiduos de promoción al no destrozo, baños o zonas asiduas de asambleas plácidas limpias y armónicas diariamente garantizadas institucionalmente."
    ],
    situacionesAvanzado: [
      "Embellecen e involucran a toda el plantel con turnos o cuadrillas donde corrigen in situ o pre previenen reparando perdidas a las horas, de índole asertiva elevando los estándares de infraestructuras exógenas como patios techaos optimísimos que elevan estatus moral del infante dignificándolo fuertemente inhouse ahí logísticamente con eficiencia total resolutiva suprema y activa continuada."
    ]
  },
  "12.2": {
    id: "12.2",
    nombre: "Disponibilización expedita didáctica, tecnológica TIC e instruccional y mediación del provecho al aprendizaje global cognitivo estudiantil general al curso de aula.",
    descripcion: "ASEGURAN RECURSOS DIDÁCTICOS Y PROMUEVEN SU USO PARA POTENCIAR EL APRENDIZAJE.",
    problemasDebil: [
      "Implementos arruinados u obstaculizados donde un control nulo pierde los insumos limitando capacitación o no difundiendo nada limitados a lo fútil y perdiendo en trabas horribles sacar proyector u material de aula e ignorando u obviando la instrucción pedagógica al colega pasivamente letárgico a lo tecnológico ahí despojado inútil didácticamente al menor."
    ],
    problemasIncipientes: [
      "Listados de equipación engorrosos donde no ayudan a sacarlo y el incentivo a capacitarse rige para ciertos pero no focalizado a cómo eso enseña a rendir, promoviendo a duras penas uso a alumnos u obteniendo implementos básicos regularizados con desfases organizativos limitando eficacia procedimental general."
    ],
    criteriosSatisfactorios: [
      "Lineamientos pre programados, incentivan activamente a incorporar de plano la TIC en programas, prestando recursos con fluidez inventariada controladora solvente e instruyendo a maestros con focos del uso del aparato a finanzas eficientes, explicando potencialidades pro aprendizajes en reuniones activas y resguardando y dotando stock de mantención a tiempo."
    ],
    situacionesAvanzado: [
      "Extensión al ramo extracurriculares hiper tecnológicos (robótica web). Plataformas IT repositorias masivas donde padres alumnos o formadores ven y obtienen guías, e instan un co modelaje de pares evaluando la eficacia del método traído ahí para enseñar de fondo extraordinariamente óptimo modelo al servicio del alumno con lo provisto superior en vanguardia ahí dotado educacionalmente."
    ]
  },
  "12.3": {
    id: "12.3",
    nombre: "Optimización logístico pedagógico asiduo u operativamente asertiva del CRA y fomento magnánimo a los libros fomentadores del espíritu leyente base estudiantil pre formativa al alumnado base en general.",
    descripcion: "ASEGURAN UNA BIBLIOTECA CRA PARA APOYAR Y FOMENTAR EL HÁBITO LECTOR DE ESTUDIANTES.",
    problemasDebil: [
      "Espacio infame u nulo; sin material o colecciones viejas cerradas con pestillos u imposibilitadas al infeliz alumno, privando fomento lector, sin profesional atinente limitando a un calabozo un espacio vital del establecimiento ahí asilado ineficazmente con desdén formador craso."
    ],
    problemasIncipientes: [
      "CRA esparcido, usado por secretarios u asambleas limitando libros algo nuevos pero insuficientes y confusos de hallar con personal de media formación no motivadora o programas limitados a chicos de iniciales solamente marginando de planes mayores a la base escolar de fomento en sí."
    ],
    criteriosSatisfactorios: [
      "Local ordenadísimo dotado bajo norma ley amplios y con registros ágiles asiduos anti hurto. Fomento integral expansivo familiar con profesional experto y encasillado horario amparando a todos desde plan lector unificado institucional fomentador general del agrado intrínseco humano al libro ahí propiciamente dotado logísticamente amable y solvente educativo en regla general."
    ],
    situacionesAvanzado: [
      "Acervos inconmensurables de volúmenes de libros atractivos o digitalización IT plena a nivel remoto inventarial amparando formadores hiper carismáticos; irradian programas unificantes barriales dotados educacionalmente atrayendo comunidades exógenas como faro de la zona ampliando con estatus el núcleo formativo valioso allí en el CRA propio instalado superior innegable e inmejorable para ellos."
    ]
  }
};
