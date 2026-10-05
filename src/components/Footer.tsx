import { Link } from "react-router-dom";
import { business } from "../data/business";
export default function Footer() {
  return (
    <footer className="bg-coal"><div className="pole" />
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
        <div><p className="font-display text-lg font-bold uppercase tracking-widest">{business.name}</p><p className="mt-3 text-sm text-ash">{business.address}<br />{business.city} · CEP {business.cep}</p></div>
        <div><p className="text-xs tracking-widest text-brass">HORÁRIOS</p><ul className="mt-3 space-y-1 text-sm text-ash">{business.hours.map(h => <li key={h.label}>{h.label}: {h.value}</li>)}</ul></div>
        <div><p className="text-xs tracking-widest text-brass">CONTATO</p>
          <p className="mt-3 text-sm text-ash"><a className="hover:text-bone" href={`https://wa.me/${business.whatsapp}`}>WhatsApp {business.phone}</a><br /><a className="hover:text-bone" href={`https://www.instagram.com/${business.instagram.replace(/^@/, "")}/`} target="_blank" rel="noreferrer">Instagram: {business.instagram}</a></p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm"><Link to="/contato" className="text-brass hover:underline">Contato e localização →</Link><Link to="/agendar" className="text-brass hover:underline">Agendar horário →</Link></div></div>
      </div>
    </footer>
  );
}
