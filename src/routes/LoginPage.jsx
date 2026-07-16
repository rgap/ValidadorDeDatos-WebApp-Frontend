import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';
import { apiLogin, saveSession } from '../services/authService';

/**
 * LoginPage — formulario de autenticación.
 */
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const response = await apiLogin(email, password);

    if (response.ok) {
      saveSession(response.data);
      navigate('/');
    } else {
      setError(response.error);
    }

    setLoading(false);
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
                setError('');
              }}
            />

            <FormField
              id="password"
              label="Tu contraseña"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              error={error || undefined}
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
