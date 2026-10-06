import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { business } from "../data/business";
import { services } from "../data/services";
import { barbers } from "../data/barbers";
import { useCustomerAuth, saveCustomerAppointment } from "../services/customerAuth";

const steps = ["Serviço", "Barbeiro", "Data", "Horário", "Seus dados"];
const WEEK = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const DRAFT_KEY = "andrade:booking-draft";
interface BookingSelection {
  service: string;
  barber: string;
  date: string;
  time: string;
  name: string;
  phone: string;
}

function daysInMonth(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];
}
function slotsFor(date: string) {
  if (!date) return [];
  const h = business.hours.find(x => x.days.includes(new Date(date + "T12:00").getDay()));
  if (!h || !h.open) return [];
  return Array.from({ length: h.close - h.open }, (_, i) => `${String(h.open + i).padStart(2, "0")}:00`);
}
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function Booking() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { customer } = useCustomerAuth();
  const [savedDraft] = useState(() => sessionStorage.getItem(DRAFT_KEY));
  const resume = params.get("confirmar") === "1" && Boolean(customer) && Boolean(savedDraft);
  const [step, setStep] = useState(resume ? 4 : 0);
  const [sel, setSel] = useState<BookingSelection>(() => ({
    service: params.get("servico") ?? "",
    barber: "",
    date: "",
    time: "",
    ...(resume && savedDraft ? JSON.parse(savedDraft) as Partial<BookingSelection> : {}),
    name: customer?.name ?? "",
    phone: customer?.phone ?? "",
  }));
  const [done, setDone] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const days = useMemo(() => daysInMonth(calendarMonth), [calendarMonth]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const set = (key: keyof BookingSelection, value: string) => setSel(previous => ({ ...previous, [key]: value }));
  const valid = [sel.service, sel.barber, sel.date, sel.time, sel.name.trim() && sel.phone.trim()][step];

  if (done) return (
    <section className="mx-auto max-w-lg px-5 py-24 text-center">
      <span aria-hidden="true" className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-3xl text-emerald-300">✓</span>
      <h1 className="mt-6 font-display text-4xl font-bold">Horário solicitado</h1>
      <p className="mt-4 text-ash">Seu pedido de agendamento foi salvo. A confirmação será enviada pelos canais da barbearia.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/meus-agendamentos" className="rounded-full bg-[#d9a441] px-6 py-3 text-sm font-bold text-ink transition hover:bg-bone">VER MEUS AGENDAMENTOS</Link>
        <Link to="/" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-bone transition hover:bg-white/5">VOLTAR AO INÍCIO</Link>
      </div>
    </section>
  );

  const opt = (active: boolean) => `rounded-xl border p-4 text-left transition ${active ? "border-brass bg-brass/10" : "border-white/10 bg-coal hover:border-white/30"}`;
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <ol className="flex gap-2 text-[11px]" aria-label="Etapas">{steps.map((label, i) => <li key={label} aria-current={i === step ? "step" : undefined} className={`flex-1 border-t-2 pt-2 ${i <= step ? "border-brass text-bone" : "border-white/10 text-ash"}`}>{label}</li>)}</ol>
      <h1 className="mt-8 font-display text-4xl font-bold">{step === 4 ? "Confirme seu horário" : `Escolha: ${steps[step].toLowerCase()}`}</h1>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {step === 0 && services.map(service => <button key={service.id} onClick={() => set("service", service.id)} className={opt(sel.service === service.id)}><b>{service.name}</b><span className="block text-xs text-ash">{service.duration} · {service.price}</span></button>)}
        {step === 1 && barbers.map(barber => <button key={barber.id} onClick={() => set("barber", barber.id)} className={opt(sel.barber === barber.id)}><b>{barber.name}</b><span className="block text-xs text-ash">{barber.role}</span></button>)}
        {step === 2 && <div className="sm:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <button type="button" aria-label="Mês anterior" disabled={calendarMonth.getFullYear() === today.getFullYear() && calendarMonth.getMonth() === today.getMonth()} onClick={() => setCalendarMonth(month => new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-lg border border-white/10 px-3 py-2 text-bone transition hover:border-brass disabled:invisible">‹</button>
            <h2 className="font-display text-xl font-semibold capitalize">{calendarMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</h2>
            <button type="button" aria-label="Próximo mês" onClick={() => setCalendarMonth(month => new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-lg border border-white/10 px-3 py-2 text-bone transition hover:border-brass">›</button>
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2" role="grid" aria-label="Calendário de agendamento">
            {WEEK.map(day => <div key={day} role="columnheader" className="pb-2 text-center text-[10px] font-semibold text-ash sm:text-xs">{day}</div>)}
            {days.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} role="gridcell" aria-hidden="true" />;
              const date = iso(day);
              const isOpen = business.hours.some(hours => hours.open > 0 && hours.days.includes(day.getDay()));
              const isDisabled = day < today || !isOpen;
              return <button key={date} type="button" role="gridcell" aria-label={day.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })} aria-pressed={sel.date === date} disabled={isDisabled} onClick={() => setSel(previous => ({ ...previous, date, time: "" }))} className={`aspect-square rounded-xl border text-sm font-semibold transition sm:text-base ${sel.date === date ? "border-brass bg-brass text-ink" : "border-white/10 bg-coal text-bone hover:border-brass"} disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10`}>{day.getDate()}</button>;
            })}
          </div>
          <p className="mt-3 text-xs text-ash">Dias passados e dias em que a barbearia fecha não podem ser selecionados.</p>
        </div>}
        {step === 3 && slotsFor(sel.date).map((time, i) => <button key={time} disabled={i % 4 === 1} onClick={() => set("time", time)} className={`${opt(sel.time === time)} disabled:line-through disabled:opacity-30`}>{time}</button>)}
        {step === 4 && <form className="space-y-4 sm:col-span-2" onSubmit={event => {
          event.preventDefault();
          if (!customer || !valid) return;
          saveCustomerAppointment({ id: crypto.randomUUID(), customerId: customer.id, serviceId: sel.service, barberId: sel.barber, date: sel.date, time: sel.time, status: "Pendente" });
          sessionStorage.removeItem(DRAFT_KEY);
          setDone(true);
        }}>
          <div className="rounded-xl border border-brass/25 bg-brass/5 p-4 text-sm">
            <p className="font-semibold text-brass">Resumo do horário</p>
            <p className="mt-2 text-bone">{services.find(item => item.id === sel.service)?.name} · {barbers.find(item => item.id === sel.barber)?.name}</p>
            <p className="mt-1 text-ash">{sel.date && new Date(`${sel.date}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })} às {sel.time}</p>
          </div>
          <label className="block text-sm">Nome completo<input required autoComplete="name" value={sel.name} onChange={event => set("name", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-coal p-3" /></label>
          <label className="block text-sm">WhatsApp<input required inputMode="tel" autoComplete="tel" value={sel.phone} onChange={event => set("phone", event.target.value)} placeholder="(32) 00000-0000" className="mt-2 w-full rounded-xl border border-white/10 bg-coal p-3" /></label>
          <button type="submit" disabled={!valid} className="w-full rounded-full bg-[#d9a441] py-4 text-sm font-semibold text-ink transition hover:bg-bone disabled:opacity-40">CONFIRMAR AGENDAMENTO</button>
        </form>}
      </div>
      <div className="mt-10 flex justify-between">
        <button disabled={step === 0} onClick={() => setStep(step - 1)} className="text-sm text-ash disabled:invisible">Voltar</button>
        {step < 4 && <button disabled={!valid} onClick={() => {
          if (step === 3 && !customer) {
            sessionStorage.setItem(DRAFT_KEY, JSON.stringify(sel));
            navigate("/entrar?next=%2Fagendar&booking=1");
          } else setStep(step + 1);
        }} className="rounded-full bg-[#d9a441] px-8 py-3 text-sm font-semibold text-ink transition hover:bg-bone disabled:opacity-40">CONTINUAR</button>}
      </div>
      {step === 3 && !customer && <p className="mt-5 text-center text-sm text-ash">Você entrará na sua conta para confirmar o horário escolhido.</p>}
    </section>
  );
}
