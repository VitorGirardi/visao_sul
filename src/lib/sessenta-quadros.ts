/** Um quadro a cada 1/60 s, com folga para o tique de uma tela de 60 Hz, que chega um pouco antes, não cair fora. */
const INTERVALO = 1000 / 60;
const FOLGA = 2;

/**
 * NO MÁXIMO 60 QUADROS POR SEGUNDO, mesmo em tela de 144 Hz (a do notebook
 * do Vitor, medido em 09/10/2026): desenhar na taxa da tela era 2,4 vezes
 * mais trabalho para um movimento que não fica mais bonito por isso.
 *
 * A cada tique do requestAnimationFrame, `hora()` diz se já é tempo do
 * próximo quadro. O acumulado mantém a média em 60: numa tela de 144 Hz os
 * quadros saem a cada 2 ou 3 tiques, não sempre a cada 3 (o que daria 48).
 */
export function relogioDe60() {
  let ultimo = performance.now();
  let acumulado = INTERVALO;
  return {
    /** Recomeça a contar depois de uma pausa: o próximo tique já é quadro. */
    zerar(agora = performance.now()) {
      ultimo = agora;
      acumulado = INTERVALO;
    },
    hora(agora: number) {
      acumulado = Math.min(acumulado + agora - ultimo, INTERVALO * 2);
      ultimo = agora;
      if (acumulado < INTERVALO - FOLGA) return false;
      acumulado = Math.max(0, acumulado - INTERVALO);
      return true;
    },
  };
}
