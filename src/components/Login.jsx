import { useState } from "react";
import logoHabitFlow from "../assets/logo-habit-flow.png";

const API_URL = "http://localhost:3000";

const Login = ({ onLogin, irRegistro, irLanding }) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Envia las credenciales al backend y recibe el usuario si son correctas.
  const iniciarSesion = async (evento) => {
    evento.preventDefault();

    if (correo.trim() === "" || password === "") {
      setMensaje("Completa el correo y la contraseña.");
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo: correo.trim().toLowerCase(),
          password
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "No se pudo iniciar sesión.");
        return;
      }

      onLogin(datos.usuario);
    } catch (error) {
      setMensaje("No se pudo conectar con el backend.");
    }
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
            placeholder="********"
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
