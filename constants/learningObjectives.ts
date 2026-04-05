
export interface LearningObjective {
    id: string;
    description: string;
}

export interface Nucleus {
    name: string;
    objectives: LearningObjective[];
}

export interface Level {
    name: string;
    nuclei: Nucleus[];
}

export const learningObjectivesData: Level[] = [
    {
        name: "Prekinder",
        nuclei: [
            {
                name: "Identidad y Autonomía",
                objectives: [
                    { id: "OA 1", description: "Comunicar a los demás rasgos de su identidad (gustos, intereses, fortalezas)." },
                    { id: "OA 2", description: "Manifestar disposición y confianza para enfrentar desafíos y resolver problemas." },
                    { id: "OA 3", description: "Reconocer y nombrar sus emociones y las de los demás ante diversas situaciones." },
                    { id: "OA 4", description: "Expresar sus opiniones y defender sus puntos de vista en juegos y conversaciones." },
                    { id: "OA 5", description: "Comunicar sus preferencias y proponer juegos o actividades." },
                    { id: "OA 6", description: "Planificar y llevar a cabo proyectos simples de manera autónoma." },
                    { id: "OA 7", description: "Comunicar rasgos de su identidad, como nombre, sexo y pertenencia a grupos." },
                    { id: "OA 8", description: "Cuidar su bienestar personal, practicando hábitos de higiene y alimentación." },
                    { id: "OA 9", description: "Reconocer y comunicar situaciones de riesgo para su integridad física." }
                ]
            },
            {
                name: "Convivencia y Ciudadanía",
                objectives: [
                    { id: "OA 1", description: "Participar en actividades grupales de manera colaborativa y democrática." },
                    { id: "OA 2", description: "Respetar normas y acuerdos establecidos por el grupo para la convivencia." },
                    { id: "OA 3", description: "Manifestar empatía y solidaridad frente a las necesidades de otros." },
                    { id: "OA 4", description: "Apreciar la diversidad de las personas (etnias, géneros, capacidades)." },
                    { id: "OA 5", description: "Aplicar estrategias pacíficas en la resolución de conflictos." },
                    { id: "OA 6", description: "Reconocer que todos los niños y niñas tienen derechos y responsabilidades." },
                    { id: "OA 7", description: "Identificar vínculos de pertenencia a su familia, escuela y comunidad." },
                    { id: "OA 8", description: "Participar activa y responsablemente en el cuidado de su entorno." }
                ]
            },
            {
                name: "Corporalidad y Movimiento",
                objectives: [
                    { id: "OA 1", description: "Manifestar iniciativa en el movimiento corporal y juegos motrices." },
                    { id: "OA 2", description: "Reconocer y apreciar sus atributos corporales y posibilidades motrices." },
                    { id: "OA 3", description: "Resolver desafíos motrices que requieran coordinación y equilibrio." },
                    { id: "OA 4", description: "Expresar sensaciones y emociones a través del cuerpo y el movimiento." },
                    { id: "OA 5", description: "Realizar movimientos precisos con sus manos (coordinación fina)." },
                    { id: "OA 6", description: "Ejecutar acciones motrices globales (correr, saltar, trepar) con seguridad." },
                    { id: "OA 7", description: "Resolver situaciones prácticas de la vida cotidiana usando su cuerpo." },
                    { id: "OA 8", description: "Manifestar interés por realizar actividad física de forma regular." }
                ]
            },
            {
                name: "Lenguaje Verbal",
                objectives: [
                    { id: "OA 1", description: "Expresarse oralmente empleando estructuras oracionales completas." },
                    { id: "OA 2", description: "Comprender textos orales literarios y no literarios en diversas situaciones." },
                    { id: "OA 3", description: "Descubrir atributos fonológicos de las palabras (rimas, sílabas)." },
                    { id: "OA 4", description: "Comunicar oralmente sus ideas, experiencias y sentimientos." },
                    { id: "OA 5", description: "Manifestar interés por la lectura a través de diversos textos." },
                    { id: "OA 6", description: "Comprender contenidos explícitos e implícitos de textos escuchados." },
                    { id: "OA 7", description: "Reconocer palabras y logos del entorno (iniciación a la lectura)." },
                    { id: "OA 8", description: "Producir sus propios signos gráficos y letras (iniciación a la escritura)." }
                ]
            },
            {
                name: "Lenguajes Artísticos",
                objectives: [
                    { id: "OA 1", description: "Apreciar producciones artísticas visuales, musicales y escénicas." },
                    { id: "OA 2", description: "Expresar su imaginación mediante el dibujo, la pintura y el modelado." },
                    { id: "OA 3", description: "Interpretar canciones y juegos musicales sencillos." },
                    { id: "OA 4", description: "Expresar corporalmente sensaciones que le sugiere la música." },
                    { id: "OA 5", description: "Crear proyectos artísticos individuales y colectivos con diversos medios." },
                    { id: "OA 6", description: "Representar roles y situaciones en juegos dramáticos." },
                    { id: "OA 7", description: "Apreciar la estética de elementos naturales y culturales de su entorno." }
                ]
            },
            {
                name: "Exploración del Entorno Natural",
                objectives: [
                    { id: "OA 1", description: "Manifestar curiosidad por el conocimiento de los seres vivos y su entorno." },
                    { id: "OA 2", description: "Formular conjeturas sobre causas y efectos de fenómenos naturales." },
                    { id: "OA 3", description: "Reconocer la importancia de la energía y el agua para la vida." },
                    { id: "OA 4", description: "Comunicar acciones que contribuyen al cuidado del medio ambiente." },
                    { id: "OA 5", description: "Distinguir características de los seres vivos en su hábitat." },
                    { id: "OA 6", description: "Realizar experimentos simples siguiendo procedimientos de investigación." }
                ]
            },
            {
                name: "Comprensión del Entorno Sociocultural",
                objectives: [
                    { id: "OA 1", description: "Identificar funciones de instituciones y personas de su comunidad." },
                    { id: "OA 2", description: "Reconocer la importancia del servicio que prestan diversas profesiones." },
                    { id: "OA 3", description: "Comparar modos de vida del presente con los del pasado." },
                    { id: "OA 4", description: "Identificar costumbres y tradiciones de su país y de otros." },
                    { id: "OA 5", description: "Usar herramientas y objetos tecnológicos para resolver problemas." },
                    { id: "OA 6", description: "Reconocer símbolos representativos de su identidad nacional." }
                ]
            },
            {
                name: "Pensamiento Matemático",
                objectives: [
                    { id: "OA 1", description: "Crear patrones sonoros, visuales o gestuales de varios elementos." },
                    { id: "OA 2", description: "Clasificar y seriar objetos por diversos atributos (forma, tamaño, longitud)." },
                    { id: "OA 3", description: "Comunicar la posición de objetos usando conceptos de ubicación y dirección." },
                    { id: "OA 4", description: "Emplear cuantificadores (más que, menos que, igual que) para comparar." },
                    { id: "OA 5", description: "Orientarse temporalmente empleando nociones de secuencia y frecuencia." },
                    { id: "OA 6", description: "Emplear los números para contar, cuantificar, comparar y completar." },
                    { id: "OA 7", description: "Representar números y cantidades hasta el 20 de forma concreta y pictórica." },
                    { id: "OA 8", description: "Resolver problemas de suma y resta en situaciones cotidianas simples." }
                ]
            }
        ]
    }
];
