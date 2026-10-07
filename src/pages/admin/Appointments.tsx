import { useMemo, useState } from "react";
import { appointments, statuses } from "../../data/appointments";
import { barbers } from "../../data/barbers";
import { NeedsBackend, Notice, PageHeader, input } from "../../components/admin/AdminUI";
export default function Appointments() {
  const [q, setQ] = useState(""); const [status, setStatus] = useState(""); const [barber, setBarber] = useState("");
  const [sortBy, setSortBy] = useState<"client" | "service" | "barber" | "time">("time");
  const [descending, setDescending] = useState(false); const [page, setPage] = useState(0);
  const pageSize = 5;
  const list = useMemo(() => appointments.filter(a => {
    const barberName = barbers.find(item => item.id === a.barber)?.name ?? "";
    const query = q.trim().toLocaleLowerCase("pt-BR");
    return (!query || `${a.client} ${a.service} ${barberName} ${a.time} ${a.status}`.toLocaleLowerCase("pt-BR").includes(query))
      && (!status || a.status === status) && (!barber || a.barber === barber);
  }).sort((a, b) => {
    const left = sortBy === "barber" ? barbers.find(item => item.id === a.barber)?.name ?? "" : a[sortBy];
    const right = sortBy === "barber" ? barbers.find(item => item.id === b.barber)?.name ?? "" : b[sortBy];
    const order = left.localeCompare(right, "pt-BR", { numeric: true });
    return descending ? -order : order;
  }), [q, status, barber, sortBy, descending]);
  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  const visible = list.slice(page * pageSize, (page + 1) * pageSize);
  const sort = (key: typeof sortBy) => {
    if (sortBy === key) setDescending(value => !value);
    else { setSortBy(key); setDescending(false); }
    setPage(0);
  };
  const columns: { key: typeof sortBy; label: string }[] = [{ key: "client", label: "Cliente" }, { key: "service", label: "Serviço" }, { key: "barber", label: "Barbeiro" }, { key: "time", label: "Horário" }];
  return (<>
    <PageHeader title="Agendamentos" />
    <Notice>Busca, ordenação e filtros funcionam sobre dados fictícios. Editar, alterar status e cancelar dependem de backend.</Notice>
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      <label className="text-xs">Buscar agendamento<input value={q} onChange={e => { setQ(e.target.value); setPage(0); }} placeholder="Cliente, serviço ou horário" className={input} /></label>
      <label className="text-xs">Status<select value={status} onChange={e => { setStatus(e.target.value); setPage(0); }} className={input}><option value="">Todos</option>{statuses.map(s => <option key={s}>{s}</option>)}</select></label>
      <label className="text-xs">Barbeiro<select value={barber} onChange={e => { setBarber(e.target.value); setPage(0); }} className={input}><option value="">Todos</option>{barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
    </div>
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-coal">
      <div className="divide-y divide-white/10 sm:hidden">{visible.map(a => <article key={a.id} className="p-4">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="break-words font-medium">{a.client}</p><p className="mt-1 text-xs text-ash">{a.service} · {barbers.find(b => b.id === a.barber)?.name}</p></div><span className="shrink-0 rounded-full bg-brass/10 px-2.5 py-1 text-[10px] text-brass">{a.status}</span></div>
        <div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-ash">{a.date} · {a.time}</span><NeedsBackend label="Editar" /></div>
      </article>)}</div>
      <div className="hidden overflow-x-auto sm:block"><table className="w-full min-w-[640px] text-left text-sm"><thead className="text-xs text-ash"><tr>{columns.map(column => <th key={column.key} aria-sort={sortBy === column.key ? (descending ? "descending" : "ascending") : "none"} className="py-3"><button type="button" onClick={() => sort(column.key)} className="inline-flex min-h-10 items-center gap-1 pr-3 font-medium hover:text-bone">{column.label}<span aria-hidden="true">{sortBy === column.key ? (descending ? "↓" : "↑") : "↕"}</span></button></th>)}{["Status", "Ações"].map(h => <th key={h} className="py-3 font-medium">{h}</th>)}</tr></thead>
        <tbody>{visible.map(a => <tr key={a.id} className="border-t border-white/10"><td className="py-3">{a.client}</td><td>{a.service}</td><td>{barbers.find(b => b.id === a.barber)?.name}</td><td>{a.time}</td><td>{a.status}</td><td><NeedsBackend label="Editar" /></td></tr>)}</tbody></table></div>
      {!list.length && <p className="px-4 py-8 text-center text-sm text-ash">Nenhum agendamento encontrado.</p>}
    </div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-ash">
      <span>{list.length ? `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, list.length)} de ${list.length} agendamentos` : "0 agendamentos"}</span>
      <div className="flex items-center gap-2">
        <button type="button" disabled={page === 0} onClick={() => setPage(value => Math.max(0, value - 1))} className="min-h-11 rounded-xl border border-white/10 px-4 transition hover:border-brass/40 disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
        <span aria-live="polite" className="min-w-20 text-center">Página {page + 1} de {pages}</span>
        <button type="button" disabled={page + 1 >= pages} onClick={() => setPage(value => Math.min(pages - 1, value + 1))} className="min-h-11 rounded-xl border border-white/10 px-4 transition hover:border-brass/40 disabled:cursor-not-allowed disabled:opacity-40">Próxima</button>
      </div>
    </div>
  </>);
}
