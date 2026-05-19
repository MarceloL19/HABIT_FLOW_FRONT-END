import { useState } from "react";
import logoHabitFlow from "../assets/logo-habit-flow.png";

const Login = ({ onLogin, irRegistro, irLanding }) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const iniciarSesion = (evento) => {
    evento.preventDefault();

    const usuarioGuardado = localStorage.getItem("usuarioHabitFlow");

    if (correo === "" || password === "") {
      setMensaje("Completa el correo y la contraseña.");
      return;
    }

    if (usuarioGuardado === null) {
      setMensaje("Primero debes crear una cuenta.");
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    if (correo !== usuario.correo || password !== usuario.password) {
      setMensaje("Correo o contraseña incorrectos.");
      return;
    }

    onLogin(usuario);
  };

  return (
    <main className="pantalla-formulario">
      <section className="tarjeta formulario-contenedor">
        <div className="marca-formulario">
          <img src={logoHabitFlow} alt="Logo de HabitFlow" />
          <span>HabitFlow</span>
        </div>

        <h1>Iniciar sesión</h1>
        <p className="texto-secundario">Ingresa para continuar con tu seguimiento.</p>

        {mensaje !== "" && <p className="mensaje error">{mensaje}</p>}

        <form onSubmit={iniciarSesion} className="formulario">
          <label htmlFor="loginCorreo">Correo electrónico</label>
          <input
            id="loginCorreo"
            type="email"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            placeholder="nombre@email.com"
          />

          <label htmlFor="loginPassword">Contraseña</label>
          <input
            id="loginPassword"
            type="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            placeholder="Tu contraseña"
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
