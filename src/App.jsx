import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage.jsx";
import Registro from "./components/Registro.jsx";
import Login from "./components/Login.jsx";
import NavegacionInterna from "./components/NavegacionInterna.jsx";
import Dashboard from "./components/Dashboard.jsx";
import MisHabitos from "./components/MisHabitos.jsx";
import Estadisticas from "./components/Estadisticas.jsx";
import Perfil from "./components/Perfil.jsx";
import habitosIniciales from "./data/habitos.json";

const CLAVE_USUARIO = "usuarioActivo";
const CLAVE_HABITOS = "habitosHabitFlow";
const CLAVE_HABITOS_ANTERIOR = "habitos";

const restarDias = (dias) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  return fecha.toISOString();
};

const normalizarHabito = (habito) => {
  const diasReferencia = Math.max(
    Number(habito.diasCompletados) || 0,
    Number(habito.racha) || 0,
    1
  );

  return {
    ...habito,
    createdAt: habito.createdAt || restarDias(diasReferencia)
  };
};

const textosNavegacion = {
  es: {
    dashboard: "Dashboard",
    habitos: "Mis hábitos",
    estadisticas: "Estadísticas",
    perfil: "Perfil",
    salir: "Salir"
  },
  en: {
    dashboard: "Dashboard",
    habitos: "My habits",
    estadisticas: "Stats",
    perfil: "Profile",
    salir: "Logout"
  }
};

const App = () => {
  const [pantalla, setPantalla] = useState("landing");
  const [usuario, setUsuario] = useState(null);
  const idiomaActual = usuario?.preferencias?.idioma || "es";
  const textos = textosNavegacion[idiomaActual] || textosNavegacion.es;

  // Carga habitos iniciales y restaura la sesion activa guardada desde el backend.
  useEffect(() => {
    const habitosGuardados = JSON.parse(localStorage.getItem(CLAVE_HABITOS)) || [];
    const habitosAnteriores = JSON.parse(localStorage.getItem(CLAVE_HABITOS_ANTERIOR)) || [];

    if (habitosGuardados.length === 0) {
      const habitosBase = habitosAnteriores.length > 0 ? habitosAnteriores : habitosIniciales;
      localStorage.setItem(CLAVE_HABITOS, JSON.stringify(habitosBase.map(normalizarHabito)));
    } else {
      const habitosFaltantes = habitosIniciales.filter((habitoInicial) => {
        return !habitosGuardados.some((habitoGuardado) => habitoGuardado.id === habitoInicial.id);
      });

      const habitosActualizados = [
        ...habitosGuardados.map(normalizarHabito),
        ...habitosFaltantes.map(normalizarHabito)
      ];

      localStorage.setItem(CLAVE_HABITOS, JSON.stringify(habitosActualizados));
    }

    localStorage.removeItem(CLAVE_HABITOS_ANTERIOR);

    const usuarioGuardado = localStorage.getItem(CLAVE_USUARIO);

    if (usuarioGuardado !== null) {
      setUsuario(JSON.parse(usuarioGuardado));
      setPantalla("dashboard");
    }
  }, []);

  // Aplica el tema visual elegido desde las preferencias del usuario.
  useEffect(() => {
    const tema = usuario?.preferencias?.tema || "claro";
    document.body.classList.toggle("tema-oscuro", tema === "oscuro");
  }, [usuario]);

  // Guarda en localStorage el usuario que retorna el backend al iniciar sesion.
  const iniciarSesion = (usuarioEncontrado) => {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuarioEncontrado));
    setUsuario(usuarioEncontrado);
    setPantalla("dashboard");
  };

  // Actualiza el usuario activo despues de guardar cambios en el backend.
  const actualizarUsuario = (usuarioActualizado) => {
    const correoAnterior = usuario?.correo;
    const correoNuevo = usuarioActualizado.correo;

    if (correoAnterior !== correoNuevo) {
      const habitosGuardados = JSON.parse(localStorage.getItem(CLAVE_HABITOS)) || [];
      const habitosActualizados = habitosGuardados.map((habito) => {
        if (habito.usuarioCorreo === correoAnterior) {
          return {
            ...habito,
            usuarioCorreo: correoNuevo
          };
        }

        return habito;
      });

      localStorage.setItem(CLAVE_HABITOS, JSON.stringify(habitosActualizados));
    }

    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuarioActualizado));
    setUsuario(usuarioActualizado);
  };

  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_USUARIO);
    setUsuario(null);
    setPantalla("landing");
  };

  const mostrarPantallaInterna = () => {
    if (pantalla === "habitos") {
      return <MisHabitos usuario={usuario} />;
    }

    if (pantalla === "estadisticas") {
      return <Estadisticas usuario={usuario} />;
    }

    if (pantalla === "perfil") {
      return (
        <Perfil
          usuario={usuario}
          idiomaActual={idiomaActual}
          actualizarUsuario={actualizarUsuario}
          cerrarSesion={cerrarSesion}
        />
      );
    }

    return <Dashboard usuario={usuario} irAHabitos={() => setPantalla("habitos")} />;
  };

  if (pantalla === "registro") {
    return (
      <Registro
        irLogin={() => setPantalla("login")}
        irLanding={() => setPantalla("landing")}
      />
    );
  }

  if (pantalla === "login") {
    return (
      <Login
        onLogin={iniciarSesion}
        irRegistro={() => setPantalla("registro")}
        irLanding={() => setPantalla("landing")}
      />
    );
  }

  if (usuario !== null) {
    return (
      <div className="app-interna">
        <NavegacionInterna
          pantallaActual={pantalla}
          textos={textos}
          cambiarPantalla={setPantalla}
          cerrarSesion={cerrarSesion}
        />
        {mostrarPantallaInterna()}
      </div>
    );
  }

  return (
    <LandingPage
      irRegistro={() => setPantalla("registro")}
      irLogin={() => setPantalla("login")}
    />
  );
};

export default App;
