"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { acompanharPercurso } from "@/lib/rolagem-presa";

/** Onde a vitrine fica presa e anda de lado: tela larga, sem "menos movimento". */
const PRESA = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * VITRINE QUE ANDA DE LADO. Na tela larga a seção fica presa (sticky, dentro
 * de um percurso que tem a altura da tela mais a largura que sobra do
 * trilho) e a rolagem para baixo vira movimento para o lado. No celular, e
 * com "menos movimento", é a rolagem lateral do próprio trilho, com encaixe
 * em cada cartão: prender a tela no toque atrapalha mais do que encanta.
 *
 * Sticky no lugar do `pin` do GSAP desde 12/10/2026 (`lib/rolagem-presa.ts`).
 */
export function TrilhoHorizontal({ cabeca, children }: { cabeca: ReactNode; children: ReactNode }) {
  const percurso = useRef<HTMLDivElement>(null);
  const secao = useRef<HTMLDivElement>(null);
  const trilho = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const caixa = percurso.current;
    const presa = secao.current;
    const el = trilho.current;
    if (!caixa || !presa || !el) return;
    const midia = window.matchMedia(PRESA);
    let desligar: (() => void) | undefined;
    let distancia = 0;
    let progresso = 0;
    let escrito = NaN;

    const aplicar = () => {
      const x = Math.round(-distancia * progresso * 10) / 10;
      if (x === escrito) return;
      escrito = x;
      el.style.transform = `translate3d(${x}px, 0, 0)`;
    };
    const medir = () => {
      distancia = Math.max(0, el.scrollWidth - el.clientWidth);
      caixa.style.setProperty("--distancia", `${distancia}px`);
    };
    const soltar = () => {
      desligar?.();
      desligar = undefined;
      delete caixa.dataset.preso;
      caixa.style.removeProperty("--distancia");
      el.style.transform = "";
      escrito = NaN;
    };
    const prender = () => {
      soltar();
      if (!midia.matches) return;
      caixa.dataset.preso = "";
      medir();
      desligar = acompanharPercurso(
        caixa,
        presa,
        (p) => {
          progresso = p;
          aplicar();
        },
        0.6,
      );
    };
    // a tela mudou de largura: a distância muda mesmo sem rolar
    const aoRedimensionar = () => {
      if (!desligar) return;
      medir();
      aplicar();
    };

    prender();
    midia.addEventListener("change", prender);
    window.addEventListener("resize", aoRedimensionar);
    return () => {
      midia.removeEventListener("change", prender);
      window.removeEventListener("resize", aoRedimensionar);
      soltar();
    };
  }, []);

  return (
    <div ref={percurso} className="group/percurso data-[preso]:h-[calc(100svh+var(--distancia,0px))]">
      <div
        ref={secao}
        className="flex flex-col justify-center group-data-[preso]/percurso:sticky group-data-[preso]/percurso:top-0 group-data-[preso]/percurso:h-svh group-data-[preso]/percurso:overflow-hidden"
      >
        <div className="recipiente">{cabeca}</div>
        <div
          ref={trilho}
          className="trilho mt-10 flex snap-x snap-mandatory scroll-pl-[calc(max(0px,(100vw-1320px)/2)+clamp(1.25rem,4vw,3rem))] gap-4 overflow-x-auto pb-6 pl-[calc(max(0px,(100vw-1320px)/2)+clamp(1.25rem,4vw,3rem))] [scrollbar-width:none] lg:gap-5 group-data-[preso]/percurso:snap-none group-data-[preso]/percurso:overflow-visible group-data-[preso]/percurso:pb-0 group-data-[preso]/percurso:will-change-transform [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
