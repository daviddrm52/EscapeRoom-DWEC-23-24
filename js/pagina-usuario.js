var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
var database = "usuariosER-David-Rueda-Madrid";
const DB_STORE_NAME = 'usuarios';
const DB_VERSION = 1;
var db;
var opened = false;

//Variables para almacenar los datos buenos al actualizar datos
var nombreBueno;
var nombreUsuarioBueno;
var contrasenaBueno;
var administradorBueno;

//Variables para los botones de la pagina (Hay muchos lo se)
var botonMostrarEliminacionUsuario = document.getElementById("mostrarEliminacionUsuario");
var botonEliminarUsuario = document.getElementById("eliminarUsuario");
var botonCancelarEliminarUsuario = document.getElementById("cancelarEliminarUsuario");
var botonMostrarFormularioContrasena = document.getElementById("mostrarFormularioContrasena")
var botonActualizarContrasena = document.getElementById("actualizarContrasena");
var botonCancelarActualizarContrasena = document.getElementById("cancelarActualizarContrasena");
var botonMostrarFormularioDatosPersonales = document.getElementById("mostrarFormularioDatosPersonales");
var botonActualizarDatosPersonales = document.getElementById("actualizarDatosPersonales");
var botonCancelarActualizarDatosPersonales = document.getElementById("cancelarActualizarDatosPersonales");

//Variables para los contenedores que tienen la información del usuario, y las opciones
var pantallaInformacionUsuario = document.getElementById("pantallaInformacionUsuario");
var opcionesUsuario = document.getElementById("opcionesUsuario");

function openCreateDatabase(onDBCompleted) {
    if(opened){
        db.close();
        opened = false;
    };
    
    // Opening the database
    var request = indexedDB.open(database, DB_VERSION);

    //onsuccess handler (works)
    request.onsuccess = (event) => {
        db = event.target.result;

        // console.log(db);
        console.log("Base de datos " + database + " abierta: " + db);
        opened = true;
        onDBCompleted(db);
    };

    //onError handler
    request.onerror = (event) => {
        console.error("Error abriendo la base de datos: ", event.target.errorCode);
    };
};

/* Leer los datos del usuario para poder ponerlos en pantalla */

function paginaUsuario(){
    openCreateDatabase(function(db){
        conseguirDatosUsuarios(db);
    });
};

/* Funcion que se encarga de conseguir los datos del usuario, en base a la id que hay almacenada en el sessionStorage */

function conseguirDatosUsuarios(event) {
    console.log("conseguirDatosUsuarios, en marcha");
    var idUsuario = sessionStorage.getItem("id");

    openCreateDatabase(function(db){
        // console.log(db);
        console.log("Id del usuario que esta conectado: "+ idUsuario);

        var tx = db.transaction(DB_STORE_NAME, "readonly");
        var store = tx.objectStore(DB_STORE_NAME);

        //Lee los registros que estan con el id del usuario conectado
        var request = store.get(parseInt(idUsuario));

        request.onsuccess = function(event){
            var record = event.target.result;
            // console.log(record);

            //Esta funcion se encarga de imprimir los datos del usuario, en el div con el id="pantallaInformacionUsuario"
            imprimirDatosUsuario(record);
        };

        request.onerror = function(event){
            console.error("conseguirDatosUsuarios: error leyendo los datos: ", e.target.errorCode);
        };

        tx.oncomplete = function() {
            console.log("conseguirDatosUsuarios: tx completado, todo bien");
            db.close();
            opened = false;
        };
    });
};

// Funcion que mostrara los datos en pantalla, ademas de almacenar los datos buenos en caso de que el usuario actualize alguno de sus datos
function imprimirDatosUsuario(record) {
    nombreBueno = record.nombre;
    nombreUsuarioBueno = record.nombreUsuario;
    contrasenaBueno = record.contrasena;
    administradorBueno = record.administrador;

    document.getElementById("muestraNombre").innerHTML = nombreBueno;
    document.getElementById("muestraNombreUsuario").innerHTML = nombreUsuarioBueno;
};

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
    paginaUsuario();
});

