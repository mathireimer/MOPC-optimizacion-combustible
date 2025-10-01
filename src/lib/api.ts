const API_URL = "http://127.0.0.1:4000"; // tu backend FastAPI

// 🔹 Login: guarda el token en localStorage
export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }),
  });

  if (!res.ok) throw new Error("Error en login");

  const data = await res.json();

  // guardamos token en localStorage con clave consistente
  localStorage.setItem("mopc_token", data.access_token);
  localStorage.setItem("mopc_user", username);

  return data; // { access_token, token_type }
}

// 🔹 Obtener usuarios (requiere token)
export async function getUsuarios() {
  const token = localStorage.getItem("mopc_token");
  if (!token) throw new Error("No hay token. Inicie sesión primero.");

  const res = await fetch(`${API_URL}/usuarios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}

// 🔹 Crear usuario (requiere token)
export async function crearUsuario(nombre: string, email: string) {
  const token = localStorage.getItem("mopc_token");
  if (!token) throw new Error("No hay token. Inicie sesión primero.");

  const res = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre, email }),
  });

  if (!res.ok) throw new Error("Error al crear usuario");
  return res.json();
}
