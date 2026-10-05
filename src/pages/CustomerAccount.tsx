import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { business } from "../data/business";
import { barbers } from "../data/barbers";
import { services } from "../data/services";
import { useCustomerAuth, getCustomerAppointments, updateCustomerAppointment, type CustomerAppointment } from "../services/customerAuth";

type Section = "appointments" | "details";
const field = "mt-2 w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-bone focus:border-brass";

function dateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}
function dateLabel(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
}
function statusStyle(status: CustomerAppointment["status"]) {
  if (status === "Confirmado") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  if (status === "Pendente") return "border-brass/30 bg-brass/10 text-brass";
  if (status === "Cancelado") return "border-red-500/30 bg-red-500/10 text-red-300";
  return "border-white/15 bg-white/5 text-ash";
}

export default function CustomerAccount() {
  const { customer, update, changePassword } = useCustomerAuth();
  const [params, setParams] = useSearchParams();
  const [section, setSection] = useState<Section>(params.get("aba") === "dados" ? "details" : "appointments");
  const [list, setList] = useState<"upcoming" | "history">("upcoming");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [name, setName] = useState(customer?.name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setSection(params.get("aba") === "dados" ? "details" : "appointments");
  }, [params]);

  if (!customer) return <Navigate to="/entrar?next=%2Fmeus-agendamentos" replace />;
  const activeCustomer = customer;

  const appointments = getCustomerAppointments(activeCustomer.id).sort((a, b) => dateTime(a.date, a.time).getTime() - dateTime(b.date, b.time).getTime());
  const now = new Date();
  const upcoming = appointments.filter(item => dateTime(item.date, item.time) >= now && item.status !== "Cancelado" && item.status !== "Concluído");
  const history = appointments.filter(item => dateTime(item.date, item.time) < now || item.status === "Cancelado" || item.status === "Concluído");
  const visibleAppointments = list === "upcoming" ? upcoming : history;

  function cancelAppointment(id: string) {
    updateCustomerAppointment(id, "Cancelado");
    setCancelId(null);
    setMessage("O agendamento foi cancelado.");
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!name.trim() || !phone.trim() || !email.trim()) return setError("Preencha todos os campos obrigatórios.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Informe um e-mail válido.");
    if (newPassword && (!currentPassword || newPassword.length < 6)) return setError("Informe a senha atual e uma nova senha com pelo menos 6 caracteres.");
    try {
      update({ name: name.trim(), phone: phone.trim(), email, whatsappReminders: activeCustomer.whatsappReminders });
      if (newPassword) await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Suas alterações foram salvas.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar as alterações.");
    }
  }

  const changeSection = (next: Section) => {
    setSection(next);
    setParams(next === "details" ? { aba: "dados" } : {});
    setMessage("");
    setError("");
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 pb-28 sm:py-16">
      <p className="text-xs tracking-[.25em] text-brass">ÁREA DO CLIENTE</p>
      <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Meus agendamentos</h1>
      <p className="mt-2 text-ash">Olá, {activeCustomer.name.trim().split(/\s+/)[0]}</p>
      <div className="mt-9 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)_220px]">
        <nav aria-label="Área do cliente" className="flex gap-2 overflow-x-auto border-b border-white/10 pb-3 lg:block lg:space-y-2 lg:overflow-visible lg:border-0 lg:pb-0">
          <button type="button" onClick={() => changeSection("appointments")} className={`shrink-0 rounded-xl px-4 py-3 text-left text-sm transition ${section === "appointments" ? "bg-brass/10 text-brass" : "text-ash hover:bg-white/5 hover:text-bone"}`}>Agendamentos</button>
          <button type="button" onClick={() => changeSection("details")} className={`shrink-0 rounded-xl px-4 py-3 text-left text-sm transition ${section === "details" ? "bg-brass/10 text-brass" : "text-ash hover:bg-white/5 hover:text-bone"}`}>Meus dados</button>
        </nav>

        <div className="min-w-0">
          {section === "appointments" ? <>
            <div className="mb-5 flex gap-2" role="tablist" aria-label="Filtrar agendamentos">
              <button type="button" role="tab" aria-selected={list === "upcoming"} onClick={() => setList("upcoming")} className={`rounded-full px-4 py-2 text-sm transition ${list === "upcoming" ? "bg-brass text-ink" : "border border-white/10 text-ash hover:text-bone"}`}>Próximos <span className="ml-1 text-xs">({upcoming.length})</span></button>
              <button type="button" role="tab" aria-selected={list === "history"} onClick={() => setList("history")} className={`rounded-full px-4 py-2 text-sm transition ${list === "history" ? "bg-brass text-ink" : "border border-white/10 text-ash hover:text-bone"}`}>Histórico <span className="ml-1 text-xs">({history.length})</span></button>
            </div>
            {visibleAppointments.length ? <div className="space-y-4">
              {visibleAppointments.map(appointment => {
                const service = services.find(item => item.id === appointment.serviceId);
                const barber = barbers.find(item => item.id === appointment.barberId);
                return <article key={appointment.id} className="rounded-2xl border border-white/10 bg-coal p-5 transition duration-200 hover:-translate-y-0.5 hover:border-brass/30 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div><p className="text-sm capitalize text-ash">{dateLabel(appointment.date)}</p><p className="mt-1 font-display text-3xl font-bold text-brass">{appointment.time}</p></div>
                    <span className={`rounded-full border px-3 py-1 text-xs ${statusStyle(appointment.status)}`}>{appointment.status}</span>
                  </div>
                  <div className="mt-5 grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
                    <div><h2 className="font-semibold">{service?.name ?? "Serviço"}</h2><p className="mt-1 text-sm text-ash">{service?.duration ?? "Duração a confirmar"} · {service?.price ?? "Valor a confirmar"}</p></div>
                    <div className="flex items-center gap-3 text-sm text-bone/80"><span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-ink text-brass">{barber?.name.replace(/[^A-Za-zÀ-ÿ ]/g, "").trim().charAt(0) || "B"}</span><span>{barber?.name.replace(/\s*\d+$/, "") ?? "Barbeiro"}</span></div>
                    {list === "upcoming" && <div className="flex gap-4 sm:justify-end"><Link to={`/agendar?servico=${appointment.serviceId}`} className="text-sm text-brass hover:underline">Reagendar</Link><button type="button" onClick={() => setCancelId(appointment.id)} className="text-sm text-red-300 hover:underline">Cancelar</button></div>}
                  </div>
                </article>;
              })}
            </div> : <div className="rounded-2xl border border-dashed border-white/15 bg-coal/50 px-6 py-12 text-center">
              <span aria-hidden="true" className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/5 text-2xl text-brass">◷</span>
              <h2 className="mt-4 font-display text-2xl font-bold">{list === "upcoming" ? "Você ainda não tem agendamentos" : "Seu histórico está vazio"}</h2>
              <p className="mt-2 text-sm text-ash">{list === "upcoming" ? "Escolha um serviço e reserve seu próximo horário." : "Seus horários concluídos ou cancelados aparecerão aqui."}</p>
              <Link to="/agendar" className="mt-6 inline-block rounded-full bg-[#d9a441] px-6 py-3 text-sm font-semibold text-ink transition hover:bg-bone">Agendar agora</Link>
            </div>}
          </> : <section className="rounded-2xl border border-white/10 bg-coal p-5 sm:p-7">
            <h2 className="font-display text-2xl font-bold">Meus dados</h2>
            <p className="mt-1 text-sm text-ash">Mantenha suas informações de contato atualizadas.</p>
            <form onSubmit={saveProfile} className="mt-6 space-y-4">
              <label className="block text-sm">Nome completo<input autoComplete="name" value={name} onChange={event => setName(event.target.value)} className={field} required /></label>
              <label className="block text-sm">WhatsApp<input autoComplete="tel" inputMode="tel" value={phone} onChange={event => setPhone(event.target.value)} className={field} required /></label>
              <label className="block text-sm">E-mail<input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className={field} required /></label>
              <div className="border-t border-white/10 pt-5">
                <h3 className="text-sm font-semibold">Alterar senha</h3>
                <label className="mt-3 block text-sm">Senha atual<input type="password" autoComplete="current-password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} className={field} /></label>
                <label className="mt-4 block text-sm">Nova senha<input type="password" autoComplete="new-password" value={newPassword} onChange={event => setNewPassword(event.target.value)} className={field} /></label>
              </div>
              {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
              {message && <p role="status" className="text-sm text-emerald-300">{message}</p>}
              <button type="submit" className="rounded-full bg-[#d9a441] px-6 py-3 text-sm font-semibold text-ink transition hover:bg-bone">Salvar alterações</button>
            </form>
          </section>}
          {message && section === "appointments" && <p role="status" className="mt-4 text-sm text-emerald-300">{message}</p>}
        </div>

        <aside className="rounded-xl border border-white/10 bg-coal p-4 text-sm text-ash lg:self-start">
          <p className="font-semibold text-bone">Barbearia Andrade</p>
          <p className="mt-2">{business.address}<br />{business.city}</p>
          <a href={`tel:${business.phone.replace(/[^\d+]/g, "")}`} className="mt-2 inline-block hover:text-brass">{business.phone}</a>
        </aside>
      </div>

      <Link to="/agendar" className="fixed bottom-5 right-5 z-30 rounded-full bg-[#d9a441] px-6 py-4 text-xs font-bold tracking-wide text-ink shadow-2xl transition hover:bg-bone sm:bottom-8 sm:right-8">NOVO AGENDAMENTO</Link>

      {cancelId && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-5" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setCancelId(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="cancel-title" className="w-full max-w-md rounded-2xl border border-white/10 bg-coal p-6 shadow-2xl">
          <h2 id="cancel-title" className="font-display text-2xl font-bold">Cancelar agendamento</h2>
          <p className="mt-3 text-sm text-ash">Tem certeza que deseja cancelar?</p>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setCancelId(null)} className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-bone transition hover:bg-white/5">Voltar</button>
            <button type="button" onClick={() => cancelAppointment(cancelId)} className="rounded-full bg-red-500/90 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400">Sim, cancelar</button>
          </div>
        </section>
      </div>}
    </section>
  );
}
