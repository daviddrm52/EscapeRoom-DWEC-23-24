var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
var database = "usuariosER-David-Rueda-Madrid";
const DB_STORE_NAME = 'usuarios';
const DB_VERSION = 1;
var db;
var opened = false;
//Cuando el usuario quiera enviar el formulario
var enviarDatos = document.querySelector("#enviarDatosFormulario");
//When the user clicks on "Reset"
// var resetData = document.querySelector('#resetDataForm');

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

/* Zona del registro del usuario a la pagina */

function enviarFormularioDatos() {
    openCreateDatabase(function(db){
        anadirFormularioUsuario(db);
    });
};

function anadirFormularioUsuario(db) {
    //Si ocurre un error, esto nos servira para tirar del cable
    var errorDetectado = true;
    //Campos del formulario
    var nombre = document.getElementById("nombre");
    var nombreUsuario = document.getElementById("nombreUsuario");
    var contrasena = document.getElementById("contrasena");
    var confirmarContrasena = document.getElementById("confirmarContrasena");
    var verificacionAdministrador;

    //Mensajes de error en caso de que ocurran
    var nombreError = document.getElementById("nombreError");
    var nombreUsuarioError = document.getElementById("nombreUsuarioError");
    var contrasenaError = document.getElementById("contrasenaError");
    var confirmarContrasenaError = document.getElementById("confirmarContrasenaError");
    //Para verificar que las contraseñas coinciden
    var contrasenaIgualError = document.getElementById("contrasenaIgualError");
    var confirmaContrasenaIgualError = document.getElementById("confirmarContrasenaIgualError");

    /* Validación de todos los parametros del formulario */
    //Validar si las contraseñas son iguales
    if(contrasena.value !== confirmarContrasena.value) {
        contrasenaIgualError.innerText = "¡Las contraseñas no coinciden!";
        confirmaContrasenaIgualError.innerText = "¡Las contraseñas no coinciden!";
        contrasenaIgualError.style.display = "block";
        confirmaContrasenaIgualError.style.display = "block";
        errorDetectado = true;
    } else {
        console.log("Las contraseñas coinciden, esto es bueno");
        contrasenaIgualError.style.display = "none";
        confirmaContrasenaIgualError.style.display = "none";
        errorDetectado = false;
    };
    //Validando contraseña
    if(contrasena.value === ''){
        contrasenaError.innerText = "¡El campo de la contraseña esta vacío!";
        contrasenaError.style.display = "block";
        errorDetectado = true;
    } else if(!contrasenaValida(contrasena.value)){
        contrasenaError.innerText = "¡La contraseña no es valida, pruebe con otra!";
        contrasenaError.style.display = "block";
        errorDetectado = true;
    } else {
        contrasenaError.style.display = "none";
        errorDetectado = false;
    };
    //Validando la confirmación de la contraseña
    if(confirmarContrasena.value === ''){
        confirmarContrasenaError.innerText = "¡El campo de confirmación de la contraseña esta vacio!";
        confirmarContrasenaError.style.display = "block";
        errorDetectado = true;
    } else if(!contrasenaValida(confirmarContrasena.value)){
        confirmarContrasenaError.innerText = "¡La contraseña no es valida, pruebe con otra!";
        confirmarContrasenaError.style.display = "block";
        errorDetectado = true;
    } else {
        confirmarContrasenaError.style.display = "none";
        errorDetectado = false;
    };
    //Validación del nombre
    if(nombre.value.trim() === ''){
        nombreError.innerText = "¡El campo del nombre esta vacio!";
        nombreError.style.display = "block";
        errorDetectado = true;
    } else {
        nombreError.style.display = "none";
        errorDetectado = false;
    };
    //Validación del nombre de usuario
    if(nombreUsuario.value.trim() === ''){
        nombreUsuarioError.innerText = "¡El nombre de usuario esta vacío!";
        nombreUsuarioError.style.display = "block";
        errorDetectado = true;
    } else {
        nombreUsuarioError.style.display = "none";
        errorDetectado = false;
    };
    //Validando si la cajita de confirmacion de ser administrador, esta seleccionada
    if(document.getElementById('confirmacionAdministracion').checked) {
        verificacionAdministrador = true;
        console.log("Estado de administrador del usuario: "+verificacionAdministrador);
    } else {
        verificacionAdministrador = false;
        console.log("Estado de administrador del usuario: "+verificacionAdministrador);
    };
    //In case an error is detected in the inputs
    if (errorDetectado){
        console.log("Errores detectados, ejecutando salida de emergencia...");
        db.close();
        opened = false;
        return;
    } else {
        console.log("Todo correcto");
    };

    //Para encriptar la contraseña (Aqui la seguridad importa)
    var hash = CryptoJS.MD5(contrasena.value);
    //Coje los valores para almacenarlos en la base de datos
    var object = {nombre: nombre.value, nombreUsuario: nombreUsuario.value, contrasena: hash.toString(), administrador: verificacionAdministrador};

    //Start transaction
    var tx = db.transaction(DB_STORE_NAME, "readwrite");
    var store = tx.objectStore(DB_STORE_NAME);

    //tryCatch
    try {
        request = store.add(object);
    } catch (e) {
        console.log("Atrapado");
    };

    request.onsuccess = (event) => {
        console.log("añadirFormularioUsuario: Insercion de datos correcta. ID: " + event.target.result);

        //Operaciones que se realizan despues de insertar los datos a la base de datos
        sessionStorage.setItem('id', event.target.result);
        sessionStorage.setItem('nombreUsuario', nombreUsuario.value);
        sessionStorage.setItem("administrador", verificacionAdministrador);

        //Verificar si el nuevo usuario es administrador
        if(verificacionAdministrador == true){
            //Redirigido a la pagina de administración
            window.location.replace("./administracion.html");
        } else {
            //Redirigido al inicio normal(si es un usuario normal)
            window.location.replace("./index.html");
        }
    };

    request.onerror = (event) => {
        console.error("añadirFormularioUsuario: error añadiendo los datos!", this.error);
    };

    //After transaction is completed, we close the database
    tx.oncomplete = () => {
        console.log("añadirFormularioUsuario: transaccion completada");
        db.close();
        opened = false;
    };
};


/* Funciones de validación de datos puestos en el formulario */

//Para validar la contraseña (Aqui nos tomamos en serio la seguridad)
function contrasenaValida(input){
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return re.test(String(input)); //Will return true or false
};

/* Event Listeners para el formulario */

window.addEventListener('load', (event) =>{
    enviarDatos.addEventListener('click', (event) => {
        enviarFormularioDatos();
    });
});