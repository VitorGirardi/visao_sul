"use client";

import { FotoDoProduto } from "@/components/ui/foto-do-produto";
import { IconeCelular, IconeChave, IconeGabinete, IconeImpressora, IconeNotebook, IconeWifi } from "@/components/ui/icones";
import type { Chamado } from "@/data/amostra-do-painel";
import { produtoPorSlug } from "@/data/produtos";
import { aparelhoPorValor } from "@/data/servicos";
import type { PedidoNoPainel } from "./estado";
import { Miniatura } from "./ui";

/** "HP Victus 15 e mais 1", com a foto do primeiro item. */
export function ItensDoPedido({ pedido }: { pedido: PedidoNoPainel }) {
  const primeiro = produtoPorSlug(pedido.itens[0]?.slug ?? "");
  const outros = pedido.itens.length - 1;
  const quantos = pedido.itens.reduce((soma, i) => soma + i.qtd, 0);
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      {primeiro && (
        <Miniatura>
          <FotoDoProduto produto={primeiro} sizes="40px" semSombra alt="" />
        </Miniatura>
      )}
      <span className="min-w-0 truncate">
        {pedido.itens[0]?.qtd > 1 && `${pedido.itens[0].qtd}x `}
        {primeiro?.nomeCurto}
        {outros > 0 && <span className="text-texto-3"> e mais {outros}</span>}
        {outros === 0 && quantos > 1 && <span className="sr-only"> ({quantos} unidades)</span>}
      </span>
    </span>
  );
}

const ICONES = { notebook: IconeNotebook, computador: IconeGabinete, impressora: IconeImpressora, celular: IconeCelular, rede: IconeWifi } as const;

/** "Notebook · Não liga", com o ícone do aparelho (o mesmo do chamado no site). */
export function AparelhoDoChamado({ chamado }: { chamado: Chamado }) {
  const Icone = ICONES[chamado.aparelho] ?? IconeChave;
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="grid size-8 shrink-0 place-items-center rounded-md border border-linha bg-fundo-3 text-texto-2">
        <Icone tamanho={16} />
      </span>
      <span className="min-w-0 truncate">
        {aparelhoPorValor(chamado.aparelho)?.rotulo} <span className="text-texto-3">· {chamado.problema}</span>
      </span>
    </span>
  );
}

/** Classes da tabela do painel: linha de 52 px, cabeçalho pequeno em caixa alta. */
export const TH = "whitespace-nowrap border-b border-linha bg-fundo px-3 py-2 text-left text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-texto-3";
export const TD = "h-[52px] border-b border-linha px-3 align-middle";
