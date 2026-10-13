import type { ItemDaBuscaRapida } from "@/data/indice-de-busca";

let carregando: Promise<ItemDaBuscaRapida[]> | null = null;

/**
 * O índice da busca do topo (`/indice-de-busca`, JSON pronto no build), uma
 * vez por visita. Começa a baixar quando a pessoa chega perto da lupa; se
 * falhar, a próxima tentativa baixa de novo.
 */
export function carregarIndiceDaBusca() {
  carregando ??= fetch("/indice-de-busca")
    .then((r) => (r.ok ? (r.json() as Promise<ItemDaBuscaRapida[]>) : Promise.reject(new Error(`índice da busca: ${r.status}`))))
    .catch(() => {
      carregando = null;
      return [];
    });
  return carregando;
}
