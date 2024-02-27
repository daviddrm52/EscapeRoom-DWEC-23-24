//Para verificar que el usuario ha iniciado sesión, solo se puede acceder si se ha iniciado sesión
var usuarioIniciado = sessionStorage.getItem("id");
if (usuarioIniciado == null){
    window.location.replace("./sign-in.html");
} else {
    console.log("Identificador del usuario: "+usuarioIniciado);
}
//JSON donde estan todas las preguntas del examen (version nacional)
import preguntasNacionales from "./../misc/nationalExamJSTRC.json" assert {type: 'json'};
//JSON donde estan todas las preguntas del examen (version internacional)
import preguntasInternacionales from "./../misc/internationalExamJSTRC.json" assert {type: 'json'};

//La primera ronda será el examen nacional
// let preguntasExamenJSTRC = preguntasNacionales;
let preguntasExamenJSTRC = preguntasInternacionales;

//Variables que cuentan cuantas preguntas llevamos bien y mal, ademas de en cual estamos
let indicePreguntaActual = 0;
let respuestasCorrectas = 0;
let respuestasIncorrectas = 0;
let tiempoTotal = 0;
let examenFinalizado = false;
let puntuacionExamen = 0;
let examenCancelado = false;

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
const mensajeAbandono = document.getElementById("mensajeAbandono");
let nombreJugador = sessionStorage.getItem('nombreUsuario');
var nombrePartida = "examen-"+nombreJugador;
document.getElementById("nombreJugador").innerHTML = nombreJugador;

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
        };
    };
};

function mostrandoResultados(){
    console.log("Examen finalizado, mostrando resultados...");
    var estadoExamen;
    clearInterval(cronometro);
    if(examenCancelado){
        mensajeAbandono.style.display = "block";
        document.getElementById("resultadoExamenAbandonado").textContent = `Preguntas correctas: ${respuestasCorrectas}. Preguntas fallidas; ${respuestasIncorrectas}. Tiempo: ${tiempoTotal}. Puntuación: ${puntuacionExamen}`;
        document.getElementById("examenJSTRC").style.display = "none";
        document.getElementById("resultadoExamen").style.display = "block";
        estadoExamen = "No finalizado";
    } else {
        if(respuestasCorrectas > 1/*=== preguntasExamenJSTRC.length*/){
            mensajeExcelente.style.display = "block"
            document.getElementById("resultadoExamenExcelente").textContent = `Preguntas correctas: ${respuestasCorrectas}. Preguntas fallidas; ${respuestasIncorrectas}. Tiempo: ${tiempoTotal}. Puntuación: ${puntuacionExamen}`;
            document.getElementById("examenJSTRC").style.display = "none";
            document.getElementById("resultadoExamen").style.display = "block";
            estadoExamen = "Excelente";
        } else if (respuestasIncorrectas > 5){
            mensajeSuspenso.style.display = "block";
            document.getElementById("resultadoExamenSuspenso").textContent = `Preguntas correctas: ${respuestasCorrectas}. Preguntas fallidas; ${respuestasIncorrectas}. Tiempo: ${tiempoTotal}. Puntuación: ${puntuacionExamen}`;
            document.getElementById("examenJSTRC").style.display = "none";
            document.getElementById("resultadoExamen").style.display = "block";
            estadoExamen = "Suspenso";
        } else {
            mensajeAprobado.style.display = "block"
            document.getElementById("resultadoExamenAprobado").textContent = `Has aprobado, bien hecho. Preguntas correctas: ${respuestasCorrectas}. Preguntas fallidas; ${respuestasIncorrectas}. Tiempo: ${tiempoTotal}. Puntuación: ${puntuacionExamen}`;
            document.getElementById("examenJSTRC").style.display = "none";
            document.getElementById("resultadoExamen").style.display = "block";
            estadoExamen = "Aprobado";
        };
    };
    document.getElementById("clasificaciones").style.display = "block";
    var resultado = {
        "NombreJugador": nombreJugador,
        "EstadoExamen": estadoExamen,
        "TiempoExamen": tiempoTotal,
        "PreguntasAcertadas": respuestasCorrectas,
        "PreguntasFalladas": respuestasIncorrectas,
        "Puntuacion": puntuacionExamen,
        "TipoExamen": "nacional"
    };
    localStorage.setItem(nombrePartida, JSON.stringify(resultado));
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

function anadirJugadoresTabla(jugadores){
    var tablaJugadores = document.getElementById("tabla-jugadores");
    tablaJugadores.innerHTML = "<tr><th>Nombre del jugador</th><th>Estado examen</th><th>Duración examen</th><th>Nº aciertos</th><th>Nº fallos</th><th>Puntuación</th></tr>";
    for (let i = 0; i < jugadores.length; i++){
        tablaJugadores.innerHTML += "<tr><td>"+jugadores[i].NombreJugador+"</td><td>"+jugadores[i].EstadoExamen+"</td><td>"+jugadores[i].TiempoExamen+"</td><td>"+jugadores[i].PreguntasAcertadas+"</td><td>"+jugadores[i].PreguntasFalladas+"</td><td>"+jugadores[i].Puntuacion+"</td></tr>";
    };
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
});

//Boton para entrar en el edificio
document.getElementById("entrarEdificio").addEventListener("click", () => {
    document.getElementById("exteriorJuego").style.display = "none";
    document.getElementById("interiorEdificio").style.display = "block";
});

//Boton para entrar en la habitación
document.getElementById("entrarExamen").addEventListener("click", () => {
    document.getElementById("interiorEdificio").style.display = "none";
    document.getElementById("informacion-juego").style.display = "block";
});

//Boton para cancelar e irte a casa
document.getElementById("cancelarExamen").addEventListener("click", () => {
    examenCancelado = true;
    puntuacionExamen = 0;
    mostrandoResultados();
})

document.getElementById("mostrarClasificacion").addEventListener("click", () => {
    document.getElementById("tablaClasificacion").style.display = "block"
    var valores = [], llaves = Object.keys(localStorage), i = llaves.length;
    while (i--){
        valores.push(JSON.parse(localStorage.getItem(llaves[i])));
    }
    console.log(valores);
    anadirJugadoresTabla(valores);
});

// Variante internacional del examen
document.getElementById("iniciarExamenInternacional").addEventListener("click", () => {
    preguntasExamenJSTRC = preguntasInternacionales;
    indicePreguntaActual = 0;
    respuestasCorrectas = 0;
    respuestasIncorrectas = 0;
    tiempoTotal = 0;
    examenFinalizado = false;
    puntuacionExamen = 0;
    examenCancelado = false;
    tiempoExamen.innerHTML  = "00:00:00";
    cronometro = setInterval(cronometroExamen, 1000);
    document.getElementById("examenJSTRC").style.display = "block";
    document.getElementById("informacion-juego").style.display = "none";
    mostrandoPreguntaActual();
});
