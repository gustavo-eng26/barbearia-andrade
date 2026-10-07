import { Link } from "react-router-dom";
import { business } from "../data/business";
const gallery = [["fachada", "Fachada com o poste de barbeiro", "3/4"], ["corredor", "Recepção com sofá e quadros: foco, disciplina, execução", "4/3"], ["interior", "Cadeiras e bancada de atendimento", "3/4"]] as const;
export default function About() {
  return (
    <article className="mx-auto max-w-5xl px-5 py-20">
      <p className="text-xs tracking-[.3em] text-brass">SOBRE · DESDE {business.since}</p>
      <div className="mt-4 grid items-center gap-10 md:grid-cols-[1fr_1.1fr]">
        <img src={business.logo ?? ""} alt="Logo da Barbearia Andrade, desde 2012" width={400} height={400} fetchPriority="high" className="mx-auto aspect-square w-full max-w-[15rem] rounded-2xl bg-white p-3 object-contain shadow-[0_0_50px_rgba(201,162,74,.16)] md:max-w-none" />
        <div><h1 className="font-display text-[clamp(2.5rem,10vw,3rem)] font-bold leading-tight">{business.name}</h1><p className="mt-2 font-display text-xl text-brass">{business.slogan}</p>
          <p className="mt-5 leading-7 text-ash">[INSERIR HISTÓRIA / FILOSOFIA DA BARBEARIA]</p>
          <p className="mt-6 text-sm text-ash">{business.address}, {business.city}<br />Instagram {business.instagram}</p></div>
      </div>
      <h2 className="mt-20 font-display text-3xl font-bold">O ambiente</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">{gallery.map(([n, alt]) => <figure key={n} className={n === "corredor" ? "sm:col-span-3" : ""}><img loading="lazy" src={`${import.meta.env.BASE_URL}images/${n}.webp`} alt={alt} width={n === "corredor" ? 1200 : 900} height={n === "corredor" ? 600 : 1200} className={`w-full rounded-2xl border border-white/10 object-cover shadow-lg ${n === "corredor" ? "aspect-[16/8]" : "aspect-[3/4]"}`} /></figure>)}</div>
      <div className="pole mt-16 rounded-full" aria-hidden="true" />
      <Link to="/agendar" className="mt-10 inline-block rounded-full bg-brass px-8 py-4 text-sm font-semibold text-ink hover:bg-bone">AGENDAR HORÁRIO</Link>
    </article>
  );
}
