"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * As miniaturas da galeria da ficha (13/10/2026). O trilho das fotos vem
 * pronto do servidor e já arrasta sozinho (rolagem lateral com encaixe):
 * aqui só se acompanha qual foto está na tela e se leva o trilho até a
 * escolhida. As fotos das miniaturas também chegam do servidor.
 */
export function MiniaturasDaVitrine({ trilho, fotos }: { trilho: string; fotos: ReactNode[] }) {
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    const el = document.getElementById(trilho);
    if (!el) return;
    // o estado só muda quando a foto do meio troca; o resto da rolagem não renderiza nada
    const medir = () => setAtual(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    el.addEventListener("scroll", medir, { passive: true });
    return () => el.removeEventListener("scroll", medir);
  }, [trilho]);

  const irPara = (i: number) => {
    const el = document.getElementById(trilho);
    if (!el) return;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduzido ? "auto" : "smooth" });
  };

  return (
    <div className="mt-3 flex gap-2" role="group" aria-label="Fotos do produto">
      {fotos.map((foto, i) => (
        <button
          key={i}
          type="button"
          onClick={() => irPara(i)}
          aria-label={`Foto ${i + 1} de ${fotos.length}`}
          aria-pressed={atual === i}
          aria-controls={trilho}
          className={cn(
            "w-16 rounded-2xl border bg-fundo-2 transition-[border-color,opacity] duration-300",
            atual === i ? "border-destaque" : "border-linha opacity-60 hover:opacity-100",
          )}
        >
          {foto}
        </button>
      ))}
    </div>
  );
}
