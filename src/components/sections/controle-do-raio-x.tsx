"use client";

import { useEffect } from "react";
import { etapaAtual } from "@/data/raio-x";
import { podeUsar3D } from "@/lib/abertura";
import { estadoDoRaioX } from "@/lib/raio-x";
import { acompanharPercurso } from "@/lib/rolagem-presa";

/**
 * Transforma a rolagem pelo percurso do Raio-X (a seção fica presa por
 * `position: sticky` enquanto se rola 260% da altura da tela, 130% no
 * celular) no progresso da cena, e escreve no CSS o `data-etapa`, que acende
 * o passo certo da lista. Sem 3D não há percurso (`data-sem3d`) e a lista
 * aparece inteira.
 *
 * O brilho do céu e o fim (preço e botões) recebem a opacidade e o
 * deslocamento prontos, só quando mudam (13/10/2026). Antes era o `--p`
 * escrito na seção, herdado por cada passo, preço e botão, e o navegador
 * recalculava o estilo de todos a cada quadro: 12 ms no celular médio,
 * contra menos de 1 ms assim.
 *
 * Meio segundo de alcance (09/10/2026, saiu o Lenis): com a rolagem nativa a
 * roda do mouse pula 100 px de uma vez, e o progresso seguindo na hora fazia
 * a cena andar aos degraus.
 */
export function ControleDoRaioX({ alvo }: { alvo: string }) {
  useEffect(() => {
    const secao = document.getElementById(alvo);
    const percurso = secao?.parentElement;
    if (!secao || !percurso) return;
    if (!podeUsar3D()) {
      percurso.dataset.sem3d = "";
      return () => {
        delete percurso.dataset.sem3d;
      };
    }

    secao.dataset.animado = "sim";
    const brilho = secao.querySelector<HTMLElement>(".raio-x-brilho");
    const final = secao.querySelector<HTMLElement>(".raio-x-final");
    let ultima = -2;
    let brilhoEscrito = "";
    let chegadaEscrita = -1;
    const desligar = acompanharPercurso(percurso, secao, (progresso) => {
      estadoDoRaioX.progresso = progresso;
      // o brilho amarelo do céu cresce com a passagem
      const opacidade = (0.43 + progresso * 0.57).toFixed(3);
      if (brilho && opacidade !== brilhoEscrito) {
        brilhoEscrito = opacidade;
        brilho.style.opacity = opacidade;
      }
      // o preço e os botões sobem e acendem no fim do percurso; antes disso, nada muda
      const chegada = Math.min(1, Math.max(0, (progresso - 0.93) * 14));
      if (final && Math.abs(chegada - chegadaEscrita) >= 0.001) {
        chegadaEscrita = chegada;
        final.style.opacity = chegada.toFixed(3);
        final.style.translate = `0 ${(1 - chegada).toFixed(3)}rem`;
      }
      const etapa = etapaAtual(progresso);
      if (etapa !== ultima) {
        ultima = etapa;
        secao.dataset.etapa = String(etapa);
      }
    });

    return () => {
      desligar();
      estadoDoRaioX.progresso = 0;
      delete secao.dataset.animado;
      brilho?.style.removeProperty("opacity");
      final?.style.removeProperty("opacity");
      final?.style.removeProperty("translate");
    };
  }, [alvo]);
  return null;
}
