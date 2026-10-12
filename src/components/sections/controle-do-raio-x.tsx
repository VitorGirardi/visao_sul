"use client";

import { useEffect } from "react";
import { etapaAtual } from "@/data/raio-x";
import { podeUsar3D } from "@/lib/abertura";
import { estadoDoRaioX } from "@/lib/raio-x";
import { acompanharPercurso } from "@/lib/rolagem-presa";

/**
 * Transforma a rolagem pelo percurso do Raio-X (a seção fica presa por
 * `position: sticky` enquanto se rola 260% da altura da tela) no progresso
 * da cena, e escreve no CSS o `--p` e o `data-etapa`, que acende o passo
 * certo da lista. Sem 3D não há percurso (`data-sem3d`) e a lista aparece
 * inteira.
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
    let ultima = -2;
    let escrito = "";
    const desligar = acompanharPercurso(percurso, secao, (progresso) => {
      estadoDoRaioX.progresso = progresso;
      const p = progresso.toFixed(4);
      if (p !== escrito) {
        escrito = p;
        secao.style.setProperty("--p", p);
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
    };
  }, [alvo]);
  return null;
}
