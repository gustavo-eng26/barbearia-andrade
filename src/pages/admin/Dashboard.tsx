import { appointments } from "../../data/appointments";
import { barbers } from "../../data/barbers";
import { services } from "../../data/services";
import { Notice, PageHeader } from "../../components/admin/AdminUI";
export default function Dashboard() {
  const stats = [["Agendamentos hoje", appointments.length], ["Barbeiros", barbers.length], ["Serviços", services.length]];
  return (<>
    <PageHeader title="Dashboard" subtitle="Visão geral do dia" />
    <Notice>Dados fictícios temporários.</Notice>
    <section className="grid gap-3 sm:grid-cols-3" aria-label="Indicadores">{stats.map(([l, v]) => <div key={l} className="rounded-xl border border-white/10 bg-coal p-4"><p className="text-xs text-ash">{l}</p><p className="mt-2 font-display text-3xl">{v}</p></div>)}</section>
    <section className="mt-8"><h2 className="mb-3 text-sm text-brass">PRÓXIMOS AGENDAMENTOS</h2>
      <ul className="divide-y divide-white/10 rounded-xl border border-white/10 bg-coal">{appointments.map(a => <li key={a.id} className="flex justify-between p-4 text-sm"><span>{a.time} · {a.client}</span><span className="text-ash">{a.service}</span></li>)}</ul></section>
  </>);
}
