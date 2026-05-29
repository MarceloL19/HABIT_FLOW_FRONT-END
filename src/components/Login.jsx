import { useState } from "react";
import logoHabitFlow from "../assets/logo-habit-flow.png";
const Login = ({ onLogin, irRegistro, irLanding }) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Valida las credenciales contra los usuarios guardados antes de iniciar sesion.
  const iniciarSesion = (evento) => {
    evento.preventDefault();

    const usuarioGuardado = localStorage.getItem("usuarioSesionActiva");
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (correo === "" || password === "") {
      setMensaje("Completa el correo y la contraseña.");
      return;
    }

    if (usuarioGuardado === null && usuariosGuardados.length === 0) {
      setMensaje("Primero debes crear una cuenta.");
      return;
    }

    const usuarioPrincipal = usuarioGuardado !== null ? JSON.parse(usuarioGuardado) : null;
    const usuario = usuariosGuardados.find((usuarioItem) => usuarioItem.correo === correo)
      || (usuarioPrincipal?.correo === correo ? usuarioPrincipal : null);

    if (!usuario || correo !== usuario.correo || password !== usuario.password) {
      setMensaje("Correo o contraseña incorrectos.");
      return;
    }

    onLogin(usuario);
  };

  return (
    <main className="pantalla-formulario">
      <button className="marca-volver" onClick={irLanding}>
        <img src={logoHabitFlow} alt="Logo de HabitFlow" className="logo-marca" />
        <span>HabitFlow</span>
      </button>

      <section className="tarjeta formulario-contenedor">
        <h1>Bienvenido de nuevo</h1>
        <p className="texto-secundario">Ingresa para continuar con tu seguimiento.</p>

        {mensaje !== "" && <p className="mensaje error">{mensaje}</p>}

        <form onSubmit={iniciarSesion} className="formulario">
          <label htmlFor="loginCorreo">Correo electrónico</label>
          <input
            id="loginCorreo"
            type="email"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            placeholder="tu@email.com"
          />

          <label htmlFor="loginPassword">Contraseña</label>
          <input
            id="loginPassword"
            type="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            placeholder="••••••••"
          />

          <button className="boton boton-principal" type="submit">
            Iniciar sesión
          </button>
        </form>

        <p className="cambio-pantalla">
          ¿No tienes cuenta?
          <button onClick={irRegistro}>Crear cuenta</button>
        </p>

        <button className="boton boton-texto boton-ancho" onClick={irLanding}>
          Volver al inicio
        </button>
      </section>
    </main>
  );
};

export default Login;
