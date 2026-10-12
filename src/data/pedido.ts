/**
 * Regras do pedido que a sacola (no navegador) e a rota do WhatsApp (no
 * servidor) dividem. Fora de `produtos.ts` de propósito: a sacola entra em
 * toda página e não precisa carregar o catálogo inteiro (12/10/2026).
 */

/** Teto de unidades por produto num pedido (a rota do WhatsApp confere). */
export const QUANTIDADE_MAXIMA = 20;
