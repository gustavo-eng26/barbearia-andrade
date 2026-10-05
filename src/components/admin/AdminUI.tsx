import type { ReactNode } from "react";
export const PageHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <header className="mb-8"><h1 className="font-display text-3xl font-bold">{title}</h1>{subtitle && <p className="mt-1 text-sm text-ash">{subtitle}</p>}</header>
);
export const Notice = ({ children }: { children: ReactNode }) => (
  <p role="note" className="mb-6 rounded-lg border border-brass/40 bg-brass/10 px-4 py-3 text-xs text-brass">{children}</p>
);
export const NeedsBackend = ({ label }: { label: string }) => (
  <button disabled title="Depende de backend" className="cursor-not-allowed rounded-full border border-white/15 px-4 py-2 text-xs text-ash">{label}</button>
);
export const ExclusiveBanner = () => (
  <div role="note" className="attn mb-6 flex items-center gap-3 rounded-lg border border-brass bg-brass/10 px-4 py-3 text-xs font-bold tracking-widest text-brass">
    <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brass opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brass" /></span>
    ÁREA EXCLUSIVA PARA A EQUIPE DA BARBEARIA ANDRADE
  </div>
);
export const input = "mt-2 w-full rounded-xl border border-white/10 bg-ink p-3 text-sm disabled:opacity-50";
