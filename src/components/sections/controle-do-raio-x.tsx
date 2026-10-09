"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { etapaAtual } from "@/data/raio-x";
import { podeUsar3D } from "@/lib/abertura";
import { estadoDoRaioX } from "@/lib/raio-x";

/**
 * Prende o Raio-X na tela por 260% de rolagem e escreve o progresso para a
 * cena e para o CSS (`--p` e `data-etapa`, que acende o passo certo da
 * lista). Sem 3D, nada fica preso: a lista aparece inteira.
 */
export function ControleDoRaioX({ alvo }: { alvo: string }) {
  useEffect(() => {
    const secao = document.getElementById(alvo);
    if (!secao || !podeUsar3D()) return;
    gsap.registerPlugin(ScrollTrigger);
    secao.dataset.animado = "sim";
    let ultima = -2;
    const gatilho = ScrollTrigger.create({
      trigger: secao,
      start: "top top",
      end: "+=260%",
      pin: true,
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        estadoDoRaioX.progresso = self.progress;
        secao.style.setProperty("--p", self.progress.toFixed(4));
        const etapa = etapaAtual(self.progress);
        if (etapa !== ultima) {
          ultima = etapa;
          secao.dataset.etapa = String(etapa);
        }
      },
    });
    return () => {
      gatilho.kill();
      estadoDoRaioX.progresso = 0;
      delete secao.dataset.animado;
    };
  }, [alvo]);
  return null;
}
