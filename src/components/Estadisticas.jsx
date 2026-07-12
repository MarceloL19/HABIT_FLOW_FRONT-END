import { useEffect, useState } from "react";

const CLAVE_HABITOS = "habitosHabitFlow";
const API_ESTADISTICAS = "http://localhost:3000/api/estadisticas";

const diasSemana = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
const etiquetasSemana = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

const calcularDiasActivos = (createdAt) => {
  const fechaCreacion = createdAt ? new Date(createdAt) : new Date();
  const hoy = new Date();
  const diferencia = hoy - fechaCreacion;
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24)) + 1;

  return Math.max(1, dias);
};

const normalizarHabito = (habito) => ({
  ...habito,
  createdAt: habito.createdAt || new Date().toISOString(),
  diasCompletados: Number(habito.diasCompletados) || 0,
  racha: Number(habito.racha) || 0
});

const obtenerNombreMes = (fecha) => {
  return fecha.toLocaleDateString("es-ES", { month: "long" });
};

const generarEstadisticasLocales = (usuario) => {
  const guardados = JSON.parse(localStorage.getItem(CLAVE_HABITOS)) || [];
  const habitos = guardados.map(normalizarHabito);
  const habitosUsuario = habitos.filter((habito) => habito.usuarioCorreo === usuario?.correo);
  const totalHabitos = habitosUsuario.length;
  const completadosHoy = habitosUsuario.filter((habito) => habito.completadoHoy).length;
  const totalCompletados = habitosUsuario.reduce((total, habito) => total + habito.diasCompletados, 0);
  const rachaActual = habitosUsuario.reduce((mayor, habito) => Math.max(mayor, habito.racha), 0);
  const diasEsperados = habitosUsuario.reduce((total, habito) => total + calcularDiasActivos(habito.createdAt), 0);
  const progresoGeneral = diasEsperados > 0
    ? Math.min(100, Math.round((totalCompletados / diasEsperados) * 100))
    : 0;
  const hoy = new Date();
  const diaActual = diasSemana[hoy.getDay()];
  const semana = etiquetasSemana.map((dia) => ({
    dia,
    total: dia === diaActual ? completadosHoy : 0
  }));
  const mesesProgreso = [2, 1, 0].map((mesesAtras) => {
    const fechaMes = new Date(hoy.getFullYear(), hoy.getMonth() - mesesAtras, 1);
    const anio = fechaMes.getFullYear();
    const mes = fechaMes.getMonth();
    const datos = [0, 1, 2, 3].map((indiceSemana) => {
      const inicioSemana = new Date(anio, mes, 1 + indiceSemana * 7);
      const finSemana = new Date(anio, mes, Math.min(7 + indiceSemana * 7, new Date(anio, mes + 1, 0).getDate()));
      const diasEsperadosSemana = habitosUsuario.reduce((total, habito) => {
        const fechaCreacion = new Date(habito.createdAt);

        if (fechaCreacion > finSemana) return total;

        const inicioReal = fechaCreacion > inicioSemana ? fechaCreacion : inicioSemana;
        const diasActivosSemana = Math.floor((finSemana - inicioReal) / (1000 * 60 * 60 * 24)) + 1;

        return total + Math.max(0, diasActivosSemana);
      }, 0);
      const completadosEstimados = habitosUsuario.reduce((total, habito) => {
        const fechaCreacion = new Date(habito.createdAt);

        if (fechaCreacion > finSemana) return total;

        const diasHastaSemana = Math.floor((finSemana - fechaCreacion) / (1000 * 60 * 60 * 24)) + 1;
        const proporcion = Math.min(1, Math.max(0, diasHastaSemana / calcularDiasActivos(habito.createdAt)));

        return total + Math.round(habito.diasCompletados * proporcion);
      }, 0);

      return {
        semana: `S${indiceSemana + 1}`,
        progreso: diasEsperadosSemana > 0
          ? Math.min(100, Math.round((completadosEstimados / diasEsperadosSemana) * 100))
          : 0
      };
    });

    return {
      nombre: obtenerNombreMes(fechaMes),
      datos
    };
  });
  const topHabitos = [...habitosUsuario]
    .sort((a, b) => b.diasCompletados - a.diasCompletados)
    .slice(0, 5);

  return {
    resumen: {
      totalHabitos,
      completadosHoy,
      totalCompletados,
      rachaActual,
      progresoGeneral
    },
    semana,
    mesesProgreso,
    topHabitos,
    mejorHabito: topHabitos[0] || null,
    mensajeMotivacional: progresoGeneral >= 70
      ? "Excelente avance, vas construyendo una gran constancia."
      : progresoGeneral >= 40
        ? "Buen progreso, sigue completando tus habitos esta semana."
        : "Cada dia cuenta, elige un habito pequeno y empieza de nuevo."
  };
};

