import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { business } from "../data/business";
import { services } from "../data/services";
import ServiceCard from "../components/ServiceCard";

const diffs = [`Desde ${business.since}`, "Ambiente com ar-condicionado", "Música e conforto na cadeira", "Foco, disciplina, execução"];
const cta = "inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-bone active:scale-[.99] sm:px-8";
const images = {
  corredor: `${import.meta.env.BASE_URL}images/corredor.webp`,
  fachada: `${import.meta.env.BASE_URL}images/fachada.webp`,
  interior: `${import.meta.env.BASE_URL}images/interior.webp`,
};

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={images.corredor} alt="" fetchpriority="high" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <div className="relative mx-auto grid min-h-[min(760px,calc(100svh-4rem))] max-w-6xl items-center gap-8 px-4 py-12 sm:gap-10 sm:px-5 sm:py-16 md:grid-cols-[1.2fr_.8fr] md:py-20">
          <div className="grid gap-6">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tracking-[.3em] text-brass sm:text-xs sm:tracking-[.4em]">DESDE {business.since} · {business.city.toUpperCase()}</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="font-display text-[clamp(2.75rem,11vw,4.5rem)] font-bold leading-[.98] tracking-tight">Barbearia <span className="text-brass">Andrade</span></motion.h1>
            <p className="font-display text-xl leading-snug text-bone/80 sm:text-2xl">{business.slogan}</p>
            <p className="text-sm leading-6 text-ash">{business.tagline}</p>
            <div className="flex flex-wrap items-center gap-4"><Link to="/agendar" className={cta}>AGENDAR HORÁRIO</Link><span className="text-sm text-ash">★ {business.rating} · {business.reviews} avaliações</span></div>
          </div>
          <motion.img initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} src={images.fachada} alt="Fachada da Barbearia Andrade com o tradicional poste de barbeiro" width={900} height={1200} fetchpriority="high" className="block aspect-[16/9] w-full rounded-2xl border border-brass/30 object-cover object-center shadow-xl md:aspect-[3/4] md:max-w-sm md:justify-self-end md:rounded-t-[999px]" />
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
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-5 sm:py-24" aria-labelledby="h-serv"><h2 id="h-serv" className="font-display text-4xl font-bold">Serviços</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">{services.map(s => <ServiceCard key={s.id} s={s} />)}</div></section>
      <section className="relative overflow-hidden border-t border-white/10 py-28 text-center">
        <img loading="lazy" src={images.fachada} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="relative px-5"><h2 className="font-display text-4xl font-bold sm:text-5xl">Pronto para o seu próximo corte?</h2><Link to="/agendar" className={`${cta} mt-8 inline-block`}>AGENDAR HORÁRIO</Link></div>
      </section>
    </>
  );
}
