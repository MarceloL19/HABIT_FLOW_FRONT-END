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

const traduccionesGlobalesIngles = {
  "Buenos días": "Good morning",
  "Buenas tardes": "Good afternoon",
  "Buenas noches": "Good evening",
  "Aquí está tu resumen de hoy. ¡Sigue así!": "Here is your summary for today. Keep going!",
  "Hábitos activos": "Active habits",
  "Completados hoy": "Completed today",
  "Racha más larga": "Longest streak",
  "Progreso semanal": "Weekly progress",
  "Tus hábitos de hoy": "Your habits today",
  "+ Agregar hábito": "+ Add habit",
  "¡Empieza tu viaje hoy!": "Start your journey today!",
  "Aún no tienes hábitos registrados. Agregar uno pequeño puede cambiar tu día.": "You do not have habits yet. Adding one small habit can change your day.",
  "Completar": "Complete",
  "Completado": "Completed",
  "Eliminar hábito": "Delete habit",
  "¿Estás seguro de que deseas eliminar este hábito? Esta acción no se puede deshacer.": "Are you sure you want to delete this habit? This action cannot be undone.",
  "Cancelar": "Cancel",
  "Eliminar": "Delete",
  "Mis hábitos": "My habits",
  "Nuevo hábito": "New habit",
  "Editar hábito": "Edit habit",
  "Nombre": "Name",
  "Descripción": "Description",
  "Categoría": "Category",
  "Frecuencia": "Frequency",
  "Crear hábito": "Create habit",
  "Guardar cambios": "Save changes",
  "Todas": "All",
  "Salud": "Health",
  "Estudio": "Study",
  "Deporte": "Sport",
  "Trabajo": "Work",
  "Personal": "Personal",
  "Diaria": "Daily",
  "Semanal": "Weekly",
  "No tienes hábitos aquí. ¡Crea uno con el formulario de arriba!": "You do not have habits here. Create one with the form above!",
  "Marcar": "Mark",
  "Editar": "Edit",
  "ESTADÍSTICAS": "STATS",
  "ESTADISTICAS": "STATS",
  "Estadisticas": "Stats",
  "Estadísticas": "Stats",
  "Analiza tu progreso": "Analyze your progress",
  "Revisa tu avance, tus rachas y tus hábitos más constantes.": "Review your progress, streaks, and most consistent habits.",
  "Revisa tu avance, tus rachas y tus habitos mas constantes.": "Review your progress, streaks, and most consistent habits.",
  "Racha actual": "Current streak",
  "días consecutivos": "consecutive days",
  "dias consecutivos": "consecutive days",
  "completado": "completed",
  "Total de hábitos completados": "Total completed habits",
  "Total de habitos completados": "Total completed habits",
  "hábitos completados": "completed habits",
  "habitos completados": "completed habits",
  "Cumplimiento semanal": "Weekly completion",
  "Progreso mensual": "Monthly progress",
  "Top de hábitos en racha": "Top habit streaks",
  "Top de habitos en racha": "Top habit streaks",
  "Mejor hábito": "Best habit",
  "Mejor habito": "Best habit",
  "No hay hábitos registrados.": "There are no habits registered.",
  "No hay datos suficientes.": "There is not enough data.",
  "veces": "times",
  "Racha": "Streak",
  "progreso": "progress"
};

const traduccionesPlaceholdersIngles = {
  "Ej: Beber agua": "Ex: Drink water",
  "Ej: Tomar 8 vasos al día": "Ex: Drink 8 glasses a day"
};

const traducirTextoGlobal = (texto) => {
  let resultado = texto;

  Object.entries(traduccionesGlobalesIngles)
    .sort(([textoA], [textoB]) => textoB.length - textoA.length)
    .forEach(([espanol, ingles]) => {
      resultado = resultado.replaceAll(espanol, ingles);
    });

  resultado = resultado.replaceAll("días", "days");
  resultado = resultado.replaceAll("dias", "days");
  resultado = resultado.replaceAll("Frecuencia:", "Frequency:");
  resultado = resultado.replaceAll("Racha:", "Streak:");
  resultado = resultado.replace(/\bLun\b/g, "Mon");
  resultado = resultado.replace(/\bMar\b/g, "Tue");
  resultado = resultado.replace(/\bMie\b/g, "Wed");
  resultado = resultado.replace(/\bJue\b/g, "Thu");
  resultado = resultado.replace(/\bVie\b/g, "Fri");
  resultado = resultado.replace(/\bSab\b/g, "Sat");
  resultado = resultado.replace(/\bDom\b/g, "Sun");

  return resultado;
};

const App = () => {
  const [pantalla, setPantalla] = useState("landing");
  const [usuario, setUsuario] = useState(null);
  const idiomaActual = usuario?.preferencias?.idioma || "español";
  const textos = textosNavegacion[idiomaActual] || textosNavegacion.español;

  // Revisa si ya existe una sesion activa cuando carga la aplicacion.
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

  useEffect(() => {
    const tema = usuario?.preferencias?.tema || "claro";
    const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const usarOscuro = tema === "oscuro" || (tema === "sistema" && prefiereOscuro);

    document.body.classList.toggle("tema-oscuro", usarOscuro);
  }, [usuario]);

  useEffect(() => {
    if (idiomaActual !== "inglés") {
      return;
    }

    const traducirNodo = (nodo) => {
      if (nodo.nodeType === Node.TEXT_NODE) {
        const textoTraducido = traducirTextoGlobal(nodo.nodeValue);
        if (textoTraducido !== nodo.nodeValue) {
          nodo.nodeValue = textoTraducido;
        }
        return;
      }

      if (nodo.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const elemento = nodo;
      if (elemento.placeholder && traduccionesPlaceholdersIngles[elemento.placeholder]) {
        elemento.placeholder = traduccionesPlaceholdersIngles[elemento.placeholder];
      }

      elemento.childNodes.forEach(traducirNodo);
    };

    const traducirPantalla = () => traducirNodo(document.querySelector(".app-interna"));
    const tiempo = setTimeout(traducirPantalla, 0);
    const observador = new MutationObserver(traducirPantalla);
    const contenedor = document.querySelector(".app-interna");

    if (contenedor) {
      observador.observe(contenedor, {
        childList: true,
        subtree: true
      });
    }

    return () => {
      clearTimeout(tiempo);
      observador.disconnect();
    };
  }, [idiomaActual, pantalla]);

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
