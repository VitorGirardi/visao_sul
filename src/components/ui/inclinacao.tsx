"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";

/** O que a inclinação guarda entre um movimento e outro (fora do estado do React). */
type Movimento = { caixa: DOMRect | null; x: number; y: number; pedido: number; esquecer: () => void };

function criarMovimento(): Movimento {
  const m: Movimento = {
    caixa: null,
    x: 0.5,
    y: 0.5,
    pedido: 0,
    // a página rolou (ou a vitrine andou): o cartão mudou de lugar, mede de novo
    esquecer: () => {
      m.caixa = null;
    },
  };
  return m;
}

/** Escreve a inclinação e o ponto de luz (uma vez por quadro, no requestAnimationFrame). */
function escrever(el: HTMLElement, m: Movimento, intensidade: number) {
  m.pedido = 0;
  const s = el.style;
  s.setProperty("--rx", `${((0.5 - m.y) * intensidade).toFixed(2)}deg`);
  s.setProperty("--ry", `${((m.x - 0.5) * intensidade).toFixed(2)}deg`);
  s.setProperty("--mx", `${(m.x * 100).toFixed(1)}%`);
  s.setProperty("--my", `${(m.y * 100).toFixed(1)}%`);
}

/**
 * Inclina o cartão na direção do mouse e leva junto um ponto de luz.
 * Só com mouse de verdade (`pointerType === "mouse"`): no toque o cartão
 * fica parado, que é o certo. Escreve variáveis CSS direto no elemento,
 * sem estado do React.
 *
 * Leve (12/10/2026): o mouse dispara bem mais eventos que a tela desenha,
 * então só o último de cada quadro é escrito; e o tamanho do cartão é medido
 * uma vez, quando o mouse entra, não a cada movimento.
 */
export function Inclinacao({ intensidade = 7, children, ...resto }: ComponentPropsWithoutRef<"div"> & { intensidade?: number }) {
  const caixa = useRef<HTMLDivElement>(null);
  const movimento = useRef<Movimento | null>(null);
  if (movimento.current == null) movimento.current = criarMovimento();
  return (
    <div
      ref={caixa}
      {...resto}
      onPointerEnter={(e) => {
        const m = movimento.current;
        if (e.pointerType !== "mouse" || !m) return;
        m.caixa = e.currentTarget.getBoundingClientRect();
        window.addEventListener("scroll", m.esquecer, { passive: true, once: true });
      }}
      onPointerMove={(e) => {
        const el = caixa.current;
        const m = movimento.current;
        if (e.pointerType !== "mouse" || !el || !m) return;
        m.caixa ??= el.getBoundingClientRect();
        m.x = (e.clientX - m.caixa.left) / m.caixa.width;
        m.y = (e.clientY - m.caixa.top) / m.caixa.height;
        if (!m.pedido) m.pedido = requestAnimationFrame(() => escrever(el, m, intensidade));
      }}
      onPointerLeave={() => {
        const m = movimento.current;
        if (m) {
          cancelAnimationFrame(m.pedido);
          m.pedido = 0;
          m.caixa = null;
          window.removeEventListener("scroll", m.esquecer);
        }
        const s = caixa.current?.style;
        s?.setProperty("--rx", "0deg");
        s?.setProperty("--ry", "0deg");
      }}
    >
      {children}
    </div>
  );
}
