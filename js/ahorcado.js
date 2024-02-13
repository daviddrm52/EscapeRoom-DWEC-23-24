/* Variables */

//Variables generales
let palabras = ["CHIQUITIN AIRLINES", "CHIQUITIN REGIONAL", "CHIQUITIN EXPRESS", "CHIQUITIN AIRLINES CARGO", "AIR CHIQUIN", "AIR CHIQUIN CARGO", "AIR LIAN", "KAISA AIRLINES", "KAISA AIRLINES CARGO", "ARTIC AIRLINES", "AIR NEVADA", "CARGOWATCH", "AEROLINEAS CHIQUITIANAS", "YELLOW AIRLINES", "AIR CHIQUITINO", "GREENPLUS AIR", "ALOE AIR", "AEROSPACE INNOVATIONS", "LINEAS AEREAS DE AVENA", "ICATHIA AIR", "ACR AIRWAYS"];
let intentosRestantes = 7;
let erroresCometidos = 0;
let tiempoTotal = 0;
let palabraSecreta = palabras[Math.floor(Math.random()*palabras.length)];
let intentosHTML = document.getElementById("intentos");
let erroresHTML = document.getElementById("erroresCometidos");
let solucionHTML = document.getElementById("solucion");
// let restadorIntentosHTML = document.getElementById("restadorIntentos");
let solucionVictoriaHTML = document.getElementById("solucion_victoria");
let botonIniciarPartida = document.getElementById("botonIniciarPartida");

//Variables de los contenedores (i know, it's a lot)
let contenedor = document.getElementById("contenedor");
let contenedorTiempo = document.getElementById("contenedor-tiempo");
let contenedorInicio = document.getElementById("contenedor-inicio");
let contenedorDerrota = document.getElementById("contenedor-derrota");
let contenedorVictoria = document.getElementById("contenedor-victoria");
let contenedorAyuda = document.getElementById("contenedor-ayuda");
let contenedorReinicio = document.getElementById("contenedor-reinicio");
let contenedorPalabras = document.querySelector(".contenedor-palabras");
let contenedorMuestra = document.querySelector(".contenedor-muestra");
let contenedorEstadisticas = document.querySelector(".contenedor-ultima-partida");

//Variables en relación al contador
let elCrono;
let miFecha = new Date();
let tiempoTranscurrido = document.getElementById("tiempoTranscurrido");
miFecha.setHours(0,0,0,0);
tiempoTranscurrido.innerHTML = "00:00:00";

//Ocultando la palabra 
let palabraSecretaHTML = document.getElementById("palabraSecreta");
let palabraSeparadaOculta = palabraSecreta.toUpperCase().split("");
let palabraSeparadaCorrecta = palabraSecreta.split("");
for(let i = 0; i < palabraSeparadaOculta.length; i++){
    palabraSeparadaOculta.splice([i], 1, "_");
};
let amogus = palabraSeparadaOculta.join(',').replace(/,/g, ' ').split();
palabraSecretaHTML.innerText = amogus;

//Ocultar por defecto el contenedor
contenedor.style.display = "none";

/* Eventos (Event Listeners) */

//Evento que oculta y muestra lo necesario al iniciar la partida, ademas de iniciar el tiempo de partida
botonIniciarPartida.addEventListener('click', (e) => {
    console.log("Partida iniciada");
    elCrono = setInterval(cronometroInicial, 1000);
    // restadorIntentos = setTimeout(restaIntentos, 10000);
    botonIniciarPartida.style.display = "none";
    contenedorInicio.style.display = "none";
    contenedorAyuda.style.display = "none";
    contenedorMuestra.style.display = "none";
    contenedorPalabras.style.display = "none";
    contenedorEstadisticas.style.display = "none";
    contenedorReinicio.style.display = "block";
    contenedorTiempo.style.display = "block";
    contenedor.style.display = "block";
});

//Evento cuando el usuario hace click a una letra
contenedor.addEventListener('click', (e) => {
    if(e.target.classList.contains('letra') && !e.target.classList.contains('error') && !e.target.classList.contains('correcto')){
        let letraEscogida = e.target.innerHTML;
        console.log("Letra escogida: "+letraEscogida);
        if(palabraSeparadaCorrecta.includes(letraEscogida)){ //En caso de ser correcta
            e.target.classList.toggle('correcto');
            modificarPalabra(letraEscogida);
            console.log("Letra correcta");     
        } else { //En caso de ser incorrecta
            e.target.classList.toggle('error');
            intentosRestantes--;
            erroresCometidos++;
            intentosHTML.innerHTML = intentosRestantes;
            erroresHTML.innerHTML = erroresCometidos;
            console.log("Letra incorrecta");
        };
        if(intentosRestantes === 0){ //Si nos quedamos sin intentos, nos aparecerá el contenedor de derrota
            clearInterval(elCrono);
            // clearTimeout(restadorIntentos);
            contenedor.style.display = "none";
            contenedorDerrota.style.display = "block";
            solucionHTML.innerHTML = palabraSecreta;
            anadirEstadisticas();
        };
        if(!palabraSeparadaOculta.includes("_")) { //En caso de acertar todo, nos aparecerá el contenedor de victoria
            clearInterval(elCrono);
            // clearTimeout(restadorIntentos);
            contenedor.style.display = "none";
            contenedorVictoria.style.display = "block";
            solucionVictoriaHTML.innerHTML = palabraSecreta;
            anadirEstadisticas();
        };
    };
});

