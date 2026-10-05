// Camada de autenticação. A proteção REAL precisa existir no servidor;
// o sessionStorage abaixo só controla a interface e pode ser burlado.
const KEY = "andrade:admin-ui-session";
const API = import.meta.env.VITE_API_URL as string | undefined;
export const authMode: "api" | "demo" = API ? "api" : "demo";

export async function login(username: string, password: string): Promise<void> {
  if (API) {
    const r = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email: username, password }) });
    if (!r.ok) throw new Error(r.status === 401 ? "E-mail ou senha incorretos." : "Não foi possível entrar. Tente novamente.");
  } else if (username.trim().toLowerCase() !== "admin" || password !== "admin") {
    throw new Error("No modo demonstração, use usuário admin e senha admin.");
  }
  sessionStorage.setItem(KEY, "1");
}
export const isLoggedIn = () => sessionStorage.getItem(KEY) === "1";
export const logout = () => sessionStorage.removeItem(KEY);
