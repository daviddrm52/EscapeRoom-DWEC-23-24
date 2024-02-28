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
const preguntasJSTRCNacional = preguntasNacionales;
const preguntasJSTRCInternacional = preguntasInternacionales;

//Variables que cuentan cuantas preguntas llevamos bien y mal, ademas de en cual estamos
let indicePreguntaActual = 0;
let respuestasCorrectas = 0;
let respuestasIncorrectas = 0;
let tiempoTotal = 0;
let examenFinalizado = false;
let puntuacionExamen = 0;
let examenCancelado = false;
let versionExamen = "nacional";

//Variables para poder poner las cosas en el html y eso
let numeroPregunta = document.getElementById("numeroPregunta");
const preguntaPropuesta = document.getElementById("preguntaPropuestaExamen");
const boton1 = document.getElementById("boton1");
const boton2 = document.getElementById("boton2");
const boton3 = document.getElementById("boton3");
const boton4 = document.getElementById("boton4");
const imagenPregunta = document.getElementById("imagenPregunta")
//Mensajes para el examen nacional
const mensajeSuspensoNacional = document.getElementById("mensajeSuspensoNacional");
const mensajeAprobadoNacional = document.getElementById("mensajeAprobadoNacional");
const mensajeExcelenteNacional = document.getElementById("mensajeExcelenteNacional");
const mensajeAbandonoNacional = document.getElementById("mensajeAbandonoNacional");
//Mensajes para el examen internacional
// const mensajeSuspensoInternacional = document.getElementById("mensajeSuspenso");
// const mensajeAprobadoInternacional = document.getElementById("mensajeAprobado");
// const mensajeExcelenteInternacional = document.getElementById("mensajeExcelente");
// const mensajeAbandonoInternacional = document.getElementById("mensajeAbandono");
const iniciarExamenNacional = document.getElementById("iniciarExamenNacional");
const iniciarExamenInternacional = document.getElementById("iniciarExamenInternacional");
const informacionJuego = document.getElementsByClassName("habitación-juego");
let nombreJugador = sessionStorage.getItem('nombreUsuario');
var nombrePartidaNacional = "examen-"+nombreJugador+"-nacional";
var nombrePartidaInternacional = "examen-"+nombreJugador+"-internacional";
document.getElementById("nombreJugador").innerHTML = nombreJugador;

//Variables en relación del tiempo
let cronometro;
let fechaActual = new Date();
let tiempoExamen = document.getElementById("tiempoExamen")
fechaActual.setHours(0,0,0,0);
tiempoExamen.innerHTML  = "00:00:00";

/* FUNCIONES GENERALES */

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

//Funcion que baraja las respuestas
function mezcladorRespuestas(correcta, incorrecta1, incorrecta2, incorrecta3) {
    const respuestas = [correcta, incorrecta1, incorrecta2, incorrecta3];
    respuestas.sort(() => Math.random() - 0.5);
    return respuestas;
};

//Funcion que muestra a los jugadores que se han enfrentado a la prueba
function anadirJugadoresTabla(jugadores){
    var tablaJugadores = document.getElementById("tabla-jugadores");
    tablaJugadores.innerHTML = "<tr><th>Nombre del jugador</th><th>Tipo de examen</th><th>Estado examen</th><th>Duración examen</th><th>Nº aciertos</th><th>Nº fallos</th><th>Puntuación</th></tr>";
    for (let i = 0; i < jugadores.length; i++){
        tablaJugadores.innerHTML += "<tr><td>"+jugadores[i].NombreJugador+"</td><td>"+jugadores[i].TipoExamen+"</td><td>"+jugadores[i].EstadoExamen+"</td><td>"+jugadores[i].TiempoExamen+"</td><td>"+jugadores[i].PreguntasAcertadas+"</td><td>"+jugadores[i].PreguntasFalladas+"</td><td>"+jugadores[i].Puntuacion+"</td></tr>";
    };
};

//Funcion que comprueba la respuesta que el usuario ha escogido
function compruebaRespuesta(respuestaSeleccionada){
    const preguntaActualNacional = preguntasJSTRCNacional[indicePreguntaActual];
    const preguntaActualInternacional = preguntasJSTRCNacional[indicePreguntaActual];
    if(versionExamen === "nacional") {
        console.log(indicePreguntaActual, preguntasJSTRCNacional.length);
        if(respuestaSeleccionada === preguntaActualNacional.respuestaCorrecta){
            respuestasCorrectas++;
            puntuacionExamen = puntuacionExamen + 100;
        } else {
            respuestasIncorrectas++;
            puntuacionExamen = puntuacionExamen -50;
        };
        if((indicePreguntaActual+1) == preguntasJSTRCNacional.length){
            indicePreguntaActual++;
            examenFinalizado = true;
            mostrandoPreguntaActualNacional();
        } else {
            indicePreguntaActual++;
            mostrandoPreguntaActualNacional();
        };
    } else if (versionExamen === "internacional") {
        console.log(indicePreguntaActual, preguntasJSTRCInternacional.length);
        if(respuestaSeleccionada === preguntaActualInternacional.respuestaCorrecta){
            respuestasCorrectas++;
            puntuacionExamen = puntuacionExamen + 100;
        } else {
            respuestasIncorrectas++;
            puntuacionExamen = puntuacionExamen -50;
        };
        if((indicePreguntaActual+1) == preguntasJSTRCInternacional.length){
            indicePreguntaActual++;
            examenFinalizado = true;
            mostrandoPreguntaActualInternacional();
        } else {
            indicePreguntaActual++;
            mostrandoPreguntaActualInternacional();
        };
    } else {
        console.log("El examen se fue a otro sitio del cual no sabemos nada");
    };
};

