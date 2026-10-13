import type { SVGProps } from "react";

/** Os poucos ícones que só o painel usa, no mesmo traço dos do site (`components/ui/icones.tsx`). */
type Props = SVGProps<SVGSVGElement> & { tamanho?: number };

function Base({ tamanho = 18, children, ...resto }: Props) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...resto}>
      {children}
    </svg>
  );
}

export const IconeSino = (p: Props) => (
  <Base {...p}>
    <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15l1.5-2Z" />
    <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
  </Base>
);

export const IconeCopiar = (p: Props) => (
  <Base {...p}>
    <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2" />
    <path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5" />
  </Base>
);

export const IconeVoltar = (p: Props) => (
  <Base {...p}>
    <path d="M14.5 6 8.5 12l6 6" />
  </Base>
);

export const IconeGrafico = (p: Props) => (
  <Base {...p}>
    <path d="M4 20h16M7 16v-4M12 16V8M17 16v-7" />
  </Base>
);