//Evento para poder ver que palabras hay (en el menu)
let botonMostrarPalabras = document.getElementById("verPalabras").addEventListener('click', (event) => {
    contenedorAyuda.style.display = "none";
    contenedorPalabras.style.display = "none";
    contenedorInicio.style.display = "none";
    mostrarPalabras();
});

//Evento de vuelta al inicio desde el contenedor de palabras
let botonVueltaInicio = document.getElementById("volverInicio").addEventListener('click', (event) => {
    contenedorAyuda.style.display = "block";
    contenedorPalabras.style.display = "block";
    contenedorInicio.style.display = "block";
    contenedorMuestra.style.display = "none";
});

//Evento en cuanto pulsamos para ver las estadisticas, nos mostrará la ultima partida jugada
let botonEstadisticas = document.getElementById("mostrarEstadisticas").addEventListener('click', (event) => {
    document.getElementById("estadisticas").style.display = "block";
    document.getElementById("resultadoPartidaEstadistica").innerHTML = localStorage.getItem("resultado-partida");
    document.getElementById("nombreJugadorEstadistica").innerHTML = localStorage.getItem("nombre-jugador");
    document.getElementById("palabraSecretaEstadistica").innerHTML = localStorage.getItem("palabra-secreta");
    document.getElementById("erroresCometidosEstadistica").innerHTML = localStorage.getItem("errores-cometidos");
    document.getElementById("tiempoEmpleadoEstadistica").innerHTML = localStorage.getItem("tiempo-empleado");
});

/* Funciones */

//Funcion que muestra las palabras que hay en el ahorcado en el inicio
function mostrarPalabras() {
    var ul = document.getElementById("ul-palabras");
    var total = document.getElementById("total-palabras");
    ul.innerHTML = "";
    contenedorMuestra.style.display = "block"
    for(let i = 0; i < palabras.length; i++){
        ul.innerHTML += "<li> "+palabras[i]+" </li>"
    };
    total.innerHTML = palabras.length;
};

//Funcion que modifica la palabra dependiendo de que letra ha sido introducida
function modificarPalabra(userInput) {
    do {
        do {
            let posicionLetra = palabraSeparadaCorrecta.findIndex(x => x == userInput);
            palabraSeparadaOculta[posicionLetra] = userInput;
            palabraSeparadaCorrecta[posicionLetra] = "_";
        } while(palabraSeparadaCorrecta.includes(userInput));
    } while (!palabraSeparadaOculta.includes(userInput));
    let reemplazo = palabraSeparadaOculta.join(',').replace(/,/g, ' ').split();
    palabraSecretaHTML.innerText = reemplazo;
};

//Funcion que realiza el cronometro de tiempo transcurrido
function cronometroInicial(){
    let horas = miFecha.getHours();
    let minutos = miFecha.getMinutes();
    let segundos = miFecha.getSeconds();
    segundos += 1;
    if (segundos == 60){
        segundos = 0;
        minutos += 1;
        miFecha.setMinutes(minutos);
    };
    if (minutos == 60){
        minutos = 0;
        horas += 1;
        miFecha.setHours(horas);
    };
    miFecha.setSeconds(segundos);
    if (horas < 10) { horas = "0" + horas;}
    if (minutos < 10) { minutos = "0" + minutos;}
    if (segundos < 10) { segundos = "0" + segundos;}
    tiempoTranscurrido.innerHTML = horas + ":" + minutos + ":" + segundos;   
    tiempoTotal = horas + ":" + minutos + ":" + segundos;
};

//Funcion que quita un intento, pasados los 10 segundos
// function restaIntentos() {
//     intentosRestantes--;
//     let intentosQuitados = 0;
//     intentosHTML.innerHTML = intentosRestantes;
//     intentosQuitados++;
//     restadorIntentosHTML.innerHTML = "Se te han restado "+intentosQuitados+" intentos.";
// }

//Funcion que añade los datos de la partida a localStorage, y que posteriormente, se pueden ver en el menu del juego
function anadirEstadisticas(){
    if(intentosRestantes === 0){
        localStorage.setItem("resultado-partida", "Derrota");
    } else {
        localStorage.setItem("resultado-partida", "Victoria");
    }
    localStorage.setItem("palabra-secreta", palabraSecreta);
    localStorage.setItem("errores-cometidos", erroresCometidos);
    localStorage.setItem("tiempo-empleado", tiempoTotal);
    localStorage.setItem("nombre-jugador", sessionStorage.getItem("nombreUsuario"))
};

//Funcion para verificar que hay un usuario conectado
function verificarUsuarioConectado() {
    if(sessionStorage.getItem('id') == null){
        window.location.replace("./index.html");
    } else {
        console.log("Usuario conectado, dejando pasar...");
    }
}

// Event Listener para cuando la pagina se cargue, se muestren los datos, ademas de verificar si esta entrando en la pagina un usuario conectado, y no alguien sin identificar
window.addEventListener('load', (event) => {
    verificarUsuarioConectado();
});