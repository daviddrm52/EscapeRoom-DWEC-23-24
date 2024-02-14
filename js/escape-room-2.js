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
        pregunta: "¿Cual es la aerolinea de bandera de Pais Chiquitín?",
        imagen: "./img/test_jstrc/CHN100CH_C569_CH.png",
        respuestaCorrecta: "Chiquitín Airlines",
        respuestaIncorrecta1: "Air Chiquin",
        respuestaIncorrecta2: "Aerolineas Chiquitianas",
        respuestaIncorrecta3: "No hay aerolinea de bandera"
    },
    {
        pregunta: "¿Que avión es este?",
        imagen: "#",
        respuestaCorrecta: "C400-300 Combi",
        respuestaIncorrecta1: "C400-100",
        respuestaIncorrecta2: "C400-300",
        respuestaIncorrecta3: "C400-200"
    },
    {
        pregunta: "¿Que variantes del Chiquitín C400 aún siguen en producción?",
        imagen: "#",
        respuestaCorrecta: "Versión de carga y versiones militares",
        respuestaIncorrecta1: "Versión de carga unicamente",
        respuestaIncorrecta2: "Versiones militares unicamente",
        respuestaIncorrecta3: "Ya no esta en producción"
    },
    {
        pregunta: "¿Cual es la ruta aerea más concurrida de Pais Chiquitin?",
        imagen: "#",
        respuestaCorrecta: "Ciudad Chiquitín (ACH) a Ciudad Chiquin (ACN)",
        respuestaIncorrecta1: "Ciudad Chiquitín (CHN) a la Isla de Kai'Sa (KSA)",
        respuestaIncorrecta2: "Ciudad Chiquin (ACN) a Solari (SRL)",
        respuestaIncorrecta3: "Isla del Vacío (VOI) a Shurima (SHM)"
    },
    {
        pregunta: "¿Cuales son los aviones más grandes que operan la ruta más concurrida?",
        imagen: "#",
        respuestaCorrecta: "Los Boeing 777-300 de Air Chiquin y el Boeing 747-400D de Chiquitin Airlines",
        respuestaIncorrecta1: "Los Airbus A380-800 de Chiquitin Airlines y los Boeing 777-300ER de Air Chiquin",
        respuestaIncorrecta2: "Los Boeing 767-400ER de Chiquitin Airlines y los Airbus A340-600 de Air Chiquin",
        respuestaIncorrecta3: "Los Airbus A320 y Boeing 737 de multiples aerolineas"
    },
    {
        pregunta: "¿Cual es el modelo de negocio de Aloe Air?",
        imagen: "#",
        respuestaCorrecta: "Low-cost de largo y medio radio",
        respuestaIncorrecta1: "Aerolinea charter",
        respuestaIncorrecta2: "Low-cost de corto radio",
        respuestaIncorrecta3: "Ultra-low-cost de corto radio"
    },
    {
        pregunta: "¿Cual es la ultima iteración del CHJ 100?",
        imagen: "#",
        respuestaCorrecta: "CHJ 100 MAX 9",
        respuestaIncorrecta1: "CHJ 100-1000LR",
        respuestaIncorrecta2: "CHJ 100 MPA",
        respuestaIncorrecta3: "CHJ 100 MAX 10"
    },
    {
        pregunta: "¿De donde provienen los nombres de los primeros Airbus A320neo de Air Chiquin (por ejemplo CHN830AC, Akane Kurokawa)?",
        imagen: "#",
        respuestaCorrecta: "Colaboración con el anime y manga Oshi No Ko",
        respuestaIncorrecta1: "Ciudades de España y Portugal",
        respuestaIncorrecta2: "Artistas de Pais Chiquitín",
        respuestaIncorrecta3: "Parques naturales de Pais Chiquitín"
    },
    {
        pregunta: "¿Cuantos CHJ 520-800 tiene en operación Air Chiquin?",
        imagen: "#",
        respuestaCorrecta: "40",
        respuestaIncorrecta1: "30",
        respuestaIncorrecta2: "25",
        respuestaIncorrecta3: "Air Chiquin no opera este avión"
    },
    {
        pregunta: "¿Que avión de Chiquitin Airlines ha sido retirado este año?",
        imagen: "#",
        respuestaCorrecta: "El Boeing 767-300ER",
        respuestaIncorrecta1: "El Airbus A321-200",
        respuestaIncorrecta2: "El Boeing 757-200",
        respuestaIncorrecta3: "El Chiquitín C600-300"
    },
    {
        pregunta: "¿Que avión es este?",
        imagen: "#",
        respuestaCorrecta: "Chiquitín C600-800",
        respuestaIncorrecta1: "Boeing 787-8 Dreamliner",
        respuestaIncorrecta2: "Airbus A330-800neo",
        respuestaIncorrecta3: "CHJ 900-100"
    },
];

//Variables que cuentan cuantas preguntas llevamos bien y mal, ademas de en cual estamos
let indicePreguntaActual = 0;
let respuestasCorrectas = 0;
let respuestasIncorrectas = 0;
let tiempoTotal = 0;
let examenFinalizado = false;

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
        mensajeExcelente.textContent = "¡Has respondido todas las preguntas bien!"
        document.getElementById("examenJSTRC").style.display = "none";
        document.getElementById("resultadoExamen").style.display = "block";
    } else if (respuestasIncorrectas > 5){
        mensajeSuspenso.style.display = "block";
        document.getElementById("examenJSTRC").style.display = "none";
        document.getElementById("resultadoExamen").style.display = "block";
    } else {
        mensajeAprobado.textContent = `Has aprobado, bien hecho. Preguntas correctas: ${respuestasCorrectas}. Preguntas fallidas; ${respuestasIncorrectas}. Tiempo: `;
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
    } else {
        respuestasIncorrectas++;
    }
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