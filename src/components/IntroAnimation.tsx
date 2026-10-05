import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { business } from "../data/business";

interface Props { logoSrc?: string | null; duration?: number }
const KEY = "andrade:intro-seen";

export default function IntroAnimation({ logoSrc = business.logo, duration = 3200 }: Props) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => !sessionStorage.getItem(KEY));
  const close = () => { sessionStorage.setItem(KEY, "1"); setShow(false); };
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(close, reduce ? 800 : duration);
    return () => clearTimeout(t);
  }, [show, reduce, duration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div role="dialog" aria-label="Abertura" className="fixed inset-0 z-[100] grid place-items-center bg-ink"
          exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.7 }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 45%, rgba(185,128,63,.25), transparent 55%)" }} />
          <div className="relative text-center">
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.2 }} className="mx-auto mb-8 h-px w-40 bg-brass" />
            {logoSrc && <motion.img src={logoSrc} alt="Barbearia Andrade" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.3 }} className="mx-auto mb-8 h-24 rounded-2xl bg-white p-2 shadow-[0_0_60px_rgba(201,162,74,.35)] sm:h-32" />}
            <motion.p initial={{ opacity: 0, letterSpacing: "0.1em" }} animate={{ opacity: 1, letterSpacing: "0.5em" }} transition={{ duration: 1.2, delay: 0.5 }} className="text-xs text-brass">BEM-VINDO</motion.p>
            <div className="overflow-hidden">
              <motion.h1 initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 1, ease: [0.22, 1, 0.36, 1] }} className="mt-4 font-display text-2xl font-bold uppercase tracking-wide sm:text-4xl">{business.name}</motion.h1>
            </div>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1.4 }} className="mx-auto mt-8 h-px w-40 bg-brass" />
          </div>
          <button onClick={close} className="absolute bottom-6 right-6 text-xs text-ash hover:text-bone">Pular</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
