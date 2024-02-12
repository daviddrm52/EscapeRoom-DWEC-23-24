var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
var database = "usuariosER-David-Rueda-Madrid";
const DB_STORE_NAME = 'usuarios';
const DB_VERSION = 1;
var db;
var opened = false;

//Para verificar que el usuario que ha iniciado sesión, tiene privilegios de administrador
function verificacionAdministrador() {
    var usuarioIniciado = sessionStorage.getItem("id");
    var usuarioAdministrador = sessionStorage.getItem("administrador");
    var nombreUsuarioAdministrador = sessionStorage.getItem("nombreUsuario");
    if(usuarioIniciado != null) {
        if (usuarioAdministrador == "false"){
            window.location.replace("./index.html");
        } else {
            console.log("Identificador del usuario administrador: "+usuarioIniciado);
            console.log("¿El usuario es administrador? "+usuarioAdministrador);
            document.getElementById("administradorConectado").innerText = nombreUsuarioAdministrador;
        };
    } else {
        window.location.replace("./sign-in.html");
    };
}

//Abriendo la base de datos
function openCreateDatabase(onDBCompleted) {
    if(opened){
        db.close();
        opened = false;
    };
    var request = indexedDB.open(database, DB_VERSION);
    request.onsuccess = (event) => {
        db = event.target.result;
        console.log("Base de datos " + database + " abierta: " + db);
        opened = true;
        onDBCompleted(db);
    };
    request.onerror = (event) => {
        console.error("Error abriendo la base de datos: ", event.target.errorCode);
    };
};

/* Conseguir los datos de los usuarios que han creado una cuenta */
function datosAdministrador(){
    openCreateDatabase(function(db){
        conseguirDatosUsuarios(db);
    });
};

//
function conseguirDatosUsuarios(db){
    var tx = db.transaction(DB_STORE_NAME, "readonly");
    var store = tx.objectStore(DB_STORE_NAME);

    var result = [];
    var request = store.openCursor();

    request.onsuccess = function (event) {
        var cursor = event.target.result;

        if(cursor){
            result.push(cursor.value);
            // console.log(cursor.value);
            cursor.continue();
        } else {
            console.log("Fin del archivo");
            // console.log(result);
            //Operacion de añadir los resultados, al HTML
            anadirUsuariosAlHTML(result);
        };

        request.onerror = function (event) {
            console.error("conseguirDatosUsuarios: error leyendo los datos:", event.target.errorCode);
        };

        tx.oncomplete = function() {
            console.log("conseguirDatosUsuarios: tx completado, todo bien");
            db.close();
            opened = false;
        };
    };
};

//Funcion para añadir los usuarios que ha recogido la funcion anterior
function anadirUsuariosAlHTML(usuarios) {
    var tablaUsuarios = document.getElementById("tabla-usuarios");
    tablaUsuarios.innerHTML = "<tr><th>Id del usuario</th><th>Nombre</th><th>Nombre de usuario</th><th>Administrador</th><th>Opciones</th></tr>";

    for(let i = 0; i < usuarios.length; i++){
        tablaUsuarios.innerHTML += "<tr><td>"+usuarios[i].id+"</td><td>"+usuarios[i].nombre+"</td><td>"+usuarios[i].nombreUsuario+"</td><td>"+usuarios[i].administrador+"</td><td><button><span class='material-symbols-outlined'>lock_reset</span></button><button><span class='material-symbols-outlined'>delete</span></button></td></tr>"
    };
};

window.addEventListener('load', (event) => {
    verificacionAdministrador();
    datosAdministrador();
})