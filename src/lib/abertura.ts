/**
 * O ESTADO DA ABERTURA, dividido entre quem rola (o GSAP, em
 * `abertura-animada.tsx`) e quem desenha (a cena 3D, em `tres/olho-3d.tsx`).
 * É um objeto mutável de propósito: a cena lê 60 vezes por segundo, e isso
 * não pode passar pelo estado do React.
 */
export const estadoDaAbertura = {
  /** 0 = parado na abertura, 1 = mergulho concluído (dentro da loja). */
  progresso: 0,
  /** Mouse de -1 a 1 nos dois eixos (0 no centro da tela). */
  ponteiro: { x: 0, y: 0 },
  /** A camada da foto da loja: a cena escreve nela onde está o furo do olho. */
  portal: null as HTMLElement | null,
};

/** WebGL disponível e a pessoa não pediu menos movimento. Lido uma vez. */
let podeCache: boolean | null = null;
export function podeUsar3D() {
  if (podeCache !== null) return podeCache;
  try {
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    podeCache = Boolean(gl) && !reduzido;
  } catch {
    podeCache = false;
  }
  return podeCache;
}
