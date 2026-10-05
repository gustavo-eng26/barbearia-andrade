import { services } from "../data/services";
import ServiceCard from "../components/ServiceCard";
export default function Services() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs tracking-[.3em] text-brass">CATÁLOGO</p>
      <h1 className="mt-3 font-display text-5xl font-bold">Serviços</h1>
      <p className="mt-3 text-sm text-ash">Valores e durações em definição com a barbearia.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">{services.map(s => <ServiceCard key={s.id} s={s} />)}</div>
    </section>
  );
}
