import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage.jsx";
import Registro from "./components/Registro.jsx";
import Login from "./components/Login.jsx";
import NavegacionInterna from "./components/NavegacionInterna.jsx";
import Dashboard from "./components/Dashboard.jsx";
import MisHabitos from "./components/MisHabitos.jsx";
import Estadisticas from "./components/Estadisticas.jsx";
import Perfil from "./components/Perfil.jsx";

const CLAVE_USUARIO = "usuarioSesionActiva";
const CLAVE_SESION = "sesionActiva";

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

  // Restaura la sesion activa si el usuario ya habia iniciado sesion antes.
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem(CLAVE_USUARIO);
    const sesionActiva = localStorage.getItem(CLAVE_SESION);

    if (usuarioGuardado !== null && sesionActiva === "true") {
      setUsuario(JSON.parse(usuarioGuardado));
      setPantalla("dashboard");
    }
  }, []);

  // Aplica el tema visual elegido en el perfil: claro u oscuro.
  useEffect(() => {
    const tema = usuario?.preferencias?.tema || "claro";
    const usarOscuro = tema === "oscuro";

    document.body.classList.toggle("tema-oscuro", usarOscuro);
  }, [usuario]);

  // Guarda como usuario activo al que el backend acaba de registrar.
  const registrarUsuario = (nuevoUsuario) => {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(nuevoUsuario));
    setUsuario(nuevoUsuario);
  };

  // Guarda la sesion cuando Login valida correctamente el correo y la contrasena.
  const iniciarSesion = (usuarioEncontrado) => {
    localStorage.setItem(CLAVE_SESION, "true");
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuarioEncontrado));
    setUsuario(usuarioEncontrado);
    setPantalla("dashboard");
  };

  // Actualiza los datos del usuario activo (solo en la sesion, por ahora).
  const actualizarUsuario = (usuarioActualizado) => {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuarioActualizado));
    setUsuario(usuarioActualizado);
  };

  // Cierra la sesion eliminando las claves del usuario activo.
  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_SESION);
    localStorage.removeItem(CLAVE_USUARIO);
    setUsuario(null);
    setPantalla("landing");
  };

  // Decide que pantalla interna se muestra segun la opcion elegida en la barra de navegacion.
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
