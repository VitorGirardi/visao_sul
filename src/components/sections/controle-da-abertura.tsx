"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { estadoDaAbertura, podeUsar3D } from "@/lib/abertura";

/**
 * Prende a abertura na tela enquanto a pessoa rola 170% da altura e
 * transforma essa rolagem no progresso do mergulho (0 a 1). O progresso vai
 * para a cena 3D (`estadoDaAbertura`) e para o CSS (`--p` na seção), que
 * apaga o texto e acende a chegada. Também leva o mouse para o olho seguir.
 */
export function ControleDaAbertura({ alvo }: { alvo: string }) {
  useEffect(() => {
    const secao = document.getElementById(alvo);
    if (!secao) return;
    estadoDaAbertura.portal = secao;

    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      estadoDaAbertura.ponteiro.x = (e.clientX / window.innerWidth) * 2 - 1;
      estadoDaAbertura.ponteiro.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", mover, { passive: true });

    let gatilho: ScrollTrigger | undefined;
    if (podeUsar3D()) {
      gsap.registerPlugin(ScrollTrigger);
      gatilho = ScrollTrigger.create({
        trigger: secao,
        start: "top top",
        end: "+=170%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          estadoDaAbertura.progresso = self.progress;
          secao.style.setProperty("--p", self.progress.toFixed(4));
        },
      });
    }

    return () => {
      window.removeEventListener("pointermove", mover);
      gatilho?.kill();
      estadoDaAbertura.portal = null;
      estadoDaAbertura.progresso = 0;
    };
  }, [alvo]);

  return null;
}