/* FUNCIONES PARA EL EXAMEN NACIONAL */

//Funcion que va a mostrar la pregunta, con sus respuestas versión examen nacional
function mostrandoPreguntaActualNacional(){
    console.log(indicePreguntaActual);
    console.log(preguntasJSTRCNacional.length);
    if(indicePreguntaActual < preguntasJSTRCNacional.length){
        numeroPregunta.textContent = "Pregunta "+(indicePreguntaActual+1);
        const preguntaActual = preguntasJSTRCNacional[indicePreguntaActual];
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
            mostrandoResultadosNacional();
        } else {
            console.log("Examen aún en curso...");
        };
    };
};

//Funcion que una vez que haya finalizado el examen por haberlo completado, o por haber abandonado, nos mostrara nuestros resultados
function mostrandoResultadosNacional(){
    console.log("Examen finalizado, mostrando resultados...");
    var estadoExamen;
    clearInterval(cronometro);
    if(examenCancelado){
        mensajeAbandonoNacional.style.display = "block";
        document.getElementById("resultadoExamenNacionalAbandonado").textContent = `Preguntas correctas: ${respuestasCorrectas}. Preguntas fallidas; ${respuestasIncorrectas}. Tiempo: ${tiempoTotal}. Puntuación: ${puntuacionExamen}`;
        document.getElementById("examenJSTRC").style.display = "none";
        document.getElementById("resultadoExamenNacional").style.display = "block";
        estadoExamen = "No finalizado";
    } else {
        if(respuestasCorrectas === preguntasJSTRCNacional.length){
            mensajeExcelenteNacional.style.display = "block"
            document.getElementById("resultadoExamenNacionalExcelente").textContent = `Preguntas correctas: ${respuestasCorrectas}. Preguntas fallidas; ${respuestasIncorrectas}. Tiempo: ${tiempoTotal}. Puntuación: ${puntuacionExamen}`;
            document.getElementById("examenJSTRC").style.display = "none";
            document.getElementById("resultadoExamenNacional").style.display = "block";
            estadoExamen = "Excelente";
        } else if (respuestasIncorrectas > 25){
            mensajeSuspensoNacional.style.display = "block";
            document.getElementById("resultadoExamenNacionalSuspenso").textContent = `Preguntas correctas: ${respuestasCorrectas}. Preguntas fallidas; ${respuestasIncorrectas}. Tiempo: ${tiempoTotal}. Puntuación: ${puntuacionExamen}`;
            document.getElementById("examenJSTRC").style.display = "none";
            document.getElementById("resultadoExamenNacional").style.display = "block";
            estadoExamen = "Suspenso";
        } else {
            mensajeAprobadoNacional.style.display = "block"
            document.getElementById("resultadoExamenNacionalAprobado").textContent = `Has aprobado, bien hecho. Preguntas correctas: ${respuestasCorrectas}. Preguntas fallidas; ${respuestasIncorrectas}. Tiempo: ${tiempoTotal}. Puntuación: ${puntuacionExamen}`;
            document.getElementById("examenJSTRC").style.display = "none";
            document.getElementById("resultadoExamenNacional").style.display = "block";
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
    localStorage.setItem(nombrePartidaNacional, JSON.stringify(resultado));
};

/* FUNCIONES PARA EL EXAMEN INTERNACIONAL */
/* Versión internacional del examen (solo se puede acceder si se aprueba la variante nacional) */

//Funcion que va a mostrar la pregunta, con sus respuestas versión internacional
function mostrandoPreguntaActualInternacional(){
    console.log(indicePreguntaActual);
    console.log(preguntasJSTRCInternacional.length);
    if(indicePreguntaActual < preguntasJSTRCInternacional.length){
        numeroPregunta.textContent = "Pregunta "+(indicePreguntaActual+1);
        const preguntaActual = preguntasJSTRCInternacional[indicePreguntaActual];
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
            mostrandoResultadosInternacional();
        } else {
            console.log("Examen internacional aún en curso...");
        };
    };
};

function mostrandoResultadosInternacional(){
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
        if(respuestasCorrectas > 1/*=== preguntasJSTRCNacional.length*/){
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
        "TipoExamen": "internacional"
    };
    localStorage.setItem(nombrePartidaInternacional, JSON.stringify(resultado));
}

/* EVENT LISTENERS */

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

//Boton para mostrar la clasificacion de jugadores
document.getElementById("mostrarClasificacion").addEventListener("click", () => {
    document.getElementById("tablaClasificacion").style.display = "block"
    var valores = [], llaves = Object.keys(localStorage), i = llaves.length;
    while (i--){
        valores.push(JSON.parse(localStorage.getItem(llaves[i])));
    }
    console.log(valores);
    anadirJugadoresTabla(valores);
});

//Para iniciar el examen nacional (el primero)
iniciarExamenNacional.addEventListener("click", (event) => {
    mostrandoPreguntaActualNacional();
    cronometro = setInterval(cronometroExamen, 1000);
    document.getElementById("examenJSTRC").style.display = "block";
    document.getElementById("informacion-juego").style.display = "none";
});

//Botones del examen (para los dos en general)
boton1.addEventListener("click", () => compruebaRespuesta(boton1.textContent));
boton2.addEventListener("click", () => compruebaRespuesta(boton2.textContent));
boton3.addEventListener("click", () => compruebaRespuesta(boton3.textContent));
boton4.addEventListener("click", () => compruebaRespuesta(boton4.textContent));

//Para iniciar el examen internacional (el segundo)
iniciarExamenInternacional.addEventListener("click", () => {
    versionExamen = "internacional";
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
    mostrandoPreguntaActualInternacional();
});