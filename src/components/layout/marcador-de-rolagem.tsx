"use client";

import { useEffect } from "react";

/** A marca sai um pouco depois do último movimento: a vitrine ainda desliza depois que a roda para. */
const FOLGA = 300;

/**
 * NADA DE HOVER ENQUANTO A PÁGINA ROLA (12/10/2026). Na vitrine presa, os
 * cartões passam por baixo do mouse parado, e cada um que passava disparava
 * o Raio-X (um segundo de animação) no meio da rolagem. Este componente
 * marca `data-rolando` no `<html>` enquanto há rolagem, e o CSS tira o
 * ponteiro dos cartões até ela parar.
 */
export function MarcadorDeRolagem() {
  useEffect(() => {
    const raiz = document.documentElement;
    let espera = 0;
    const aoRolar = () => {
      if (espera) window.clearTimeout(espera);
      else raiz.dataset.rolando = "";
      espera = window.setTimeout(() => {
        espera = 0;
        delete raiz.dataset.rolando;
      }, FOLGA);
    };
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.clearTimeout(espera);
      delete raiz.dataset.rolando;
    };
  }, []);
  return null;
}
