//Para verificar que el usuario ha iniciado sesión, solo se puede acceder si se ha iniciado sesión
var usuarioIniciado = sessionStorage.getItem("id");
if (usuarioIniciado == null){
    window.location.replace("./sign-in.html");
} else {
    console.log("Identificador del usuario: "+usuarioIniciado);
}

//Array donde estan todas las preguntas del examen
const preguntasExamenJSTRC = [
    {
        //Pregunta 1
        pregunta: "¿Cual es la aerolinea de bandera de Pais Chiquitín?",
        imagen: "./img/test_jstrc/pregunta_1.png",
        respuestaCorrecta: "Chiquitín Airlines",
        respuestaIncorrecta1: "Air Chiquin",
        respuestaIncorrecta2: "Aerolineas Chiquitianas",
        respuestaIncorrecta3: "No hay aerolinea de bandera"
    },
    {
        //Pregunta 2
        pregunta: "¿Que avión es este?",
        imagen: "./img/test_jstrc/pregunta_2.png",
        respuestaCorrecta: "C400-300",
        respuestaIncorrecta1: "C400-100",
        respuestaIncorrecta2: "Boeing 737-700",
        respuestaIncorrecta3: "C400-200"
    },
    {
        //Pregunta 3
        pregunta: "¿Que variantes del Chiquitín C400 aún siguen en producción?",
        imagen: "./img/test_jstrc/pregunta_3.png",
        respuestaCorrecta: "Versión de carga y versiones militares",
        respuestaIncorrecta1: "Versión de carga unicamente",
        respuestaIncorrecta2: "Versiones militares unicamente",
        respuestaIncorrecta3: "Ya no esta en producción"
    },
    {
        //Pregunta 4
        pregunta: "¿Cual es la ruta aerea más concurrida de Pais Chiquitin?",
        imagen: "./img/test_jstrc/pregunta_4.png",
        respuestaCorrecta: "Ciudad Chiquitín (ACH) a Ciudad Chiquin (ACN)",
        respuestaIncorrecta1: "Ciudad Chiquitín (CHN) a la Isla de Kai'Sa (KSA)",
        respuestaIncorrecta2: "Ciudad Chiquin (ACN) a Solari (SRL)",
        respuestaIncorrecta3: "Isla del Vacío (VOI) a Shurima (SHM)"
    },
    {
        //Pregunta 5
        pregunta: "¿Cuales son los aviones más grandes que operan la ruta más concurrida?",
        imagen: "./img/test_jstrc/pregunta_5.png",
        respuestaCorrecta: "Los Boeing 777-300 de Air Chiquin y el Boeing 747-400D de Chiquitin Airlines",
        respuestaIncorrecta1: "Los Airbus A380-800 de Chiquitin Airlines y los Boeing 777-300ER de Air Chiquin",
        respuestaIncorrecta2: "Los Boeing 767-400ER de Chiquitin Airlines y los Airbus A340-600 de Air Chiquin",
        respuestaIncorrecta3: "Los Airbus A320 y Boeing 737 de multiples aerolineas"
    },
    {
        //Pregunta 6
        pregunta: "¿Cual es el modelo de negocio de Aloe Air?",
        imagen: "./img/test_jstrc/pregunta_6.png",
        respuestaCorrecta: "Low-cost de largo y medio radio",
        respuestaIncorrecta1: "Aerolinea charter",
        respuestaIncorrecta2: "Low-cost de corto radio",
        respuestaIncorrecta3: "Ultra-low-cost de corto radio"
    },
    {
        //Pregunta 7
        pregunta: "¿Cual es la ultima iteración del CHJ 100?",
        imagen: "./img/test_jstrc/pregunta_7.png",
        respuestaCorrecta: "CHJ 100 MAX 9",
        respuestaIncorrecta1: "CHJ 100-1000LR",
        respuestaIncorrecta2: "CHJ 100 MPA",
        respuestaIncorrecta3: "CHJ 100 MAX 10"
    },
    {
        //Pregunta 8
        pregunta: "¿De donde provienen los nombres de los primeros Airbus A320neo de Air Chiquin (por ejemplo CHN830AC, Akane Kurokawa)?",
        imagen: "./img/test_jstrc/pregunta_8.png",
        respuestaCorrecta: "Colaboración con el anime y manga Oshi No Ko",
        respuestaIncorrecta1: "Ciudades de España y Portugal",
        respuestaIncorrecta2: "Artistas de Pais Chiquitín",
        respuestaIncorrecta3: "Parques naturales de Pais Chiquitín"
    },
    {
        //Pregunta 9
        pregunta: "¿Cuantos CHJ 520-800 tiene en operación Air Chiquin?",
        imagen: "./img/test_jstrc/pregunta_9.png",
        respuestaCorrecta: "40",
        respuestaIncorrecta1: "30",
        respuestaIncorrecta2: "25",
        respuestaIncorrecta3: "Air Chiquin no opera este avión"
    },
    {
        //Pregunta 10
        pregunta: "¿Que aerolinea que habia cerrado ha reanudado operaciones este año?",
        imagen: "./img/test_jstrc/pregunta_10.png",
        respuestaCorrecta: "Air David",
        respuestaIncorrecta1: "Chiquitin International Airlines",
        respuestaIncorrecta2: "Real Chiquin",
        respuestaIncorrecta3: "Ninguna"
    },
    {
        //Pregunta 11
        pregunta: "¿Que avión es este?",
        imagen: "./img/test_jstrc/pregunta_11.png",
        respuestaCorrecta: "Chiquitín C600-800",
        respuestaIncorrecta1: "Boeing 787-8 Dreamliner",
        respuestaIncorrecta2: "Airbus A330-800neo",
        respuestaIncorrecta3: "CHJ 900-100"
    },
    {
        //Pregunta 12
        pregunta: "¿Que avión es 'ZA002' de la ROChAF?",
        imagen: "./img/test_jstrc/pregunta_12.png",
        respuestaCorrecta: "Boeing 757-2ZA",
        respuestaIncorrecta1: "Chiquitin C500-106",
        respuestaIncorrecta2: "Airbus A310-308",
        respuestaIncorrecta3: "Chiquitin C300-202"
    },
    {
        //Pregunta 13
        pregunta: "¿Que motores hay en funcionamiento en los B772 de Air Chiquin?",
        imagen: "./img/test_jstrc/pregunta_13.png",
        respuestaCorrecta: "Pratt & Withney PW4077",
        respuestaIncorrecta1: "General ElectricGE90-76B",
        respuestaIncorrecta2: "Rolls Royce Trent 895",
        respuestaIncorrecta3: "Air Chiquin no opera el B772"
    },
    {
        //Pregunta 14
        pregunta: "¿Cual es el Boeing Customer Code de Chiquitin Airlines?",
        imagen: "./img/test_jstrc/pregunta_14.png",
        respuestaCorrecta: "79",
        respuestaIncorrecta1: "CH",
        respuestaIncorrecta2: "39",
        respuestaIncorrecta3: "A2"
    },
    {
        //Pregunta 15
        pregunta: "¿Cual es el vuelo internacional más largo que hay en servicio desde Pais Chiquitín?",
        imagen: "./img/test_jstrc/pregunta_15.png",
        respuestaCorrecta: "Ciudad Chiquin (ACN) a Santiago de Chile (SCL) con un Boeing 777-200LR de Air Chiquin",
        respuestaIncorrecta1: "Ciudad Chiquitin (CHN) a Nueva York (JFK) con un Boeing 777-300ER de Chiquitin Airlines",
        respuestaIncorrecta2: "Ciudad Chiquin (ACN) a Madrid (MAD) con un Airbus A340-600 de Air Chiquin",
        respuestaIncorrecta3: "Ciudad Chiquitín (CHN) a Toronto (YYZ) con un Boeing 747-8i de Chiquitin Airlines"
    },
    {
        //Pregunta 16
        pregunta: "¿Cual es el vuelo internacional más concurrido que hay en Pais Chiquitín?",
        imagen: "./img/test_jstrc/pregunta_16.png",
        respuestaCorrecta: "Ciudad Chiquin (ACN) a Seoul Incheon (ICN)",
        respuestaIncorrecta1: "Ciudad Chiquitin (CHN) a Tokyo Narita (NRT)",
        respuestaIncorrecta2: "Ciudad Chiquitín (CHN) a Madrid (MAD)",
        respuestaIncorrecta3: "Isla de Kai'Sa (KSA) a Sapporo Chitose (CTS)"
    },
    {
        //Pregunta 17
        pregunta: "¿Cual es el Boeing Customer Code de Air Chiquin?",
        imagen: "./img/test_jstrc/pregunta_17.png",
        respuestaCorrecta: "AC",
        respuestaIncorrecta1: "CA",
        respuestaIncorrecta2: "CH",
        respuestaIncorrecta3: "FA"
    },
    {
        //Pregunta 18
        pregunta: "¿Que avión es este?",
        imagen: "./img/test_jstrc/pregunta_18.png",
        respuestaCorrecta: "CHJ 520-800",
        respuestaIncorrecta1: "CHJ 520-100",
        respuestaIncorrecta2: "CHJ 500-800F",
        respuestaIncorrecta3: "CHJ 500-100"
    },
    {
        //Pregunta 19
        pregunta: "¿Cual es la aerolinea más antigua (fundada en 1922)?",
        imagen: "./img/test_jstrc/pregunta_19.png",
        respuestaCorrecta: "Aerolineas Chiquitianas",
        respuestaIncorrecta1: "Chiquitin Airlines",
        respuestaIncorrecta2: "Chiquitin International Airlines",
        respuestaIncorrecta3: "CargoWatch"
    },
    {
        //Pregunta 20
        pregunta: "¿Cual es la aerolinea más reciente (fundada en 2023)?",
        imagen: "./img/test_jstrc/pregunta_20.png",
        respuestaCorrecta: "Star Chiquin",
        respuestaIncorrecta1: "Aloe Air",
        respuestaIncorrecta2: "Yellow Airlines",
        respuestaIncorrecta3: "Aerospace Innovations"
    },
    {
        //Pregunta 21
        pregunta: "¿Cual es la principal aerolinea low-cost?",
        imagen: "./img/test_jstrc/pregunta_21.png",
        respuestaCorrecta: "Yellow Airlines",
        respuestaIncorrecta1: "Chiquitin Express",
        respuestaIncorrecta2: "Aloe Air",
        respuestaIncorrecta3: "Air Chiquin Express"
    },
    {
        //Pregunta 22
        pregunta: "¿A que alianza pertenece Air Chiquin?",
        imagen: "./img/test_jstrc/pregunta_22.png",
        respuestaCorrecta: "OneWorld",
        respuestaIncorrecta1: "Star Alliance",
        respuestaIncorrecta2: "Sky Team",
        respuestaIncorrecta3: "No esta en ninguna"
    },
    {
        //Pregunta 23
        pregunta: "¿Que aeropuerto es el que 'más restricciones' tiene actualmente para vuelos?",
        imagen: "./img/test_jstrc/pregunta_23.png",
        respuestaCorrecta: "Aeropuerto de la Isla del Vacío (KVS)",
        respuestaIncorrecta1: "Aeropuerto de la Isla de Bel'Veth (KBV)",
        respuestaIncorrecta2: "Aeropuerto de Chiquitín.S.A. (CHX)",
        respuestaIncorrecta3: "Aeropuerto del Valle Soleado (VSA)"
    },
    {
        //Pregunta 24
        pregunta: "¿Pueden operar aerolineas extranjeras en el Aeropuerto de la Isla del Vacío?",
        imagen: "./img/test_jstrc/pregunta_24.png",
        respuestaCorrecta: "Si, All Nippon Airways y Japan Airlines",
        respuestaIncorrecta1: "No, no hay vuelos internacionales",
        respuestaIncorrecta2: "Si, unicamente puede Korean Air",
        respuestaIncorrecta3: "Si, no hay restricciones para ello"
    },
    {
        //Pregunta 25
        pregunta: "¿Cual es el avión más inseguro fabricado en Pais Chiquitín?",
        imagen: "./img/test_jstrc/pregunta_25.png",
        respuestaCorrecta: "C600-200D",
        respuestaIncorrecta1: "C600-100",
        respuestaIncorrecta2: "CHJ 500-100",
        respuestaIncorrecta3: "C400-500"
    },
    {
        //Pregunta 26
        pregunta: "¿Que avión es este?",
        imagen: "./img/test_jstrc/pregunta_26.png",
        respuestaCorrecta: "CHJ 560-700",
        respuestaIncorrecta1: "CHJ 700-100",
        respuestaIncorrecta2: "C400-800",
        respuestaIncorrecta3: "CHJ 600-100"
    },
    {
        //Pregunta 27
        pregunta: "¿Que avión AEW&C ha producido Chiquitín.S.A. ultimamente?",
        imagen: "./img/test_jstrc/pregunta_27.png",
        respuestaCorrecta: "Chiquitín E-56 Sentinel (C400-300)",
        respuestaIncorrecta1: "Chiquitín E-60 Centurion (C400-300)",
        respuestaIncorrecta2: "Chiquitín P-43 Atlantis (C400-300)",
        respuestaIncorrecta3: "Chiquitín E-46 (C300-100), aún no ha desarrollado algo nuevo"
    },
    {
        //Pregunta 28
        pregunta: "¿Que hay presente en la cola de los aviones destinados al transporte presidencial de la Republica de Chiquitín?",
        imagen: "./img/test_jstrc/pregunta_28.png",
        respuestaCorrecta: "ZA (Zulu Alpha) y la silueta de Chiquitín",
        respuestaIncorrecta1: "ZA (Zulu Alpha) y la región en la que esten basados",
        respuestaIncorrecta2: "La bandera de la republica unicamente",
        respuestaIncorrecta3: "Nada"
    },
    {
        //Pregunta 29
        pregunta: "¿Que aerolinea ha mantenido más tiempo su imagen corporativa sin modificaciones?",
        imagen: "./img/test_jstrc/pregunta_29.png",
        respuestaCorrecta: "Air Chiquin",
        respuestaIncorrecta1: "Chiquitín Airlines",
        respuestaIncorrecta2: "Aerolineas Chiquitianas",
        respuestaIncorrecta3: "La ROChAF (Republic Of Chiquitín Air Force)"
    },
    {
        //Pregunta 30
        pregunta: "¿Quien es el creador de TODOS los aviones de Chiquitín.S.A. y TODAS las aerolineas de Pais Chiquitín?",
        imagen: "./img/test_jstrc/pregunta_30.png",
        respuestaCorrecta: "daviddrm52",
        respuestaIncorrecta1: "Un conglomerado de gente",
        respuestaIncorrecta2: "Chiquitín",
        respuestaIncorrecta3: "Un usuario aleatorio"
    },
];

