/**
 * O ESTADO DA ABERTURA, dividido entre quem rola (o controle, em
 * `sections/controle-da-abertura.tsx`) e quem desenha (a cena 3D, em
 * `tres/olho-3d.tsx`).
 * É um objeto mutável de propósito: a cena lê 60 vezes por segundo, e isso
 * não pode passar pelo estado do React.
 */
export const estadoDaAbertura = {
  /** 0 = parado na abertura, 1 = mergulho concluído (dentro da loja). */
  progresso: 0,
  /** Mouse de -1 a 1 nos dois eixos (0 no centro da tela). */
  ponteiro: { x: 0, y: 0 },
  /** As camadas que acompanham o furo do olho: a cena escreve nelas onde ele está na tela. */
  furo: null as CamadasDoFuro | null,
};

export type CamadasDoFuro = {
  /** a foto da loja, recortada no círculo do furo */
  foto: HTMLElement;
  /** o brilho do letreiro, atrás do olho */
  brilho: HTMLElement;
  /** as ondas da marca, centradas no furo */
  arcos: HTMLElement;
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
    // Solto o contexto do teste na hora: preso, ele ficava vivo ao lado do da
    // cena, e o navegador limita quantos contextos WebGL vivem juntos (12/10/2026).
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    podeCache = false;
  }
  return podeCache;
}
