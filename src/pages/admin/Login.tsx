import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { authMode, isLoggedIn, login } from "../../services/auth";
import { ExclusiveBanner, Notice, input } from "../../components/admin/AdminUI";
import { useCustomerAuth } from "../../services/customerAuth";

export default function Login() {
  const { customer } = useCustomerAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState(authMode === "demo" ? "admin" : ""); const [password, setPassword] = useState(authMode === "demo" ? "admin" : "");
  const [show, setShow] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  if (customer) return <Navigate to="/acesso-negado" replace />;
  if (isLoggedIn()) return <Navigate to="/admin/dashboard" replace />;
  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    if (authMode === "api" && !/^\S+@\S+\.\S+$/.test(email)) return setError("Informe um e-mail válido.");
    if (authMode === "api" && password.length < 6) return setError("A senha deve ter ao menos 6 caracteres.");
    if (authMode === "demo" && (email.trim().toLowerCase() !== "admin" || password !== "admin")) return setError("No modo demonstração, use usuário admin e senha admin.");
    setLoading(true);
    try { await login(email, password); nav("/admin/dashboard"); }
    catch (err) { setError(err instanceof Error ? err.message : "Erro inesperado."); }
    finally { setLoading(false); }
  }
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <form onSubmit={submit} noValidate className="w-full max-w-sm rounded-2xl border border-white/10 bg-coal p-8">
        <ExclusiveBanner />
        <p className="text-xs tracking-[.3em] text-brass">PAINEL ADMINISTRATIVO</p>
        <h1 className="mt-2 mb-6 font-display text-3xl font-bold">Entrar</h1>
        {authMode === "demo" && <Notice>Modo demonstração: usuário <strong>admin</strong> e senha <strong>admin</strong>. O acesso fica salvo apenas nesta sessão do navegador.</Notice>}
        <label className="block text-sm">{authMode === "demo" ? "Usuário" : "E-mail"}<input type={authMode === "demo" ? "text" : "email"} autoComplete={authMode === "demo" ? "username" : "email"} value={email} onChange={e => setEmail(e.target.value)} className={input} /></label>
        <label className="mt-4 block text-sm">Senha
          <span className="relative block"><input type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className={`${input} pr-16`} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-xs text-ash">{show ? "Ocultar" : "Mostrar"}</button></span></label>
        {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-brass py-3 text-sm font-semibold text-ink disabled:opacity-50">{loading ? "Entrando..." : "ENTRAR"}</button>
      </form>
    </main>
  );
}
