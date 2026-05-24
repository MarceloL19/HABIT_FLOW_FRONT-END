import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage.jsx";
import Registro from "./components/Registro.jsx";
import Login from "./components/Login.jsx";
import NavegacionInterna from "./components/NavegacionInterna.jsx";
import Dashboard from "./components/Dashboard.jsx";
import MisHabitos from "./components/MisHabitos.jsx";
import Estadisticas from "./components/Estadisticas.jsx";
import Perfil from "./components/Perfil.jsx";
import usuariosIniciales from "./data/usuarios.json";
import habitosIniciales from "./data/habitos.json";

const CLAVE_USUARIO = "usuarioHabitFlow";
const CLAVE_SESION = "sesionActiva";
const CLAVE_HABITOS = "habitosHabitFlow";
const CLAVE_USUARIOS = "usuarios";
const CLAVE_HABITOS_INICIALES = "habitos";

const textosNavegacion = {
  español: {
    dashboard: "Dashboard",
    habitos: "Mis hábitos",
    estadisticas: "Estadísticas",
    perfil: "Perfil",
    salir: "Salir"
  },
  inglés: {
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
  const idiomaActual = usuario?.preferencias?.idioma || "español";
  const textos = textosNavegacion[idiomaActual] || textosNavegacion.español;

  // Revisa si ya existe una sesion activa cuando carga la aplicacion.
  useEffect(() => {
    const usuariosGuardados = JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    const habitosGuardados = JSON.parse(localStorage.getItem(CLAVE_HABITOS_INICIALES)) || [];
    const habitosHabitFlowGuardados = JSON.parse(localStorage.getItem(CLAVE_HABITOS)) || [];

    if (usuariosGuardados.length === 0) {
      localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosIniciales));
    } else {
      const usuariosFaltantes = usuariosIniciales.filter((usuarioInicial) => {
        return !usuariosGuardados.some((usuarioGuardado) => usuarioGuardado.correo === usuarioInicial.correo);
      });

      if (usuariosFaltantes.length > 0) {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify([...usuariosGuardados, ...usuariosFaltantes]));
      }
    }

    if (habitosGuardados.length === 0) {
      localStorage.setItem(CLAVE_HABITOS_INICIALES, JSON.stringify(habitosIniciales));
    } else {
      const habitosFaltantes = habitosIniciales.filter((habitoInicial) => {
        return !habitosGuardados.some((habitoGuardado) => habitoGuardado.id === habitoInicial.id);
      });

      if (habitosFaltantes.length > 0) {
        localStorage.setItem(CLAVE_HABITOS_INICIALES, JSON.stringify([...habitosGuardados, ...habitosFaltantes]));
      }
    }

    const usuarioGuardado = localStorage.getItem(CLAVE_USUARIO);
    const sesionActiva = localStorage.getItem(CLAVE_SESION);

    if (usuarioGuardado !== null && sesionActiva === "true") {
      setUsuario(JSON.parse(usuarioGuardado));
      setPantalla("dashboard");
    }

    if (habitosHabitFlowGuardados.length === 0) {
      localStorage.setItem(CLAVE_HABITOS, JSON.stringify(habitosIniciales));
    }
  }, []);

  useEffect(() => {
    const tema = usuario?.preferencias?.tema || "claro";
    const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const usarOscuro = tema === "oscuro" || (tema === "sistema" && prefiereOscuro);

    document.body.classList.toggle("tema-oscuro", usarOscuro);
  }, [usuario]);

  const registrarUsuario = (nuevoUsuario) => {
    const usuariosGuardados = JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    const usuarioConId = {
      id: Date.now(),
      ...nuevoUsuario
    };
    const usuariosActualizados = [...usuariosGuardados, usuarioConId];

    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosActualizados));
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(nuevoUsuario));
    setUsuario(nuevoUsuario);
  };

  const iniciarSesion = (usuarioEncontrado) => {
    localStorage.setItem(CLAVE_SESION, "true");
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuarioEncontrado));
    setUsuario(usuarioEncontrado);
    setPantalla("dashboard");
  };

  const actualizarUsuario = (usuarioActualizado) => {
    const usuariosGuardados = JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    const usuariosActualizados = usuariosGuardados.map((usuarioItem) => {
      if (usuarioItem.correo === usuario?.correo) {
        return {
          ...usuarioItem,
          ...usuarioActualizado
        };
      }

      return usuarioItem;
    });

    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosActualizados));
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuarioActualizado));
    setUsuario(usuarioActualizado);
  };

  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_SESION);
    setUsuario(null);
    setPantalla("landing");
  };

  const mostrarPantallaInterna = () => {
    if (pantalla === "habitos") {
      return <MisHabitos usuario={usuario} />;
    }

    if (pantalla === "estadisticas") {
      return <Estadisticas />;
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

    return <Dashboard usuario={usuario} />;
  };

  if (pantalla === "registro") {
    return (
      <Registro
        onRegistrar={registrarUsuario}
        irLogin={() => setPantalla("login")}
        irLanding={() => setPantalla("landing")}
        irDashboard={() => setPantalla("dashboard")}
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

  if (usuario !== null && localStorage.getItem(CLAVE_SESION) === "true") {
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
