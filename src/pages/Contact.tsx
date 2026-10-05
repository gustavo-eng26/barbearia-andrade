import { Link } from "react-router-dom";
import { business } from "../data/business";

const instagramHandle = business.instagram.replace(/^@/, "");
const instagramUrl = `https://www.instagram.com/${instagramHandle}/`;
const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de falar com a Barbearia Andrade.")}`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address}, ${business.city}, ${business.cep}`)}`;

export default function Contact() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10 bg-coal">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,164,65,0.12),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <p className="text-xs tracking-[.3em] text-brass">FALE COM A GENTE</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold sm:text-6xl">Contato e localização</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ash sm:text-base">
            Tire dúvidas, fale com a equipe ou encontre a Barbearia Andrade em Lima Duarte.
            Para escolher um horário, use nosso agendamento online.
          </p>
          <Link to="/agendar" className="mt-7 inline-flex rounded-full bg-brass px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-bone">
            AGENDAR HORÁRIO
          </Link>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <section aria-label="Canais de contato" className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-coal p-6 transition hover:border-brass/40 sm:p-7">
            <p className="text-xs tracking-[.2em] text-brass">WHATSAPP E TELEFONE</p>
            <h2 className="mt-3 font-display text-2xl font-bold">Fale diretamente com a barbearia</h2>
            <a href={`tel:${business.phone.replace(/[^\d+]/g, "")}`} className="mt-3 inline-block text-lg text-bone hover:text-brass">{business.phone}</a>
            <p className="mt-2 text-sm text-ash">Entre em contato para tirar dúvidas ou falar sobre seu horário.</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full border border-brass/50 px-5 py-2.5 text-sm font-semibold text-brass transition hover:bg-brass hover:text-ink">
              Chamar no WhatsApp
            </a>
          </article>

          <article className="rounded-2xl border border-white/10 bg-coal p-6 transition hover:border-brass/40 sm:p-7">
            <p className="text-xs tracking-[.2em] text-brass">INSTAGRAM</p>
            <h2 className="mt-3 font-display text-2xl font-bold">Acompanhe nosso trabalho</h2>
            <p className="mt-3 text-sm text-ash">Veja novidades e acompanhe a barbearia nas redes sociais.</p>
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-bone transition hover:text-brass">
              {business.instagram}<span aria-hidden="true">↗</span>
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          </article>
        </section>

        <section aria-labelledby="location-title" className="mt-12 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div className="rounded-2xl border border-white/10 bg-coal p-6 sm:p-8">
            <p className="text-xs tracking-[.2em] text-brass">COMO CHEGAR</p>
            <h2 id="location-title" className="mt-3 font-display text-3xl font-bold">Estamos em {business.city}</h2>
            <address className="mt-5 not-italic leading-7 text-bone/85">
              {business.name}<br />
              {business.address}<br />
              {business.city}<br />
              CEP {business.cep}
            </address>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink transition hover:bg-bone">
              Abrir rota no Google Maps
              <span aria-hidden="true" className="ml-2">↗</span>
              <span className="sr-only">(abre em nova aba)</span>
            </a>
            <p className="mt-4 text-xs leading-5 text-ash">O mapa abrirá em um serviço externo de navegação.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-coal p-6 sm:p-8">
            <p className="text-xs tracking-[.2em] text-brass">HORÁRIOS DE ATENDIMENTO</p>
            <h2 className="mt-3 font-display text-3xl font-bold">Quando nos encontrar</h2>
            <ul className="mt-6 divide-y divide-white/10">
              {business.hours.map(hours => (
                <li key={hours.label} className="flex flex-wrap justify-between gap-2 py-4 text-sm">
                  <span className="text-bone/80">{hours.label}</span>
                  <span className={hours.open ? "font-medium text-bone" : "text-ash"}>{hours.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-5 text-ash">
              Para garantir seu atendimento, consulte os horários disponíveis e faça seu agendamento online.
            </p>
            <Link to="/agendar" className="mt-5 inline-block text-sm text-brass transition hover:text-bone">Ver horários disponíveis →</Link>
          </div>
        </section>

        <aside className="mt-8 rounded-xl border border-brass/20 bg-brass/5 px-5 py-4 text-sm leading-6 text-ash">
          <span className="font-semibold text-bone">Dica:</span> ao abrir a rota, confira o endereço e as instruções atualizadas no aplicativo de mapas antes de sair.
        </aside>
      </main>
    </div>
  );
}
