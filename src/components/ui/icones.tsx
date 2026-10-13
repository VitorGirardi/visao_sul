import type { SVGProps } from "react";

/**
 * ÍCONES DO SITE, desenhados no mesmo traço (24 × 24, linha de 1,6, pontas
 * redondas). Sem biblioteca de ícones: são poucos e pesam nada.
 * `aria-hidden` por padrão; quem precisa de nome dá no botão ou no link.
 */
type Props = SVGProps<SVGSVGElement> & { tamanho?: number };

function Base({ tamanho = 20, children, ...resto }: Props) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...resto}
    >
      {children}
    </svg>
  );
}

/**
 * O do WhatsApp vem de `public/marca/icones.svg` por `<use>` (12/10/2026): o
 * caminho tem 886 caracteres e aparecia 16 vezes por página, no HTML e de novo
 * nos dados do React. A cor continua sendo a do texto (currentColor).
 */
export const ICONES_SVG = "/marca/icones.svg?v=1";

export const IconeWhatsApp = ({ tamanho = 20, ...resto }: Props) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...resto}>
    <use href={`${ICONES_SVG}#whatsapp`} />
  </svg>
);

export const IconeInstagram = (p: Props) => (
  <Base {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
  </Base>
);

export const IconeSacola = (p: Props) => (
  <Base {...p}>
    <path d="M5 8h14l-1.2 11.2A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.8L5 8Z" />
    <path d="M9 10V7a3 3 0 0 1 6 0v3" />
  </Base>
);

export const IconeSol = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
  </Base>
);

export const IconeLua = (p: Props) => (
  <Base {...p}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </Base>
);

export const IconeSeta = (p: Props) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);

export const IconeSetaDiagonal = (p: Props) => (
  <Base {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Base>
);

export const IconeMais = (p: Props) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);

export const IconeMenos = (p: Props) => (
  <Base {...p}>
    <path d="M5 12h14" />
  </Base>
);

export const IconeFechar = (p: Props) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);

export const IconeLupa = (p: Props) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </Base>
);

export const IconeMenu = (p: Props) => (
  <Base {...p}>
    <path d="M4 8h16M4 16h16" />
  </Base>
);

export const IconeLixeira = (p: Props) => (
  <Base {...p}>
    <path d="M4 7h16M9 7V4.8c0-.4.4-.8.8-.8h4.4c.4 0 .8.4.8.8V7M6.5 7l.8 12.2c.1 1 .9 1.8 1.9 1.8h5.6c1 0 1.8-.8 1.9-1.8L17.5 7" />
  </Base>
);

export const IconeCheck = (p: Props) => (
  <Base {...p}>
    <path d="m5 12.5 4.2 4L19 7" />
  </Base>
);

export const IconeNotebook = (p: Props) => (
  <Base {...p}>
    <rect x="4.5" y="5" width="15" height="10" rx="1.5" />
    <path d="M2.5 18.5h19l-1.2-2H3.7l-1.2 2Z" />
  </Base>
);

