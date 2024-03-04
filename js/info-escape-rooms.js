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

//Funcion que muestra a los jugadores que se han enfrentado a la prueba
function anadirJugadoresTabla(jugadores){
    var tablaJugadores = document.getElementById("tabla-jugadores");
    tablaJugadores.innerHTML = "<tr><th>Nombre del jugador</th><th>Tipo de examen</th><th>Estado examen</th><th>Duración examen</th><th>Nº aciertos</th><th>Nº fallos</th><th>Puntuación</th></tr>";
    for (let i = 0; i < jugadores.length; i++){
        tablaJugadores.innerHTML += "<tr><td>"+jugadores[i].NombreJugador+"</td><td>"+jugadores[i].TipoExamen+"</td><td>"+jugadores[i].EstadoExamen+"</td><td>"+jugadores[i].TiempoExamen+"</td><td>"+jugadores[i].PreguntasAcertadas+"</td><td>"+jugadores[i].PreguntasFalladas+"</td><td>"+jugadores[i].Puntuacion+"</td></tr>";
    };
};