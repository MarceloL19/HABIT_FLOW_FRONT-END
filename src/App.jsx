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

const CLAVE_USUARIO = "usuarioSesionActiva";
const CLAVE_USUARIO_ANTERIOR = "usuarioHabitFlow";
const CLAVE_SESION = "sesionActiva";
const CLAVE_HABITOS = "habitosHabitFlow";
const CLAVE_USUARIOS = "usuarios";
const CLAVE_HABITOS_ANTERIOR = "habitos";

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

  // Carga los datos iniciales y restaura la sesion activa si el usuario ya habia iniciado sesion.
  useEffect(() => {
    const usuariosGuardados = JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    const habitosGuardados = JSON.parse(localStorage.getItem(CLAVE_HABITOS)) || [];
    const habitosAnteriores = JSON.parse(localStorage.getItem(CLAVE_HABITOS_ANTERIOR)) || [];

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
      const habitosBase = habitosAnteriores.length > 0 ? habitosAnteriores : habitosIniciales;
      localStorage.setItem(CLAVE_HABITOS, JSON.stringify(habitosBase));
    } else {
      const habitosFaltantes = habitosIniciales.filter((habitoInicial) => {
        return !habitosGuardados.some((habitoGuardado) => habitoGuardado.id === habitoInicial.id);
      });

      if (habitosFaltantes.length > 0) {
        localStorage.setItem(CLAVE_HABITOS, JSON.stringify([...habitosGuardados, ...habitosFaltantes]));
      }
    }

    localStorage.removeItem(CLAVE_HABITOS_ANTERIOR);

    const usuarioAnterior = localStorage.getItem(CLAVE_USUARIO_ANTERIOR);
    if (usuarioAnterior !== null && localStorage.getItem(CLAVE_USUARIO) === null) {
      localStorage.setItem(CLAVE_USUARIO, usuarioAnterior);
    }
    localStorage.removeItem(CLAVE_USUARIO_ANTERIOR);

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

  // Registra un usuario nuevo, le asigna un ID correlativo y lo deja como usuario activo.
  const registrarUsuario = (nuevoUsuario) => {
    const usuariosGuardados = JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    const ultimoId = usuariosGuardados.reduce((mayorId, usuarioItem) => {
      return Math.max(mayorId, Number(usuarioItem.id) || 0);
    }, 0);
    const usuarioConId = {
      id: ultimoId + 1,
      ...nuevoUsuario
    };
    const usuariosActualizados = [...usuariosGuardados, usuarioConId];

    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosActualizados));
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuarioConId));
    setUsuario(usuarioConId);
  };

  // Guarda la sesion cuando Login valida correctamente el correo y la contrasena.
  const iniciarSesion = (usuarioEncontrado) => {
    localStorage.setItem(CLAVE_SESION, "true");
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuarioEncontrado));
    setUsuario(usuarioEncontrado);
    setPantalla("dashboard");
  };

  // Actualiza los datos personales y preferencias tanto en la lista de usuarios como en la sesion activa.
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