/* Cierre de sesión del usuario */

document.getElementById("cerrarSesionUsuario").addEventListener('click', (event) => {
    sessionStorage.clear();
    window.location.replace("./index.html");
});

/* Sección de eliminación de usuario que esta conectado */

//Boton que muestra la confirmación que queremos eliminar nuestro usuario
botonMostrarEliminacionUsuario.addEventListener('click', (event) => {
    var containerEliminarUsuario = document.getElementById("containerEliminarUsuarioSeleccionado");
    containerEliminarUsuario.style.display = "block";
    pantallaInformacionUsuario.style.display = "none";
    opcionesUsuario.style.display = "none";
});

//Boton que quitará el formulario de eliminación
botonCancelarEliminarUsuario.addEventListener('click', (event) => {
    var containerEliminarUsuario = document.getElementById("containerEliminarUsuarioSeleccionado");
    containerEliminarUsuario.style.display = "none";
    pantallaInformacionUsuario.style.display = "block";
    opcionesUsuario.style.display = "block";
});

//Boton de confirmación de eliminación de usuario (este si que lo elimina)
botonEliminarUsuario.addEventListener('click', (event) => {
    eliminarUsuario();
});

//Funcion para eliminar el usuario
function eliminarUsuario(){
    openCreateDatabase(function(db){
        eliminarUsuarioConectado(db);
    });
};

//Funcion que elimina el usuario que esta conectado
function eliminarUsuarioConectado(event){
    console.log("eliminarUsuarioConectado");
    var idUsuario = sessionStorage.getItem('id');

    openCreateDatabase(function(db){
        console.log(idUsuario);
        var tx = db.transaction(DB_STORE_NAME, "readwrite");
        var store = tx.objectStore(DB_STORE_NAME);

        //Eliminando al usuario en la ObjectStore
        var request = store.delete(parseInt(idUsuario));

        request.onsuccess = function (event) {
            console.log("eliminarUsuarioConectado: usuario con id="+idUsuario+" eliminado correctamente");

            //Operaciones que se van a realizar despues de la eliminación del usuario
            //Se vuelve al inicio y se limpia el sessionStorage
            sessionStorage.clear();
            window.location.replace("./index.html");
        };

        //Si ocurre un error, entrará aqui
        request.onerror = function(event){
            console.error("eliminarUsuarioConectado: error eliminando el usuario: ", event.target.errorCode);
        };

        //Si todo ha ido bien, se cerrará la base de datos y se habra completado la operación
        tx.oncomplete = function(){
            console.log("eliminarUsuarioConectado: tx completado, todo bien");
            db.close();
            opened = false;
        };
    });
};

/* Sección de modificación de datos personales (Exceptuando la contraseña) */

botonMostrarFormularioDatosPersonales.addEventListener('click', (event) => {
    var containerActualizarDatosPersonales = document.getElementById("containerActualizarDatosPersonales");
    containerActualizarDatosPersonales.style.display = "block";
    pantallaInformacionUsuario.style.display = "none";
    opcionesUsuario.style.display = "none";
    document.getElementById("nuevoNombre").value = nombreBueno;
    document.getElementById("nuevoNombreUsuario").value = nombreUsuarioBueno;
});

botonCancelarActualizarDatosPersonales.addEventListener('click', (event) => {
    var containerActualizarDatosPersonales = document.getElementById("containerActualizarDatosPersonales");
    containerActualizarDatosPersonales.style.display = "none";
    pantallaInformacionUsuario.style.display = "block";
    opcionesUsuario.style.display = "block";
});

botonActualizarDatosPersonales.addEventListener('click', (event) => {
    actualizarDatosPersonales();
});

function actualizarDatosPersonales() {
    openCreateDatabase(function(db){
        actualizarDatosUsuarioConectado(db);
    });
};

