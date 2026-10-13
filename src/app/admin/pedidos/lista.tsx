"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SituacaoDoPedido } from "@/data/amostra-do-painel";
import { cn, formatarPreco } from "@/lib/utils";
import { ItensDoPedido, TD, TH } from "../comum";
import { useAgora, usePainel } from "../estado";
import { pagamentos, plural, quandoFoi, situacoesDoPedido } from "../formato";
import { Chip, Filtros, TituloDaPagina } from "../ui";

type Filtro = SituacaoDoPedido | "todos";
const VENDIDOS: SituacaoDoPedido[] = ["pago", "pronto", "saiu", "entregue"];

/** O filtro vem da visão geral pela URL (`?situacao=novo`); a lista só existe no navegador. */
function filtroDaUrl(): Filtro {
  const s = new URLSearchParams(window.location.search).get("situacao");
  return s && s in situacoesDoPedido ? (s as SituacaoDoPedido) : "todos";
}

export function ListaDePedidos() {
  const { estado, totalDe } = usePainel();
  const agora = useAgora();
  const roteador = useRouter();
  const [filtro, setFiltro] = useState<Filtro>(filtroDaUrl);

  const conta = (s: SituacaoDoPedido) => estado.pedidos.filter((p) => p.situacao === s).length;
  const aguardando = estado.pedidos.filter((p) => p.situacao === "aguardando");
  const vendidos = estado.pedidos.filter((p) => VENDIDOS.includes(p.situacao));
  const lista = [...estado.pedidos].filter((p) => filtro === "todos" || p.situacao === filtro).sort((a, b) => b.chegou - a.chegou);

  const opcoes: { valor: Filtro; rotulo: string; quantos?: number }[] = [
    { valor: "todos", rotulo: "Todos", quantos: estado.pedidos.length },
    { valor: "novo", rotulo: "Novos", quantos: conta("novo") },
    { valor: "aguardando", rotulo: "Aguardando pagamento", quantos: conta("aguardando") },
    { valor: "pago", rotulo: "Pagos", quantos: conta("pago") },
    { valor: "pronto", rotulo: "Prontos para retirar", quantos: conta("pronto") },
    { valor: "saiu", rotulo: "Saiu para entrega", quantos: conta("saiu") },
    { valor: "entregue", rotulo: "Entregues", quantos: conta("entregue") },
    { valor: "cancelado", rotulo: "Cancelados", quantos: conta("cancelado") },
  ];

  return (
    <>
      <TituloDaPagina
        titulo="Pedidos"
        linha={`${plural(conta("novo"), "novo", "novos")} · ${plural(aguardando.length, "aguardando pagamento", "aguardando pagamento")}, ${formatarPreco(aguardando.reduce((s, p) => s + totalDe(p), 0))} · ${plural(vendidos.length, "venda no mês", "vendas no mês")}, ${formatarPreco(vendidos.reduce((s, p) => s + totalDe(p), 0))}`}
      />
      <Filtros opcoes={opcoes} valor={filtro} aoMudar={setFiltro} />
      <div className="overflow-hidden rounded-lg border border-linha bg-fundo-2">
        {lista.length === 0 ? (
          <p className="px-4 py-10 text-center text-texto-3">Nenhum pedido nesta situação.</p>
        ) : (
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                <th className={cn(TH, "w-[9.5rem]")}>Pedido</th>
                <th className={TH}>Itens</th>
                <th className={cn(TH, "hidden w-40 lg:table-cell")}>Entrega</th>
                <th className={cn(TH, "hidden w-40 xl:table-cell")}>Pagamento</th>
                <th className={cn(TH, "hidden w-28 text-right sm:table-cell")}>Valor</th>
                <th className={cn(TH, "hidden w-28 md:table-cell")}>Chegou</th>
                <th className={cn(TH, "w-[11.5rem]")}>Situação</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.numero} onClick={() => roteador.push(`/admin/pedidos/${p.numero}`)} className="cursor-pointer hover:bg-fundo">
                  <td className={TD}>
                    <Link href={`/admin/pedidos/${p.numero}`} className="font-semibold tabular-nums hover:underline">
                      {p.numero}
                    </Link>
                    {p.situacao === "novo" && agora - p.chegou < 10 * 60_000 && <span className="ml-1.5 text-xs font-semibold text-aviso">agora</span>}
                    <span className="block truncate text-xs text-texto-3">
                      {p.cliente} · {p.cidade}
                    </span>
                  </td>
                  <td className={cn(TD, "max-w-0")}>
                    <ItensDoPedido pedido={p} />
                  </td>
                  <td className={cn(TD, "hidden truncate text-texto-2 lg:table-cell")}>{p.entrega === "retirar" ? "Retira na loja" : `Entregar em ${p.cidade}`}</td>
                  <td className={cn(TD, "hidden truncate text-texto-2 xl:table-cell")}>{pagamentos[p.pagamento]}</td>
                  <td className={cn(TD, "hidden text-right tabular-nums sm:table-cell")}>{formatarPreco(totalDe(p))}</td>
                  <td className={cn(TD, "hidden whitespace-nowrap text-texto-2 md:table-cell")}>{quandoFoi(p.chegou, agora)}</td>
                  <td className={TD}>
                    <Chip tom={situacoesDoPedido[p.situacao].tom}>{situacoesDoPedido[p.situacao].rotulo}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