//Variables que cuentan cuantas preguntas llevamos bien y mal, ademas de en cual estamos
let indicePreguntaActual = 0;
let respuestasCorrectas = 0;
let respuestasIncorrectas = 0;
let tiempoTotal = 0;
let examenFinalizado = false;
let puntuacionExamen = 0;

//Variables para poder poner las cosas en el html y eso
let numeroPregunta = document.getElementById("numeroPregunta");
const preguntaPropuesta = document.getElementById("preguntaPropuestaExamen");
const boton1 = document.getElementById("boton1");
const boton2 = document.getElementById("boton2");
const boton3 = document.getElementById("boton3");
const boton4 = document.getElementById("boton4");
const imagenPregunta = document.getElementById("imagenPregunta")
const mensajeSuspenso = document.getElementById("mensajeSuspenso");
const mensajeAprobado = document.getElementById("mensajeAprobado");
const mensajeExcelente = document.getElementById("mensajeExcelente");

//Variables en relación del tiempo
let cronometro;
let fechaActual = new Date();
let tiempoExamen = document.getElementById("tiempoExamen")
fechaActual.setHours(0,0,0,0);
tiempoExamen.innerHTML  = "00:00:00";

//Funcion que servira como cronometro
function cronometroExamen(){
    let horas = fechaActual.getHours();
    let minutos = fechaActual.getMinutes();
    let segundos = fechaActual.getSeconds();
    segundos += 1;
    if (segundos == 60){
        segundos = 0;
        minutos += 1;
        fechaActual.setMinutes(minutos);
    };
    if (minutos == 60){
        minutos = 0;
        horas += 1;
        fechaActual.setHours(horas);
    };
    fechaActual.setSeconds(segundos);
    if (horas < 10) { horas = "0" + horas;}
    if (minutos < 10) { minutos = "0" + minutos;}
    if (segundos < 10) { segundos = "0" + segundos;}
    tiempoExamen.innerHTML = horas + ":" + minutos + ":" + segundos;   
    tiempoTotal = horas + ":" + minutos + ":" + segundos;
};

