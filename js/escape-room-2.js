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
];

//Variables que cuentan cuantas preguntas llevamos bien y mal, ademas de en cual estamos
let indicePreguntaActual = 0;
let respuestasCorrectas = 0;
let respuestasIncorrectas = 0;

//Variables para poder poner las cosas en el html y eso
const preguntaPropuesta = document.getElementById("preguntaPropuestaExamen");
const boton1 = document.getElementById("boton1");
const boton2 = document.getElementById("boton2");
const boton3 = document.getElementById("boton3");
const boton4 = document.getElementById("boton4");
const imagenPregunta = document.getElementById("imagenPregunta")
const mensajeSuspenso = document.getElementById("mensajeSuspenso");
const mensajeAprobado = document.getElementById("mensajeAprobado");
const mensajeExcelente = document.getElementById("mensajeExcelente");

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
    if(indicePreguntaActual < preguntasExamenJSTRC.length){
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
    } else {
        if(respuestasCorrectas === preguntasExamenJSTRC.length){
            mensajeExcelente.textContent = "¡Has respondido todas las preguntas bien!"
        } else if (respuestasIncorrectas > 5){
            mensajeSuspenso.textContent = "Has suspendido el examen";
        } else {
            mensajeAprobado.textContent = `Has aprobado, bien hecho. Preguntas correctas: ${respuestasCorrectas}. Preguntas fallidas; ${respuestasIncorrectas}. Tiempo: `;
        };
    };
};

//Funcion que comprueba la respuesta
function compruebaRespuesta(respuestaSeleccionada){
    const preguntaActual = preguntasExamenJSTRC[indicePreguntaActual];
    if(respuestaSeleccionada === preguntaActual.respuestaCorrecta){
        respuestasCorrectas++;
    } else {
        respuestasIncorrectas++;
    }
    indicePreguntaActual++;
    mostrandoPreguntaActual();
};

//Event Listeners
boton1.addEventListener("click", () => compruebaRespuesta(boton1.textContent));
boton2.addEventListener("click", () => compruebaRespuesta(boton2.textContent));
boton3.addEventListener("click", () => compruebaRespuesta(boton3.textContent));
boton4.addEventListener("click", () => compruebaRespuesta(boton4.textContent));
iniciarExamen.addEventListener("click", (event) => {
    mostrandoPreguntaActual();
})