import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { business } from "../data/business";
import { useCustomerAuth } from "../services/customerAuth";

const input = "mt-2 w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-bone placeholder:text-ash/70 focus:border-brass";
const validEmail = /^\S+@\S+\.\S+$/;

export default function CustomerLogin() {
  const { customer, login, register, loading } = useCustomerAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">(params.get("modo") === "cadastro" ? "register" : "login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [reminders, setReminders] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const booking = params.get("booking") === "1";
  const next = params.get("next");

  if (customer) {
    if (booking) return <Navigate to="/agendar?confirmar=1" replace />;
    return <Navigate to={next === "/meus-agendamentos" ? next : "/meus-agendamentos"} replace />;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      if (tab === "register") {
        if (!validEmail.test(email)) return setError("Informe um e-mail válido.");
        if (password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
        if (!name.trim() || !phone.trim()) return setError("Preencha todos os campos obrigatórios.");
        if (password !== confirmPassword) return setError("As senhas não coincidem.");
        await register({ name: name.trim(), phone: phone.trim(), email, whatsappReminders: reminders }, password);
      } else {
        if (email.trim().toLowerCase() !== "admin" && !validEmail.test(email)) return setError("Informe um e-mail válido.");
        if (email.trim().toLowerCase() !== "admin" && password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
        await login(email, password);
      }
      if (booking) navigate("/agendar?confirmar=1", { replace: true });
      else navigate(next === "/meus-agendamentos" ? next : "/meus-agendamentos", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar. Tente novamente.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl pr-3 text-sm font-medium text-ash transition hover:bg-white/5 hover:text-brass focus-visible:text-brass">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m14 18-6-6 6-6M8 12h12" /></svg>
          Voltar ao site
        </Link>
        <Link to="/" className="mb-8 flex flex-col items-center text-center">
          {business.logo && <img src={business.logo} alt={business.name} className="h-20 w-20 rounded-full border border-brass/40 object-cover" />}
          <span className="mt-3 font-display text-2xl font-bold uppercase tracking-widest">{business.name}</span>
        </Link>
        <section className="rounded-2xl border border-white/10 bg-coal p-6 shadow-2xl sm:p-8">
          {booking && <p className="mb-5 rounded-xl border border-brass/30 bg-brass/10 px-4 py-3 text-sm text-brass">Entre para confirmar seu horário.</p>}
          <p className="text-center text-xs tracking-[.22em] text-brass">ÁREA DO CLIENTE</p>
          <h1 className="mt-2 text-center font-display text-3xl font-bold">{tab === "login" ? "Bem-vindo de volta" : "Crie sua conta"}</h1>
          <div role="tablist" aria-label="Acesso à conta" className="mt-6 grid grid-cols-2 rounded-xl border border-white/10 bg-ink p-1">
            <button type="button" role="tab" aria-selected={tab === "login"} onClick={() => { setTab("login"); setError(""); }} className={`rounded-lg px-3 py-2.5 text-sm transition ${tab === "login" ? "bg-brass font-semibold text-ink" : "text-ash hover:text-bone"}`}>Entrar</button>
            <button type="button" role="tab" aria-selected={tab === "register"} onClick={() => { setTab("register"); setError(""); }} className={`rounded-lg px-3 py-2.5 text-sm transition ${tab === "register" ? "bg-brass font-semibold text-ink" : "text-ash hover:text-bone"}`}>Criar conta</button>
          </div>
          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            {tab === "register" && <>
              <label className="block text-sm">Nome completo<input autoComplete="name" value={name} onChange={event => setName(event.target.value)} className={input} required /></label>
              <label className="block text-sm">WhatsApp<input autoComplete="tel" inputMode="tel" placeholder="(32) 00000-0000" value={phone} onChange={event => setPhone(event.target.value)} className={input} required /></label>
            </>}
            <label className="block text-sm">{tab === "login" ? "E-mail ou usuário" : "E-mail"}<input type={tab === "login" ? "text" : "email"} autoComplete={tab === "login" ? "username" : "email"} value={email} onChange={event => setEmail(event.target.value)} className={input} required /></label>
            <label className="block text-sm">Senha
              <span className="relative block"><input type={showPassword ? "text" : "password"} autoComplete={tab === "register" ? "new-password" : "current-password"} value={password} onChange={event => setPassword(event.target.value)} className={`${input} pr-24`} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-xs text-ash hover:text-bone">{showPassword ? "Ocultar senha" : "Mostrar senha"}</button></span>
            </label>
            {tab === "register" && <>
              <label className="block text-sm">Confirmar senha<input type={showPassword ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} className={input} required /></label>
              <label className="flex items-start gap-3 text-sm text-bone/80"><input type="checkbox" checked={reminders} onChange={event => setReminders(event.target.checked)} className="mt-1 accent-[#d9a441]" />Quero receber lembretes pelo WhatsApp</label>
            </>}
            {tab === "login" && <button type="button" onClick={() => setNotice("A recuperação de senha estará disponível quando o serviço de autenticação for conectado.")} className="text-sm text-brass hover:underline">Esqueci minha senha</button>}
            {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
            {notice && <p role="status" className="rounded-lg border border-brass/30 bg-brass/10 px-3 py-2 text-sm text-brass">{notice}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-full bg-[#d9a441] py-3.5 text-sm font-bold tracking-wide text-ink transition hover:bg-bone disabled:cursor-wait disabled:opacity-60">{loading ? "AGUARDE..." : tab === "login" ? "ENTRAR" : "CRIAR CONTA"}</button>
          </form>
          <p role="note" className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-ash">Modo demonstração: use usuário <strong>admin</strong> e senha <strong>admin</strong>. A conta de cliente e o acesso da equipe são separados e ficam apenas neste navegador; conecte um backend antes de publicar.</p>
        </section>
        <p className="mt-6 text-center text-sm text-ash">Você é da equipe? <Link to="/admin" className="text-brass hover:underline">Acesse o painel da barbearia</Link></p>
      </div>
    </main>
  );
}
