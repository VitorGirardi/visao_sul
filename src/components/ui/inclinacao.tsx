"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";

/**
 * Inclina o cartão na direção do mouse e leva junto um ponto de luz.
 * Só com mouse de verdade (`pointerType === "mouse"`): no toque o cartão
 * fica parado, que é o certo. Escreve variáveis CSS direto no elemento,
 * sem estado do React (60 vezes por segundo não é coisa para render).
 */
export function Inclinacao({ intensidade = 7, children, ...resto }: ComponentPropsWithoutRef<"div"> & { intensidade?: number }) {
  const caixa = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={caixa}
      {...resto}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !caixa.current) return;
        const r = caixa.current.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const s = caixa.current.style;
        s.setProperty("--rx", `${(0.5 - y) * intensidade}deg`);
        s.setProperty("--ry", `${(x - 0.5) * intensidade}deg`);
        s.setProperty("--mx", `${x * 100}%`);
        s.setProperty("--my", `${y * 100}%`);
      }}
      onPointerLeave={() => {
        const s = caixa.current?.style;
        s?.setProperty("--rx", "0deg");
        s?.setProperty("--ry", "0deg");
      }}
    >
      {children}
    </div>
  );
}
