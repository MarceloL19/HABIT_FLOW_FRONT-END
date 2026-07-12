import { useEffect, useState } from "react";

// Direccion del backend para los habitos
const API = "http://localhost:3000/api/habitos";

// Categorias disponibles para clasificar los habitos
const categorias = ["Salud", "Estudio", "Deporte", "Trabajo", "Personal"];

const MisHabitos = ({ usuario }) => {
  // Lista de habitos del usuario (viene del backend)
  const [habitos, setHabitos] = useState([]);

  // Campos del formulario para crear o editar un habito
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("Salud");
  const [frecuencia, setFrecuencia] = useState("Diaria");

  // Si estamos editando guardamos el id del habito; si no, vale null
  const [idEditando, setIdEditando] = useState(null);

  // Categoria elegida para filtrar la vista ("Todas" muestra todo)
  const [filtro, setFiltro] = useState("Todas");

  // Id del usuario que inicio sesion (lo devuelve el backend al hacer login)
  const idUsuario = usuario?.id_usuario || usuario?.id;

  // Le pide al backend los habitos del usuario y los guarda en el estado
  const cargarHabitos = async () => {
    const respuesta = await fetch(`${API}/${idUsuario}`);
    const datos = await respuesta.json();
    setHabitos(datos.habitos || []);
  };

  // Cuando carga la pagina traemos los habitos del backend
  useEffect(() => {
    cargarHabitos();
  }, []);

  // Deja el formulario vacio y sale del modo edicion
  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setCategoria("Salud");
    setFrecuencia("Diaria");
    setIdEditando(null);
  };

  // Crea un habito nuevo o guarda los cambios si estamos editando
  const guardarFormulario = async (evento) => {
    evento.preventDefault();

    // No dejamos crear un habito sin nombre
    if (nombre.trim() === "") {
      return;
    }

    if (idEditando === null) {
      // Creamos un habito nuevo en el backend
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: idUsuario,
          nombre: nombre,
          descripcion: descripcion,
          categoria: categoria,
          frecuencia: frecuencia
        })
      });
    } else {
      // Editamos el habito que estamos editando
      await fetch(`${API}/${idEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre,
          descripcion: descripcion,
          categoria: categoria,
          frecuencia: frecuencia
        })
      });
    }

    await cargarHabitos();
    limpiarFormulario();
  };

  // Pone los datos del habito en el formulario para editarlo
  const editarHabito = (habito) => {
    setNombre(habito.nombre);
    setDescripcion(habito.descripcion);
    setCategoria(habito.categoria);
    setFrecuencia(habito.frecuencia);
    setIdEditando(habito.id_habito);
  };

  // Borra un habito del backend
  const eliminarHabito = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    await cargarHabitos();

    // Si estabamos editando ese habito, limpiamos el formulario
    if (idEditando === id) {
      limpiarFormulario();
    }
  };

  // Marca o desmarca un habito como completado hoy
  const completarHabito = async (id) => {
    await fetch(`${API}/${id}/toggle`, { method: "PUT" });
    await cargarHabitos();
  };

  // Aplicamos el filtro de categoria elegido
  const habitosVisibles = habitos.filter((habito) => {
    if (filtro === "Todas") {
      return true;
    }
    return habito.categoria === filtro;
  });

  return (
    <main className="contenedor-interno">
      <h1 className="titulo-pagina">Mis hábitos</h1>

      {/* Formulario para crear o editar un habito */}
      <section className="tarjeta formulario-habito">
        <p className="etiqueta">
          {idEditando === null ? "Nuevo hábito" : "Editar hábito"}
        </p>

        <form className="formulario" onSubmit={guardarFormulario}>
          <label>Nombre</label>
          <input
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            placeholder="Ej: Beber agua"
          />

          <label>Descripción</label>
          <input
            value={descripcion}
            onChange={(evento) => setDescripcion(evento.target.value)}
            placeholder="Ej: Tomar 8 vasos al día"
          />

          <label>Categoría</label>
          <select
            value={categoria}
            onChange={(evento) => setCategoria(evento.target.value)}
          >
            {categorias.map((nombreCategoria) => (
              <option key={nombreCategoria} value={nombreCategoria}>
                {nombreCategoria}
              </option>
            ))}
          </select>

          <label>Frecuencia</label>
          <select
            value={frecuencia}
            onChange={(evento) => setFrecuencia(evento.target.value)}
          >
            <option value="Diaria">Diaria</option>
            <option value="Semanal">Semanal</option>
          </select>

          <button type="submit" className="boton boton-principal boton-ancho">
            {idEditando === null ? "Crear hábito" : "Guardar cambios"}
          </button>

          {idEditando !== null && (
            <button
              type="button"
              className="boton boton-texto"
              onClick={limpiarFormulario}
            >
              Cancelar
            </button>
          )}
        </form>
      </section>

      {/* Botones para filtrar los habitos por categoria */}
      <div className="filtros-habitos">
        <button
          className={filtro === "Todas" ? "chip chip-activo" : "chip"}
          onClick={() => setFiltro("Todas")}
        >
          Todas
        </button>

        {categorias.map((nombreCategoria) => (
          <button
            key={nombreCategoria}
            className={filtro === nombreCategoria ? "chip chip-activo" : "chip"}
            onClick={() => setFiltro(nombreCategoria)}
          >
            {nombreCategoria}
          </button>
        ))}
      </div>

      {/* Si no hay habitos para mostrar, avisamos al usuario */}
      {habitosVisibles.length === 0 && (
        <section className="tarjeta">
          <p>No tienes hábitos aquí. ¡Crea uno con el formulario de arriba!</p>
        </section>
      )}

      {/* Mostramos los habitos agrupados por categoria (una seccion por categoria) */}
      {categorias.map((nombreCategoria) => {
        // Habitos visibles que pertenecen a esta categoria
        const habitosDeCategoria = habitosVisibles.filter(
          (habito) => habito.categoria === nombreCategoria
        );

        // Si la categoria no tiene habitos, no mostramos la seccion
        if (habitosDeCategoria.length === 0) {
          return null;
        }

        return (
          <section key={nombreCategoria} className="seccion-categoria">
            <h2 className="titulo-categoria">{nombreCategoria}</h2>

            <div className="lista-habitos">
              {habitosDeCategoria.map((habito) => (
                <article key={habito.id_habito} className="tarjeta tarjeta-habito">
                  <div>
                    <h3>{habito.nombre}</h3>
                    <p>{habito.descripcion}</p>
                    <p className="dato-habito">
                      Frecuencia: {habito.frecuencia} · Racha: {habito.racha} días
                    </p>
                  </div>

                  <div className="acciones-habito">
                    <button
                      className={
                        habito.completado_hoy
                          ? "boton boton-principal"
                          : "boton boton-borde"
                      }
                      onClick={() => completarHabito(habito.id_habito)}
                    >
                      {habito.completado_hoy ? "Completado" : "Marcar"}
                    </button>

                    <button
                      className="boton boton-borde"
                      onClick={() => editarHabito(habito)}
                    >
                      Editar
                    </button>

                    <button
                      className="boton boton-peligro"
                      onClick={() => eliminarHabito(habito.id_habito)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
};

export default MisHabitos;
