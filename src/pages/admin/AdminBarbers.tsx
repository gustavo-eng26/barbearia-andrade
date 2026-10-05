import { barbers } from "../../data/barbers";
import { NeedsBackend, Notice, PageHeader } from "../../components/admin/AdminUI";
export default function AdminBarbers() {
  return (<>
    <PageHeader title="Barbeiros" />
    <Notice>Nomes são placeholders. Cadastro, foto, horários, disponibilidade e credenciais dependem de backend; credenciais nunca aparecem nesta listagem.</Notice>
    <div className="mb-4"><NeedsBackend label="+ Adicionar barbeiro" /></div>
    <div className="grid gap-3 sm:grid-cols-3">{barbers.map(b => <article key={b.id} className="rounded-xl border border-white/10 bg-coal p-5"><div className="mb-3 grid h-14 w-14 place-items-center rounded-full border border-dashed border-white/20 text-[9px] text-ash">FOTO</div><h2 className="font-semibold">{b.name}</h2><p className="text-xs text-ash">{b.role}</p><div className="mt-4 flex gap-2"><NeedsBackend label="Editar" /><NeedsBackend label="Desativar" /></div></article>)}</div>
  </>);
}
