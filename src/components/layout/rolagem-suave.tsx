"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { registrarRolagem } from "@/lib/rolagem";

/**
 * ROLAGEM SUAVE (Lenis) amarrada ao relógio do GSAP, para as cenas presas à
 * rolagem (o mergulho da abertura, o Raio-X do notebook) andarem no mesmo
 * quadro que a página. No toque o Lenis não suaviza (o celular já rola
 * bem), e com "menos movimento" ele nem liga.
 *
 * Decisão de 09/10/2026: o Vitor pediu o nível de animação do protótipo que
 * virou a Prime Collection (three, GSAP, Lenis). O preço é o GSAP e o Lenis
 * em toda página (~40 KB gzip); o 3D, que é o pesado, entra por
 * `next/dynamic` só onde aparece.
 */
export function RolagemSuave() {
  const caminho = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, anchors: { offset: -80 }, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const quadro = (tempo: number) => lenis.raf(tempo * 1000);
    gsap.ticker.add(quadro);
    gsap.ticker.lagSmoothing(0);
    registrarRolagem(lenis);
    return () => {
      gsap.ticker.remove(quadro);
      registrarRolagem(null);
      lenis.destroy();
    };
  }, []);

  // Página nova começa do topo e recalcula as cenas presas à rolagem.
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => window.clearTimeout(id);
  }, [caminho]);

  return null;
}
