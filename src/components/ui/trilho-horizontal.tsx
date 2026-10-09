"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * VITRINE QUE ANDA DE LADO. Na tela larga a seção fica presa e a rolagem
 * para baixo vira movimento para o lado (GSAP + ScrollTrigger). No celular
 * é a rolagem lateral do próprio dedo, com encaixe em cada cartão: prender a
 * tela no toque atrapalha mais do que encanta.
 */
export function TrilhoHorizontal({ cabeca, children }: { cabeca: ReactNode; children: ReactNode }) {
  const secao = useRef<HTMLDivElement>(null);
  const trilho = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = trilho.current;
      const caixa = secao.current;
      if (!el || !caixa) return;
      const distancia = () => Math.max(0, el.scrollWidth - el.clientWidth);
      const animacao = gsap.to(el, {
        x: () => -distancia(),
        ease: "none",
        scrollTrigger: {
          trigger: caixa,
          start: "top top",
          end: () => `+=${distancia()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        animacao.scrollTrigger?.kill();
        animacao.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={secao} className="flex flex-col justify-center lg:h-svh lg:overflow-hidden">
      <div className="recipiente">{cabeca}</div>
      <div
        ref={trilho}
        className="trilho mt-10 flex snap-x pl-[calc(max(0px,(100vw-1320px)/2)+clamp(1.25rem,4vw,3rem))] scroll-pl-[calc(max(0px,(100vw-1320px)/2)+clamp(1.25rem,4vw,3rem))] snap-mandatory gap-4 overflow-x-auto pb-6 [scrollbar-width:none] lg:snap-none lg:gap-5 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}
