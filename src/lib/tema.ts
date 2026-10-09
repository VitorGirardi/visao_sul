import { useSyncExternalStore } from "react";
import { CHAVE_DO_TEMA } from "@/lib/tema-script";

/**
 * TEMA ESCURO E CLARO (pedido do Vitor em 09/10/2026: "faça já com esses 2
 * temas, escuro e claro, para eu ver").
 *
 * Quem manda é o atributo `data-tema` do <html>. Ele é posto ANTES da
 * primeira pintura pelo `SCRIPT_DO_TEMA` (no <head> do layout raiz), que lê
 * a escolha guardada; sem ele a página piscaria no tema errado. O escuro é o
 * padrão porque é a cara da loja (a parede grafite com o letreiro aceso).
 */
export type Tema = "escuro" | "claro";

const COR_DA_BARRA: Record<Tema, string> = { escuro: "#010029", claro: "#f4f3ef" };

const ouvintes = new Set<() => void>();

function temaDoDocumento(): Tema {
  return document.documentElement.dataset.tema === "claro" ? "claro" : "escuro";
}

function assinar(aviso: () => void) {
  ouvintes.add(aviso);
  return () => ouvintes.delete(aviso);
}

/** O tema atual, para quem desenha (o 3D troca material e luz por ele). */
export function useTema(): Tema {
  return useSyncExternalStore(assinar, temaDoDocumento, () => "escuro");
}

function aplicar(tema: Tema) {
  const html = document.documentElement;
  html.dataset.tema = tema;
  html.style.colorScheme = tema === "claro" ? "light" : "dark";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", COR_DA_BARRA[tema]);
  try {
    localStorage.setItem(CHAVE_DO_TEMA, tema);
  } catch {
    // aba anônima sem armazenamento: o tema vale só nesta visita
  }
  ouvintes.forEach((aviso) => aviso());
}

/**
 * Troca o tema com a página nova entrando num círculo que nasce do botão
 * (View Transitions). Sem suporte, ou com "menos movimento", troca direto.
 */
export function alternarTema(origem?: { x: number; y: number }) {
  const proximo: Tema = temaDoDocumento() === "escuro" ? "claro" : "escuro";
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduzido) {
    aplicar(proximo);
    return;
  }
  const x = origem?.x ?? window.innerWidth - 80;
  const y = origem?.y ?? 40;
  const raio = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const transicao = document.startViewTransition(() => aplicar(proximo));
  transicao.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${raio}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.7, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
}
