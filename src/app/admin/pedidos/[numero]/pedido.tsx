"use client";

import Link from "next/link";
import { useState } from "react";
import { FotoDoProduto } from "@/components/ui/foto-do-produto";
import { pedidoQueChega, type SituacaoDoPedido } from "@/data/amostra-do-painel";
import { mensagemParaALoja } from "@/data/contato";
import { produtoPorSlug } from "@/data/produtos";
import { montarConversa } from "@/lib/conversa";
import { cn, formatarPreco } from "@/lib/utils";
import { useAgora, usePainel, type PedidoNoPainel } from "../../estado";
import { horaDe, pagamentos, quandoFoi, situacoesDoPedido } from "../../formato";
import { IconeVoltar } from "../../icones";
import { Bolha, Botao, Cartao, Chip, JanelaDeMensagem, Miniatura, Recado } from "../../ui";

/**
 * O PEDIDO POR DENTRO, no modelo da Prime: as etapas com o botão-verbo da
 * vez, os itens, o pagamento e, ao lado, a mensagem exata que o site manda
 * hoje para o WhatsApp da loja. É a ponte da demonstração: o que hoje chega
 * solto na conversa vira um pedido que anda sozinho.
 */
const ETAPAS: { rotulo: string; situacoes: SituacaoDoPedido[] }[] = [
  { rotulo: "Novo", situacoes: ["novo"] },
  { rotulo: "Aguardando pagamento", situacoes: ["aguardando"] },
  { rotulo: "Pago", situacoes: ["pago"] },
  { rotulo: "Pronto ou saiu", situacoes: ["pronto", "saiu"] },
  { rotulo: "Entregue", situacoes: ["entregue"] },
];

const primeiroNome = (cliente: string) => cliente.split(" ")[0];

function linhasDosItens(pedido: PedidoNoPainel) {
  return pedido.itens.map((i) => `${i.qtd}x ${produtoPorSlug(i.slug)?.nomeCurto ?? i.slug}`).join("\n");
}

/** A mensagem que a loja manda ao cliente em cada etapa (o que o "Avisar no WhatsApp" monta). */
function mensagemAoCliente(pedido: PedidoNoPainel, total: number) {
  const ola = `Olá, ${primeiroNome(pedido.cliente)}! Aqui é o Marciano, da Visão Sul.`;
  switch (pedido.situacao) {
    case "novo":
    case "aguardando":
      return `${ola}\nSeu pedido *${pedido.numero}* está confirmado:\n${linhasDosItens(pedido)}\nTotal: *${formatarPreco(total)}*\n\nPague por Pix ou no cartão em até 10x pelo link:\n(link de pagamento)`;
    case "pago":
      return `${ola}\nRecebemos o pagamento do pedido *${pedido.numero}*. Já estamos separando e aviso quando estiver ${pedido.entrega === "retirar" ? "pronto para retirar" : "saindo para entrega"}.`;
    case "pronto":
      return `${ola}\nSeu pedido *${pedido.numero}* está pronto para retirar na loja:\n${linhasDosItens(pedido)}`;
    case "saiu":
      return `${ola}\nSeu pedido *${pedido.numero}* saiu para entrega em ${pedido.cidade}. Logo chega aí!`;
    case "entregue":
      return `${ola}\nObrigado pela compra! Qualquer coisa com o pedido *${pedido.numero}*, é só chamar aqui.`;
    case "cancelado":
      return `${ola}\nO pedido *${pedido.numero}* foi cancelado. Se quiser, a gente ajuda a escolher outro.`;
  }
}

/** A mensagem que chegou: a mesma que a rota `/whatsapp` monta para o pedido feito pela sacola. */
function mensagemQueChegou(pedido: PedidoNoPainel) {
  const p = new URLSearchParams({ assunto: "pedido", nome: pedido.cliente, entrega: pedido.entrega, cidade: pedido.cidade });
  for (const i of pedido.itens) p.set(`qtd-${i.slug}`, String(i.qtd));
  return mensagemParaALoja(...montarConversa(p));
}

