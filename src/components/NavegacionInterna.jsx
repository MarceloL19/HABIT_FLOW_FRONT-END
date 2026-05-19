import logoHabitFlow from "../assets/logo-habit-flow.png";

const NavegacionInterna = ({ pantallaActual, cambiarPantalla, cerrarSesion }) => {
  const opciones = [
    { id: "dashboard", texto: "Dashboard" },
    { id: "habitos", texto: "Mis hábitos" },
    { id: "estadisticas", texto: "Estadísticas" },
    { id: "perfil", texto: "Perfil" }
  ];

  return (
    <header className="navegacion">
      <div className="marca-nav">
        <img src={logoHabitFlow} alt="Logo de HabitFlow" />
        <span>HabitFlow</span>
      </div>

      <nav>
        {opciones.map((opcion) => (
          <button
            key={opcion.id}
            className={pantallaActual === opcion.id ? "nav-activo" : ""}
            onClick={() => cambiarPantalla(opcion.id)}
          >
            {opcion.texto}
          </button>
        ))}
        <button className="salir" onClick={cerrarSesion}>Salir</button>
      </nav>
    </header>
  );
};

export default NavegacionInterna;
