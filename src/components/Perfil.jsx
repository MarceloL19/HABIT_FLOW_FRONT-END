import { useEffect, useState } from "react";

const CLAVE_HABITOS = "habitosHabitFlow";

const formatearFecha = (fecha, idiomaActual) => {
  if (!fecha) {
    return "Fecha no registrada";
  }

  const opciones = {
    day: "numeric",
    month: "long",
    year: "numeric"
  };

  const locale = idiomaActual === "inglés" ? "en-US" : "es-PE";

  return new Date(fecha).toLocaleDateString(locale, opciones);
};

const textosPerfil = {
  español: {
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
    temaSistema: "Sistema",
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
    datoTitulo: "¿Sabías qué?",
    datoTexto: "Se necesitan aproximadamente 66 días para formar un nuevo hábito. Sé paciente contigo mismo.",
    error: "El nombre y el correo son obligatorios.",
    exito: "Perfil actualizado correctamente."
  },
  inglés: {
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
    temaSistema: "System",
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
    idioma: "español",
    notificaciones: true
  };
  const textos = textosPerfil[idiomaActual] || textosPerfil.español;

  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [correo, setCorreo] = useState(usuario?.correo || "");
  const [tema, setTema] = useState(preferenciasIniciales.tema);
  const [idioma, setIdioma] = useState(preferenciasIniciales.idioma);
  const [notificaciones, setNotificaciones] = useState(preferenciasIniciales.notificaciones);
  const [mensaje, setMensaje] = useState("");
  const [habitos, setHabitos] = useState([]);

  const inicial = usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : "H";
  const habitosDelUsuario = habitos.filter((habito) => habito.usuarioCorreo === usuario?.correo);
  const totalHabitos = habitosDelUsuario.length;
  const completadosHoy = habitosDelUsuario.filter((habito) => habito.completadoHoy).length;
  const habitosCompletados = habitosDelUsuario.reduce((total, habito) => {
    return total + (Number(habito.diasCompletados) || 0);
  }, 0);

  useEffect(() => {
    const cargarHabitos = () => {
      const habitosGuardados = JSON.parse(localStorage.getItem(CLAVE_HABITOS)) || [];
      setHabitos(habitosGuardados);
    };

    cargarHabitos();
    window.addEventListener("focus", cargarHabitos);
    return () => window.removeEventListener("focus", cargarHabitos);
  }, []);

  const guardarCambios = (evento) => {
    evento.preventDefault();

    if (nombre.trim() === "" || correo.trim() === "") {
      setMensaje(textos.error);
      return;
    }

    const usuarioActualizado = {
      ...usuario,
      nombre: nombre.trim(),
      correo: correo.trim(),
      preferencias: {
        tema: tema,
        idioma: idioma,
        notificaciones: notificaciones
      }
    };

    actualizarUsuario(usuarioActualizado);
    setEditando(false);
    setMensaje(textos.exito);
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
              <p>✉ {usuario?.correo}</p>
              <p>▣ {textos.miembroDesde} {formatearFecha(usuario?.fechaRegistro, idiomaActual)}</p>
            </div>
          </article>

          <article className="tarjeta estadisticas-perfil">
            <h2>{textos.estadisticas}</h2>
            <div className="metricas-perfil">
              <div className="metrica verde">
                <span>◎ {textos.total}</span>
                <strong>{totalHabitos}</strong>
              </div>
              <div className="metrica azul">
                <span>◎ {textos.activos}</span>
                <strong>{completadosHoy}</strong>
              </div>
              <div className="metrica morado">
                <span>◎ {textos.completados}</span>
                <strong>{habitosCompletados}</strong>
              </div>
            </div>
          </article>

          <article className="tarjeta preferencias-card">
            <h2>{textos.preferencias}</h2>

            {mensaje !== "" && <p className="mensaje exito">{mensaje}</p>}

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
                <option value="sistema">{textos.temaSistema}</option>
              </select>

              <label htmlFor="idioma">{textos.idioma}</label>
              <select
                id="idioma"
                value={idioma}
                disabled={!editando}
                onChange={(evento) => setIdioma(evento.target.value)}
              >
                <option value="español">{textos.idiomaEspanol}</option>
                <option value="inglés">{textos.idiomaIngles}</option>
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