const Estadisticas = ({ usuario }) => {
  const [diaSeleccionado, setDiaSeleccionado] = useState(diasSemana[new Date().getDay()]);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState("S4");
  const [filtroTop, setFiltroTop] = useState("todos");
  const [mesSeleccionado, setMesSeleccionado] = useState(2);
  const [estadisticas, setEstadisticas] = useState(() => generarEstadisticasLocales(usuario));
  const [usandoBackend, setUsandoBackend] = useState(false);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      const idUsuario = usuario?.id_usuario || usuario?.id;

      if (!idUsuario) {
        setEstadisticas(generarEstadisticasLocales(usuario));
        setUsandoBackend(false);
        return;
      }

      try {
        const respuesta = await fetch(`${API_ESTADISTICAS}/${idUsuario}`);

        if (!respuesta.ok) {
          throw new Error("No se pudieron consultar las estadisticas");
        }

        const data = await respuesta.json();
        setEstadisticas(data);
        setUsandoBackend(true);
      } catch (error) {
        setEstadisticas(generarEstadisticasLocales(usuario));
        setUsandoBackend(false);
      }
    };

    cargarEstadisticas();
  }, [usuario]);

  const resumen = estadisticas.resumen || {};
  const datosSemana = estadisticas.semana || [];
  const mesesProgreso = estadisticas.mesesProgreso?.length
    ? estadisticas.mesesProgreso
    : [{ nombre: "Mes actual", datos: [{ semana: "S1", progreso: 0 }, { semana: "S2", progreso: 0 }, { semana: "S3", progreso: 0 }, { semana: "S4", progreso: 0 }] }];
  const mesActual = mesesProgreso[mesSeleccionado] || mesesProgreso[mesesProgreso.length - 1];
  const datosMes = mesActual.datos;
  const topBase = estadisticas.topHabitos || [];
  const topHabitos = topBase.filter((habito) => {
    if (filtroTop === "activos") return habito.estado === "activo" || habito.activo === true || habito.estado === undefined;
    if (filtroTop === "hoy") return habito.completadoHoy;
    return true;
  });
  const mejorHabito = estadisticas.mejorHabito || topHabitos[0];
  const mensajeMotivacional = estadisticas.mensajeMotivacional || "Cada dia cuenta, elige un habito pequeno y empieza de nuevo.";
  const progresoGeneral = Number(resumen.progresoGeneral) || 0;
  const totalCompletados = Number(resumen.totalCompletados) || 0;
  const rachaActual = Number(resumen.rachaActual) || 0;
  const maximoSemana = Math.max(1, ...datosSemana.map((dato) => Number(dato.total) || 0));
  const detalleDia = datosSemana.find((dato) => dato.dia === diaSeleccionado) || datosSemana[0] || { dia: diaSeleccionado, total: 0 };
  const posicionesMes = [35, 150, 265, 385];
  const puntosMes = datosMes.map((dato, index) => ({
    x: posicionesMes[index],
    y: 180 - (dato.progreso / 100) * 155
  }));
  const puntosLineaMes = puntosMes.map((punto) => `${punto.x},${punto.y}`).join(" ");

  const cambiarMesAnterior = () => {
    if (mesSeleccionado > 0) {
      setMesSeleccionado(mesSeleccionado - 1);
      setSemanaSeleccionada("S1");
    }
  };

  const cambiarMesSiguiente = () => {
    if (mesSeleccionado < mesesProgreso.length - 1) {
      setMesSeleccionado(mesSeleccionado + 1);
      setSemanaSeleccionada("S1");
    }
  };

  const descargarReporteTxt = () => {
    const lineas = [
      "REPORTE DE ESTADISTICAS - HABITFLOW",
      "",
      `Usuario: ${usuario?.nombre || "Usuario no identificado"}`,
      `Correo: ${usuario?.correo || "Sin correo"}`,
      `Fuente: ${usandoBackend ? "Backend PostgreSQL" : "Datos locales"}`,
      "",
      "RESUMEN GENERAL",
      `Racha actual: ${rachaActual} dias consecutivos`,
      `Progreso general: ${progresoGeneral}%`,
      `Total de habitos completados: ${totalCompletados}`,
      "",
      "CUMPLIMIENTO SEMANAL",
      ...datosSemana.map((dato) => `${dato.dia}: ${dato.total} habitos completados`),
      "",
      "PROGRESO MENSUAL",
      ...datosMes.map((dato) => `${dato.semana}: ${dato.progreso}%`),
      "",
      "TOP DE HABITOS EN RACHA",
      ...topHabitos.map((habito, index) => `${index + 1}. ${habito.nombre} - ${habito.racha} dias - ${habito.diasCompletados} veces`),
      "",
      "MENSAJE MOTIVACIONAL",
      mensajeMotivacional
    ];

    const archivo = new Blob([lineas.join("\n")], { type: "text/plain" });
    const enlace = document.createElement("a");

    enlace.href = URL.createObjectURL(archivo);
    enlace.download = "reporte-estadisticas-habitflow.txt";
    enlace.click();

    URL.revokeObjectURL(enlace.href);
  };

  return (
    <main className="contenedor-interno">
      <section className="encabezado-estadisticas">
        <p className="etiqueta">Estadisticas</p>
        <h1>Analiza tu progreso</h1>
        <p className="texto-secundario">
          Revisa tu avance, tus rachas y tus habitos mas constantes.
        </p>

        <div className="acciones-estadisticas">
          <button
            className="boton boton-principal"
            onClick={descargarReporteTxt}
            type="button"
          >
            Descargar reporte TXT
          </button>
        </div>
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
          <h2>Progreso general</h2>
          <strong>{progresoGeneral}%</strong>
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
                    style={{ height: `${((Number(dato.total) || 0) / maximoSemana) * 100}%` }}
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

          <div className="controles-mes">
            <button onClick={cambiarMesAnterior} disabled={mesSeleccionado === 0} type="button">
              Anterior
            </button>
            <strong>{mesActual.nombre}</strong>
            <button onClick={cambiarMesSiguiente} disabled={mesSeleccionado === mesesProgreso.length - 1} type="button">
              Siguiente
            </button>
          </div>

          <div className="grafico-linea">
            <svg viewBox="0 0 420 220" role="img" aria-label="Progreso mensual">
              <line x1="35" y1="25" x2="35" y2="180" className="eje" />
              <line x1="35" y1="180" x2="390" y2="180" className="eje" />

              <polyline
                points={puntosLineaMes}
                fill="none"
                stroke="#60a5fa"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {datosMes.map((dato, index) => {
                const punto = puntosMes[index];
                const estaSeleccionado = semanaSeleccionada === dato.semana;
                const tooltipX = index === datosMes.length - 1 ? punto.x - 105 : punto.x - 58;
                const tooltipTextoX = index === datosMes.length - 1 ? punto.x - 91 : punto.x - 44;

                return (
                  <g key={dato.semana} className="punto-mes-grupo" onClick={() => setSemanaSeleccionada(dato.semana)}>
                    {estaSeleccionado && (
                      <g className="tooltip-mes">
                        <rect x={tooltipX} y={punto.y - 64} width="116" height="46" rx="10" />
                        <text x={tooltipTextoX} y={punto.y - 44}>{dato.semana}</text>
                        <text x={tooltipTextoX} y={punto.y - 26}>progreso: {dato.progreso}%</text>
                      </g>
                    )}

                    <circle className={estaSeleccionado ? "punto-mes activo" : "punto-mes"} cx={punto.x} cy={punto.y} r="7" />
                    <text x={punto.x - 10} y="205">{dato.semana}</text>
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

          <div className="filtros-top">
            <button className={filtroTop === "todos" ? "activo" : ""} onClick={() => setFiltroTop("todos")} type="button">
              Todos
            </button>
            <button className={filtroTop === "activos" ? "activo" : ""} onClick={() => setFiltroTop("activos")} type="button">
              Activos
            </button>
            <button className={filtroTop === "hoy" ? "activo" : ""} onClick={() => setFiltroTop("hoy")} type="button">
              Completados hoy
            </button>
          </div>

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

        <article className="tarjeta mensaje-motivacional">
          <h2>Mensaje motivacional</h2>
          <p>{mensajeMotivacional}</p>
        </article>
      </section>
    </main>
  );
};

export default Estadisticas;
