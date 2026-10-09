import type Lenis from "lenis";

/**
 * A rolagem suave (Lenis) é uma só no site, criada em
 * `components/layout/rolagem-suave.tsx`. Quem abre gaveta ou menu pausa a
 * rolagem da página por baixo e retoma ao fechar.
 */
let instancia: Lenis | null = null;

export const registrarRolagem = (lenis: Lenis | null) => {
  instancia = lenis;
};

export const pausarRolagem = () => instancia?.stop();
export const retomarRolagem = () => instancia?.start();

/** Rola até um elemento ou posição, suave quando dá. */
export function rolarAte(alvo: string | number | HTMLElement, deslocamento = -80) {
  if (instancia) instancia.scrollTo(alvo, { offset: deslocamento });
  else if (typeof alvo === "number") window.scrollTo({ top: alvo, behavior: "smooth" });
  else (typeof alvo === "string" ? document.querySelector(alvo) : alvo)?.scrollIntoView({ behavior: "smooth" });
}
