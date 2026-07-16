/**
 * authService — simula el endpoint /api/login
 */

const CREDENTIALS = {
  email: "victor.stone@test.com",
  password: "victorpass",
};

/** Utilidad para simular latencia de red. */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Simula POST /api/login
 * Retorna la respuesta del servidor con datos del usuario o error.
 */
export async function apiLogin(email, password) {
  await delay(400);

  if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
    return {
      ok: true,
      data: {
        email: "victor.stone@test.com",
        name: "Victor Stone",
        role: "admin",
        token: "123token",
      },
    };
  }

  return {
    ok: false,
    error: "Credenciales inválidas",
  };
}

/**
 * Guarda la sesión del usuario en localStorage.
 */
export function saveSession(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data));
}

/**
 * Obtiene el usuario guardado en localStorage.
 */
export function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

/**
 * Verifica si hay un usuario autenticado con rol admin.
 */
export function isAdmin() {
  const user = getUser();
  return user && user.role === "admin";
}
