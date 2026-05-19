import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage.jsx";
import Registro from "./components/Registro.jsx";
import Login from "./components/Login.jsx";
import NavegacionInterna from "./components/NavegacionInterna.jsx";
import Dashboard from "./components/Dashboard.jsx";
import MisHabitos from "./components/MisHabitos.jsx";
import Estadisticas from "./components/Estadisticas.jsx";
import Perfil from "./components/Perfil.jsx";

const CLAVE_USUARIO = "usuarioHabitFlow";
const CLAVE_SESION = "sesionActiva";
const CLAVE_HABITOS = "habitosHabitFlow";

const App = () => {
  const [pantalla, setPantalla] = useState("landing");
  const [usuario, setUsuario] = useState(null);

  // Revisa si ya existe una sesion activa cuando carga la aplicacion.
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem(CLAVE_USUARIO);
    const sesionActiva = localStorage.getItem(CLAVE_SESION);

    if (usuarioGuardado !== null && sesionActiva === "true") {
      setUsuario(JSON.parse(usuarioGuardado));
      setPantalla("dashboard");
    }

    if (localStorage.getItem(CLAVE_HABITOS) === null) {
      localStorage.setItem(CLAVE_HABITOS, JSON.stringify([]));
    }
  }, []);

  const registrarUsuario = (nuevoUsuario) => {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(nuevoUsuario));
    setUsuario(nuevoUsuario);
  };

  const iniciarSesion = (usuarioEncontrado) => {
    localStorage.setItem(CLAVE_SESION, "true");
    setUsuario(usuarioEncontrado);
    setPantalla("dashboard");
  };

  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_SESION);
    setUsuario(null);
    setPantalla("landing");
  };

  const mostrarPantallaInterna = () => {
    if (pantalla === "habitos") {
      return <MisHabitos />;
    }

    if (pantalla === "estadisticas") {
      return <Estadisticas />;
    }

    if (pantalla === "perfil") {
      return <Perfil usuario={usuario} />;
    }

    return <Dashboard usuario={usuario} />;
  };

  if (pantalla === "registro") {
    return (
      <Registro
        onRegistrar={registrarUsuario}
        irLogin={() => setPantalla("login")}
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