//Segundo set de variables
const iniciarExamen = document.getElementById("iniciarExamen");
const informacionJuego = document.getElementsByClassName("habitación-juego");

//Funcion que baraja las respuestas
function mezcladorRespuestas(correcta, incorrecta1, incorrecta2, incorrecta3) {
    const respuestas = [correcta, incorrecta1, incorrecta2, incorrecta3];
    respuestas.sort(() => Math.random() - 0.5);
    return respuestas;
};

//Funcion que va a mostrar la pregunta, con sus respuestas
function mostrandoPreguntaActual(){
    console.log(indicePreguntaActual);
    console.log(preguntasExamenJSTRC.length);
    if(indicePreguntaActual < preguntasExamenJSTRC.length){
        numeroPregunta.textContent = "Pregunta "+(indicePreguntaActual+1);
        const preguntaActual = preguntasExamenJSTRC[indicePreguntaActual];
        preguntaPropuesta.textContent = preguntaActual.pregunta;
        imagenPregunta.src = preguntaActual.imagen;
        const [mezclaCorrecto, mezclaIncorrecto1, mezclaIncorrecto2, mezclaIncorrecto3] = mezcladorRespuestas(
            preguntaActual.respuestaCorrecta,
            preguntaActual.respuestaIncorrecta1,
            preguntaActual.respuestaIncorrecta2,
            preguntaActual.respuestaIncorrecta3
        );
        boton1.textContent = mezclaCorrecto;    
        boton2.textContent = mezclaIncorrecto1;
        boton3.textContent = mezclaIncorrecto2;
        boton4.textContent = mezclaIncorrecto3;
        console.log("Pregunta mostrada. Preguntas acertadas: "+respuestasCorrectas+" Preguntas fallidas: "+respuestasIncorrectas);
        console.log(examenFinalizado);
    } else {
        if(examenFinalizado){
            mostrandoResultados();
        } else {
            console.log("Examen aún en curso...");
        }
    };
};

