"use client";

import { useEffect } from "react";
import { estadoDaAbertura, podeUsar3D } from "@/lib/abertura";
import { acompanharPercurso } from "@/lib/rolagem-presa";

/**
 * Transforma a rolagem pelo percurso da abertura (a seção fica presa por
 * `position: sticky` enquanto se rola 170% da altura da tela) no progresso
 * do mergulho, de 0 a 1. O progresso vai para a cena 3D (`estadoDaAbertura`)
 * e para o CSS (`--p` na seção), que apaga o texto e acende a chegada.
 * Também leva o mouse para o olho seguir.
 *
 * Sem 3D não há mergulho: `data-sem3d` no percurso tira a altura extra, e a
 * seção rola como qualquer outra. Com "menos movimento", o CSS já faz isso.
 */
export function ControleDaAbertura({ alvo }: { alvo: string }) {
  useEffect(() => {
    const secao = document.getElementById(alvo);
    const percurso = secao?.parentElement;
    if (!secao || !percurso) return;
    estadoDaAbertura.portal = secao;

    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      estadoDaAbertura.ponteiro.x = (e.clientX / window.innerWidth) * 2 - 1;
      estadoDaAbertura.ponteiro.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", mover, { passive: true });

    let desligar: (() => void) | undefined;
    if (podeUsar3D()) {
      let escrito = "";
      desligar = acompanharPercurso(percurso, secao, (progresso) => {
        estadoDaAbertura.progresso = progresso;
        const p = progresso.toFixed(4);
        if (p === escrito) return;
        escrito = p;
        secao.style.setProperty("--p", p);
      });
    } else {
      percurso.dataset.sem3d = "";
    }

    return () => {
      window.removeEventListener("pointermove", mover);
      desligar?.();
      delete percurso.dataset.sem3d;
      estadoDaAbertura.portal = null;
      estadoDaAbertura.progresso = 0;
    };
  }, [alvo]);

  return null;
}
