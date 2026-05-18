const CLAVE_USUARIO = "usuarioHabitFlow";
const CLAVE_SESION = "sesionActiva";
const CLAVE_HABITOS = "habitosHabitFlow";

const vistaLogin = document.getElementById("vista-login");
const vistaRegistro = document.getElementById("vista-registro");
const vistaDashboard = document.getElementById("vista-dashboard");

const formLogin = document.getElementById("form-login");
const formRegistro = document.getElementById("form-registro");
const formHabito = document.getElementById("form-habito");

const mensajeLogin = document.getElementById("mensaje-login");
const mensajeRegistro = document.getElementById("mensaje-registro");
const mensajeHabito = document.getElementById("mensaje-habito");

const saludoUsuario = document.getElementById("saludo-usuario");
const listaHabitos = document.getElementById("lista-habitos");

// Obtiene el usuario guardado en localStorage.
const obtenerUsuario = () => {
    const usuarioGuardado = localStorage.getItem(CLAVE_USUARIO);

    if (usuarioGuardado === null) {
        return null;
    }

    return JSON.parse(usuarioGuardado);
};

// Cambia entre las vistas principales de la aplicacion.
const mostrarVista = (vista) => {
    vistaLogin.classList.add("oculto");
    vistaRegistro.classList.add("oculto");
    vistaDashboard.classList.add("oculto");

    if (vista === "login") {
        vistaLogin.classList.remove("oculto");
    }

    if (vista === "registro") {
        vistaRegistro.classList.remove("oculto");
    }

    if (vista === "dashboard") {
        const usuario = obtenerUsuario();

        if (usuario !== null) {
            saludoUsuario.textContent = "Hola, " + usuario.nombre;
        }

        renderizarHabitos();
        vistaDashboard.classList.remove("oculto");
    }
};

// Muestra mensajes visuales de error o exito.
const mostrarMensaje = (elemento, texto, tipo) => {
    elemento.textContent = texto;
    elemento.className = "mensaje " + tipo;
};

const limpiarMensaje = (elemento) => {
    elemento.textContent = "";
    elemento.className = "mensaje";
};

const correoValido = (correo) => {
    return correo.includes("@") && correo.includes(".");
};

// Valida y guarda un usuario nuevo.
const registrarUsuario = (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById("registro-nombre").value.trim();
    const correo = document.getElementById("registro-correo").value.trim();
    const password = document.getElementById("registro-password").value;
    const confirmar = document.getElementById("registro-confirmar").value;

    if (nombre === "" || correo === "" || password === "" || confirmar === "") {
        mostrarMensaje(mensajeRegistro, "Todos los campos son obligatorios.", "error");
        return;
    }

    if (!correoValido(correo)) {
        mostrarMensaje(mensajeRegistro, "Ingresa un correo válido.", "error");
        return;
    }

    if (password.length < 6) {
        mostrarMensaje(mensajeRegistro, "La contraseña debe tener al menos 6 caracteres.", "error");
        return;
    }

    if (password !== confirmar) {
        mostrarMensaje(mensajeRegistro, "Las contraseñas no coinciden.", "error");
        return;
    }

    const usuario = {
        nombre: nombre,
        correo: correo,
        password: password,
        fechaRegistro: new Date().toISOString()
    };

    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    formRegistro.reset();
    mostrarMensaje(mensajeRegistro, "Cuenta creada correctamente. Ahora puedes iniciar sesión.", "exito");
};

// Valida el acceso con los datos guardados.
const iniciarSesion = (evento) => {
    evento.preventDefault();

    const correo = document.getElementById("login-correo").value.trim();
    const password = document.getElementById("login-password").value;
    const usuario = obtenerUsuario();

    if (correo === "" || password === "") {
        mostrarMensaje(mensajeLogin, "Completa el correo y la contraseña.", "error");
        return;
    }

    if (usuario === null) {
        mostrarMensaje(mensajeLogin, "Primero debes registrarte para iniciar sesión.", "error");
        return;
    }

    if (correo !== usuario.correo || password !== usuario.password) {
        mostrarMensaje(mensajeLogin, "Correo o contraseña incorrectos.", "error");
        return;
    }

    localStorage.setItem(CLAVE_SESION, "true");
    formLogin.reset();
    limpiarMensaje(mensajeLogin);
    mostrarVista("dashboard");
};

const cerrarSesion = () => {
    localStorage.setItem(CLAVE_SESION, "false");
    mostrarVista("login");
};

