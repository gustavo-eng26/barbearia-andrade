import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { business } from "../data/business";
import { useCustomerAuth } from "../services/customerAuth";

const links = [["/", "Início"], ["/sobre", "Sobre"], ["/servicos", "Serviços"], ["/contato", "Contato"]] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { customer, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const cls = ({ isActive }: { isActive: boolean }) => `text-sm transition hover:text-brass ${isActive ? "text-brass" : "text-bone/80"}`;
  const signOut = () => { logout(); setOpen(false); setAccountOpen(false); navigate("/"); };
  const accountLinks = (
    <>
      <Link to="/meus-agendamentos" onClick={() => { setAccountOpen(false); setOpen(false); }} className="block rounded-lg px-3 py-2 text-sm text-bone/80 hover:bg-white/5 hover:text-brass">Meus agendamentos</Link>
      <Link to="/meus-agendamentos?aba=dados" onClick={() => { setAccountOpen(false); setOpen(false); }} className="block rounded-lg px-3 py-2 text-sm text-bone/80 hover:bg-white/5 hover:text-brass">Meus dados</Link>
      <button type="button" onClick={signOut} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-bone/80 hover:bg-white/5 hover:text-brass">Sair</button>
    </>
  );
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="font-display text-lg font-bold uppercase tracking-widest">{business.name}</Link>
        <nav aria-label="Principal" className="hidden items-center gap-7 md:flex">
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"} className={cls}>{label}</NavLink>)}
          <NavLink to="/agendar" className="rounded-full bg-brass px-5 py-2 text-sm font-semibold text-ink transition hover:bg-bone">Agendar horário</NavLink>
          {customer ? (
            <div className="relative">
              <button type="button" aria-expanded={accountOpen} onClick={() => setAccountOpen(!accountOpen)} className="flex items-center gap-2 text-sm text-bone/90 hover:text-brass">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-brass/50 bg-brass/10 font-semibold text-brass">{customer.name.trim().charAt(0).toUpperCase()}</span>
                {customer.name.trim().split(/\s+/)[0]}
              </button>
              {accountOpen && <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-white/10 bg-coal p-2 shadow-xl">{accountLinks}</div>}
            </div>
          ) : <NavLink to="/entrar" className={`${cls({ isActive: false })} inline-flex items-center gap-2`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-1.5a7 7 0 0 1 14 0V21" /></svg>Entrar</NavLink>}
        </nav>
        <button className="md:hidden" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
      </div>
      {open && (
        <nav aria-label="Menu mobile" className="flex flex-col gap-1 border-t border-white/10 bg-coal p-4 md:hidden">
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)} className={(s) => `${cls(s)} rounded-lg px-3 py-3`}>{label}</NavLink>)}
          <NavLink to="/agendar" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-brass">Agendar horário</NavLink>
          {customer ? (
            <div className="border-t border-white/10 pt-2">
              <button type="button" onClick={() => setAccountOpen(!accountOpen)} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-bone">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-brass/50 bg-brass/10 font-semibold text-brass">{customer.name.trim().charAt(0).toUpperCase()}</span>
                {customer.name.trim().split(/\s+/)[0]}
              </button>
              {accountOpen && <div className="ml-8">{accountLinks}</div>}
            </div>
          ) : <NavLink to="/entrar" onClick={() => setOpen(false)} className={(s) => `${cls(s)} flex items-center gap-2 rounded-lg px-3 py-3`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-1.5a7 7 0 0 1 14 0V21" /></svg>Entrar</NavLink>}
        </nav>
      )}
    </header>
  );
}
