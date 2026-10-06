import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { business } from "../data/business";
import { services } from "../data/services";
import ServiceCard from "../components/ServiceCard";

const diffs = [`Desde ${business.since}`, "Ambiente com ar-condicionado", "Música e conforto na cadeira", "Foco, disciplina, execução"];
const cta = "rounded-full bg-brass px-8 py-4 text-sm font-semibold text-ink transition hover:bg-bone";
const images = {
  corredor: `${import.meta.env.BASE_URL}images/corredor.webp`,
  fachada: `${import.meta.env.BASE_URL}images/fachada.webp`,
  interior: `${import.meta.env.BASE_URL}images/interior.webp`,
};

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={images.corredor} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <div className="relative mx-auto grid min-h-[84vh] max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-[1.2fr_.8fr]">
          <div className="grid gap-6">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs tracking-[.4em] text-brass">DESDE {business.since} · {business.city.toUpperCase()}</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="font-display text-5xl font-bold leading-[1.02] sm:text-7xl">Barbearia <span className="text-brass">Andrade</span></motion.h1>
            <p className="font-display text-xl text-bone/80 sm:text-2xl">{business.slogan}</p>
            <p className="text-sm text-ash">{business.tagline}</p>
            <div className="flex flex-wrap items-center gap-4"><Link to="/agendar" className={cta}>AGENDAR HORÁRIO</Link><span className="text-sm text-ash">★ {business.rating} · {business.reviews} avaliações</span></div>
          </div>
          <motion.img initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} src={images.fachada} alt="Fachada da Barbearia Andrade com o tradicional poste de barbeiro" width={900} height={1200} className="hidden aspect-[3/4] w-full max-w-sm justify-self-end rounded-t-[999px] border border-brass/40 object-cover shadow-2xl md:block" />
        </div>
      </section>
      <div className="pole" aria-hidden="true" />
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-2" aria-labelledby="h-sobre">
        <img loading="lazy" src={images.interior} alt="Interior da barbearia com duas cadeiras e capas com a marca Andrade" width={900} height={1200} className="aspect-[4/5] w-full rounded-2xl border border-white/10 object-cover" />
        <div><p className="text-xs tracking-[.3em] text-brass">SOBRE</p><h2 id="h-sobre" className="mt-3 font-display text-4xl font-bold">Tradição que o tempo só afia</h2>
          <p className="mt-5 leading-7 text-ash">Desde {business.since}, a Barbearia Andrade cuida de barba, cabelo e bigode em Lima Duarte. [INSERIR TEXTO DA HISTÓRIA]</p>
          <Link to="/sobre" className="mt-6 inline-block text-sm text-brass hover:underline">Conhecer a barbearia →</Link></div>
      </section>
      <section className="border-y border-white/10 bg-coal" aria-label="Diferenciais"><ul className="mx-auto grid max-w-6xl gap-6 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">{diffs.map(d => <li key={d} className="border-l-2 border-wood pl-4 text-sm">{d}</li>)}</ul></section>
      <section className="mx-auto max-w-6xl px-5 py-24" aria-labelledby="h-serv"><h2 id="h-serv" className="font-display text-4xl font-bold">Serviços</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">{services.map(s => <ServiceCard key={s.id} s={s} />)}</div></section>
      <section className="relative overflow-hidden border-t border-white/10 py-28 text-center">
        <img loading="lazy" src={images.fachada} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="relative px-5"><h2 className="font-display text-4xl font-bold sm:text-5xl">Pronto para o seu próximo corte?</h2><Link to="/agendar" className={`${cta} mt-8 inline-block`}>AGENDAR HORÁRIO</Link></div>
      </section>
    </>
  );
}
