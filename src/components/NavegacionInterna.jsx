import logoHabitFlow from "../assets/logo-habit-flow.png";

const NavegacionInterna = ({ pantallaActual, textos, cambiarPantalla, cerrarSesion }) => {
  const opciones = [
    { id: "dashboard", texto: textos.dashboard },
    { id: "habitos", texto: textos.habitos },
    { id: "estadisticas", texto: textos.estadisticas },
    { id: "perfil", texto: textos.perfil }
  ];

  return (
    <header className="navegacion">
      <div className="marca-nav">
        <img src={logoHabitFlow} alt="Logo de HabitFlow" className="logo-marca" />
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
        <button className="salir" onClick={cerrarSesion}>{textos.salir}</button>
      </nav>
    </header>
  );
};

export default NavegacionInterna;
