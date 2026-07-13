import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";
const API_HABITOS = `${API_URL}/api/habitos`;

const formatearFecha = (fecha, idiomaActual) => {
  if (!fecha) {
    return "Fecha no registrada";
  }

  const opciones = {
    day: "numeric",
    month: "long",
    year: "numeric"
  };

  const locale = idiomaActual === "en" ? "en-US" : "es-PE";

  return new Date(fecha).toLocaleDateString(locale, opciones);
};

const textosPerfil = {
  es: {
    titulo: "Mi Perfil",
    miembroDesde: "Miembro desde",
    estadisticas: "Estadísticas generales",
    total: "Hábitos registrados",
    activos: "Completados hoy",
    completados: "Días completados",
    preferencias: "Preferencias",
    nombre: "Nombre completo",
    correo: "Correo electrónico",
    tema: "Tema",
    temaClaro: "Claro",
    temaOscuro: "Oscuro",
    idioma: "Idioma",
    idiomaEspanol: "Español",
    idiomaIngles: "Inglés",
    notificaciones: "Activar notificaciones",
    guardar: "Guardar cambios",
    acciones: "Acciones",
    editar: "Editar perfil",
    cerrar: "Cerrar sesión",
    consejoEtiqueta: "Consejo",
    consejoTitulo: "Consejo del día",
    consejoTexto: "Los hábitos pequeños y constantes son más efectivos que los cambios grandes pero esporádicos.",
    datoEtiqueta: "Dato útil",
    datoTitulo: "¿Sabías que?",
    datoTexto: "Se necesitan aproximadamente 66 días para formar un nuevo hábito. Sé paciente contigo mismo.",
    error: "El nombre y el correo son obligatorios.",
    exito: "Perfil actualizado correctamente."
  },
  en: {
    titulo: "My Profile",
    miembroDesde: "Member since",
    estadisticas: "General stats",
    total: "Registered habits",
    activos: "Completed today",
    completados: "Completed days",
    preferencias: "Preferences",
    nombre: "Full name",
    correo: "Email",
    tema: "Theme",
    temaClaro: "Light",
    temaOscuro: "Dark",
    idioma: "Language",
    idiomaEspanol: "Spanish",
    idiomaIngles: "English",
    notificaciones: "Enable notifications",
    guardar: "Save changes",
    acciones: "Actions",
    editar: "Edit profile",
    cerrar: "Logout",
    consejoEtiqueta: "Tip",
    consejoTitulo: "Tip of the day",
    consejoTexto: "Small and consistent habits are more effective than big but occasional changes.",
    datoEtiqueta: "Useful fact",
    datoTitulo: "Did you know?",
    datoTexto: "It takes around 66 days to build a new habit. Be patient with yourself.",
    error: "Name and email are required.",
    exito: "Profile updated successfully."
  }
};

