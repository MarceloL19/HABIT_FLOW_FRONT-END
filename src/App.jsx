import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage.jsx";
import Registro from "./components/Registro.jsx";
import Login from "./components/Login.jsx";
import NavegacionInterna from "./components/NavegacionInterna.jsx";
import Dashboard from "./components/Dashboard.jsx";
import MisHabitos from "./components/MisHabitos.jsx";
import Estadisticas from "./components/Estadisticas.jsx";
import Perfil from "./components/Perfil.jsx";

const CLAVE_USUARIO = "usuarioActivo";

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

  // Restaura la sesion activa guardada al iniciar sesion con el backend.
  useEffect(() => {
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
        onRegistroExitoso={iniciarSesion}
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
