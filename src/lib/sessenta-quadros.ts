/** Um quadro a cada 1/60 s, com folga para o tique de uma tela de 60 Hz, que chega um pouco antes, não cair fora. */
const INTERVALO = 1000 / 60;
const FOLGA = 2;

let tique = -1;
let ultimo = 0;
let acumulado = 0;
let batida = false;

/**
 * NO MÁXIMO 60 QUADROS POR SEGUNDO, mesmo em tela de 144 Hz (a do notebook
 * do Vitor, medido em 09/10/2026): desenhar na taxa da tela era 2,4 vezes
 * mais trabalho para um movimento que não fica mais bonito por isso.
 *
 * A cada tique do requestAnimationFrame, diz se já é tempo do próximo
 * quadro. O acumulado mantém a média em 60: numa tela de 144 Hz os quadros
 * saem a cada 2 ou 3 tiques, não sempre a cada 3 (o que daria 48).
 *
 * O compasso é UM SÓ para a página (13/10/2026). Cada cena tinha o seu
 * relógio, e na tela de 144 Hz a rolagem da abertura e o olho batiam em
 * tiques diferentes: 4 de cada 10 tiques com trabalho eram a mais, cada um
 * com o seu estilo, pintura e composição. Agora a decisão sai uma vez por
 * tique, e todos os que perguntam no mesmo tique (o `agora` do
 * requestAnimationFrame é o mesmo para todos) recebem a mesma resposta.
 */
export function horaDoQuadro(agora: number) {
  if (agora === tique) return batida;
  const passou = agora - ultimo;
  tique = agora;
  ultimo = agora;
  // depois de uma pausa (ninguém perguntou por mais de dois quadros), o primeiro tique já é quadro
  acumulado = passou > INTERVALO * 2 ? INTERVALO : Math.min(acumulado + passou, INTERVALO * 2);
  batida = acumulado >= INTERVALO - FOLGA;
  if (batida) acumulado = Math.max(0, acumulado - INTERVALO);
  return batida;
}
