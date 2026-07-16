import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
// import { apiLogin } from "../services/authService";

/**
 * LoginPage — formulario de autenticación.
 */

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const respuesta = await apiLogin(email, password);

    if (respuesta.ok) {
      guardarSesion(respuesta.data);
      navigate("/");
    } else {
      setError(respuesta.error);
    }

    setCargando(false);
  }

  return (
    <main className="page-center">
      <div className="card">
        <h1 className="title">Validador de Datos</h1>

        <form
          id="login-form"
          className="login-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="login-form__fields">
            <FormField
              id="email"
              label="Tu correo electrónico"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />

            <FormField
              id="password"
              label="Tu contraseña"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              error={error || undefined}
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn-primary"
            disabled={cargando}
          >
            {cargando ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
