import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { business } from "../data/business";
import { useCustomerAuth } from "../services/customerAuth";

const links = [["/", "Início"], ["/sobre", "Sobre"], ["/servicos", "Serviços"], ["/contato", "Contato"]] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { customer, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const cls = ({ isActive }: { isActive: boolean }) => `text-sm transition hover:text-brass ${isActive ? "text-brass" : "text-bone/80"}`;
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);
  const signOut = () => { logout(); setOpen(false); setAccountOpen(false); navigate("/"); };
  const accountLinks = (
    <>
      <Link to="/meus-agendamentos" onClick={() => { setAccountOpen(false); setOpen(false); }} className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm text-bone/80 hover:bg-white/5 hover:text-brass">Meus agendamentos</Link>
      <Link to="/meus-agendamentos?aba=dados" onClick={() => { setAccountOpen(false); setOpen(false); }} className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm text-bone/80 hover:bg-white/5 hover:text-brass">Meus dados</Link>
      <button type="button" onClick={signOut} className="flex min-h-11 w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-bone/80 hover:bg-white/5 hover:text-brass">Sair</button>
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
        <button type="button" className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-bone transition hover:border-brass/50 hover:bg-white/5 active:scale-95 md:hidden" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
          <span className="relative h-4 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 rounded bg-current transition-transform duration-200 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-[14px] h-0.5 w-5 rounded bg-current transition-transform duration-200 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>
      {createPortal(<AnimatePresence>
        {open && <motion.div className="fixed inset-x-0 bottom-0 top-16 z-50 bg-black/60 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.nav id="mobile-navigation" aria-label="Menu mobile" className="flex max-h-full flex-col gap-1 overflow-y-auto border-t border-white/10 bg-coal px-4 pb-8 pt-3 shadow-2xl" initial={{ y: -12 }} animate={{ y: 0 }} exit={{ y: -12 }} transition={{ duration: 0.18 }} onClick={event => event.stopPropagation()}>
            {links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)} className={(s) => `${cls(s)} flex min-h-12 items-center rounded-xl px-4 py-3 active:bg-white/10`}>{label}</NavLink>)}
            <NavLink to="/agendar" onClick={() => setOpen(false)} className="mt-2 flex min-h-12 items-center justify-center rounded-full bg-brass px-4 py-3 text-sm font-semibold text-ink transition hover:bg-bone active:scale-[.99]">Agendar horário</NavLink>
            {customer ? (
              <div className="mt-3 border-t border-white/10 pt-2">
                <button type="button" onClick={() => setAccountOpen(!accountOpen)} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-bone">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-brass/50 bg-brass/10 font-semibold text-brass">{customer.name.trim().charAt(0).toUpperCase()}</span>
                  {customer.name.trim().split(/\s+/)[0]}
                </button>
                {accountOpen && <div className="ml-8">{accountLinks}</div>}
              </div>
            ) : <NavLink to="/entrar" onClick={() => setOpen(false)} className={(s) => `${cls(s)} mt-2 flex min-h-12 items-center gap-2 rounded-xl px-4 py-3 active:bg-white/10`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-1.5a7 7 0 0 1 14 0V21" /></svg>Entrar</NavLink>}
          </motion.nav>
        </motion.div>}
      </AnimatePresence>, document.body)}
    </header>
  );
}
