import { horaDoQuadro } from "@/lib/sessenta-quadros";

/**
 * ROLAGEM PRESA SEM BIBLIOTECA (12/10/2026, no lugar do `pin` + `scrub` do
 * GSAP, que custava 44 KB gz na home).
 *
 * A seção fica `position: sticky` dentro de um percurso mais alto, e o
 * navegador a prende sozinho. O `pin` embrulhava a seção num `.pin-spacer` e
 * trocava para `position: fixed`, refazendo o layout da página inteira na
 * entrada e na saída de cada cena (o tranco nas bordas) e quebrando o React
 * ao trocar de página ("removeChild").
 *
 * Aqui só se lê quanto do percurso já foi rolado e se entrega esse progresso
 * (0 a 1) alisado: a roda do mouse pula 100 px de uma vez, e a cena não pode
 * andar aos degraus. `alcance` é o tempo, em segundos, para o progresso
 * alcançar a rolagem (o `scrub` do GSAP). As entregas saem a no máximo 60
 * por segundo, no ritmo das cenas 3D.
 *
 * Devolve a função que desliga tudo.
 */
export function acompanharPercurso(percurso: HTMLElement, presa: HTMLElement, aoMudar: (progresso: number) => void, alcance = 0.5) {
  // em `alcance` segundos falta 5% do caminho (e⁻³)
  const rapidez = 3 / alcance;
  let curso = 1;
  let alvo = 0;
  let atual = -1;
  let pedido = 0;
  let ultimo = 0;

  const passo = (agora: number) => {
    pedido = requestAnimationFrame(passo);
    if (!horaDoQuadro(agora)) return;
    const dt = Math.min(0.1, Math.max(0, agora - ultimo) / 1000);
    ultimo = agora;
    atual += (alvo - atual) * (1 - Math.exp(-dt * rapidez));
    if (Math.abs(alvo - atual) < 0.0005) {
      atual = alvo;
      cancelAnimationFrame(pedido);
      pedido = 0;
    }
    aoMudar(atual);
  };

  const ler = () => {
    alvo = Math.min(1, Math.max(0, -percurso.getBoundingClientRect().top / curso));
    if (atual < 0) {
      // a primeira leitura (página aberta no meio do percurso) vai direto, sem animar
      atual = alvo;
      aoMudar(atual);
      return;
    }
    if (pedido || alvo === atual) return;
    ultimo = performance.now();
    pedido = requestAnimationFrame(passo);
  };

  const medir = () => {
    curso = Math.max(1, percurso.offsetHeight - presa.offsetHeight);
    ler();
  };

  medir();
  window.addEventListener("scroll", ler, { passive: true });
  // a altura do percurso e a da seção mudam com a tela (svh) e com o conteúdo
  const observador = new ResizeObserver(medir);
  observador.observe(percurso);
  observador.observe(presa);

  return () => {
    window.removeEventListener("scroll", ler);
    observador.disconnect();
    cancelAnimationFrame(pedido);
  };
}
