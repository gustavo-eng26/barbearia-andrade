import { appointments } from "../../data/appointments";
import { barbers } from "../../data/barbers";
import { Notice, PageHeader } from "../../components/admin/AdminUI";
const hours = Array.from({ length: 10 }, (_, i) => `${String(9 + i).padStart(2, "0")}:00`);
export default function Agenda() {
  return (<>
    <PageHeader title="Agenda" subtitle="Visão diária por barbeiro (visão semanal: preparada, não implementada)" />
    <Notice>Dados fictícios. Disponibilidade real depende de banco de dados.</Notice>
    <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-sm"><thead className="text-left text-xs text-ash"><tr><th className="p-2">Hora</th>{barbers.map(b => <th key={b.id} className="p-2">{b.name}</th>)}</tr></thead>
      <tbody>{hours.map(h => <tr key={h} className="border-t border-white/10"><td className="p-2 text-ash">{h}</td>
        {barbers.map(b => { const a = appointments.find(x => x.barber === b.id && x.time === h); return <td key={b.id} className="p-2">{a ? <span className="block rounded bg-brass/15 px-2 py-1 text-xs">{a.client} · {a.service}</span> : <span className="text-xs text-white/20">livre</span>}</td>; })}</tr>)}</tbody></table></div>
  </>);
}
