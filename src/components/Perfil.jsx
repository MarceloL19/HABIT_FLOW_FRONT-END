const Perfil = ({ usuario }) => {
  return (
    <main className="contenedor-interno">
      <section className="tarjeta pagina-provisional">
        <p className="etiqueta">Perfil</p>
        <h1>Sección en desarrollo</h1>
        <p>Usuario actual: {usuario?.nombre}</p>
        <p>Correo: {usuario?.correo}</p>
      </section>
    </main>
  );
};

export default Perfil;
