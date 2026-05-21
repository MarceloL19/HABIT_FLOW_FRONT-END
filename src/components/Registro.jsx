import { useState } from "react";
import logoHabitFlow from "../assets/logo-habit-flow.png";
const Registro = ({ onRegistrar, irLogin, irLanding, irDashboard }) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [registroCorrecto, setRegistroCorrecto] = useState(false);

  const registrar = (evento) => {
    evento.preventDefault();

    if (nombre === "" || correo === "" || password === "" || confirmarPassword === "") {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    if (password !== confirmarPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    const nuevoUsuario = {
      nombre: nombre,
      correo: correo,
      password: password,
      fechaRegistro: new Date().toISOString()
    };

    onRegistrar(nuevoUsuario);
    setMensaje("Cuenta creada correctamente.");
    setRegistroCorrecto(true);
  };

  const entrarAlDashboard = () => {
    localStorage.setItem("sesionActiva", "true");
    irDashboard();
  };

  return (
    <main className="pantalla-formulario">
      <button className="marca-volver" onClick={irLanding}>
        <img src={logoHabitFlow} alt="Logo de HabitFlow" className="logo-marca" />
        <span>HabitFlow</span>
      </button>

      <section className="tarjeta formulario-contenedor">
        <h1>Crea tu cuenta</h1>
        <p className="texto-secundario">Comienza tu viaje hacia mejores hábitos.</p>

        {mensaje !== "" && (
          <p className={registroCorrecto ? "mensaje exito" : "mensaje error"}>{mensaje}</p>
        )}

        <form onSubmit={registrar} className="formulario">
          <label htmlFor="nombre">Nombre completo</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            placeholder="Tu nombre"
          />

          <label htmlFor="correo">Correo electrónico</label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            placeholder="tu@email.com"
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            placeholder="Mínimo 6 caracteres"
          />

          <label htmlFor="confirmar">Confirmar contraseña</label>
          <input
            id="confirmar"
            type="password"
            value={confirmarPassword}
            onChange={(evento) => setConfirmarPassword(evento.target.value)}
            placeholder="Repite tu contraseña"
          />

          <button className="boton boton-principal" type="submit">
            Crear cuenta
          </button>
        </form>

        {registroCorrecto && (
          <button className="boton boton-secundario boton-ancho" onClick={entrarAlDashboard}>
            Ir al dashboard
          </button>
        )}

        <p className="cambio-pantalla">
          ¿Ya tienes cuenta?
          <button onClick={irLogin}>Iniciar sesión</button>
        </p>

        <button className="boton boton-texto boton-ancho" onClick={irLanding}>
          Volver al inicio
        </button>
      </section>
    </main>
  );
};

export default Registro;
