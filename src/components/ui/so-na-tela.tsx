"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/**
 * ANIMAÇÃO INFINITA SÓ NA TELA (12/10/2026). Animação CSS em loop continua
 * contando fora da tela, e o Chrome recalculava cada uma a cada quadro
 * enquanto a página rolava ou o olho 3D desenhava (24 delas na home). Este
 * invólucro marca `data-na-tela` quando aparece, e o CSS (`.so-na-tela`)
 * pausa tudo o que anima dentro dele quando a marca não está lá.
 */
export function SoNaTela({ className, ...resto }: ComponentPropsWithoutRef<"div">) {
  const caixa = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const observador = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting) el.dataset.naTela = "";
      else delete el.dataset.naTela;
    });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);
  return <div ref={caixa} className={cn("so-na-tela", className)} {...resto} />;
}
