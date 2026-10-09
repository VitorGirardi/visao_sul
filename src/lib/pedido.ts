import { useSyncExternalStore } from "react";
import { produtoPorSlug, QUANTIDADE_MAXIMA } from "@/data/produtos";

/**
 * "MEU PEDIDO": a sacola do site, guardada no navegador (localStorage), sem
 * conta e sem banco. Ela não cobra nada: no fim vira uma mensagem pronta no
 * WhatsApp (`/whatsapp?assunto=pedido`), que é como a Visão Sul vende hoje.
 * Pagamento online entra na fase 2 da proposta.
 *
 * Mesmo desenho do prime-collection: estado do navegador com
 * `useSyncExternalStore`, sem biblioteca de estado. A foto do que está
 * guardado é sempre a mesma lista até mudar (o React exige isso).
 */
export type ItemDoPedido = { slug: string; qtd: number };

const CHAVE = "visao-pedido";
const VAZIO: ItemDoPedido[] = [];
const ouvintes = new Set<() => void>();
let itens: ItemDoPedido[] | null = null;

function validos(bruto: unknown): ItemDoPedido[] {
  if (!Array.isArray(bruto)) return [];
  return bruto.flatMap((item) => {
    const slug = typeof item?.slug === "string" ? item.slug : "";
    const qtd = Math.floor(Number(item?.qtd));
    return produtoPorSlug(slug) && qtd >= 1 ? [{ slug, qtd: Math.min(qtd, QUANTIDADE_MAXIMA) }] : [];
  });
}

function ler(): ItemDoPedido[] {
  if (itens) return itens;
  try {
    itens = validos(JSON.parse(localStorage.getItem(CHAVE) ?? "[]"));
  } catch {
    itens = [];
  }
  return itens;
}

function gravar(novos: ItemDoPedido[]) {
  itens = novos;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(novos));
  } catch {
    // aba anônima sem armazenamento: o pedido vale até fechar a aba
  }
  ouvintes.forEach((aviso) => aviso());
}

function assinar(aviso: () => void) {
  ouvintes.add(aviso);
  // outra aba mexeu no pedido: relê na próxima leitura
  const outraAba = (e: StorageEvent) => {
    if (e.key === CHAVE) {
      itens = null;
      aviso();
    }
  };
  window.addEventListener("storage", outraAba);
  return () => {
    ouvintes.delete(aviso);
    window.removeEventListener("storage", outraAba);
  };
}

export function usePedido(): ItemDoPedido[] {
  return useSyncExternalStore(assinar, ler, () => VAZIO);
}

export function adicionarAoPedido(slug: string, qtd = 1) {
  if (!produtoPorSlug(slug)) return;
  const atual = ler();
  const existente = atual.find((i) => i.slug === slug);
  gravar(
    existente
      ? atual.map((i) => (i.slug === slug ? { ...i, qtd: Math.min(i.qtd + qtd, QUANTIDADE_MAXIMA) } : i))
      : [...atual, { slug, qtd: Math.min(qtd, QUANTIDADE_MAXIMA) }],
  );
}

export function mudarQuantidade(slug: string, qtd: number) {
  if (qtd < 1) return removerDoPedido(slug);
  gravar(ler().map((i) => (i.slug === slug ? { ...i, qtd: Math.min(qtd, QUANTIDADE_MAXIMA) } : i)));
}

export function removerDoPedido(slug: string) {
  gravar(ler().filter((i) => i.slug !== slug));
}

export function limparPedido() {
  gravar([]);
}

export const totalDeItens = (lista: ItemDoPedido[]) => lista.reduce((soma, i) => soma + i.qtd, 0);

export const totalDoPedido = (lista: ItemDoPedido[]) =>
  lista.reduce((soma, i) => soma + (produtoPorSlug(i.slug)?.preco ?? 0) * i.qtd, 0);

/** A gaveta do pedido abre por evento: qualquer botão do site pode pedir. */
export const EVENTO_ABRIR_PEDIDO = "visao:abrir-pedido";
export const abrirPedido = () => window.dispatchEvent(new Event(EVENTO_ABRIR_PEDIDO));