function actualizarDatosUsuarioConectado(db){
    //En caso de que algun error ocurra
    var errorDetectado = true;
    //Campos del formulario
    var idUsuario = sessionStorage.getItem('id');
    var nombreActualizado = document.getElementById("nuevoNombre");
    var nombreUsuarioActualizado = document.getElementById("nuevoNombreUsuario");
    //Mensajes de error en caso de que algo no pueda ser validado
    var errorNuevoNombre = document.getElementById("nuevoNombreError");
    var errorNuevoNombreUsuario = document.getElementById("nuevoNombreUsuarioError");

    //Validación de los nuevos datos para el usuario
    //Validando el nuevo nombre
    if(nombreActualizado.value.trim() === ''){
        errorNuevoNombre.innerText = "¡El campo del nuevo nombre esta vacío!";
        errorNuevoNombre.style.display = "block";
        errorDetectado = true;
    } else {
        errorNuevoNombre.style.display = "none";
        errorDetectado = false;
    };
    //Validando el nuevo nombre de usuario
    if(nombreUsuarioActualizado.value.trim() === ''){
        errorNuevoNombreUsuario.innerText = "¡El campo del nuevo nombre de usuario esta vacío!";
        errorNuevoNombreUsuario.style.display = "block";
        errorDetectado = true;
    } else {
        errorNuevoNombreUsuario.style.display = "none";
        errorDetectado = false;
    };
    //En caso de que un error se haya detectado en los campos
    if (errorDetectado){
        console.log("Errores detectados, saliendo...");
        db.close();
        opened = false;
        return;
    } else {
        console.log("Todo correcto Devola y Popola");
    };
    var object = {
        id: parseInt(idUsuario),
        nombre: nombreActualizado.value,
        nombreUsuario: nombreUsuarioActualizado.value,
        contrasena: contrasenaBueno,
        administrador: administradorBueno
    };

    var tx = db.transaction(DB_STORE_NAME, "readwrite");
    var store = tx.objectStore(DB_STORE_NAME);

    //Actualiza los valores que tenemos de nuestro usuario, sin eliminar ninguno de los anteriores
    request = store.put(object);

    request.onsuccess = function (event) {
        console.log("actualizarDatosUsuarioConectado; datos actualizados correctamente");

        //Operaciones que vamos a realizar al actualizar los datos del usuario
        sessionStorage.removeItem('nombreUsuario');
        sessionStorage.setItem('nombreUsuario', nombreUsuarioActualizado.value);
        nombreActualizado.value = "";
        nombreUsuarioActualizado.value = "";
        var containerActualizarDatosPersonales = document.getElementById("containerActualizarDatosPersonales");
        containerActualizarDatosPersonales.style.display = "none";
        window.location.reload();
    };

    request.onerror = function (event) {
        console.error("actualizarDatosUsuarioConectado: error actualizando los datos del usuario ", this.error);
    };

    tx.oncomplete = function() {
        console.log("actualizarDatosUsuarioConectado: tx completado, todo bien");
        db.close();
        opened = false;
    };
};

/* Sección de modificación de la contraseña (sin afectar a los otros datos) */

botonMostrarFormularioContrasena.addEventListener('click', (event) => {
    var containerActualizarContrasena  = document.getElementById("containerActualizarContrasena");
    containerActualizarContrasena.style.display = "block";
    pantallaInformacionUsuario.style.display = "none";
    opcionesUsuario.style.display = "none";
});

botonCancelarActualizarContrasena.addEventListener('click', (event) => {
    var containerActualizarContrasena  = document.getElementById("containerActualizarContrasena");
    containerActualizarContrasena.style.display = "none";
    pantallaInformacionUsuario.style.display = "block";
    opcionesUsuario.style.display = "block";  
});

botonActualizarContrasena.addEventListener('click', (event) => {
    actualizarContrasena();
});

function actualizarContrasena() {
    openCreateDatabase(function(db){
        actualizarContrasenaUsuarioConectado(db);
    });
};

function actualizarContrasenaUsuarioConectado(db){

}

/* Pendiente actualizar contraseña, actualizar datos usuario y eliminación de la cuenta */