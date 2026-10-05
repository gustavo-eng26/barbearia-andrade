import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { authMode, logout } from "../services/auth";
import { ExclusiveBanner, Notice } from "../components/admin/AdminUI";

const groups = [
  { title: "", items: [["dashboard", "Dashboard"]] },
  { title: "AGENDA", items: [["agenda", "Agenda"]] },
  { title: "GESTÃO", items: [["agendamentos", "Agendamentos"], ["servicos", "Serviços"], ["barbeiros", "Barbeiros"]] },
  { title: "SISTEMA", items: [["configuracoes", "Configurações"]] },
];
export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <div className="flex items-center justify-between border-b border-white/10 bg-coal p-4 md:hidden">
        <span className="font-display font-bold">Painel Administrativo</span>
        <button aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
      </div>
      <aside className={`${open ? "block" : "hidden"} border-r border-white/10 bg-coal p-5 md:block`}>
        <Link to="/" className="hidden font-display text-lg font-bold md:block">Barbearia Andrade</Link>
        <p className="mb-6 hidden text-[10px] tracking-widest text-brass md:block">PAINEL ADMINISTRATIVO</p>
        <nav aria-label="Painel" className="space-y-5">
          {groups.map(g => (<div key={g.title}>{g.title && <p className="mb-1 px-3 text-[10px] tracking-widest text-ash">{g.title}</p>}
            {g.items.map(([to, label]) => <NavLink key={to} to={`/admin/${to}`} onClick={() => setOpen(false)} className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm ${isActive ? "bg-white/10 text-bone" : "text-ash hover:text-bone"}`}>{label}</NavLink>)}</div>))}
        </nav>
        <button onClick={() => { logout(); nav("/admin"); }} className="mt-8 px-3 text-sm text-ash hover:text-bone">Sair</button>
      </aside>
      <main className="min-w-0 p-5 sm:p-8">
        <ExclusiveBanner />
        {authMode === "demo" && <Notice>Modo demonstração: acesso com usuário <strong>admin</strong> e senha <strong>admin</strong>. Não há segurança real até existir um backend.</Notice>}
        <Outlet />
      </main>
    </div>
  );
}
