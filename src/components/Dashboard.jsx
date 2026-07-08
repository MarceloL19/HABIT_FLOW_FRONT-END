import { useState, useEffect } from "react";

// Clave donde se guardan los habitos en el navegador (la misma que usa MisHabitos.jsx)
const CLAVE_HABITOS = "habitosHabitFlow";

const Dashboard = ({ usuario, irAHabitos }) => {

  // Lista de todos los habitos guardados en el navegador
  const [habitos, setHabitos] = useState([]);

  // Guarda el id del habito que se quiere eliminar, null significa que no hay confirmacion abierta
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);

  // Cuando carga la pagina leemos los habitos guardados en el navegador
  useEffect(() => {
    const guardados = localStorage.getItem(CLAVE_HABITOS);
    if (guardados !== null) {
      setHabitos(JSON.parse(guardados));
    }
  }, []);

  // Recarga los habitos cada vez que el usuario vuelve a esta pestana
  useEffect(() => {
    const cargar = () => {
      const guardados = localStorage.getItem(CLAVE_HABITOS);
      if (guardados !== null) setHabitos(JSON.parse(guardados));
    };
    window.addEventListener("focus", cargar);
    return () => window.removeEventListener("focus", cargar);
  }, []);

  // Guarda la lista en el navegador y en el estado
  const guardarHabitos = (lista) => {
    localStorage.setItem(CLAVE_HABITOS, JSON.stringify(lista));
    setHabitos(lista);
  };

  // Devuelve un saludo segun la hora del dia
  const saludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  // Nos quedamos solo con los habitos del usuario que inicio sesion
  const habitosDelUsuario = habitos.filter(
    (habito) => habito.usuarioCorreo === usuario?.correo
  );

  // Calculos para las tarjetas de resumen
  const habitosActivos = habitosDelUsuario.length;
  const completadosHoy = habitosDelUsuario.filter((h) => h.completadoHoy).length;
  const rachaMasLarga = habitosDelUsuario.length > 0
    ? Math.max(...habitosDelUsuario.map((h) => h.racha || 0))
    : 0;
  const progresoSemanal = habitosActivos > 0
    ? Math.round((completadosHoy / habitosActivos) * 100)
    : 0;

  // Marca o desmarca un habito como completado hoy
  const completarHabito = (id) => {
    const lista = habitos.map((habito) => {
      if (habito.id === id) {
        const quedaCompletado = !habito.completadoHoy;
        const diasCompletados = Number(habito.diasCompletados) || 0;
        const racha = Number(habito.racha) || 0;

        return {
          ...habito,
          completadoHoy: quedaCompletado,
          diasCompletados: quedaCompletado
            ? diasCompletados + 1
            : Math.max(0, diasCompletados - 1),
          racha: quedaCompletado ? racha + 1 : Math.max(0, racha - 1)
        };
      }
      return habito;
    });
    guardarHabitos(lista);
  };

  // Borra un habito de la lista y cierra el modal de confirmacion
  const eliminarHabito = (id) => {
    const lista = habitos.filter((habito) => habito.id !== id);
    guardarHabitos(lista);
    setConfirmarEliminar(null);
  };

  // Devuelve el color del habito; si no tiene color propio usa el de su categoria
  const colorHabito = (habito) => {
    if (habito.color) return habito.color;
    const colores = {
      Productividad: "#22c55e",
      Salud: "#06b6d4",
      Estudio: "#a855f7",
      Deporte: "#f97316"
    };
    return colores[habito.categoria] || "#6b7280";
  };

  // Devuelve el icono del habito; si no tiene icono propio usa el de su categoria
  const iconoHabito = (habito) => {
    if (habito.icono) return habito.icono;
    const iconos = {
      Productividad: "📗",
      Salud: "💧",
      Estudio: "🖥️",
      Deporte: "🏃"
    };
    return iconos[habito.categoria] || "⭐";
  };

  return (
    <main className="contenedor-interno">

      {/* Saludo personalizado segun la hora del dia */}
      <section className="bienvenida">
        <h1>{saludo()}, {usuario?.nombre}</h1>
        <p>Aquí está tu resumen de hoy. ¡Sigue así!</p>
      </section>

      {/* Tarjetas con el resumen de estadisticas del usuario */}
      <section className="grid-resumen">
        <article className="tarjeta">
          <div className="tarjeta-header">
            <span>Hábitos activos</span>
            <span className="icono-tarjeta verde">🎯</span>
          </div>
          <h2>{habitosActivos}</h2>
        </article>

        <article className="tarjeta">
          <div className="tarjeta-header">
            <span>Completados hoy</span>
            <span className="icono-tarjeta azul">✔️</span>
          </div>
          <h2>{completadosHoy}</h2>
        </article>

        <article className="tarjeta">
          <div className="tarjeta-header">
            <span>Racha más larga</span>
            <span className="icono-tarjeta naranja">🔥</span>
          </div>
          <h2>{rachaMasLarga} días</h2>
        </article>

        <article className="tarjeta">
          <div className="tarjeta-header">
            <span>Progreso semanal</span>
            <span className="icono-tarjeta morado">📈</span>
          </div>
          <h2>{progresoSemanal}%</h2>
        </article>
      </section>

      {/* Lista de habitos del dia con acciones */}
      <section className="seccion-habitos">
        <div className="habitos-header">
          <h2>Tus hábitos de hoy</h2>
          {/* El boton redirige a la pestana Mis habitos para crear uno nuevo */}
          <button className="btn-agregar" onClick={irAHabitos}>+ Agregar hábito</button>
        </div>

        {/* Si no hay habitos mostramos un mensaje motivacional */}
        {habitosDelUsuario.length === 0 && (
          <div className="habitos-vacio">
            <span className="habitos-vacio-icono">🌱</span>
            <h3>¡Empieza tu viaje hoy!</h3>
            <p>Aún no tienes hábitos registrados. Agregar uno pequeño puede cambiar tu día.</p>
          </div>
        )}

        {/* Tarjeta por cada habito del usuario */}
        {habitosDelUsuario.map((habito) => (
          <div
            key={habito.id}
            className={`habito-card ${habito.completadoHoy ? "completado" : ""}`}
            style={{ borderLeft: `4px solid ${colorHabito(habito)}` }}
          >
            {/* Icono con el color de la categoria o el color personalizado */}
            <div className="habito-icono" style={{ backgroundColor: colorHabito(habito) }}>
              {iconoHabito(habito)}
            </div>

            {/* Informacion del habito */}
            <div className="habito-info">
              <h3>{habito.nombre}</h3>
              <p>{habito.descripcion}</p>
              <div className="habito-tags">
                <span className="tag" style={{ color: colorHabito(habito) }}>{habito.categoria}</span>
                <span className="tag gris">{habito.frecuencia}</span>
              </div>
              {habito.racha > 0 && <span className="racha">🔥 {habito.racha} días</span>}
            </div>

            {/* Acciones: completar, editar (redirige a Mis habitos) y eliminar */}
            <div className="habito-acciones">
              <button
                className={`btn-completar ${habito.completadoHoy ? "completado" : ""}`}
                onClick={() => completarHabito(habito.id)}
              >
                ✓ {habito.completadoHoy ? "Completado" : "Completar"}
              </button>
              <button className="btn-icono" title="Editar en Mis hábitos" onClick={irAHabitos}>✏️</button>
              <button className="btn-icono" title="Eliminar" onClick={() => setConfirmarEliminar(habito.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </section>

      {/* Modal de confirmacion antes de eliminar un habito */}
      {confirmarEliminar && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-cerrar" onClick={() => setConfirmarEliminar(null)}>✕</button>
            <h3>Eliminar hábito</h3>
            <p>¿Estás seguro de que deseas eliminar este hábito? Esta acción no se puede deshacer.</p>
            <div className="modal-botones">
              <button className="btn-cancelar" onClick={() => setConfirmarEliminar(null)}>Cancelar</button>
              <button className="btn-eliminar" onClick={() => eliminarHabito(confirmarEliminar)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default Dashboard;