export const IconeGabinete = (p: Props) => (
  <Base {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
    <circle cx="12" cy="13.5" r="3" />
    <path d="M9.5 6h5" />
  </Base>
);

export const IconeImpressora = (p: Props) => (
  <Base {...p}>
    <path d="M7 8V3.5h10V8" />
    <rect x="3" y="8" width="18" height="9" rx="2" />
    <path d="M7 14h10v6.5H7z" />
  </Base>
);

export const IconeCelular = (p: Props) => (
  <Base {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M10.5 5.5h3" />
  </Base>
);

export const IconeWifi = (p: Props) => (
  <Base {...p}>
    <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 15.9a5 5 0 0 1 6.8 0" />
    <circle cx="12" cy="19" r="0.9" fill="currentColor" />
  </Base>
);

export const IconeChave = (p: Props) => (
  <Base {...p}>
    <path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6V21h3.4l5.7-5.7a4.5 4.5 0 0 0 5.6-6l-2.9 2.9-2.4-.6-.6-2.4 2.9-2.9Z" />
  </Base>
);

export const IconeChip = (p: Props) => (
  <Base {...p}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="0.8" />
    <path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5" />
  </Base>
);

export const IconeDisco = (p: Props) => (
  <Base {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
  </Base>
);

export const IconeVentoinha = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 12c0-3 1-5.5 3.5-5.5S17 9.5 12 12Zm0 0c2.6 1.5 4.3 3.6 3 5.8-1.2 2.1-4.6-.3-3-5.8Zm0 0c-2.6 1.5-5.3 1.9-6.5-.3-1.3-2.2 2.2-3.8 6.5.3Z" />
  </Base>
);

export const IconeCaminhao = (p: Props) => (
  <Base {...p}>
    <path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3.2v2.8h-7" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </Base>
);

export const IconeEscudo = (p: Props) => (
  <Base {...p}>
    <path d="M12 2.8 4.5 5.6v6c0 4.6 3.1 8.2 7.5 9.6 4.4-1.4 7.5-5 7.5-9.6v-6L12 2.8Z" />
    <path d="m8.8 12.2 2.2 2.2 4.4-4.6" />
  </Base>
);

export const IconeRelogio = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.2 2" />
  </Base>
);

export const IconeLocal = (p: Props) => (
  <Base {...p}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.6" />
  </Base>
);

export const IconeOlho = (p: Props) => (
  <Base {...p}>
    <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3.2" />
  </Base>
);

export const IconeCasa = (p: Props) => (
  <Base {...p}>
    <path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6h-6v6H4.5a1 1 0 0 1-1-1v-9.5Z" />
  </Base>
);

export const IconeLoja = (p: Props) => (
  <Base {...p}>
    <path d="M3.5 9.5 5 4h14l1.5 5.5M4 9.5v10.5h16V9.5M3.5 9.5c0 1.4 1.2 2.5 2.7 2.5s2.7-1.1 2.7-2.5c0 1.4 1.2 2.5 2.7 2.5h.8c1.5 0 2.7-1.1 2.7-2.5 0 1.4 1.2 2.5 2.7 2.5s2.7-1.1 2.7-2.5" />
    <path d="M9.5 20v-5h5v5" />
  </Base>
);

export const IconeEmpresa = (p: Props) => (
  <Base {...p}>
    <path d="M4 21V5.5c0-.6.4-1 1-1h8c.6 0 1 .4 1 1V21M14 9.5h5c.6 0 1 .4 1 1V21M2.5 21h19M7.5 8h3M7.5 11.5h3M7.5 15h3M17 13h0M17 16.5h0" />
  </Base>
);

export const IconeRaio = (p: Props) => (
  <Base {...p}>
    <path d="M3 7V4.5C3 3.7 3.7 3 4.5 3H7M17 3h2.5c.8 0 1.5.7 1.5 1.5V7M21 17v2.5c0 .8-.7 1.5-1.5 1.5H17M7 21H4.5c-.8 0-1.5-.7-1.5-1.5V17" />
    <path d="M3 12h18" />
  </Base>
);

export const IconeControle = (p: Props) => (
  <Base {...p}>
    <path d="M7.5 7h9a5 5 0 0 1 4.9 6l-.7 3.4a2.4 2.4 0 0 1-4.1 1.1L14.2 15H9.8l-2.4 2.5a2.4 2.4 0 0 1-4.1-1.1L2.6 13a5 5 0 0 1 4.9-6Z" />
    <path d="M7.5 10v3M6 11.5h3" />
    <circle cx="16" cy="10.5" r="0.7" fill="currentColor" />
    <circle cx="17.5" cy="12.5" r="0.7" fill="currentColor" />
  </Base>
);

export const IconeSom = (p: Props) => (
  <Base {...p}>
    <rect x="5" y="2.5" width="14" height="19" rx="3" />
    <circle cx="12" cy="14.5" r="3.5" />
    <circle cx="12" cy="7" r="1.2" />
  </Base>
);

export const IconeCalendario = (p: Props) => (
  <Base {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Base>
);

export const IconeTeclado = (p: Props) => (
  <Base {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <path d="M6 9.5h0M9 9.5h0M12 9.5h0M15 9.5h0M18 9.5h0M6 12.5h0M9 12.5h0M12 12.5h0M15 12.5h0M18 12.5h0M8 15h8" />
  </Base>
);

export const IconeAlvo = (p: Props) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
  </Base>
);

/** Ícone por nome, para listas que vêm de `data/`. */
export const iconesPorNome = {
  notebook: IconeNotebook,
  gabinete: IconeGabinete,
  impressora: IconeImpressora,
  celular: IconeCelular,
  wifi: IconeWifi,
  chave: IconeChave,
  chip: IconeChip,
  disco: IconeDisco,
  ventoinha: IconeVentoinha,
  controle: IconeControle,
  som: IconeSom,
  teclado: IconeTeclado,
  alvo: IconeAlvo,
} as const;

export type NomeDoIcone = keyof typeof iconesPorNome;
