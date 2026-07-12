import { useState, useEffect } from "react";

// Direccion del backend
const API = "http://localhost:3000/api";

const Dashboard = ({ usuario, irAHabitos }) => {

  // Lista de habitos del usuario (viene del backend)
  const [habitos, setHabitos] = useState([]);

  // Guarda el id del habito que se quiere eliminar, null significa que no hay confirmacion abierta
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);

  // Le pide al backend los habitos del usuario y los guarda en el estado
  const cargarHabitos = async () => {
    const respuesta = await fetch(API + "/habitos/" + usuario.id_usuario);
    const datos = await respuesta.json();
    setHabitos(datos.habitos);
  };

  // Cuando carga la pagina traemos los habitos del backend
  useEffect(() => {
    cargarHabitos();
  }, []);

  // Recarga los habitos cada vez que el usuario vuelve a esta pestana
  useEffect(() => {
    window.addEventListener("focus", cargarHabitos);
    return () => window.removeEventListener("focus", cargarHabitos);
  }, []);

  // Devuelve un saludo segun la hora del dia
  const saludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  // Calculos para las tarjetas de resumen
  const habitosActivos = habitos.length;
  const completadosHoy = habitos.filter((h) => h.completadoHoy).length;
  const rachaMasLarga = habitos.length > 0
    ? Math.max(...habitos.map((h) => h.racha || 0))
    : 0;
  const progresoSemanal = habitosActivos > 0
    ? Math.round((completadosHoy / habitosActivos) * 100)
    : 0;

  // Marca o desmarca un habito como completado hoy
  const completarHabito = async (id) => {
    await fetch(API + "/habitos/" + id + "/cumplir", { method: "POST" });
    await cargarHabitos();
  };

  // Borra un habito del backend y cierra el modal de confirmacion
  const eliminarHabito = async (id) => {
    await fetch(API + "/habitos/" + id, { method: "DELETE" });
    await cargarHabitos();
    setConfirmarEliminar(null);
  };

  // Devuelve el color del habito segun su categoria
  const colorHabito = (habito) => {
    const colores = {
      Productividad: "#22c55e",
      Salud: "#06b6d4",
      Estudio: "#a855f7",
      Deporte: "#f97316"
    };
    return colores[habito.categoria] || "#6b7280";
  };

  // Devuelve el icono del habito segun su categoria
  const iconoHabito = (habito) => {
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
        {habitos.length === 0 && (
          <div className="habitos-vacio">
            <span className="habitos-vacio-icono">🌱</span>
            <h3>¡Empieza tu viaje hoy!</h3>
            <p>Aún no tienes hábitos registrados. Agregar uno pequeño puede cambiar tu día.</p>
          </div>
        )}

        {/* Tarjeta por cada habito del usuario */}
        {habitos.map((habito) => (
          <div
            key={habito.id_habito}
            className={`habito-card ${habito.completadoHoy ? "completado" : ""}`}
            style={{ borderLeft: `4px solid ${colorHabito(habito)}` }}
          >
            {/* Icono con el color de la categoria */}
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
                onClick={() => completarHabito(habito.id_habito)}
              >
                ✓ {habito.completadoHoy ? "Completado" : "Completar"}
              </button>
              <button className="btn-icono" title="Editar en Mis hábitos" onClick={irAHabitos}>✏️</button>
              <button className="btn-icono" title="Eliminar" onClick={() => setConfirmarEliminar(habito.id_habito)}>🗑️</button>
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