function mostrandoResultados(){
    console.log("Examen finalizado, mostrando resultados...");
    clearInterval(cronometro);
    if(respuestasCorrectas === preguntasExamenJSTRC.length){
        mensajeExcelente.style.display = "block"
        document.getElementById("resultadoExamenExcelente").textContent = `Preguntas correctas: ${respuestasCorrectas}. Preguntas fallidas; ${respuestasIncorrectas}. Tiempo: ${tiempoTotal}. Puntuación: ${puntuacionExamen}`;
        document.getElementById("examenJSTRC").style.display = "none";
        document.getElementById("resultadoExamen").style.display = "block";
    } else if (respuestasIncorrectas > 5){
        mensajeSuspenso.style.display = "block";
        document.getElementById("resultadoExamenSuspenso").textContent = `Preguntas correctas: ${respuestasCorrectas}. Preguntas fallidas; ${respuestasIncorrectas}. Tiempo: ${tiempoTotal}. Puntuación: ${puntuacionExamen}`;
        document.getElementById("examenJSTRC").style.display = "none";
        document.getElementById("resultadoExamen").style.display = "block";
    } else {
        mensajeAprobado.style.display = "block"
        document.getElementById("resultadoExamenAprobado").textContent = `Has aprobado, bien hecho. Preguntas correctas: ${respuestasCorrectas}. Preguntas fallidas; ${respuestasIncorrectas}. Tiempo: ${tiempoTotal}. Puntuación: ${puntuacionExamen}`;
        document.getElementById("examenJSTRC").style.display = "none";
        document.getElementById("resultadoExamen").style.display = "block";
    };
}

