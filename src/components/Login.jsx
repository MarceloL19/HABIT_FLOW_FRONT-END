import { useState } from "react";
import logoHabitFlow from "../assets/logo-habit-flow.png";

// Direccion del backend
const API = "http://localhost:3000/api";

const Login = ({ onLogin, irRegistro, irLanding }) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Valida las credenciales en el backend antes de iniciar sesion.
  const iniciarSesion = async (evento) => {
    evento.preventDefault();

    if (correo === "" || password === "") {
      setMensaje("Completa el correo y la contraseña.");
      return;
    }

    // Le pedimos al backend que valide el correo y la contrasena
    const respuesta = await fetch(API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: correo, password: password })
    });
    const datos = await respuesta.json();

    // Si el backend responde con error, mostramos su mensaje
    if (!respuesta.ok) {
      setMensaje(datos.mensaje);
      return;
    }

    // El backend nos devuelve el usuario con su id_usuario real
    onLogin(datos.usuario);
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
