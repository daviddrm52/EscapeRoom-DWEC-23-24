var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
var database = "usuariosER-David-Rueda-Madrid";
const DB_STORE_NAME = 'usuarios';
const DB_VERSION = 1;
var db;
var opened = false;
//Cuando el usuario quiera enviar el formulario
var datosInicioSesion = document.querySelector("#iniciarSesionFormulario");

var datosUsuarios;

/* Creación y obertura de la base de datos */

function openCreateDatabase(onDBCompleted) {
    if(opened){
        db.close();
        opened = false;
    }
    
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
    })
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