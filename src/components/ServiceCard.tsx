import { Link } from "react-router-dom";
import type { Service } from "../data/services";
export default function ServiceCard({ s }: { s: Service }) {
  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-coal p-6 transition hover:-translate-y-1 hover:border-brass/50">
      <h3 className="font-display text-2xl font-bold">{s.name}</h3>
      <p className="mt-2 flex-1 text-sm text-ash">{s.description}</p>
      <div className="mt-6 flex items-center justify-between text-sm"><span className="text-ash">{s.duration}</span><span className="font-display text-xl text-brass">{s.price}</span></div>
      <Link to={`/agendar?servico=${s.id}`} className="mt-5 rounded-full border border-brass py-2.5 text-center text-sm font-semibold text-brass transition hover:bg-brass hover:text-ink">AGENDAR</Link>
    </article>
  );
}
