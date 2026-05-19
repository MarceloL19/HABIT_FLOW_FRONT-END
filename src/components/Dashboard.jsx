const Dashboard = ({ usuario }) => {
  return (
    <main className="contenedor-interno">
      <section className="tarjeta bienvenida">
        <p className="etiqueta">Panel principal</p>
        <h1>Hola, {usuario?.nombre}</h1>
        <p>
          Esta es la pantalla interna principal de HabitFlow. Desde aquí se
          integrarán las funcionalidades completas del proyecto grupal.
        </p>
      </section>

      <section className="grid-resumen">
        <article className="tarjeta">
          <h2>Hábitos activos</h2>
          <p>Vista provisional para el resumen de hábitos.</p>
        </article>

        <article className="tarjeta">
          <h2>Racha actual</h2>
          <p>Vista provisional para mostrar el avance del usuario.</p>
        </article>
      </section>
    </main>
  );
};

export default Dashboard;
