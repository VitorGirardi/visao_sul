"use client";

import { useEffect } from "react";
import { estadoDaAbertura, podeUsar3D } from "@/lib/abertura";
import { acompanharPercurso } from "@/lib/rolagem-presa";

const limitar = (v: number) => Math.min(1, Math.max(0, v));
/** a chegada acende de 86% a 97% do mergulho */
const chegada = (p: number) => limitar((p - 0.86) * 9);

type Estilo = Partial<Record<"opacity" | "translate" | "visibility", string>>;

/**
 * O MERGULHO, CAMADA POR CAMADA: o que o progresso p (0 parado, 1 dentro da
 * loja) faz com cada uma. Com p = 0, tudo bate com o CSS, que é como a
 * abertura fica sem 3D ou com "menos movimento". Onde está o furo (a foto, o
 * brilho e os arcos andando com ele) quem escreve é a cena, em `olho-3d.tsx`.
 */
const COREOGRAFIA: [seletor: string, estilo: (p: number) => Estilo][] = [
  // o brilho do letreiro apaga no começo
  [".abertura-halo", (p) => ({ opacity: limitar(1 - p * 3.2).toFixed(3) })],
  // as ondas da marca somem até a metade; apagadas, nem são pintadas (a cena continua abrindo o grupo)
  [
    ".abertura-arcos",
    (p) => {
      const opacidade = limitar(1 - p * 1.6);
      return { opacity: opacidade.toFixed(3), visibility: opacidade > 0 ? "" : "hidden" };
    },
  ],
  // a sombra sobre a loja clareia até a chegada
  [".abertura-portal-sombra", (p) => ({ opacity: (0.5 - p * 0.5).toFixed(3) })],
  // o texto sobe e some até 20% do mergulho
  [".abertura-texto", (p) => ({ opacity: limitar(1 - p * 5).toFixed(3), translate: `0 ${(limitar(p * 5) * -32).toFixed(1)}px` })],
  // a dica de rolar some logo
  [".abertura-dica", (p) => ({ opacity: limitar(1 - p * 8).toFixed(3) })],
  // a chegada acende no fim, com o título subindo
  [".abertura-chegada", (p) => ({ opacity: chegada(p).toFixed(3) })],
  [".abertura-chegada .titulo-2", (p) => ({ translate: `0 ${((1 - chegada(p)) * 2).toFixed(3)}rem` })],
];

/**
 * Transforma a rolagem pelo percurso da abertura (a seção fica presa por
 * `position: sticky` enquanto se rola 170% da altura da tela) no progresso
 * do mergulho, de 0 a 1. O progresso vai para a cena 3D (`estadoDaAbertura`)
 * e para as camadas, pela coreografia acima. Também leva o mouse para o olho
 * seguir.
 *
 * PROPRIEDADE PRONTA, NUNCA VARIÁVEL (13/10/2026). Antes, o `--p` era
 * escrito na seção e cada camada fazia a conta no CSS. Só que variável é
 * herdada: o navegador recalculava o estilo de cada palavra, botão e ícone
 * da abertura a cada quadro, 9 ms no celular médio. Agora cada camada recebe
 * só o valor que mudou, e o quadro inteiro custa 1 ms.
 *
 * Sem 3D não há mergulho: `data-sem3d` no percurso tira a altura extra, e a
 * seção rola como qualquer outra. Com "menos movimento", o CSS já faz isso.
 */
export function ControleDaAbertura({ alvo }: { alvo: string }) {
  useEffect(() => {
    const secao = document.getElementById(alvo);
    const percurso = secao?.parentElement;
    if (!secao || !percurso) return;
    const achar = (seletor: string) => secao.querySelector<HTMLElement>(seletor);

    const foto = achar(".abertura-portal");
    const brilho = achar(".abertura-halo");
    const arcos = achar(".abertura-arcos");
    if (foto && brilho && arcos) estadoDaAbertura.furo = { foto, brilho, arcos };

    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      estadoDaAbertura.ponteiro.x = (e.clientX / window.innerWidth) * 2 - 1;
      estadoDaAbertura.ponteiro.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", mover, { passive: true });

    const camadas = COREOGRAFIA.flatMap(([seletor, estilo]) => {
      const el = achar(seletor);
      return el ? [{ el, estilo, escrito: {} as Estilo }] : [];
    });

    let desligar: (() => void) | undefined;
    if (podeUsar3D()) {
      desligar = acompanharPercurso(percurso, secao, (progresso) => {
        estadoDaAbertura.progresso = progresso;
        for (const camada of camadas) {
          const estilo = camada.estilo(progresso);
          for (const propriedade of Object.keys(estilo) as (keyof Estilo)[]) {
            const valor = estilo[propriedade] ?? "";
            if (camada.escrito[propriedade] === valor) continue;
            camada.escrito[propriedade] = valor;
            camada.el.style.setProperty(propriedade, valor);
          }
        }
      });
    } else {
      percurso.dataset.sem3d = "";
    }

    return () => {
      window.removeEventListener("pointermove", mover);
      desligar?.();
      delete percurso.dataset.sem3d;
      estadoDaAbertura.furo = null;
      estadoDaAbertura.progresso = 0;
      for (const { el, escrito } of camadas) for (const propriedade of Object.keys(escrito)) el.style.removeProperty(propriedade);
    };
  }, [alvo]);

  return null;
}
