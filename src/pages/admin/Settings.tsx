import { business } from "../../data/business";
import { Notice, PageHeader, input } from "../../components/admin/AdminUI";
const Field = ({ l, v }: { l: string; v?: string }) => <label className="block text-xs">{l}<input disabled defaultValue={v ?? ""} className={input} /></label>;
const Group = ({ t, children }: { t: string; children: React.ReactNode }) => <fieldset className="mb-6 rounded-xl border border-white/10 bg-coal p-5"><legend className="px-2 text-sm text-brass">{t}</legend><div className="grid gap-4 sm:grid-cols-2">{children}</div></fieldset>;
export default function Settings() {
  return (<>
    <PageHeader title="Configurações" />
    <Notice>Formulários somente leitura: salvar depende de backend e não há persistência.</Notice>
    <Group t="Informações da barbearia"><Field l="Nome" v={business.name} /><Field l="Telefone" v={business.phone} /><Field l="WhatsApp" v={business.whatsapp} /><Field l="Endereço" v={`${business.address}, ${business.city}`} /></Group>
    <Group t="Funcionamento">{business.hours.map(h => <Field key={h.label} l={h.label} v={h.value} />)}</Group>
    <Group t="Agendamento"><Field l="Tempo mínimo entre agendamentos" /><Field l="Antecedência mínima" /><Field l="Política de cancelamento" /><Field l="Limite de agendamentos" /></Group>
    <Group t="Conta"><Field l="E-mail do usuário" /><Field l="Alterar senha" /></Group>
  </>);
}