export function PedidoPorDentro({ numero }: { numero: string }) {
  const { estado, acoes, precoDe, totalDe } = usePainel();
  const agora = useAgora();
  // o texto fica preso ao abrir: o Pix pode cair com a janela aberta e mudar a etapa
  const [janela, setJanela] = useState<{ titulo: string; texto: string } | null>(null);
  const [cancelando, setCancelando] = useState(false);
  const pedido = estado.pedidos.find((p) => p.numero === numero);

  if (!pedido) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="font-display text-lg font-semibold">O pedido {numero} ainda não chegou.</p>
        {numero === pedidoQueChega.numero && <p className="mt-2 text-texto-2">Ele chega quando você usar &quot;Simular pedido chegando&quot; na visão geral.</p>}
        <Link href="/admin" className="mt-5 inline-block font-semibold text-destaque-texto hover:underline">
          Ir para a visão geral
        </Link>
      </div>
    );
  }

  const total = totalDe(pedido);
  const etapaAtual = ETAPAS.findIndex((e) => e.situacoes.includes(pedido.situacao));
  const fechado = pedido.situacao === "entregue" || pedido.situacao === "cancelado";
  const pagoAgora = pedido.pagoEm && agora - pedido.pagoEm < 5 * 60_000;

  let verbo: { rotulo: string; acao: () => void; espera?: boolean } | undefined;
  if (pedido.situacao === "novo")
    verbo = {
      rotulo: "Confirmar e mandar link de pagamento",
      acao: () => {
        acoes.enviarLink(pedido.numero);
        setJanela({ titulo: "Mensagem com o link de pagamento", texto: mensagemAoCliente({ ...pedido, situacao: "aguardando" }, total) });
      },
    };
  else if (pedido.situacao === "aguardando")
    verbo = pedido.pagarEm ? { rotulo: "Esperando o pagamento", acao: () => {}, espera: true } : { rotulo: "Marcar como pago", acao: () => acoes.mudarPedido(pedido.numero, "pago") };
  else if (pedido.situacao === "pago")
    verbo =
      pedido.entrega === "retirar"
        ? { rotulo: "Marcar como pronto para retirar", acao: () => acoes.mudarPedido(pedido.numero, "pronto") }
        : { rotulo: "Marcar como saiu para entrega", acao: () => acoes.mudarPedido(pedido.numero, "saiu") };
  else if (pedido.situacao === "pronto" || pedido.situacao === "saiu") verbo = { rotulo: "Marcar como entregue", acao: () => acoes.mudarPedido(pedido.numero, "entregue") };

  const quantos = pedido.itens.reduce((s, i) => s + i.qtd, 0);

  return (
    <>
      <Link href="/admin/pedidos" className="mb-3 inline-flex items-center gap-1 text-texto-2 hover:text-texto">
        <IconeVoltar tamanho={16} />
        Pedidos
      </Link>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex flex-wrap items-center gap-2.5 font-display text-2xl font-semibold tracking-tight">
            Pedido {pedido.numero}
            <Chip tom={situacoesDoPedido[pedido.situacao].tom}>{situacoesDoPedido[pedido.situacao].rotulo}</Chip>
          </h1>
          <p className="mt-1 text-texto-2">
            {pedido.cliente} · chegou pelo site {quandoFoi(pedido.chegou, agora)} · {quantos} {quantos === 1 ? "item" : "itens"}
          </p>
        </div>
        <Botao onClick={() => setJanela({ titulo: "Avisar no WhatsApp", texto: mensagemAoCliente(pedido, total) })}>Avisar no WhatsApp</Botao>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <Cartao titulo="Etapas">
            {pedido.situacao === "cancelado" ? (
              <p className="text-texto-2">Pedido cancelado.</p>
            ) : (
              <ol className="grid grid-cols-5 gap-1.5">
                {ETAPAS.map((e, i) => (
                  <li key={e.rotulo}>
                    <span aria-hidden className={cn("block h-1.5 rounded-sm", i <= etapaAtual ? "bg-destaque" : "bg-fundo-3")} />
                    {/* no celular só a etapa da vez tem nome: os cinco não cabem lado a lado */}
                    <span className={cn("mt-1.5 block text-xs", i === etapaAtual ? "whitespace-nowrap font-semibold text-texto" : "text-texto-3 max-sm:hidden")}>{e.rotulo}</span>
                  </li>
                ))}
              </ol>
            )}
            {pagoAgora && (
              <div className="mt-4">
                <Recado>
                  {pedido.pagamento === "cartao" ? "Cartão aprovado" : "Pix confirmado"} sozinho às {horaDe(pedido.pagoEm ?? 0)}. O pedido {pedido.numero} está pago e ninguém precisou conferir extrato.
                </Recado>
              </div>
            )}
            {!fechado && (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-linha pt-4">
                {verbo && (
                  <Botao tom={verbo.espera ? "secundario" : "primario"} onClick={verbo.acao} disabled={verbo.espera}>
                    {verbo.espera && <span aria-hidden className="size-2 animate-pulse rounded-full bg-aviso" />}
                    {verbo.rotulo}
                  </Botao>
                )}
                {cancelando ? (
                  <span className="ml-auto flex items-center gap-2">
                    <span className="text-texto-2">Cancelar o pedido {pedido.numero}?</span>
                    <Botao tom="perigo" onClick={() => acoes.mudarPedido(pedido.numero, "cancelado")}>
                      Sim, cancelar
                    </Botao>
                    <Botao tom="texto" onClick={() => setCancelando(false)}>
                      Voltar
                    </Botao>
                  </span>
                ) : (
                  <Botao tom="perigo" className="ml-auto" onClick={() => setCancelando(true)}>
                    Cancelar pedido
                  </Botao>
                )}
              </div>
            )}
          </Cartao>

          <Cartao titulo="Itens" corpo="p-0">
            <ul>
              {pedido.itens.map((i) => {
                const produto = produtoPorSlug(i.slug);
                if (!produto) return null;
                return (
                  <li key={i.slug} className="flex items-center gap-3 border-b border-linha px-4 py-3">
                    <Miniatura>
                      <FotoDoProduto produto={produto} sizes="40px" semSombra alt="" />
                    </Miniatura>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{produto.nome}</span>
                      <span className="block text-xs text-texto-3">
                        {i.qtd} x {formatarPreco(precoDe(i.slug))}
                      </span>
                    </span>
                    <span className="tabular-nums">{formatarPreco(precoDe(i.slug) * i.qtd)}</span>
                  </li>
                );
              })}
            </ul>
            <p className="flex justify-between px-4 py-3 font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatarPreco(total)}</span>
            </p>
          </Cartao>

          <Cartao titulo="Pagamento">
            <p className="font-semibold">{pagamentos[pedido.pagamento]}</p>
            <p className="mt-1 text-texto-2">
              {pedido.situacao === "novo" && "Ainda não mandado. Ao confirmar, o cliente recebe o link para pagar no Pix ou no cartão."}
              {pedido.situacao === "aguardando" && (pedido.pagarEm ? "Link enviado agora. Esperando o cliente pagar." : "Link enviado. Esperando o cliente pagar.")}
              {pedido.situacao !== "novo" && pedido.situacao !== "aguardando" && pedido.situacao !== "cancelado" && (pedido.pagoEm ? `Pago às ${horaDe(pedido.pagoEm)}, confirmado sozinho.` : "Pago.")}
              {pedido.situacao === "cancelado" && "Nada a receber."}
            </p>
            <p className="mt-3 border-t border-linha pt-3 text-xs text-texto-3">Fase 2: Pix e cartão em até 10x pelo Mercado Pago. O pedido anda sozinho quando o dinheiro entra.</p>
          </Cartao>
        </div>

        <div className="space-y-5">
          <Cartao titulo="Cliente">
            <p className="font-semibold">{pedido.cliente}</p>
            <p className="text-texto-2">WhatsApp {pedido.telefone}</p>
            <p className="text-texto-2">{pedido.cidade}</p>
          </Cartao>
          <Cartao titulo="Entrega">
            <p>{pedido.entrega === "retirar" ? "Retira na loja" : `Entregar em ${pedido.cidade}`}</p>
          </Cartao>
          {pedido.nota && (
            <Cartao titulo="Nota interna">
              <p className="text-texto-2">{pedido.nota}</p>
            </Cartao>
          )}
          <Cartao titulo="A mensagem que chegou" corpo="bg-[#efeae2] p-4">
            <Bolha texto={mensagemQueChegou(pedido)} />
            <p className="mt-3 text-xs text-[#54656f]">É o que o site manda hoje para o WhatsApp da loja. No painel, ela já chega como pedido.</p>
          </Cartao>
        </div>
      </div>

      <JanelaDeMensagem
        aberta={janela !== null}
        aoFechar={() => setJanela(null)}
        titulo={janela?.titulo ?? ""}
        para={`${pedido.cliente}, ${pedido.telefone}`}
        texto={janela?.texto ?? ""}
      />
    </>
  );
}
