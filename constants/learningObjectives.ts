
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
    },
    {
        name: "Kinder",
        nuclei: [
            {
                name: "Identidad y Autonomía",
                objectives: [
                    { id: "OA 1", description: "Comunicar rasgos de su identidad (gustos, intereses, fortalezas)." },
                    { id: "OA 2", description: "Manifestar disposición para enfrentar desafíos y resolver problemas." }
                ]
            },
            {
                name: "Convivencia y Ciudadanía",
                objectives: [
                    { id: "OA 1", description: "Participar en actividades grupales de manera colaborativa." },
                    { id: "OA 2", description: "Respetar normas y acuerdos establecidos por el grupo." }
                ]
            },
            {
                name: "Corporalidad y Movimiento",
                objectives: [
                    { id: "OA 1", description: "Manifestar iniciativa en el movimiento corporal y juegos motrices." }
                ]
            },
            {
                name: "Lenguaje Verbal",
                objectives: [
                    { id: "OA 1", description: "Expresarse oralmente empleando estructuras oracionales completas." }
                ]
            },
            {
                name: "Lenguajes Artísticos",
                objectives: [
                    { id: "OA 1", description: "Apreciar producciones artísticas visuales, musicales y escénicas." }
                ]
            },
            {
                name: "Exploración del Entorno Natural",
                objectives: [
                    { id: "OA 1", description: "Manifestar curiosidad por el conocimiento de los seres vivos." }
                ]
            },
            {
                name: "Comprensión del Entorno Sociocultural",
                objectives: [
                    { id: "OA 1", description: "Identificar funciones de instituciones y personas de su comunidad." }
                ]
            },
            {
                name: "Pensamiento Matemático",
                objectives: [
                    { id: "OA 1", description: "Crear patrones sonoros, visuales o gestuales de varios elementos." }
                ]
            }
        ]
    },
    {
        name: "1° Básico",
        nuclei: [
            {
                name: "Lenguaje y Comunicación",
                objectives: [
                    { id: "OA 1", description: "Reconocer que los textos escritos transmiten mensajes y que son escritos por alguien para cumplir un propósito." },
                    { id: "OA 2", description: "Reconocer que las palabras son unidades de significado separadas por espacios en el texto escrito." },
                    { id: "OA 3", description: "Identificar los sonidos que componen las palabras (conciencia fonológica), reconociendo, separando y combinando sus fonemas y sílabas." },
                    { id: "OA 4", description: "Leer palabras aisladas y en contexto, aplicando su conocimiento de la correspondencia letra-sonido en diferentes combinaciones." },
                    { id: "OA 5", description: "Leer textos breves en voz alta para adquirir fluidez." },
                    { id: "OA 6", description: "Comprender textos, aplicando estrategias de comprensión lectora (relacionar, visualizar)." },
                    { id: "OA 8", description: "Demostrar comprensión de narraciones que aborden temas familiares, extrayendo información, respondiendo preguntas, recreando personajes." },
                    { id: "OA 13", description: "Experimentar con la escritura para comunicar hechos, ideas y sentimientos, entre otros." },
                    { id: "OA 14", description: "Escribir oraciones completas para transmitir mensajes." },
                    { id: "OA 15", description: "Escribir con letra clara, separando las palabras con un espacio para que puedan ser leídas por otros con facilidad." },
                    { id: "OA 18", description: "Comprender textos orales para obtener información y desarrollar su curiosidad por el mundo." },
                    { id: "OA 21", description: "Participar activamente en conversaciones grupales sobre textos leídos o escuchados en clases o temas de su interés." },
                    { id: "OA 23", description: "Expresarse de manera coherente y articulada sobre temas de su interés." }
                ]
            },
            {
                name: "Matemática",
                objectives: [
                    { id: "OA 1", description: "Contar números del 0 al 100 de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10, hacia adelante y hacia atrás, empezando por cualquier número menor que 100." },
                    { id: "OA 3", description: "Leer números del 0 al 20 y representarlos en forma concreta, pictórica y simbólica." },
                    { id: "OA 4", description: "Comparar y ordenar números del 0 al 20 de menor a mayor y viceversa, usando material concreto y monedas nacionales de manera manual y/o por medio de software educativo." },
                    { id: "OA 6", description: "Componer y descomponer números del 0 a 20 de manera aditiva, en forma concreta, pictórica y simbólica." },
                    { id: "OA 8", description: "Determinar las unidades y decenas en números del 0 al 20, agrupando de a 10, de manera concreta, pictórica y simbólica." },
                    { id: "OA 9", description: "Demostrar que comprenden la adición y la sustracción de números del 0 al 20 progresivamente, de 0 a 5, de 6 a 10, de 11 a 20." },
                    { id: "OA 11", description: "Reconocer, describir, crear y continuar patrones repetitivos (sonidos, figuras, ritmos...) y patrones numéricos hasta el 20, crecientes y decrecientes." },
                    { id: "OA 13", description: "Describir la posición de objetos y personas con relación a sí mismos y a otros objetos y personas, usando conceptos de ubicación y dirección." },
                    { id: "OA 14", description: "Identificar en el entorno figuras 2D y cuerpos 3D y relacionarlos usando material concreto." }
                ]
            },
            {
                name: "Ciencias Naturales",
                objectives: [
                    { id: "OA 1", description: "Reconocer y observar que los seres vivos crecen, responden a estímulos, se reproducen y necesitan agua, alimento y aire, comparándolos con las cosas no vivas." },
                    { id: "OA 2", description: "Observar y comparar animales de acuerdo a características como tamaño, cubierta corporal, estructuras de desplazamiento y hábitat." },
                    { id: "OA 6", description: "Identificar y describir la ubicación y la función de los sentidos, proponiendo medidas para protegerlos y para prevenir situaciones de riesgo." },
                    { id: "OA 7", description: "Describir, dar ejemplos y practicar hábitos de vida saludable para mantener el cuerpo sano y prevenir enfermedades." },
                    { id: "OA 8", description: "Explorar y describir los diferentes tipos de materiales en diversos objetos, clasificándolos según sus propiedades e identificando su uso en la vida cotidiana." },
                    { id: "OA 11", description: "Describir y registrar el ciclo diario y las diferencias entre el día y la noche, a partir de la observación del Sol, la Luna, las estrellas, y sus efectos." }
                ]
            },
            {
                name: "Historia, Geografía y Ciencias Sociales",
                objectives: [
                    { id: "OA 1", description: "Nombrar y secuenciar días de la semana y meses del año, utilizando calendarios, e identificar el año en curso." },
                    { id: "OA 2", description: "Secuenciar acontecimientos y actividades de la vida cotidiana, personal y familiar, utilizando categorías relativas de ubicación temporal." },
                    { id: "OA 5", description: "Reconocer los símbolos representativos de Chile, describir costumbres, actividades y participación en conmemoraciones nacionales." },
                    { id: "OA 8", description: "Reconocer que los mapas y los planos son formas de representar lugares." },
                    { id: "OA 10", description: "Observar y describir paisajes de su entorno local, utilizando vocabulario geográfico adecuado y categorías de ubicación relativa." },
                    { id: "OA 14", description: "Explicar y aplicar algunas normas para la buena convivencia y para la seguridad y el autocuidado en su familia, escuela y vía pública." }
                ]
            },
            {
                name: "Inglés",
                objectives: [
                    { id: "OA 1", description: "Comprender textos orales muy breves y simples con apoyo visual." },
                    { id: "OA 5", description: "Leer y demostrar comprensión de textos literarios y no literarios muy breves." }
                ]
            },
            {
                name: "Educación Física y Salud",
                objectives: [
                    { id: "OA 1", description: "Demostrar habilidades motrices básicas de locomoción, manipulación y equilibrio." },
                    { id: "OA 6", description: "Ejecutar actividades físicas de intensidad moderada a vigorosa." }
                ]
            },
            {
                name: "Artes Visuales",
                objectives: [
                    { id: "OA 1", description: "Expresar y crear trabajos de arte a partir de la observación del entorno natural." },
                    { id: "OA 3", description: "Expresar emociones e ideas en sus trabajos de arte." }
                ]
            },
            {
                name: "Música",
                objectives: [
                    { id: "OA 1", description: "Escuchar música en forma abundante de diversos contextos y culturas." },
                    { id: "OA 4", description: "Cantar al unísono y tocar instrumentos de percusión convencionales y no convencionales." }
                ]
            },
            {
                name: "Tecnología",
                objectives: [
                    { id: "OA 1", description: "Crear diseños de objetos tecnológicos simples para resolver problemas." },
                    { id: "OA 2", description: "Planificar la elaboración de un objeto tecnológico." }
                ]
            },
            {
                name: "Orientación",
                objectives: [
                    { id: "OA 1", description: "Reconocer y valorar sus características personales, habilidades e intereses." },
                    { id: "OA 2", description: "Identificar y practicar hábitos de vida saludable." }
                ]
            }
        ]
    },
    {
        name: "2° Básico",
        nuclei: [
            {
                name: "Lenguaje y Comunicación",
                objectives: [
                    { id: "OA 3", description: "Comprender textos aplicando estrategias (relacionar con experiencia, visualizar)." },
                    { id: "OA 5", description: "Demostrar comprensión de narraciones (extraer info, secuencias, describir personajes)." },
                    { id: "OA 12", description: "Escribir frecuentemente textos como poemas, diarios, cartas y anécdotas." },
                    { id: "OA 17", description: "Escribir correctamente aplicando reglas de ortografía literal, acentual y puntual." }
                ]
            },
            {
                name: "Matemática",
                objectives: [
                    { id: "OA 1", description: "Contar números del 0 al 1.000 de 2 en 2, 5 en 5, 10 en 10 y 100 en 100." },
                    { id: "OA 9", description: "Demostrar que comprende la adición y la sustracción en el ámbito del 0 al 100." },
                    { id: "OA 11", description: "Demostrar que comprende la multiplicación mediante representaciones concretas y pictóricas." }
                ]
            },
            {
                name: "Ciencias Naturales",
                objectives: [
                    { id: "OA 1", description: "Observar y describir las etapas del ciclo de vida de algunos animales." },
                    { id: "OA 7", description: "Identificar la ubicación y función de algunos órganos del cuerpo humano." }
                ]
            },
            {
                name: "Historia, Geografía y Ciencias Sociales",
                objectives: [
                    { id: "OA 1", description: "Describir los modos de vida de algunos pueblos originarios de Chile." },
                    { id: "OA 4", description: "Reconocer y valorar los aportes de los inmigrantes a la sociedad chilena." }
                ]
            },
            {
                name: "Inglés",
                objectives: [
                    { id: "OA 1", description: "Comprender textos orales muy breves y simples." }
                ]
            },
            {
                name: "Educación Física y Salud",
                objectives: [
                    { id: "OA 1", description: "Demostrar habilidades motrices básicas en una variedad de juegos." }
                ]
            },
            {
                name: "Artes Visuales",
                objectives: [
                    { id: "OA 1", description: "Expresar y crear trabajos de arte a partir de la observación del entorno." }
                ]
            },
            {
                name: "Música",
                objectives: [
                    { id: "OA 1", description: "Escuchar música de diversos contextos y culturas." }
                ]
            },
            {
                name: "Tecnología",
                objectives: [
                    { id: "OA 1", description: "Crear diseños de objetos tecnológicos." }
                ]
            },
            {
                name: "Orientación",
                objectives: [
                    { id: "OA 1", description: "Reconocer y valorar sus características personales." }
                ]
            }
        ]
    },
    {
        name: "3° Básico",
        nuclei: [
            {
                name: "Lenguaje y Comunicación",
                objectives: [
                    { id: "OA 2", description: "Comprender textos aplicando estrategias de comprensión lectora (releer, subrayar, predecir)." },
                    { id: "OA 4", description: "Profundizar la comprensión de las narraciones leídas: extrayendo info explícita e implícita." }
                ]
            },
            {
                name: "Matemática",
                objectives: [
                    { id: "OA 2", description: "Leer números hasta 1.000 y representarlos en forma concreta, pictórica y simbólica." },
                    { id: "OA 6", description: "Demostrar que comprenden la adición y la sustracción de números hasta 1.000." }
                ]
            },
            {
                name: "Ciencias Naturales",
                objectives: [
                    { id: "OA 1", description: "Observar y describir algunos cambios de las plantas con flor durante su ciclo de vida." },
                    { id: "OA 4", description: "Describir la importancia de las plantas para los seres vivos." }
                ]
            },
            {
                name: "Historia, Geografía y Ciencias Sociales",
                objectives: [
                    { id: "OA 1", description: "Categorizar y representar acontecimientos de su propia vida y de la de su familia." },
                    { id: "OA 3", description: "Identificar y ubicar en mapas las principales zonas climáticas del mundo." }
                ]
            },
            {
                name: "Inglés",
                objectives: [
                    { id: "OA 1", description: "Comprender textos orales breves y simples." }
                ]
            },
            {
                name: "Educación Física y Salud",
                objectives: [
                    { id: "OA 1", description: "Demostrar habilidades motrices básicas en juegos colectivos." }
                ]
            },
            {
                name: "Artes Visuales",
                objectives: [
                    { id: "OA 1", description: "Crear trabajos de arte a partir de experiencias personales." }
                ]
            },
            {
                name: "Música",
                objectives: [
                    { id: "OA 1", description: "Escuchar música de diversos contextos." }
                ]
            },
            {
                name: "Tecnología",
                objectives: [
                    { id: "OA 1", description: "Crear diseños de objetos tecnológicos para resolver problemas." }
                ]
            },
            {
                name: "Orientación",
                objectives: [
                    { id: "OA 1", description: "Reconocer y valorar sus características personales." }
                ]
            }
        ]
    },
    {
        name: "4° Básico",
        nuclei: [
            {
                name: "Lenguaje y Comunicación",
                objectives: [
                    { id: "OA 1", description: "Leer en voz alta para adquirir fluidez: precisión, respeto a la puntuación y velocidad." },
                    { id: "OA 2", description: "Comprender textos aplicando estrategias (releer, subrayar, parafrasear, visualizar)." },
                    { id: "OA 3", description: "Leer y familiarizarse con un amplio repertorio de literatura (cuentos, mitos, novelas)." },
                    { id: "OA 4", description: "Profundizar la comprensión de las narraciones leídas: extraer info, describir personajes." },
                    { id: "OA 5", description: "Comprender poemas: figuras literarias, sentimientos e imágenes." },
                    { id: "OA 6", description: "Leer independientemente y comprender textos no literarios (biografías, noticias, artículos)." },
                    { id: "OA 11", description: "Escribir frecuentemente para desarrollar la creatividad y expresar ideas." },
                    { id: "OA 12", description: "Escribir creativamente narraciones (experiencias personales, cuentos) con trama lógica." },
                    { id: "OA 13", description: "Escribir artículos informativos para comunicar información sobre un tema." },
                    { id: "OA 17", description: "Escribir, revisar y editar sus textos para transmitir ideas con claridad." },
                    { id: "OA 21", description: "Escribir correctamente aplicando reglas de ortografía literal, acentual y puntual." },
                    { id: "OA 27", description: "Expresarse de manera coherente y articulada sobre temas de su interés." }
                ]
            },
            {
                name: "Matemática",
                objectives: [
                    { id: "OA 1", description: "Representar y describir números hasta el 10.000: lectura, escritura, comparación." },
                    { id: "OA 3", description: "Demostrar que comprenden la adición y la sustracción de números hasta 1.000." },
                    { id: "OA 5", description: "Demostrar que comprenden la multiplicación de números de tres dígitos por un dígito." },
                    { id: "OA 6", description: "Demostrar que comprenden la división con dividendos de dos dígitos y divisores de un dígito." },
                    { id: "OA 7", description: "Resolver problemas rutinarios y no rutinarios en contextos cotidianos (4 operaciones)." },
                    { id: "OA 8", description: "Demostrar que comprenden las fracciones con denominadores 100, 12, 10, 8, 6, 5, 4, 3, 2." },
                    { id: "OA 11", description: "Describir y representar decimales (décimos y centésimos)." },
                    { id: "OA 21", description: "Demostrar que comprenden el área de rectángulos y cuadrados." }
                ]
            },
            {
                name: "Ciencias Naturales",
                objectives: [
                    { id: "OA 1", description: "Reconocer y explicar que los seres vivos están formados por células." },
                    { id: "OA 2", description: "Observar y comparar adaptaciones de plantas y animales para sobrevivir." },
                    { id: "OA 3", description: "Dar ejemplos de cadenas alimentarias, identificando productores, consumidores y descomponedores." },
                    { id: "OA 5", description: "Identificar y describir estructuras del sistema esquelético y muscular." },
                    { id: "OA 6", description: "Explicar los beneficios de la actividad física y hábitos de vida saludable." },
                    { id: "OA 9", description: "Comparar los tres estados de la materia (sólido, líquido, gaseoso)." },
                    { id: "OA 11", description: "Describir las capas de la Tierra (atmósfera, litosfera, hidrosfera) y sus características." }
                ]
            },
            {
                name: "Historia, Geografía y Ciencias Sociales",
                objectives: [
                    { id: "OA 1", description: "Describir la civilización Maya (ubicación, organización, aportes)." },
                    { id: "OA 2", description: "Describir la civilización Azteca (ubicación, organización, aportes)." },
                    { id: "OA 3", description: "Describir la civilización Inca (ubicación, organización, aportes)." },
                    { id: "OA 8", description: "Describir y ubicar paisajes de América, usando coordenadas geográficas." },
                    { id: "OA 11", description: "Identificar y ubicar las principales zonas climáticas del mundo." },
                    { id: "OA 14", description: "Reconocer que los niños tienen derechos y deberes." },
                    { id: "OA 20", description: "Identificar los tres poderes del Estado y sus funciones." }
                ]
            },
            {
                name: "Inglés",
                objectives: [
                    { id: "OA 1", description: "Comprender textos orales breves y simples." }
                ]
            },
            {
                name: "Educación Física y Salud",
                objectives: [
                    { id: "OA 1", description: "Demostrar habilidades motrices básicas en juegos colectivos." }
                ]
            },
            {
                name: "Artes Visuales",
                objectives: [
                    { id: "OA 1", description: "Crear trabajos de arte a partir de experiencias personales." }
                ]
            },
            {
                name: "Música",
                objectives: [
                    { id: "OA 1", description: "Escuchar música de diversos contextos." }
                ]
            },
            {
                name: "Tecnología",
                objectives: [
                    { id: "OA 1", description: "Crear diseños de objetos tecnológicos para resolver problemas." }
                ]
            },
            {
                name: "Orientación",
                objectives: [
                    { id: "OA 1", description: "Reconocer y valorar sus características personales." }
                ]
            }
        ]
    },
    {
        name: "5° Básico",
        nuclei: [
            {
                name: "Lenguaje y Comunicación",
                objectives: [
                    { id: "OA 2", description: "Comprender textos aplicando estrategias de comprensión lectora (inferencias, resúmenes)." },
                    { id: "OA 3", description: "Leer y familiarizarse con un amplio repertorio de literatura (novelas, historietas, mitos)." },
                    { id: "OA 4", description: "Analizar aspectos relevantes de narraciones leídas para profundizar su comprensión." },
                    { id: "OA 6", description: "Leer independientemente y comprender textos no literarios (noticias, reportajes)." },
                    { id: "OA 14", description: "Escribir creativamente narraciones (relatos de experiencias, cuentos)." },
                    { id: "OA 18", description: "Escribir, revisar y editar sus textos para asegurar coherencia y cohesión." },
                    { id: "OA 21", description: "Escribir correctamente aplicando reglas de ortografía literal, acentual y puntual." }
                ]
            },
            {
                name: "Matemática",
                objectives: [
                    { id: "OA 1", description: "Representar y describir números de hasta más de 6 dígitos y menores que 1.000 millones." },
                    { id: "OA 3", description: "Demostrar que comprenden la multiplicación de números de dos dígitos por números de dos dígitos." },
                    { id: "OA 4", description: "Demostrar que comprenden la división con dividendos de tres dígitos y divisores de un dígito." },
                    { id: "OA 6", description: "Resolver problemas rutinarios y no rutinarios que involucren las cuatro operaciones." },
                    { id: "OA 7", description: "Demostrar que comprenden las fracciones propias e impropias y números mixtos." },
                    { id: "OA 12", description: "Resolver adiciones y sustracciones de números decimales hasta la milésima." },
                    { id: "OA 16", description: "Identificar y dibujar puntos en el primer cuadrante del plano cartesiano." },
                    { id: "OA 22", description: "Calcular el área de rectángulos y cuadrados usando cuadrículas." }
                ]
            },
            {
                name: "Ciencias Naturales",
                objectives: [
                    { id: "OA 1", description: "Reconocer y explicar que los seres vivos están formados por una o más células." },
                    { id: "OA 2", description: "Observar y describir la organización de los seres vivos (célula, tejido, órgano, sistema)." },
                    { id: "OA 4", description: "Explicar la función de transporte del sistema circulatorio (corazón, vasos, sangre)." },
                    { id: "OA 6", description: "Investigar y explicar los beneficios de la actividad física y la alimentación equilibrada." },
                    { id: "OA 9", description: "Observar y describir las características de los océanos y lagos." },
                    { id: "OA 11", description: "Describir la distribución del agua dulce y salada en la Tierra." }
                ]
            },
            {
                name: "Historia, Geografía y Ciencias Sociales",
                objectives: [
                    { id: "OA 1", description: "Explicar los viajes de descubrimiento de Cristóbal Colón y de Magallanes." },
                    { id: "OA 2", description: "Describir el proceso de conquista de América y de Chile (conquistadores, resistencia)." },
                    { id: "OA 5", description: "Describir las principales características de la sociedad colonial (mestizaje, roles)." },
                    { id: "OA 9", description: "Caracterizar las grandes zonas de Chile (Norte Grande, Chico, Zona Central, Sur y Austral)." },
                    { id: "OA 12", description: "Reconocer que la Constitución Política es la ley fundamental del Estado." },
                    { id: "OA 16", description: "Identificar los poderes del Estado y sus funciones." }
                ]
            },
            {
                name: "Inglés",
                objectives: [
                    { id: "OA 1", description: "Comprender textos orales breves y simples." }
                ]
            },
            {
                name: "Educación Física y Salud",
                objectives: [
                    { id: "OA 1", description: "Demostrar habilidades motrices básicas en juegos colectivos." }
                ]
            },
            {
                name: "Artes Visuales",
                objectives: [
                    { id: "OA 1", description: "Crear trabajos de arte a partir de experiencias personales." }
                ]
            },
            {
                name: "Música",
                objectives: [
                    { id: "OA 1", description: "Escuchar música de diversos contextos." }
                ]
            },
            {
                name: "Tecnología",
                objectives: [
                    { id: "OA 1", description: "Crear diseños de objetos tecnológicos para resolver problemas." }
                ]
            },
            {
                name: "Orientación",
                objectives: [
                    { id: "OA 1", description: "Reconocer y valorar sus características personales." }
                ]
            }
        ]
    },
    {
        name: "6° Básico",
        nuclei: [
            {
                name: "Lenguaje y Comunicación",
                objectives: [
                    { id: "OA 3", description: "Leer y familiarizarse con un amplio repertorio de literatura (novelas, poemas, textos sagrados)." },
                    { id: "OA 4", description: "Analizar aspectos relevantes de las narraciones (conflictos, evolución de personajes)." },
                    { id: "OA 6", description: "Leer y comprender textos no literarios para ampliar conocimiento del mundo." },
                    { id: "OA 14", description: "Escribir creativamente narraciones (relatos de experiencias, cuentos)." },
                    { id: "OA 18", description: "Escribir, revisar y editar sus textos para asegurar claridad y coherencia." },
                    { id: "OA 21", description: "Escribir correctamente aplicando reglas de ortografía literal, acentual y puntual." }
                ]
            },
            {
                name: "Matemática",
                objectives: [
                    { id: "OA 1", description: "Demostrar que comprenden los factores y múltiplos (mínimo común múltiplo)." },
                    { id: "OA 3", description: "Demostrar que comprenden los números primos y compuestos." },
                    { id: "OA 5", description: "Demostrar que comprenden la multiplicación y división de fracciones y decimales." },
                    { id: "OA 8", description: "Demostrar que comprenden el concepto de porcentaje en diversas situaciones." },
                    { id: "OA 11", description: "Resolver ecuaciones de primer grado con una incógnita." },
                    { id: "OA 13", description: "Demostrar que comprenden el concepto de área de superficies en cubos y paralelepípedos." },
                    { id: "OA 18", description: "Calcular la superficie y el volumen de cubos y paralelepípedos." }
                ]
            },
            {
                name: "Ciencias Naturales",
                objectives: [
                    { id: "OA 1", description: "Explicar el proceso de fotosíntesis (aporte de energía, intercambio de gases)." },
                    { id: "OA 2", description: "Analizar el flujo de energía y materia en cadenas y redes alimentarias." },
                    { id: "OA 4", description: "Identificar y describir las etapas del desarrollo humano (especialmente la pubertad)." },
                    { id: "OA 9", description: "Explicar que la energía se manifiesta en diversas formas (cinética, potencial, térmica)." },
                    { id: "OA 12", description: "Describir las capas de la atmósfera y su importancia para la vida." },
                    { id: "OA 15", description: "Explicar los cambios en la superficie de la Tierra (placas tectónicas, sismos, volcanes)." }
                ]
            },
            {
                name: "Historia, Geografía y Ciencias Sociales",
                objectives: [
                    { id: "OA 1", description: "Explicar el proceso de Independencia de Chile (antecedentes, bandos, etapas)." },
                    { id: "OA 3", description: "Describir la organización de la República de Chile (Constitución 1833, economía)." },
                    { id: "OA 5", description: "Describir los principales hitos de la guerra del Pacífico y sus consecuencias." },
                    { id: "OA 8", description: "Comparar diferentes visiones sobre el quiebre de la democracia en 1973." },
                    { id: "OA 11", description: "Describir la organización política de Chile (Poderes del Estado, democracia)." },
                    { id: "OA 13", description: "Reconocer que todos los ciudadanos tienen derechos y deberes." }
                ]
            },
            {
                name: "Inglés",
                objectives: [
                    { id: "OA 1", description: "Comprender textos orales breves y simples." }
                ]
            },
            {
                name: "Educación Física y Salud",
                objectives: [
                    { id: "OA 1", description: "Demostrar habilidades motrices básicas en juegos colectivos." }
                ]
            },
            {
                name: "Artes Visuales",
                objectives: [
                    { id: "OA 1", description: "Crear trabajos de arte a partir de experiencias personales." }
                ]
            },
            {
                name: "Música",
                objectives: [
                    { id: "OA 1", description: "Escuchar música de diversos contextos." }
                ]
            },
            {
                name: "Tecnología",
                objectives: [
                    { id: "OA 1", description: "Crear diseños de objetos tecnológicos para resolver problemas." }
                ]
            },
            {
                name: "Orientación",
                objectives: [
                    { id: "OA 1", description: "Reconocer y valorar sus características personales." }
                ]
            }
        ]
    },
    {
        name: "7° Básico",
        nuclei: [
            {
                name: "Lengua y Literatura",
                objectives: [
                    { id: "OA 2", description: "Reflexionar sobre las dimensiones de la experiencia humana (afecto, libertad, etc.)." },
                    { id: "OA 3", description: "Analizar las narraciones leídas para enriquecer su comprensión (personajes, ambiente)." },
                    { id: "OA 7", description: "Formular una interpretación de los textos literarios leídos o vistos." },
                    { id: "OA 12", description: "Expresarse en forma creativa por medio de la escritura (poemas, cuentos)." },
                    { id: "OA 15", description: "Escribir, revisar y editar sus textos para asegurar claridad y coherencia." }
                ]
            },
            {
                name: "Matemática",
                objectives: [
                    { id: "OA 1", description: "Mostrar que comprenden la adición y la sustracción de números enteros." },
                    { id: "OA 4", description: "Mostrar que comprenden el concepto de porcentaje de diversas maneras." },
                    { id: "OA 7", description: "Mostrar que comprenden la noción de potencia de base natural y exponente natural." },
                    { id: "OA 8", description: "Mostrar que comprenden las proporciones directas e inversas." },
                    { id: "OA 11", description: "Mostrar que comprenden el círculo (perímetro y área)." }
                ]
            },
            {
                name: "Ciencias Naturales",
                objectives: [
                    { id: "OA 1", description: "Explicar los cambios físicos, psicológicos y sociales en la pubertad." },
                    { id: "OA 2", description: "Explicar la formación de un nuevo individuo (fecundación, desarrollo embrionario)." },
                    { id: "OA 7", description: "Investigar y explicar la clasificación de la materia (sustancias puras y mezclas)." },
                    { id: "OA 10", description: "Explicar los cambios de estado de la materia (fusión, ebullición, etc.)." },
                    { id: "OA 13", description: "Investigar y explicar el ciclo de las rocas y la tectónica de placas." }
                ]
            },
            {
                name: "Historia, Geografía y Ciencias Sociales",
                objectives: [
                    { id: "OA 1", description: "Explicar el proceso de hominización y la evolución de la cultura humana." },
                    { id: "OA 3", description: "Caracterizar el surgimiento de las primeras civilizaciones (Mesopotamia, Egipto)." },
                    { id: "OA 5", description: "Caracterizar el mundo clásico (Grecia y Roma) y su legado en la actualidad." },
                    { id: "OA 9", description: "Explicar la caída del Imperio Romano y el surgimiento de la Edad Media." },
                    { id: "OA 12", description: "Analizar la relación entre el ser humano y el medio ambiente en la historia." }
                ]
            },
            {
                name: "Inglés",
                objectives: [
                    { id: "OA 1", description: "Comprender textos orales breves y simples." }
                ]
            },
            {
                name: "Educación Física y Salud",
                objectives: [
                    { id: "OA 1", description: "Demostrar habilidades motrices básicas en juegos colectivos." }
                ]
            },
            {
                name: "Artes Visuales",
                objectives: [
                    { id: "OA 1", description: "Crear trabajos de arte a partir de experiencias personales." }
                ]
            },
            {
                name: "Música",
                objectives: [
                    { id: "OA 1", description: "Escuchar música de diversos contextos." }
                ]
            },
            {
                name: "Tecnología",
                objectives: [
                    { id: "OA 1", description: "Crear diseños de objetos tecnológicos para resolver problemas." }
                ]
            },
            {
                name: "Orientación",
                objectives: [
                    { id: "OA 1", description: "Reconocer y valorar sus características personales." }
                ]
            }
        ]
    },
    {
        name: "8° Básico",
        nuclei: [
            {
                name: "Lengua y Literatura",
                objectives: [
                    { id: "OA 2", description: "Reflexionar sobre las dimensiones de la experiencia humana (amor, viaje, muerte)." },
                    { id: "OA 3", description: "Analizar las narraciones leídas para enriquecer su comprensión (narrador, tiempo)." },
                    { id: "OA 7", description: "Formular una interpretación de los textos literarios leídos o vistos." },
                    { id: "OA 12", description: "Expresarse en forma creativa por medio de la escritura (poemas, cuentos)." },
                    { id: "OA 15", description: "Escribir, revisar y editar sus textos para asegurar claridad y coherencia." }
                ]
            },
            {
                name: "Matemática",
                objectives: [
                    { id: "OA 1", description: "Mostrar que comprenden la multiplicación y división de números enteros." },
                    { id: "OA 2", description: "Utilizar potencias de base 10 con exponente entero para representar números." },
                    { id: "OA 4", description: "Mostrar que comprenden las raíces cuadradas de números naturales." },
                    { id: "OA 7", description: "Mostrar que comprenden la noción de función por medio de tablas y gráficos." },
                    { id: "OA 11", description: "Mostrar que comprenden el teorema de Pitágoras." }
                ]
            },
            {
                name: "Ciencias Naturales",
                objectives: [
                    { id: "OA 1", description: "Explicar la estructura y función de la célula (animal y vegetal)." },
                    { id: "OA 2", description: "Explicar el proceso de división celular (mitosis y meiosis)." },
                    { id: "OA 6", description: "Investigar y explicar la composición y propiedades de los gases." },
                    { id: "OA 8", description: "Investigar y explicar la estructura atómica de la materia." },
                    { id: "OA 12", description: "Investigar y explicar los fenómenos eléctricos (corriente, voltaje)." }
                ]
            },
            {
                name: "Historia, Geografía y Ciencias Sociales",
                objectives: [
                    { id: "OA 1", description: "Analizar el proceso de formación del Estado moderno (monarquías, absolutismo)." },
                    { id: "OA 3", description: "Caracterizar el Renacimiento y el Humanismo como movimientos culturales." },
                    { id: "OA 5", description: "Explicar el proceso de Reforma y Contrarreforma religiosa en Europa." },
                    { id: "OA 9", description: "Analizar el impacto de la Revolución Industrial en la sociedad y economía." },
                    { id: "OA 12", description: "Analizar el proceso de formación de la nación chilena en el siglo XIX." }
                ]
            },
            {
                name: "Inglés",
                objectives: [
                    { id: "OA 1", description: "Comprender textos orales breves y simples." }
                ]
            },
            {
                name: "Educación Física y Salud",
                objectives: [
                    { id: "OA 1", description: "Demostrar habilidades motrices básicas en juegos colectivos." }
                ]
            },
            {
                name: "Artes Visuales",
                objectives: [
                    { id: "OA 1", description: "Crear trabajos de arte a partir de experiencias personales." }
                ]
            },
            {
                name: "Música",
                objectives: [
                    { id: "OA 1", description: "Escuchar música de diversos contextos." }
                ]
            },
            {
                name: "Tecnología",
                objectives: [
                    { id: "OA 1", description: "Crear diseños de objetos tecnológicos para resolver problemas." }
                ]
            },
            {
                name: "Orientación",
                objectives: [
                    { id: "OA 1", description: "Reconocer y valorar sus características personales." }
                ]
            }
        ]
    },
    {
        name: "I Medio",
        nuclei: [
            {
                name: "Lengua y Literatura",
                objectives: [
                    { id: "OA 2", description: "Reflexionar sobre las dimensiones de la experiencia humana (amor, viaje, muerte)." },
                    { id: "OA 3", description: "Analizar las narraciones leídas para enriquecer su comprensión (narrador, tiempo)." },
                    { id: "OA 7", description: "Formular una interpretación de los textos literarios leídos o vistos." },
                    { id: "OA 12", description: "Expresarse en forma creativa por medio de la escritura (poemas, cuentos)." }
                ]
            },
            {
                name: "Matemática",
                objectives: [
                    { id: "OA 1", description: "Calcular operaciones con números racionales en forma decimal y fraccionaria." },
                    { id: "OA 2", description: "Mostrar que comprenden las potencias de base racional y exponente entero." },
                    { id: "OA 4", description: "Resolver problemas que involucren productos notables y factorización." },
                    { id: "OA 8", description: "Mostrar que comprenden el concepto de función lineal y afín." }
                ]
            },
            {
                name: "Biología",
                objectives: [
                    { id: "OA 1", description: "Explicar la evolución como un proceso de cambio en los seres vivos." },
                    { id: "OA 2", description: "Analizar la evidencia de la evolución (fósiles, anatomía comparada)." },
                    { id: "OA 5", description: "Explicar cómo la biodiversidad es resultado de la evolución." }
                ]
            },
            {
                name: "Física",
                objectives: [
                    { id: "OA 1", description: "Explicar fenómenos ondulatorios (sonido y luz) en la vida cotidiana." },
                    { id: "OA 2", description: "Analizar el funcionamiento de instrumentos ópticos y acústicos." }
                ]
            },
            {
                name: "Química",
                objectives: [
                    { id: "OA 1", description: "Explicar la formación de compuestos químicos a partir de átomos." },
                    { id: "OA 2", description: "Analizar la estructura de la tabla periódica y sus propiedades." }
                ]
            },
            {
                name: "Historia, Geografía y Ciencias Sociales",
                objectives: [
                    { id: "OA 1", description: "Analizar el proceso de formación de los Estados nacionales en Europa y América." },
                    { id: "OA 3", description: "Caracterizar la idea de progreso indefinido en el siglo XIX." }
                ]
            },
            {
                name: "Inglés",
                objectives: [
                    { id: "OA 1", description: "Comprender textos orales y escritos en diversos contextos." }
                ]
            },
            {
                name: "Educación Física y Salud",
                objectives: [
                    { id: "OA 1", description: "Perfeccionar habilidades motrices en diversos deportes." }
                ]
            }
        ]
    },
    {
        name: "II Medio",
        nuclei: [
            {
                name: "Lengua y Literatura",
                objectives: [
                    { id: "OA 2", description: "Reflexionar sobre las dimensiones de la experiencia humana (identidad, libertad)." },
                    { id: "OA 3", description: "Analizar las narraciones leídas para enriquecer su comprensión (voces narrativas)." }
                ]
            },
            {
                name: "Matemática",
                objectives: [
                    { id: "OA 1", description: "Mostrar que comprenden los números reales (irracionales y racionales)." },
                    { id: "OA 2", description: "Mostrar que comprenden las propiedades de las raíces enésimas." },
                    { id: "OA 4", description: "Resolver ecuaciones de segundo grado con una incógnita." }
                ]
            },
            {
                name: "Biología",
                objectives: [
                    { id: "OA 1", description: "Explicar cómo el sistema nervioso y endocrino coordinan el organismo." },
                    { id: "OA 2", description: "Analizar el efecto de las drogas en el sistema nervioso." }
                ]
            },
            {
                name: "Física",
                objectives: [
                    { id: "OA 1", description: "Explicar el movimiento rectilíneo uniforme y acelerado." },
                    { id: "OA 2", description: "Analizar las leyes de Newton y sus aplicaciones." }
                ]
            },
            {
                name: "Química",
                objectives: [
                    { id: "OA 1", description: "Explicar las reacciones químicas y sus leyes de combinación." },
                    { id: "OA 2", description: "Analizar la estequiometría en procesos químicos." }
                ]
            },
            {
                name: "Historia, Geografía y Ciencias Sociales",
                objectives: [
                    { id: "OA 1", description: "Analizar la Primera Guerra Mundial y sus consecuencias en el mundo." },
                    { id: "OA 2", description: "Caracterizar los regímenes totalitarios del siglo XX." }
                ]
            },
            {
                name: "Inglés",
                objectives: [
                    { id: "OA 1", description: "Comprender textos orales y escritos en diversos contextos." }
                ]
            },
            {
                name: "Educación Física y Salud",
                objectives: [
                    { id: "OA 1", description: "Perfeccionar habilidades motrices en diversos deportes." }
                ]
            }
        ]
    },
    {
        name: "III Medio",
        nuclei: [
            {
                name: "Lengua y Literatura",
                objectives: [
                    { id: "OA 1", description: "Formular interpretaciones de textos literarios que aborden temas de la experiencia humana." },
                    { id: "OA 2", description: "Analizar críticamente textos de diversos géneros discursivos no literarios." }
                ]
            },
            {
                name: "Matemática",
                objectives: [
                    { id: "OA 1", description: "Tomar decisiones en situaciones de incerteza que involucren análisis de datos." },
                    { id: "OA 2", description: "Modelar situaciones o fenómenos usando funciones exponenciales y logarítmicas." }
                ]
            },
            {
                name: "Educación Ciudadana",
                objectives: [
                    { id: "OA 1", description: "Analizar los fundamentos y desafíos de la democracia en Chile." },
                    { id: "OA 2", description: "Evaluar la importancia de la participación ciudadana en el sistema democrático." }
                ]
            },
            {
                name: "Filosofía",
                objectives: [
                    { id: "OA 1", description: "Explicar los alcances y límites del conocimiento filosófico." },
                    { id: "OA 2", description: "Analizar problemas éticos contemporáneos desde diversas perspectivas filosóficas." }
                ]
            },
            {
                name: "Ciencias para la Ciudadanía",
                objectives: [
                    { id: "OA 1", description: "Analizar el impacto de la actividad humana en el medio ambiente." },
                    { id: "OA 2", description: "Evaluar el uso de tecnologías en la resolución de problemas cotidianos." }
                ]
            },
            {
                name: "Inglés",
                objectives: [
                    { id: "OA 1", description: "Comprender textos orales y escritos en diversos contextos." }
                ]
            },
            {
                name: "Educación Física y Salud",
                objectives: [
                    { id: "OA 1", description: "Perfeccionar habilidades motrices en diversos deportes." }
                ]
            }
        ]
    },
    {
        name: "IV Medio",
        nuclei: [
            {
                name: "Lengua y Literatura",
                objectives: [
                    { id: "OA 1", description: "Producir textos de diversos géneros discursivos para comunicar ideas." },
                    { id: "OA 2", description: "Evaluar críticamente la validez de los argumentos en diversos textos." }
                ]
            },
            {
                name: "Matemática",
                objectives: [
                    { id: "OA 1", description: "Utilizar modelos matemáticos para resolver problemas de la vida cotidiana." },
                    { id: "OA 2", description: "Analizar la variabilidad de datos en situaciones de incerteza." }
                ]
            },
            {
                name: "Educación Ciudadana",
                objectives: [
                    { id: "OA 1", description: "Analizar el rol del Estado en la protección de los derechos humanos." },
                    { id: "OA 2", description: "Evaluar los desafíos de la convivencia en una sociedad pluralista." }
                ]
            },
            {
                name: "Filosofía",
                objectives: [
                    { id: "OA 1", description: "Reflexionar sobre el sentido de la existencia humana desde la filosofía." },
                    { id: "OA 2", description: "Analizar la relación entre la filosofía y otras formas de conocimiento." }
                ]
            },
            {
                name: "Ciencias para la Ciudadanía",
                objectives: [
                    { id: "OA 1", description: "Analizar los desafíos de la salud pública en el siglo XXI." },
                    { id: "OA 2", description: "Evaluar el impacto de la biotecnología en la sociedad contemporánea." }
                ]
            },
            {
                name: "Inglés",
                objectives: [
                    { id: "OA 1", description: "Comprender textos orales y escritos en diversos contextos." }
                ]
            },
            {
                name: "Educación Física y Salud",
                objectives: [
                    { id: "OA 1", description: "Perfeccionar habilidades motrices en diversos deportes." }
                ]
            }
        ]
    }
];
