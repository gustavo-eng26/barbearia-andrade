import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <section className="mx-auto grid min-h-[65vh] max-w-xl place-items-center px-5 py-16 text-center">
      <div>
        <span aria-hidden="true" className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-brass/30 bg-brass/10 text-brass"><svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3" /><path d="M12 14v3" /></svg></span>
        <h1 className="mt-6 font-display text-4xl font-bold">Acesso negado</h1>
        <p className="mt-3 text-ash">Você não tem permissão para acessar esta área.</p>
        <Link to="/" className="mt-8 inline-block rounded-full bg-[#d9a441] px-7 py-3 text-sm font-semibold text-ink transition hover:bg-bone">Voltar ao início</Link>
      </div>
    </section>
  );
}
