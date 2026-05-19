import logoHabitFlow from "../assets/logo-habit-flow.png";

const beneficios = [
  {
    titulo: "Seguimiento diario",
    texto: "Registra tus avances y mantén tus hábitos visibles cada día."
  },
  {
    titulo: "Estadísticas",
    texto: "Revisa tu progreso con datos simples y fáciles de entender."
  },
  {
    titulo: "Recordatorios",
    texto: "Organiza tus horarios sugeridos para no perder el ritmo."
  },
  {
    titulo: "Motivación",
    texto: "Construye rachas y celebra cada pequeño avance."
  }
];

const LandingPage = ({ irRegistro, irLogin }) => {
  return (
    <main className="landing">
      <section className="hero">
        <div className="marca-principal">
          <img src={logoHabitFlow} alt="Logo de HabitFlow" className="logo-principal" />
          <span>HabitFlow</span>
        </div>

        <h1>Organiza tus hábitos y mejora tu rutina</h1>
        <p>
          HabitFlow te ayuda a crear, seguir y mantener hábitos personales de
          una manera visual, sencilla y motivadora.
        </p>

        <div className="acciones-hero">
          <button className="boton boton-principal" onClick={irRegistro}>
            Crear cuenta
          </button>
          <button className="boton boton-secundario" onClick={irRegistro}>
            Comenzar gratis
          </button>
          <button className="boton boton-texto" onClick={irLogin}>
            Iniciar sesión
          </button>
        </div>
      </section>

      <section className="beneficios">
        {beneficios.map((beneficio) => (
          <article className="tarjeta-beneficio" key={beneficio.titulo}>
            <h2>{beneficio.titulo}</h2>
            <p>{beneficio.texto}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default LandingPage;
