import { useEffect, useState } from "react";

// Clave donde se guardan los habitos en el navegador (la misma que usa App.jsx)
const CLAVE_HABITOS = "habitosHabitFlow";

// Categorias disponibles para clasificar los habitos
const categorias = ["Salud", "Estudio", "Deporte", "Trabajo", "Personal"];

const MisHabitos = ({ usuario }) => {
  // Lista completa de habitos guardados
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

  // Cuando carga la pagina leemos los habitos guardados en el navegador
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem(CLAVE_HABITOS)) || [];
    setHabitos(guardados);
  }, []);

  // Guarda la lista en el navegador y en el estado
  const guardarHabitos = (lista) => {
    localStorage.setItem(CLAVE_HABITOS, JSON.stringify(lista));
    setHabitos(lista);
  };

  // Deja el formulario vacio y sale del modo edicion
  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setCategoria("Salud");
    setFrecuencia("Diaria");
    setIdEditando(null);
  };

  // Crea un habito nuevo o guarda los cambios si estamos editando
  const guardarFormulario = (evento) => {
    evento.preventDefault();

    // No dejamos crear un habito sin nombre
    if (nombre.trim() === "") {
      return;
    }

    if (idEditando === null) {
      // Creamos un habito nuevo
      const nuevoHabito = {
        id: Date.now(),
        usuarioCorreo: usuario.correo,
        nombre: nombre,
        descripcion: descripcion,
        categoria: categoria,
        frecuencia: frecuencia,
        completadoHoy: false,
        racha: 0,
        estado: "activo",
        diasCompletados: 0
      };
      guardarHabitos([...habitos, nuevoHabito]);
    } else {
      // Editamos el habito que tiene el id que estamos editando
      const lista = habitos.map((habito) => {
        if (habito.id === idEditando) {
          return { ...habito, nombre, descripcion, categoria, frecuencia };
        }
        return habito;
      });
      guardarHabitos(lista);
    }

    limpiarFormulario();
  };

  // Pone los datos del habito en el formulario para editarlo
  const editarHabito = (habito) => {
    setNombre(habito.nombre);
    setDescripcion(habito.descripcion);
    setCategoria(habito.categoria);
    setFrecuencia(habito.frecuencia);
    setIdEditando(habito.id);
  };

  // Borra un habito de la lista
  const eliminarHabito = (id) => {
    const lista = habitos.filter((habito) => habito.id !== id);
    guardarHabitos(lista);

    // Si estabamos editando ese habito, limpiamos el formulario
    if (idEditando === id) {
      limpiarFormulario();
    }
  };

  // Marca o desmarca un habito como completado hoy
  const completarHabito = (id) => {
    const lista = habitos.map((habito) => {
      if (habito.id === id) {
        return { ...habito, completadoHoy: !habito.completadoHoy };
      }
      return habito;
    });
    guardarHabitos(lista);
  };

  // Nos quedamos solo con los habitos del usuario que inicio sesion
  const habitosDelUsuario = habitos.filter(
    (habito) => habito.usuarioCorreo === usuario.correo
  );

  // Aplicamos el filtro de categoria elegido
  const habitosVisibles = habitosDelUsuario.filter((habito) => {
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
                <article key={habito.id} className="tarjeta tarjeta-habito">
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
                        habito.completadoHoy
                          ? "boton boton-principal"
                          : "boton boton-borde"
                      }
                      onClick={() => completarHabito(habito.id)}
                    >
                      {habito.completadoHoy ? "Completado" : "Marcar"}
                    </button>

                    <button
                      className="boton boton-borde"
                      onClick={() => editarHabito(habito)}
                    >
                      Editar
                    </button>

                    <button
                      className="boton boton-peligro"
                      onClick={() => eliminarHabito(habito.id)}
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