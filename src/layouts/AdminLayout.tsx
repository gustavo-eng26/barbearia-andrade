import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { authMode, logout } from "../services/auth";
import { ExclusiveBanner, Notice } from "../components/admin/AdminUI";

const groups = [
  { title: "", items: [["dashboard", "Dashboard", "grid"]] },
  { title: "AGENDA", items: [["agenda", "Agenda", "calendar"]] },
  { title: "GESTÃO", items: [["agendamentos", "Agendamentos", "clock"], ["servicos", "Serviços", "scissors"], ["barbeiros", "Barbeiros", "users"]] },
  { title: "SISTEMA", items: [["configuracoes", "Configurações", "settings"]] },
] as const;

function NavigationIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    scissors: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="m8.2 8.2 11.6 11.6M14.5 9.5 20 4M8.2 15.8l3.5-3.5" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6m3-3h-6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.5.9L16 20.7h-3l-.4-1.8a8 8 0 0 1-1.5-.9l-1.7.6L8 16.2l1.4-1.1a7 7 0 0 1 0-1.8L8 12.2l1.4-2.4 1.7.6a8 8 0 0 1 1.5-.9L13 7.7h3l.4 1.8a8 8 0 0 1 1.5.9l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1-.2 1.7Z" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">{paths[name]}</svg>;
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const nav = useNavigate();

  return (
    <div className="admin-shell min-h-screen bg-ink text-bone md:grid md:grid-cols-[auto_minmax(0,1fr)]">
      {open && <button type="button" aria-label="Fechar menu" className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[min(82vw,280px)] flex-col border-r border-white/10 bg-coal px-3 py-5 shadow-2xl transition-[width,transform] duration-200 md:sticky md:top-0 md:h-screen ${collapsed ? "md:w-[76px]" : "md:w-64"} md:translate-x-0 md:shadow-none ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className={`mb-8 flex items-center ${collapsed ? "md:justify-center" : "justify-between"}`}>
          <Link to="/" onClick={() => setOpen(false)} className={`min-w-0 font-display text-lg font-bold ${collapsed ? "md:hidden" : ""}`}>Barbearia Andrade</Link>
          <button type="button" aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"} title={collapsed ? "Expandir menu" : "Recolher menu"} onClick={() => setCollapsed(!collapsed)} className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl text-ash transition hover:bg-white/5 hover:text-bone md:grid">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5"><path d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} /></svg>
          </button>
          <button type="button" aria-label="Fechar menu" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-xl text-ash hover:bg-white/5 md:hidden">×</button>
        </div>
        <p className={`mb-6 px-3 text-[10px] tracking-widest text-brass ${collapsed ? "md:hidden" : ""}`}>PAINEL ADMINISTRATIVO</p>
        <nav aria-label="Painel" className="flex-1 space-y-5 overflow-y-auto">
          {groups.map(group => <div key={group.title || "principal"}>
            {group.title && <p className={`mb-2 px-3 text-[10px] font-semibold tracking-widest text-ash ${collapsed ? "md:hidden" : ""}`}>{group.title}</p>}
            <div className="space-y-1">
              {group.items.map(([to, label, icon]) => <NavLink key={to} to={`/admin/${to}`} title={collapsed ? label : undefined} onClick={() => setOpen(false)} className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition active:scale-[.99] ${collapsed ? "md:justify-center md:px-0" : ""} ${isActive ? "bg-brass/15 font-medium text-brass" : "text-ash hover:bg-white/5 hover:text-bone"}`}>
                <NavigationIcon name={icon} /><span className={collapsed ? "md:hidden" : ""}>{label}</span>
              </NavLink>)}
            </div>
          </div>)}
        </nav>
        <button type="button" onClick={() => { logout(); nav("/admin"); }} title={collapsed ? "Sair" : undefined} className={`mt-5 flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-ash transition hover:bg-white/5 hover:text-bone ${collapsed ? "md:justify-center md:px-0" : ""}`}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5 shrink-0"><path d="M10 17l5-5-5-5M15 12H3m9-8h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" /></svg>
          <span className={collapsed ? "md:hidden" : ""}>Sair</span>
        </button>
      </aside>
      <main className="min-w-0">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-white/10 bg-coal/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(true)} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 text-bone transition hover:border-brass/50 hover:bg-white/5 md:hidden">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="min-w-0"><p className="truncate text-sm font-semibold">Painel administrativo</p><p className="hidden text-xs text-ash sm:block">Barbearia Andrade · Lima Duarte, MG</p></div>
          </div>
        </header>
        <div className="min-w-0 p-4 sm:p-6 lg:p-8">
          <ExclusiveBanner />
          {authMode === "demo" && <Notice>Modo demonstração: acesso com usuário <strong>admin</strong> e senha <strong>admin</strong>. Não há segurança real até existir um backend.</Notice>}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
