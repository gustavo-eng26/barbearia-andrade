import { useMemo, useState } from "react";
import { appointments } from "../../data/appointments";
import { barbers } from "../../data/barbers";
import { services } from "../../data/services";
import { Notice, PageHeader } from "../../components/admin/AdminUI";

type Period = "today" | "7d" | "30d" | "custom";
interface DailyMetric { date: string; revenue: number; appointments: number; customers: number; visits: number }

const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const compactMoney = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 }).format(value);
const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const shortDate = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

function LineChart({ values, color, label, format = String }: { values: number[]; color: string; label: string; format?: (value: number) => string }) {
  if (!values.length) return <div role="status" className="grid h-52 place-items-center rounded-xl border border-dashed border-white/10 text-sm text-ash">Sem dados para este período</div>;
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => ({
    x: values.length === 1 ? 360 : 20 + index * 680 / (values.length - 1),
    y: 205 - value / max * 170,
  }));
  const path = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
  const area = `${path} L ${points[points.length - 1]?.x ?? 700} 210 L ${points[0]?.x ?? 20} 210 Z`;
  return (
    <div className="min-w-0">
      <svg role="img" aria-label={label} viewBox="0 0 720 230" preserveAspectRatio="none" className="h-52 w-full overflow-visible">
        {[35, 90, 145, 200].map(y => <line key={y} x1="20" x2="700" y1={y} y2={y} stroke="currentColor" strokeOpacity=".09" strokeDasharray="4 5" />)}
        <path d={area} fill={color} fillOpacity=".12" />
        <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="3.5" fill={color}><title>{format(values[index])}</title></circle>)}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-ash"><span>{format(Math.min(...values, 0))}</span><span>{format(max)}</span></div>
    </div>
  );
}

