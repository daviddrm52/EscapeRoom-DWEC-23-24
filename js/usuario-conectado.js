/*  Esto es para el header de las paginas, donde esta el boton de iniciar sesion
    será cambiado para que el usuario vaya a su pagina personal. */

var nombreUsuarioSession = sessionStorage.getItem('nombreUsuario');
var administradorSession = sessionStorage.getItem('administrador');

var botonInicioSesion = document.querySelector("#botonInicioSesion");
var iconoBotonInicioSesion = document.querySelector("#iconoBotonInicioSesion");
var linkInicioSesion = document.querySelector("#linkInicioSesion");

if(nombreUsuarioSession == null) {
    botonInicioSesion.innerText = "";
    iconoBotonInicioSesion.innerText = "login";
} else {
    botonInicioSesion.innerText = nombreUsuarioSession;
    iconoBotonInicioSesion.innerText = "manage_accounts";
    linkInicioSesion.href = "./pagina-usuario.html";
};