const obtenerHabitos = () => {
    const habitosGuardados = localStorage.getItem(CLAVE_HABITOS);

    if (habitosGuardados === null) {
        return [];
    }

    return JSON.parse(habitosGuardados);
};

const guardarHabitos = (habitos) => {
    localStorage.setItem(CLAVE_HABITOS, JSON.stringify(habitos));
};

const obtenerClaseColor = (colorIcono) => {
    return "color-" + colorIcono.toLowerCase().split(" ").join("-").replace("í", "i");
};

const crearParrafoHabito = (etiqueta, valor) => {
    const parrafo = document.createElement("p");
    const dato = document.createElement("span");

    dato.className = "dato-habito";
    dato.textContent = etiqueta + ": ";
    parrafo.appendChild(dato);
    parrafo.append(valor);

    return parrafo;
};

const renderizarHabitos = () => {
    const habitos = obtenerHabitos();
    listaHabitos.innerHTML = "";

    if (habitos.length === 0) {
        listaHabitos.innerHTML = "<p class='sin-habitos'>Todavía no hay hábitos creados.</p>";
        return;
    }

    habitos.forEach((habito) => {
        const tarjeta = document.createElement("article");
        const titulo = document.createElement("h3");
        const descripcion = document.createElement("p");

        tarjeta.className = "habito-card " + obtenerClaseColor(habito.colorIcono);
        titulo.textContent = habito.nombre;
        descripcion.textContent = habito.descripcion || "Sin descripción";

        tarjeta.appendChild(titulo);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(crearParrafoHabito("Categoría", habito.categoria));
        tarjeta.appendChild(crearParrafoHabito("Frecuencia", habito.frecuencia));
        tarjeta.appendChild(crearParrafoHabito("Meta semanal", habito.metaSemanal || "Sin meta"));
        tarjeta.appendChild(crearParrafoHabito("Hora", habito.hora || "Sin recordatorio"));
        tarjeta.appendChild(crearParrafoHabito("Racha", habito.racha + " días"));
        listaHabitos.appendChild(tarjeta);
    });
};

const limpiarFormularioHabito = () => {
    formHabito.reset();
    limpiarMensaje(mensajeHabito);
};

// Crea un habito y lo agrega al arreglo guardado.
const crearHabito = (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById("habito-nombre").value.trim();
    const descripcion = document.getElementById("habito-descripcion").value.trim();
    const categoria = document.getElementById("habito-categoria").value;
    const frecuencia = document.getElementById("habito-frecuencia").value;
    const metaSemanal = document.getElementById("habito-meta").value;
    const hora = document.getElementById("habito-hora").value;
    const colorIcono = document.getElementById("habito-color").value;

    if (nombre === "" || categoria === "" || frecuencia === "") {
        mostrarMensaje(mensajeHabito, "Completa el nombre, la categoría y la frecuencia.", "error");
        return;
    }

    if (metaSemanal !== "" && Number(metaSemanal) <= 0) {
        mostrarMensaje(mensajeHabito, "La meta semanal debe ser un número positivo.", "error");
        return;
    }

    const nuevoHabito = {
        id: Date.now(),
        nombre: nombre,
        descripcion: descripcion,
        categoria: categoria,
        frecuencia: frecuencia,
        metaSemanal: metaSemanal === "" ? "" : Number(metaSemanal),
        hora: hora,
        colorIcono: colorIcono,
        completado: false,
        racha: 0,
        fechaCreacion: new Date().toISOString()
    };

    const habitos = obtenerHabitos();
    habitos.push(nuevoHabito);
    guardarHabitos(habitos);
    limpiarFormularioHabito();
    renderizarHabitos();
    mostrarMensaje(mensajeHabito, "Hábito guardado correctamente.", "exito");
};

document.getElementById("ir-registro").addEventListener("click", () => {
    limpiarMensaje(mensajeLogin);
    mostrarVista("registro");
});

document.getElementById("ir-login").addEventListener("click", () => {
    limpiarMensaje(mensajeRegistro);
    mostrarVista("login");
});

document.getElementById("btn-cerrar-sesion").addEventListener("click", cerrarSesion);
document.getElementById("btn-cancelar-habito").addEventListener("click", limpiarFormularioHabito);

formRegistro.addEventListener("submit", registrarUsuario);
formLogin.addEventListener("submit", iniciarSesion);
formHabito.addEventListener("submit", crearHabito);

if (localStorage.getItem(CLAVE_SESION) === "true" && obtenerUsuario() !== null) {
    mostrarVista("dashboard");
} else {
    mostrarVista("login");
}