function MetricCard({ title, value, note, icon }: { title: string; value: string; note: string; icon: string }) {
  return <article className="min-w-0 rounded-2xl border border-white/10 bg-coal p-4 shadow-sm sm:p-5">
    <div className="flex items-start justify-between gap-2"><p className="text-xs leading-5 text-ash sm:text-sm">{title}</p><span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brass/10 text-base text-brass">{icon}</span></div>
    <p title={value} className="mt-3 break-words font-display text-xl font-bold leading-tight sm:text-3xl">{value}</p><p className="mt-1 text-[11px] text-ash">{note}</p>
  </article>;
}

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>("7d");
  const [from, setFrom] = useState(() => {
    const date = new Date(); date.setDate(date.getDate() - 6); return dayKey(date);
  });
  const [to, setTo] = useState(dayKey(new Date()));
  const daily = useMemo<DailyMetric[]>(() => {
    const today = new Date(); today.setHours(12, 0, 0, 0);
    return Array.from({ length: 90 }, (_, index) => {
      const date = new Date(today); date.setDate(today.getDate() - (89 - index));
      return {
        date: dayKey(date),
        revenue: 125 + (index * 61 % 245) + (index % 4) * 38,
        appointments: 2 + index % 5,
        customers: 1 + index % 4,
        visits: 28 + (index * 29 % 115) + (index % 3) * 18,
      };
    });
  }, []);
  const currentMonth = dayKey(new Date()).slice(0, 7);
  const previousMonthDate = new Date(); previousMonthDate.setDate(1); previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
  const previousMonth = dayKey(previousMonthDate).slice(0, 7);
  const currentMonthRevenue = daily.filter(item => item.date.startsWith(currentMonth)).reduce((sum, item) => sum + item.revenue, 0);
  const previousMonthRevenue = daily.filter(item => item.date.startsWith(previousMonth)).reduce((sum, item) => sum + item.revenue, 0);
  const monthGrowth = previousMonthRevenue ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 0;
  const startDate = new Date(); startDate.setDate(startDate.getDate() - (period === "today" ? 0 : period === "7d" ? 6 : 29));
  const range = period === "custom"
    ? daily.filter(item => item.date >= from && item.date <= to)
    : daily.filter(item => item.date >= dayKey(startDate));
  const totalRevenue = range.reduce((sum, item) => sum + item.revenue, 0);
  const totalAppointments = range.reduce((sum, item) => sum + item.appointments, 0);
  const totalCustomers = range.reduce((sum, item) => sum + item.customers, 0);
  const totalVisits = range.reduce((sum, item) => sum + item.visits, 0);
  const categories = [
    { name: "Cabelo", share: 48, color: "#d9a441" },
    { name: "Barba", share: 32, color: "#9b7650" },
    { name: "Bigode", share: 20, color: "#718096" },
  ];
  const startAngle = [0, categories[0].share, categories[0].share + categories[1].share];
  const donut = `conic-gradient(${categories.map((item, index) => `${item.color} ${startAngle[index]}% ${startAngle[index] + item.share}%`).join(", ")})`;
  const periods: { id: Period; label: string }[] = [{ id: "today", label: "Hoje" }, { id: "7d", label: "7 dias" }, { id: "30d", label: "30 dias" }, { id: "custom", label: "Personalizado" }];

  return <>
    <PageHeader title="Dashboard" subtitle="Visão geral da operação" />
    <Notice>Modo demonstração: os gráficos, valores e visitas abaixo são ilustrativos; não representam faturamento ou dados reais. Conecte um backend para indicadores confiáveis.</Notice>
    <section aria-label="Período dos indicadores" className="mb-5 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium text-ash">Período</span>
      {periods.map(item => <button key={item.id} type="button" aria-pressed={period === item.id} onClick={() => setPeriod(item.id)} className={`min-h-11 rounded-xl px-4 text-xs font-medium transition active:scale-95 ${period === item.id ? "bg-brass text-ink" : "border border-white/10 text-ash hover:border-brass/40 hover:text-bone"}`}>{item.label}</button>)}
      {period === "custom" && <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
        <label className="sr-only" htmlFor="period-from">Data inicial</label><input id="period-from" type="date" value={from} max={to} onChange={event => setFrom(event.target.value)} className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-ink px-3 text-xs text-bone sm:flex-none" />
        <span aria-hidden="true" className="text-ash">—</span>
        <label className="sr-only" htmlFor="period-to">Data final</label><input id="period-to" type="date" value={to} min={from} onChange={event => setTo(event.target.value)} className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-ink px-3 text-xs text-bone sm:flex-none" />
      </div>}
    </section>

    <section aria-label="Indicadores" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <MetricCard title="Faturamento total (90 dias)" value={compactMoney(daily.reduce((sum, item) => sum + item.revenue, 0))} note="Aproximado · dado ilustrativo" icon="R$" />
      <MetricCard title="Faturamento do mês" value={compactMoney(currentMonthRevenue)} note="Mês atual · dado fictício" icon="↗" />
      <MetricCard title="Agendamentos no período" value={String(totalAppointments)} note={`${period === "today" ? "Hoje" : period === "custom" ? "Intervalo selecionado" : `Últimos ${period === "7d" ? "7" : "30"} dias`} · exemplo`} icon="▤" />
      <MetricCard title="Clientes no período" value={String(totalCustomers)} note="Contagem ilustrativa" icon="♙" />
    </section>

    <section className="mt-5 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(260px,.85fr)]">
      <article className="min-w-0 rounded-2xl border border-white/10 bg-coal p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2"><div><h2 className="font-semibold">Faturamento</h2><p className="mt-1 text-xs text-ash">Evolução no período selecionado</p></div><span className="text-sm font-semibold text-brass">{money(totalRevenue)}</span></div>
        <LineChart values={range.map(item => item.revenue)} color="#d9a441" label="Gráfico ilustrativo de faturamento no período" format={value => `R$ ${value}`} />
        <div className="mt-3 flex justify-between text-[10px] text-ash"><span>{range[0] ? shortDate(range[0].date) : "Sem dados"}</span><span>{range.length > 2 ? shortDate(range[Math.floor(range.length / 2)].date) : ""}</span><span>{range.length ? shortDate(range[range.length - 1].date) : ""}</span></div>
      </article>
      <article className="min-w-0 rounded-2xl border border-white/10 bg-coal p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">Crescimento mensal</h2><p className="mt-1 text-xs text-ash">Mês atual × mês anterior</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${monthGrowth >= 0 ? "bg-emerald-400/10 text-emerald-300" : "bg-red-400/10 text-red-300"}`}>{monthGrowth >= 0 ? "+" : ""}{monthGrowth.toFixed(1)}%</span></div>
        <div className="mt-6 space-y-5">
          {[{ label: "Mês atual", value: currentMonthRevenue, color: "bg-brass" }, { label: "Mês anterior", value: previousMonthRevenue, color: "bg-ash/60" }].map(item => <div key={item.label}><div className="mb-2 flex justify-between gap-3 text-xs"><span className="text-ash">{item.label}</span><span className="font-medium">{money(item.value)}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/5"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.max(4, item.value / Math.max(currentMonthRevenue, previousMonthRevenue, 1) * 100)}%` }} /></div></div>)}
        </div>
      </article>
    </section>

    <section className="mt-4 grid min-w-0 gap-4 xl:grid-cols-2">
      <article className="min-w-0 rounded-2xl border border-white/10 bg-coal p-4 sm:p-5">
        <div className="mb-4"><h2 className="font-semibold">Visitas ao site</h2><p className="mt-1 text-xs text-ash">Acessos ilustrativos no período · {totalVisits.toLocaleString("pt-BR")} visitas</p></div>
        <LineChart values={range.map(item => item.visits)} color="#8b9baf" label="Gráfico ilustrativo de visitas ao site" />
      </article>
      <article className="min-w-0 rounded-2xl border border-white/10 bg-coal p-4 sm:p-5">
        <div><h2 className="font-semibold">Serviços mais procurados</h2><p className="mt-1 text-xs text-ash">Distribuição fictícia por categoria</p></div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-6 sm:justify-start">
          <div role="img" aria-label="Gráfico de rosca ilustrativo: Cabelo 48%, Barba 32%, Bigode 20%" className="grid h-36 w-36 shrink-0 place-items-center rounded-full" style={{ background: donut }}><div className="grid h-24 w-24 place-items-center rounded-full bg-coal text-center"><span><strong className="block font-display text-xl">100%</strong><span className="text-[10px] text-ash">exemplo</span></span></div></div>
          <ul className="space-y-3 text-xs">{categories.map(item => <li key={item.name} className="flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} /><span className="text-ash">{item.name}</span><strong className="ml-auto">{item.share}%</strong></li>)}</ul>
        </div>
      </article>
    </section>

    <section className="mt-8 min-w-0">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><h2 className="font-semibold">Próximos agendamentos</h2><p className="mt-1 text-xs text-ash">Dados fictícios de exemplo</p></div><span className="text-xs text-ash">{appointments.length} registros</span></div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-coal">
        <div className="divide-y divide-white/10 sm:hidden">{appointments.map(item => <article key={item.id} className="p-4"><div className="flex items-center justify-between gap-3"><span className="font-medium">{item.client}</span><span className="rounded-full bg-brass/10 px-2.5 py-1 text-[10px] text-brass">{item.status}</span></div><p className="mt-2 text-xs text-ash">{item.time} · {item.service} · {barbers.find(barber => barber.id === item.barber)?.name}</p></article>)}</div>
        <div className="hidden overflow-x-auto sm:block"><table className="w-full min-w-[560px] text-left text-sm"><thead className="text-xs text-ash"><tr>{["Cliente", "Serviço", "Barbeiro", "Horário", "Status"].map(label => <th key={label} className="px-4 py-3 font-medium">{label}</th>)}</tr></thead><tbody>{appointments.map(item => <tr key={item.id} className="border-t border-white/10"><td className="px-4 py-3">{item.client}</td><td className="px-4 py-3">{item.service}</td><td className="px-4 py-3">{barbers.find(barber => barber.id === item.barber)?.name}</td><td className="px-4 py-3">{item.time}</td><td className="px-4 py-3">{item.status}</td></tr>)}</tbody></table></div>
      </div>
      <p className="mt-5 text-xs text-ash">Catálogo disponível: {services.length} serviços · Equipe cadastrada: {barbers.length} barbeiros</p>
    </section>
  </>;
}
