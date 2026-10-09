"use client";

import { IconeSacola } from "@/components/ui/icones";
import { abrirPedido, totalDeItens, usePedido } from "@/lib/pedido";

/**
 * A sacola do cabeçalho: abre a gaveta do pedido e mostra quantos itens tem.
 * `data-alvo-pedido` é onde a foto do produto pousa quando voa (ver
 * `lib/voar-para-o-pedido.ts`).
 */
export function BotaoPedido() {
  const quantidade = totalDeItens(usePedido());
  return (
    <button
      type="button"
      onClick={abrirPedido}
      data-alvo-pedido
      className="btn-icone relative"
      aria-label={quantidade > 0 ? `Meu pedido, ${quantidade} ${quantidade === 1 ? "item" : "itens"}` : "Meu pedido, vazio"}
    >
      <IconeSacola />
      {quantidade > 0 && (
        <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-destaque px-1 font-mono text-[0.65rem] font-bold leading-5 text-sobre-destaque shadow-[0_0_14px_var(--brilho)]">
          {quantidade}
        </span>
      )}
    </button>
  );
}
