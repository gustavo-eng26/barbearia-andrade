import { useMemo, useState } from "react";
import { appointments, statuses } from "../../data/appointments";
import { barbers } from "../../data/barbers";
import { NeedsBackend, Notice, PageHeader, input } from "../../components/admin/AdminUI";
export default function Appointments() {
  const [q, setQ] = useState(""); const [status, setStatus] = useState(""); const [barber, setBarber] = useState("");
  const list = useMemo(() => appointments.filter(a => a.client.toLowerCase().includes(q.toLowerCase()) && (!status || a.status === status) && (!barber || a.barber === barber)), [q, status, barber]);
  return (<>
    <PageHeader title="Agendamentos" />
    <Notice>Busca e filtros funcionam sobre dados fictícios. Editar, alterar status e cancelar dependem de backend.</Notice>
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      <label className="text-xs">Buscar cliente<input value={q} onChange={e => setQ(e.target.value)} className={input} /></label>
      <label className="text-xs">Status<select value={status} onChange={e => setStatus(e.target.value)} className={input}><option value="">Todos</option>{statuses.map(s => <option key={s}>{s}</option>)}</select></label>
      <label className="text-xs">Barbeiro<select value={barber} onChange={e => setBarber(e.target.value)} className={input}><option value="">Todos</option>{barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
    </div>
    <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="text-xs text-ash"><tr>{["Cliente", "Serviço", "Barbeiro", "Horário", "Status", "Ações"].map(h => <th key={h} className="py-2">{h}</th>)}</tr></thead>
      <tbody>{list.map(a => <tr key={a.id} className="border-t border-white/10"><td className="py-3">{a.client}</td><td>{a.service}</td><td>{barbers.find(b => b.id === a.barber)?.name}</td><td>{a.time}</td><td>{a.status}</td><td><NeedsBackend label="Editar" /></td></tr>)}</tbody></table>
      {!list.length && <p className="py-6 text-sm text-ash">Nenhum agendamento encontrado.</p>}</div>
  </>);
}
