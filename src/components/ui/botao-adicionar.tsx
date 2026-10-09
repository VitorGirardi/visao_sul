"use client";

import { useState } from "react";
import { IconeCheck, IconeSacola } from "@/components/ui/icones";
import { adicionarAoPedido } from "@/lib/pedido";
import { voarParaOPedido } from "@/lib/voar-para-o-pedido";
import { cn } from "@/lib/utils";

/**
 * Põe o produto no pedido. A foto voa até a sacola do cabeçalho e o botão
 * confirma por um instante ("No pedido"). A gaveta não abre sozinha: quem
 * está escolhendo continua escolhendo; a sacola pulsa e mostra o número.
 */
export function BotaoAdicionar({
  slug,
  className,
  compacto = false,
  rotulo = "Adicionar ao pedido",
}: {
  slug: string;
  className?: string;
  compacto?: boolean;
  rotulo?: string;
}) {
  const [feito, setFeito] = useState(false);
  return (
    <button
      type="button"
      onClick={(e) => {
        adicionarAoPedido(slug);
        voarParaOPedido(e.currentTarget.closest<HTMLElement>("[data-foto-do-pedido]") ?? document.querySelector<HTMLElement>(`[data-foto="${slug}"]`));
        setFeito(true);
        window.setTimeout(() => setFeito(false), 1600);
      }}
      className={cn(compacto ? "btn-icone relative z-20 bg-fundo-2" : "btn btn-primario relative z-20", className)}
      aria-label={compacto ? rotulo : undefined}
      aria-live="polite"
    >
      {feito ? <IconeCheck /> : <IconeSacola />}
      {!compacto && <span>{feito ? "No pedido" : rotulo}</span>}
    </button>
  );
}
