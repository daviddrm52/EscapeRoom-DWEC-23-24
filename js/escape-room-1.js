//Para verificar que el usuario ha iniciado sesión, solo se puede acceder si se ha iniciado sesión
var usuarioIniciado = sessionStorage.getItem("id");
if (usuarioIniciado == null){
    window.location.replace("./sign-in.html");
} else {
    console.log("Identificador del usuario: "+usuarioIniciado);
}