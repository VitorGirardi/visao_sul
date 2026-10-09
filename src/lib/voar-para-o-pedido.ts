/**
 * A FOTO DO PRODUTO VOA ATÉ A SACOLA do cabeçalho quando a pessoa adiciona.
 * Uma cópia da imagem faz um arco até o botão `[data-alvo-pedido]`, que dá
 * um pulinho quando ela chega. Só animação (Web Animations API), nada de
 * estado; com "menos movimento" o botão só pulsa.
 */
export function voarParaOPedido(origem: HTMLElement | null) {
  const alvo = document.querySelector<HTMLElement>("[data-alvo-pedido]");
  if (!alvo) return;
  const pulsar = () =>
    alvo.animate([{ scale: 1 }, { scale: 1.28 }, { scale: 0.92 }, { scale: 1 }], {
      duration: 520,
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    });
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const imagem = origem?.querySelector("img") ?? null;
  if (reduzido || !imagem) return void pulsar();

  const de = imagem.getBoundingClientRect();
  const para = alvo.getBoundingClientRect();
  const copia = imagem.cloneNode(true) as HTMLImageElement;
  Object.assign(copia.style, {
    position: "fixed",
    left: `${de.left}px`,
    top: `${de.top}px`,
    width: `${de.width}px`,
    height: `${de.height}px`,
    objectFit: "contain",
    zIndex: "90",
    pointerEvents: "none",
    margin: "0",
  } satisfies Partial<CSSStyleDeclaration>);
  copia.removeAttribute("srcset");
  copia.removeAttribute("sizes");
  document.body.appendChild(copia);

  const dx = para.left + para.width / 2 - (de.left + de.width / 2);
  const dy = para.top + para.height / 2 - (de.top + de.height / 2);
  const escala = Math.max(0.08, Math.min(para.width / de.width, 0.2));
  const voo = copia.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 120}px) scale(${0.55})`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(${escala})`, opacity: 0.4 },
    ],
    { duration: 820, easing: "cubic-bezier(0.55, 0, 0.35, 1)" },
  );
  voo.onfinish = () => {
    copia.remove();
    pulsar();
  };
}
