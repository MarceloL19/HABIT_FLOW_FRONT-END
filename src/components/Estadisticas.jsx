import { useMemo, useState } from "react";
import habitosIniciales from "../data/habitos.json";

const Estadisticas = ({ usuario }) => {
  const [diaSeleccionado, setDiaSeleccionado] = useState("Jue");
  const [semanaSeleccionada, setSemanaSeleccionada] = useState("S4");

  const habitosUsuario = useMemo(() => {
    return habitosIniciales.filter((habito) => {
      return habito.usuarioCorreo === usuario?.correo;
    });
  }, [usuario]);

  const totalHabitos = habitosUsuario.length;

  const completadosHoy = habitosUsuario.filter((habito) => {
    return habito.completadoHoy;
  }).length;

  const totalCompletados = habitosUsuario.reduce((total, habito) => {
    return total + habito.diasCompletados;
  }, 0);

  const rachaActual = habitosUsuario.reduce((mayor, habito) => {
    return habito.racha > mayor ? habito.racha : mayor;
  }, 0);

  const progresoSemanal =
    totalHabitos > 0 ? Math.round((completadosHoy / totalHabitos) * 100) : 0;

  const topHabitos = [...habitosUsuario]
    .sort((a, b) => b.diasCompletados - a.diasCompletados)
    .slice(0, 5);

  const mejorHabito = topHabitos[0];

  const datosSemana = [
    { dia: "Lun", total: 3 },
    { dia: "Mar", total: 4 },
    { dia: "Mie", total: 2 },
    { dia: "Jue", total: 5 },
    { dia: "Vie", total: 4 },
    { dia: "Sab", total: 3 },
    { dia: "Dom", total: 2 }
  ];

  const datosMes = [
    { semana: "S1", progreso: 65 },
    { semana: "S2", progreso: 72 },
    { semana: "S3", progreso: 68 },
    { semana: "S4", progreso: 86 }
  ];

  const maximoSemana = Math.max(...datosSemana.map((dato) => dato.total));

  const detalleDia =
    datosSemana.find((dato) => dato.dia === diaSeleccionado) || datosSemana[0];

  return (
    <main className="contenedor-interno">
      <section className="encabezado-estadisticas">
        <p className="etiqueta">Estadisticas</p>
        <h1>Analiza tu progreso</h1>
        <p className="texto-secundario">
          Revisa tu avance, tus rachas y tus habitos mas constantes.
        </p>
      </section>

      <section className="estadisticas-resumen">
        <article className="tarjeta stat-card">
          <span className="stat-icono fuego">F</span>
          <h2>Racha actual</h2>
          <strong>{rachaActual}</strong>
          <p>dias consecutivos</p>
        </article>

        <article className="tarjeta stat-card">
          <span className="stat-icono progreso">P</span>
          <h2>Progreso semanal</h2>
          <strong>{progresoSemanal}%</strong>
          <p>completado</p>
        </article>

        <article className="tarjeta stat-card">
          <span className="stat-icono total">T</span>
          <h2>Total de habitos completados</h2>
          <strong>{totalCompletados}</strong>
          <p>habitos completados</p>
        </article>
      </section>

      <section className="estadisticas-graficos">
        <article className="tarjeta grafico-card">
          <h2>Cumplimiento semanal</h2>

          <div className="grafico-barras">
            {datosSemana.map((dato) => (
              <div className="barra-item" key={dato.dia}>
                <div className="barra-contenedor">
                  <button
                    className={`barra ${diaSeleccionado === dato.dia ? "activa" : ""}`}
                    style={{ height: `${(dato.total / maximoSemana) * 100}%` }}
                    title={`${dato.dia}: ${dato.total} completados`}
                    onClick={() => setDiaSeleccionado(dato.dia)}
                    type="button"
                  />
                </div>
                <span>{dato.dia}</span>
              </div>
            ))}
          </div>

          <p className="grafico-info">
            {detalleDia.dia}: {detalleDia.total} habitos completados
          </p>
        </article>

        <article className="tarjeta grafico-card">
          <h2>Progreso mensual</h2>

          <div className="grafico-linea">
            <svg viewBox="0 0 420 220" role="img" aria-label="Progreso mensual">
              <line x1="35" y1="25" x2="35" y2="180" className="eje" />
              <line x1="35" y1="180" x2="390" y2="180" className="eje" />

              <polyline
                points="35,105 150,78 265,92 385,48"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {datosMes.map((dato, index) => {
                const puntos = [
                  { x: 35, y: 105 },
                  { x: 150, y: 78 },
                  { x: 265, y: 92 },
                  { x: 385, y: 48 }
                ];
                const punto = puntos[index];
                const estaSeleccionado = semanaSeleccionada === dato.semana;
                const tooltipX = index === datosMes.length - 1 ? punto.x - 105 : punto.x - 58;
                const tooltipTextoX = index === datosMes.length - 1 ? punto.x - 91 : punto.x - 44;

                return (
                  <g
                    key={dato.semana}
                    className="punto-mes-grupo"
                    onClick={() => setSemanaSeleccionada(dato.semana)}
                  >
                    {estaSeleccionado && (
                      <g className="tooltip-mes">
                        <rect
  x={tooltipX}
  y={punto.y - 64}
  width="116"
  height="46"
  rx="10"
/>
                        <text x={tooltipTextoX} y={punto.y - 44}>
                          {dato.semana}
                        </text>
                        <text x={tooltipTextoX} y={punto.y - 26}>
                          progreso: {dato.progreso}%
                        </text>
                      </g>
                    )}

                    <circle
                      className={estaSeleccionado ? "punto-mes activo" : "punto-mes"}
                      cx={punto.x}
                      cy={punto.y}
                      r="7"
                    />
                    <text x={punto.x - 10} y="205">
                      {dato.semana}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </article>
      </section>

      <section className="estadisticas-detalles">
        <article className="tarjeta top-habitos">
          <h2>Top de habitos en racha</h2>

          {topHabitos.length === 0 ? (
            <p className="texto-secundario">No hay habitos registrados.</p>
          ) : (
            <ul>
              {topHabitos.map((habito, index) => (
                <li key={habito.id}>
                  <span className="ranking">{index + 1}</span>
                  <div>
                    <strong>{habito.nombre}</strong>
                    <p>{habito.diasCompletados} veces</p>
                  </div>
                  <span className="racha-mini">{habito.racha} dias</span>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="tarjeta mejor-habito">
          <h2>Mejor habito</h2>

          {mejorHabito ? (
            <div className="mejor-habito-contenido">
              <h3>{mejorHabito.nombre}</h3>
              <div>
                <p>Racha</p>
                <strong>{mejorHabito.racha} dias</strong>
              </div>
              <div>
                <p>Completado</p>
                <strong>{mejorHabito.diasCompletados} veces</strong>
              </div>
            </div>
          ) : (
            <p className="texto-secundario">No hay datos suficientes.</p>
          )}
        </article>
      </section>
    </main>
  );
};

export default Estadisticas;
