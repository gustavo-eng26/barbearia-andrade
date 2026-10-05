import { services } from "../../data/services";
import { NeedsBackend, Notice, PageHeader } from "../../components/admin/AdminUI";
export default function AdminServices() {
  return (<>
    <PageHeader title="Serviços" subtitle="Catálogo da barbearia" />
    <Notice>Nomes, preços e durações são placeholders. Criar, editar e desativar dependem de backend.</Notice>
    <div className="mb-4"><NeedsBackend label="+ Novo serviço" /></div>
    <ul className="divide-y divide-white/10 rounded-xl border border-white/10 bg-coal">{services.map(s => <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"><span><b>{s.name}</b><span className="block text-xs text-ash">{s.duration} · {s.price}</span></span><span className="flex gap-2"><NeedsBackend label="Editar" /><NeedsBackend label="Desativar" /></span></li>)}</ul>
  </>);
}