const Perfil = ({ usuario, idiomaActual, actualizarUsuario, cerrarSesion }) => {
  const preferenciasIniciales = usuario?.preferencias || {
    tema: "claro",
    idioma: "es",
    notificaciones: true
  };
  const textos = textosPerfil[idiomaActual] || textosPerfil.es;
  const idUsuario = usuario?.id_usuario || usuario?.id;

  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [correo, setCorreo] = useState(usuario?.correo || "");
  const [tema, setTema] = useState(preferenciasIniciales.tema === "oscuro" ? "oscuro" : "claro");
  const [idioma, setIdioma] = useState(preferenciasIniciales.idioma || "es");
  const [notificaciones, setNotificaciones] = useState(preferenciasIniciales.notificaciones ?? true);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("exito");
  const [metricasHabitos, setMetricasHabitos] = useState({
    totalHabitos: 0,
    completadosHoy: 0,
    habitosCompletados: 0
  });

  const mostrarError = (texto) => {
    setTipoMensaje("error");
    setMensaje(texto);
  };

  const mostrarExito = (texto) => {
    setTipoMensaje("exito");
    setMensaje(texto);
  };

  const inicial = usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : "H";
  const { totalHabitos, completadosHoy, habitosCompletados } = metricasHabitos;

  useEffect(() => {
    setNombre(usuario?.nombre || "");
    setCorreo(usuario?.correo || "");
    setTema(usuario?.preferencias?.tema === "oscuro" ? "oscuro" : "claro");
    setIdioma(usuario?.preferencias?.idioma || "es");
    setNotificaciones(usuario?.preferencias?.notificaciones ?? true);
  }, [usuario]);

  // Al abrir perfil, trae los datos frescos desde PostgreSQL por medio del backend.
  useEffect(() => {
    const cargarPerfil = async () => {
      if (!idUsuario) {
        return;
      }

      try {
        const respuesta = await fetch(`${API_URL}/api/usuarios/${idUsuario}`);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          mostrarError(datos.mensaje || "No se pudo cargar el perfil.");
          return;
        }

        actualizarUsuario(datos.usuario);
      } catch (error) {
        mostrarError("No se pudo conectar con el backend.");
      }
    };

    cargarPerfil();
  }, [idUsuario]);

  useEffect(() => {
    const cargarMetricasHabitos = async () => {
      if (!idUsuario) {
        setMetricasHabitos({
          totalHabitos: 0,
          completadosHoy: 0,
          habitosCompletados: 0
        });
        return;
      }

      try {
        const respuesta = await fetch(`${API_HABITOS}/${idUsuario}`);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(datos.mensaje || "No se pudieron cargar los habitos.");
        }

        const habitosBackend = datos.habitos || [];

        setMetricasHabitos({
          totalHabitos: habitosBackend.length,
          completadosHoy: habitosBackend.filter((habito) => habito.completado_hoy).length,
          habitosCompletados: habitosBackend.reduce((total, habito) => {
            return total + (Number(habito.dias_completados) || 0);
          }, 0)
        });
      } catch (error) {
        setMetricasHabitos({
          totalHabitos: 0,
          completadosHoy: 0,
          habitosCompletados: 0
        });
      }
    };

    cargarMetricasHabitos();
    window.addEventListener("focus", cargarMetricasHabitos);
    return () => window.removeEventListener("focus", cargarMetricasHabitos);
  }, [idUsuario]);

  // Guarda datos personales y preferencias usando los endpoints del backend.
  const guardarCambios = async (evento) => {
    evento.preventDefault();
    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();

    if (nombreLimpio === "" || correoLimpio === "") {
      mostrarError(textos.error);
      return;
    }

    try {
      const respuestaPerfil = await fetch(`${API_URL}/api/usuarios/${idUsuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: nombreLimpio,
          correo: correoLimpio
        })
      });

      const datosPerfil = await respuestaPerfil.json();

      if (!respuestaPerfil.ok) {
        mostrarError(datosPerfil.mensaje || "No se pudo actualizar el perfil.");
        return;
      }

      const respuestaPreferencias = await fetch(`${API_URL}/api/usuarios/${idUsuario}/preferencias`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tema,
          idioma,
          notificaciones
        })
      });

      const datosPreferencias = await respuestaPreferencias.json();

      if (!respuestaPreferencias.ok) {
        mostrarError(datosPreferencias.mensaje || "No se pudieron actualizar las preferencias.");
        return;
      }

      const usuarioActualizado = {
        ...datosPerfil.usuario,
        preferencias: datosPreferencias.preferencias
      };

      actualizarUsuario(usuarioActualizado);
      setEditando(false);
      mostrarExito(textos.exito);
    } catch (error) {
      mostrarError("No se pudo conectar con el backend.");
    }
  };

  return (
    <main className="contenedor-interno perfil-page">
      <h1 className="titulo-pagina">{textos.titulo}</h1>

      <section className="perfil-layout">
        <div className="perfil-columna-principal">
          <article className="tarjeta perfil-resumen">
            <div className="avatar-perfil">{inicial}</div>
            <div>
              <h2>{usuario?.nombre}</h2>
              <p>Correo: {usuario?.correo}</p>
              <p>{textos.miembroDesde} {formatearFecha(usuario?.fecha_registro, idiomaActual)}</p>
            </div>
          </article>

          <article className="tarjeta estadisticas-perfil">
            <h2>{textos.estadisticas}</h2>
            <div className="metricas-perfil">
              <div className="metrica verde">
                <span>{textos.total}</span>
                <strong>{totalHabitos}</strong>
              </div>
              <div className="metrica azul">
                <span>{textos.activos}</span>
                <strong>{completadosHoy}</strong>
              </div>
              <div className="metrica morado">
                <span>{textos.completados}</span>
                <strong>{habitosCompletados}</strong>
              </div>
            </div>
          </article>

          <article className="tarjeta preferencias-card">
            <h2>{textos.preferencias}</h2>

            {mensaje !== "" && (
              <p className={tipoMensaje === "exito" ? "mensaje exito" : "mensaje error"}>
                {mensaje}
              </p>
            )}

            <form className="formulario perfil-formulario" onSubmit={guardarCambios}>
              <label htmlFor="perfilNombre">{textos.nombre}</label>
              <input
                id="perfilNombre"
                type="text"
                value={nombre}
                disabled={!editando}
                onChange={(evento) => setNombre(evento.target.value)}
              />

              <label htmlFor="perfilCorreo">{textos.correo}</label>
              <input
                id="perfilCorreo"
                type="email"
                value={correo}
                disabled={!editando}
                onChange={(evento) => setCorreo(evento.target.value)}
              />

              <label htmlFor="tema">{textos.tema}</label>
              <select
                id="tema"
                value={tema}
                disabled={!editando}
                onChange={(evento) => setTema(evento.target.value)}
              >
                <option value="claro">{textos.temaClaro}</option>
                <option value="oscuro">{textos.temaOscuro}</option>
              </select>

              <label htmlFor="idioma">{textos.idioma}</label>
              <select
                id="idioma"
                value={idioma}
                disabled={!editando}
                onChange={(evento) => setIdioma(evento.target.value)}
              >
                <option value="es">{textos.idiomaEspanol}</option>
                <option value="en">{textos.idiomaIngles}</option>
              </select>

              <label className="fila-check">
                <input
                  type="checkbox"
                  checked={notificaciones}
                  disabled={!editando}
                  onChange={(evento) => setNotificaciones(evento.target.checked)}
                />
                {textos.notificaciones}
              </label>

              {editando && (
                <button className="boton boton-principal" type="submit">
                  {textos.guardar}
                </button>
              )}
            </form>
          </article>
        </div>

        <aside className="perfil-lateral">
          <article className="tarjeta acciones-perfil">
            <h2>{textos.acciones}</h2>
            <button className="boton boton-borde boton-ancho" onClick={() => setEditando(true)}>
              {textos.editar}
            </button>
            <button className="boton boton-peligro boton-ancho" onClick={cerrarSesion}>
              {textos.cerrar}
            </button>
          </article>

          <article className="tarjeta consejo-card">
            <p className="etiqueta">{textos.consejoEtiqueta}</p>
            <h2>{textos.consejoTitulo}</h2>
            <p>{textos.consejoTexto}</p>
          </article>

          <article className="tarjeta dato-card">
            <p className="etiqueta">{textos.datoEtiqueta}</p>
            <h2>{textos.datoTitulo}</h2>
            <p>{textos.datoTexto}</p>
          </article>
        </aside>
      </section>
    </main>
  );
};

export default Perfil;
