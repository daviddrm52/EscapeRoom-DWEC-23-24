//Para verificar que el usuario ha iniciado sesión, solo se puede acceder si se ha iniciado sesión
var usuarioIniciado = sessionStorage.getItem("id");
if (usuarioIniciado == null){
    window.location.replace("./sign-in.html");
} else {
    console.log("Identificador del usuario: "+usuarioIniciado);
}

/* Event Listeners */
document.getElementById("continuarInvestigacion").addEventListener("click", () => {
    document.getElementById("introduccion").style.display = "none";
    document.getElementById("visualizacionAccidente").style.display = "block";
});

//Boton para mostrar instrucciones
document.getElementById("mostrarInstrucciones").addEventListener("click", () => {
    document.getElementById("introduccion").style.display = "none";
    document.getElementById("mostrarPistas").style.display = "none";
    document.getElementById("instrucciones").style.display = "block";
});

//Boton para cerrar las instrucciones
document.getElementById("cerrarInstrucciones").addEventListener("click", () => {
    document.getElementById("introduccion").style.display = "block";
    document.getElementById("mostrarPistas").style.display = "block";
    document.getElementById("instrucciones").style.display = "none";
});

document.getElementById("botonMostrarPistas").addEventListener("click", () => {
    document.getElementById("pistasAccidente").style.display = "block";
    document.getElementById("mostrarPistas").style.display = "none";
});

document.getElementById("botonOcultarPistas").addEventListener("click", () => {
    document.getElementById("pistasAccidente").style.display = "none";
    document.getElementById("mostrarPistas").style.display = "block";
});



