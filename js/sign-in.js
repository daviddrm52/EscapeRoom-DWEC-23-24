var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
var database = "usuariosER-David-Rueda-Madrid";
const DB_STORE_NAME = 'usuarios';
const DB_VERSION = 1;
var db;
var opened = false;
//Cuando el usuario quiera enviar el formulario
var botonIniciarSesion = document.querySelector("#botonFormularioInicioSesion");

//Variable donde se almacena los datos de los usuarios extraidos al cargar la pagina
var datosUsuarios;

/* Creación y obertura de la base de datos */
function openCreateDatabase(onDBCompleted) {
    if(opened){
        db.close();
        opened = false;
    };
    
    // Abriendo la base de datos
    var request = indexedDB.open(database, DB_VERSION);

    //onsuccess handler
    request.onsuccess = (event) => {
        db = event.target.result;

        console.log(db);
        console.log("Base de datos abierta " + db);
        opened = true;
        onDBCompleted(db);
    };

    //onupgradeneeded handler (esto es en caso de que sea la primera vez que se abre la bd)
    request.onupgradeneeded = () => {
        db = request.result;
        console.log("openCreateDatabase: se necesita una mejora "+ db);
        var objectStore = db.createObjectStore(DB_STORE_NAME, {keyPath: "id", autoIncrement: true});
        console.log("openCreateDatabase: Object store creado correctamente");
        
        objectStore.createIndex("nombre", "nombre", {unique: false});
        console.log("openCreateDatabase: Indice creado en nombre");
        objectStore.createIndex("nombreUsuario", "nombreUsuario", {unique: true});
        console.log("openCreateDatabase: Indice creado en nombreUsuario");
        objectStore.createIndex("contrasena", "contrasena", {unique: false});
        console.log("openCreateDatabase: Indice creado en contrasena");
        objectStore.createIndex("administrador", "administrador", {unique: false});
        console.log("openCreateDatabase: Indice creado en administrador");
    };

    //onError handler
    request.onerror = (event) => {
        console.error("Error abriendo la base de datos, this error hits hard: ", event.target.errorCode);
    };
};

function datosUsuariosSesion(){
    openCreateDatabase(function(db){
        conseguirDatosUsuarios(db);
    });
};

function conseguirDatosUsuarios(db){
    var tx = db.transaction(DB_STORE_NAME, "readonly");
    var store = tx.objectStore(DB_STORE_NAME);
    
    var result = [];
    var request = store.openCursor();

    request.onsuccess = function (event) {
        var cursor = event.target.result;

        if(cursor) {
            result.push(cursor.value);
            // console.log(cursor.value);
            cursor.continue();
        } else {
            console.log("Final del archivo...");
            //Operations to do afrer reading all the records
            lecturaDatos(result);
        };

        request.onerror = function (event) {
            console.error("conseguirDatosUsuarios: error extrayendo los datos:", event.target.errorCode);
        };

        tx.oncomplete = function() {
            console.log("conseguirDatosUsuarios: tx completado");
            db.close();
            opened = false;
        };
    };
};

function lecturaDatos(resultado){
    datosUsuarios = resultado;
};

// Event Listener cuando carga la pagina
window.addEventListener('load', (event) => {
    datosUsuariosSesion();
})

// Event Listener cuando el usuario procede a iniciar sesión
botonIniciarSesion.addEventListener('click', (event) => {
    verificarUsuario();
});

// Funcion para verificar los datos puestos por el usuario
function verificarUsuario(){
    //En caso de que algo vaya mal
    var errorDetectado = true;
    //Variables para los campos de texto
    var nombreUsuarioInicioSesion = document.getElementById("nombreUsuarioInicioSesion");
    var contrasenaInicioSesion = document.getElementById("contrasenaInicioSesion");
    //Variables para los errores (en caso de que el usuario no exista, o la contraseña sea erronea)
    var nombreUsuarioInicioSesionError = document.getElementById("nombreUsuarioInicioSesionError");
    var contrasenaInicioSesionError = document.getElementById("contrasenaInicioSesionError");
    //Variable que almacena los datos del usuario que ha iniciado sesion
    var informacionUsuario;

    // Validando si el campo del usuario esta vacio
    if(nombreUsuarioInicioSesion.value.trim() === ''){
        nombreUsuarioInicioSesionError.innerText = "¡El campo del nombre de usuario esta vacío!";
        nombreUsuarioInicioSesionError.style.display = "block";
        errorDetectado = true;
    } else {
        nombreUsuarioInicioSesionError.style.display = "none";
        errorDetectado = false;
    };

    //Validando si el campo del usuario esta vacio
    if(contrasenaInicioSesion.value.trim() === ''){
        contrasenaInicioSesionError.innerText = "¡El campo de la contraseña esta vacío!";
        contrasenaInicioSesionError.style.display = "block";
        errorDetectado = true;
    } else {
        contrasenaInicioSesionError.style.display = "none";
        errorDetectado = false;
    };

    // Encriptando la contraseña (para poder compararlas)
    var hash = CryptoJS.MD5(contrasenaInicioSesion.value);
    var contrasenaEncriptada = hash.toString();

    //Realizamos la busqueda en la base de datos del usuario que se ha insertado
    for (let i = 0; i < datosUsuarios.length; i++){
        if(nombreUsuarioInicioSesion.value === datosUsuarios[i].nombreUsuario){
            console.log("Nombre de usuario encontrado");
            informacionUsuario = datosUsuarios[i];
            nombreUsuarioInicioSesionError.style.display = "none";
            errorDetectado = false;
            break;
        } else {
            console.log("Aún en la busqueda, registros buscados: "+i);
            nombreUsuarioInicioSesionError.innerText = "¡El nombre de usuario no es correcto o no existe!";
            nombreUsuarioInicioSesionError.style.display = "block";
            errorDetectado = true;
        };
    };    

    //En caso de que un error haya sido detectado en los campos (si estan vacios o no son correctos)
    if (errorDetectado){
        console.log("Errores detectados, saliendo...");
        db.close();
        opened = false;
        return;
    } else {
        console.log("Todo correcto HL7526");
    };

    console.log(informacionUsuario);

    //Para poder comprobar la contraseña introducida con la registrada
    if(informacionUsuario == null){
        console.log("No hay informacion del usuario, esto es malo");
    } else {
        if(contrasenaEncriptada === informacionUsuario.contrasena){
            console.log("La contraseña es correcta, todo bien");
            contrasenaInicioSesionError.style.display = "none";
            errorDetectado = false;
            sessionStorage.setItem('id', informacionUsuario.id);
            sessionStorage.setItem('nombreUsuario', informacionUsuario.nombreUsuario);
            sessionStorage.setItem("administrador", informacionUsuario.administrador);

            //Verificar si el nuevo usuario es administrador
            if(informacionUsuario.administrador){
                //Redirigido a la pagina de administración
                window.location.replace("./administracion.html");
            } else {
                //Redirigido al inicio normal(si es un usuario normal)
                window.location.replace("./index.html");
            };
        } else {
            console.log("Contraseña no coincide, no es correcta");
            contrasenaInicioSesionError.innerText = "¡La contraseña no es correcta!";
            contrasenaInicioSesionError.style.display = "block";
            errorDetectado = true;
        };
    };
}