import { categoriaPorSlug } from "@/data/categorias";
import type { Produto } from "@/data/produtos";
import { indiceDeBusca } from "@/lib/busca";

/**
 * Tudo o que a busca lê de um produto. A vitrine (`/produtos`) e a busca do
 * topo (`/indice-de-busca`) usam o mesmo índice: o nome curto é o que se
 * digita ("PS5 Slim Digital"), e o nome da categoria traz "Wi-Fi", "Apple"
 * e "caça". Só roda no servidor: o navegador recebe o índice pronto.
 */
export const indiceDoProduto = (p: Produto) =>
  indiceDeBusca(p.nome, p.nomeCurto, p.marca, ...p.destaques, p.categoria, categoriaPorSlug(p.categoria)?.nome ?? "");

/** Um produto na busca do topo: o mínimo para a lista de resultados. */
export type ItemDaBuscaRapida = {
  slug: string;
  nome: string;
  categoria: string;
  preco: number;
  /** o índice de `indiceDoProduto` */
  busca: string;
  /** miniatura já otimizada (64 px, e 128 px na tela densa) */
  foto?: { src: string; srcSet?: string; width: number; height: number };
};