//Funcion que comprueba la respuesta
function compruebaRespuesta(respuestaSeleccionada){
    const preguntaActual = preguntasExamenJSTRC[indicePreguntaActual];
    console.log(indicePreguntaActual, preguntasExamenJSTRC.length);
    if(respuestaSeleccionada === preguntaActual.respuestaCorrecta){
        respuestasCorrectas++;
        puntuacionExamen = puntuacionExamen + 100;
    } else {
        respuestasIncorrectas++;
        puntuacionExamen = puntuacionExamen -50;
    };
    if((indicePreguntaActual+1) == preguntasExamenJSTRC.length){
        indicePreguntaActual++;
        examenFinalizado = true;
        mostrandoPreguntaActual();
    } else {
        indicePreguntaActual++;
        mostrandoPreguntaActual();
    }
};

//Event Listeners
boton1.addEventListener("click", () => compruebaRespuesta(boton1.textContent));
boton2.addEventListener("click", () => compruebaRespuesta(boton2.textContent));
boton3.addEventListener("click", () => compruebaRespuesta(boton3.textContent));
boton4.addEventListener("click", () => compruebaRespuesta(boton4.textContent));
iniciarExamen.addEventListener("click", (event) => {
    mostrandoPreguntaActual();
    cronometro = setInterval(cronometroExamen, 1000);
    document.getElementById("examenJSTRC").style.display = "block";
    document.getElementById("informacion-juego").style.display = "none";
})