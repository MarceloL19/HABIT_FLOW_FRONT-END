import logoHabitFlow from "../assets/logo-habit-flow.png";

const beneficios = [
  {
    titulo: "Seguimiento diario",
    icono: "◎",
    texto: "Registra tus hábitos cada día y visualiza tu progreso."
  },
  {
    titulo: "Estadísticas",
    icono: "↗",
    texto: "Analiza tu evolución con métricas claras y simples."
  },
  {
    titulo: "Recordatorios",
    icono: "◔",
    texto: "Organiza tus horarios para no perder el ritmo."
  },
  {
    titulo: "Motivación",
    icono: "✦",
    texto: "Mantén tu racha y avanza hacia tus metas personales."
  }
];

const LandingPage = ({ irRegistro, irLogin }) => {
  return (
    <main className="landing">
      <header className="topbar-publica">
        <div className="marca-texto">
          <img src={logoHabitFlow} alt="Logo de HabitFlow" className="logo-marca" />
          <span>HabitFlow</span>
        </div>
        <div className="acciones-topbar">
          <button className="boton boton-texto" onClick={irLogin}>Iniciar sesión</button>
          <button className="boton boton-principal" onClick={irRegistro}>Crear cuenta</button>
        </div>
      </header>

      <section className="hero">
        <h1>Construye mejores hábitos, un día a la vez</h1>
        <p>
          HabitFlow te ayuda a crear rutinas saludables, alcanzar tus metas y
          convertirte en la mejor versión de ti mismo.
        </p>

        <div className="acciones-hero">
          <button className="boton boton-secundario" onClick={irRegistro}>
            Comenzar gratis
          </button>
          <button className="boton boton-borde" onClick={irLogin}>
            Iniciar sesión
          </button>
        </div>
      </section>

      <section className="beneficios">
        {beneficios.map((beneficio) => (
          <article className="tarjeta-beneficio" key={beneficio.titulo}>
            <span className="icono-beneficio">{beneficio.icono}</span>
            <h2>{beneficio.titulo}</h2>
            <p>{beneficio.texto}</p>
          </article>
        ))}
      </section>

      <section className="cta-final">
        <h2>¿Listo para empezar?</h2>
        <p>Crea tu cuenta y empieza a ordenar tus hábitos personales.</p>
        <button className="boton boton-principal" onClick={irRegistro}>Comenzar ahora</button>
      </section>
    </main>
  );
};

export default LandingPage;
