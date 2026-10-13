"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FotoDoProduto } from "@/components/ui/foto-do-produto";
import { IconeCalendario, IconeChave, IconeNotebook, IconeSacola } from "@/components/ui/icones";
import { buscaramENaoAcharam, maisBuscados, pedidoQueChega } from "@/data/amostra-do-painel";
import { DONO } from "@/data/loja";
import { produtoPorSlug } from "@/data/produtos";
import { cn, formatarPreco } from "@/lib/utils";
import { AparelhoDoChamado, ItensDoPedido, TD, TH } from "./comum";
import { useAgora, usePainel } from "./estado";
import { dataPorExtenso, diasDaAgenda, etapasDoChamado, pagamentos, plural, quandoFoi, rotuloDoDia, saudacao, situacoesDoPedido, situacoesDoTeste } from "./formato";
import { Botao, BotaoLink, Cartao, Chip, Miniatura, Tile, TituloDaPagina } from "./ui";

type Aba = "site" | "receber" | "buscas";

function Barras({ titulo, itens }: { titulo: string; itens: { termo: string; vezes: number }[] }) {
  const maior = Math.max(...itens.map((i) => i.vezes));
  return (
    <div>
      <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-texto-3">{titulo}</p>
      <ol className="space-y-2.5">
        {itens.map((i) => (
          <li key={i.termo}>
            <span className="flex justify-between gap-3">
              <span className="truncate">{i.termo}</span>
              <span className="tabular-nums text-texto-3">{i.vezes}</span>
            </span>
            <span aria-hidden className="mt-1 block h-[3px] rounded-full bg-fundo-3">
              <span className="block h-full rounded-full bg-texto-3" style={{ width: `${(i.vezes / maior) * 100}%` }} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function VisaoGeral() {
  const { estado, acoes, totalDe, estoqueBaixo } = usePainel();
  const roteador = useRouter();
  const [aba, setAba] = useState<Aba>("site");
  const instante = useAgora();
  const agora = new Date(instante);

  const novos = estado.pedidos.filter((p) => p.situacao === "novo");
  const aguardando = estado.pedidos.filter((p) => p.situacao === "aguardando");
  const abertos = estado.chamados.filter((c) => c.etapa !== "entregue");
  const esperandoAprovacao = abertos.filter((c) => c.etapa === "aprovacao");
  const agenda = estado.testes.filter((t) => t.situacao === "a-confirmar" || t.situacao === "confirmado");
  const dias = diasDaAgenda(agora);
  const proximos = [...agenda].sort((a, b) => a.dia - b.dia || (a.periodo === "manha" ? -1 : 1)).slice(0, 4);
  const recentes = [...estado.pedidos].sort((a, b) => b.chegou - a.chegou).slice(0, 6);
  const jaChegou = estado.pedidos.some((p) => p.numero === pedidoQueChega.numero);

  const abas: { valor: Aba; rotulo: string; quantos?: number }[] = [
    { valor: "site", rotulo: "Chegaram pelo site" },
    { valor: "receber", rotulo: "A receber", quantos: aguardando.length },
    { valor: "buscas", rotulo: "Mais pesquisados" },
  ];

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-linha-forte bg-fundo-2 px-3.5 py-2.5 text-texto-2">
        <p>Prévia com dados de exemplo: nada aqui é real. Na fase 2, o painel recebe sozinho o que chega pelo site.</p>
        <Botao onClick={acoes.chegouPedido} disabled={jaChegou}>
          {jaChegou ? `O pedido ${pedidoQueChega.numero} já chegou` : "Simular pedido chegando"}
        </Botao>
      </div>

      <TituloDaPagina
        titulo={
          <>
            {saudacao(agora)}, <span className="text-destaque-texto">{DONO.primeiroNome}</span>
          </>
        }
        linha={
          <>
            <span className="first-letter:uppercase">{dataPorExtenso(agora)}</span> · {plural(novos.length, "pedido novo", "pedidos novos")}
            {esperandoAprovacao.length > 0 && ` · ${plural(esperandoAprovacao.length, "orçamento esperando resposta", "orçamentos esperando resposta")}`}
          </>
        }
        acoes={
          <BotaoLink tom="primario" href="/admin/pedidos">
            Ver pedidos
          </BotaoLink>
        }
      />

      {aguardando.length > 0 && (
        <Link
          href={`/admin/pedidos/${aguardando[0].numero}`}
          className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-aviso/25 bg-aviso-tinta px-3.5 py-2.5 text-aviso hover:border-aviso/50"
        >
          <span className="font-semibold">{plural(aguardando.length, "link de pagamento esperando", "links de pagamento esperando")}</span>
          <span>
            · Pedido {aguardando[0].numero} · {aguardando[0].cliente} · {formatarPreco(totalDe(aguardando[0]))}
          </span>
          <span className="ml-auto font-semibold">Ver</span>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile href="/admin/pedidos?situacao=novo" icone={<IconeSacola tamanho={18} />} numero={novos.length} rotulo={novos.length === 1 ? "pedido novo" : "pedidos novos"} tom="aviso" />
        <Tile
          href="/admin/chamados"
          icone={<IconeChave tamanho={18} />}
          numero={abertos.length}
          rotulo={esperandoAprovacao.length > 0 ? `chamados, ${esperandoAprovacao.length} esperando aprovação` : "chamados abertos"}
          curto="chamados abertos"
          tom="neutro"
        />
        <Tile href="/admin/testes" icone={<IconeCalendario tamanho={18} />} numero={agenda.length} rotulo="testes grátis na semana" curto="testes na semana" tom="destaque" />
        <Tile href="/admin/produtos?filtro=baixo" icone={<IconeNotebook tamanho={18} />} numero={estoqueBaixo.length} rotulo="com estoque baixo" curto="estoque baixo" tom="aviso" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Cartao
          corpo="p-0"
          titulo={
            <span className="flex gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
              {abas.map((a) => (
                <button
                  key={a.valor}
                  type="button"
                  aria-pressed={aba === a.valor}
                  onClick={() => setAba(a.valor)}
                  className={cn("relative h-11 shrink-0 px-2 font-semibold", aba === a.valor ? "text-texto" : "font-medium text-texto-3 hover:text-texto")}
                >
                  {a.rotulo}
                  {!!a.quantos && <span className="ml-1.5 tabular-nums text-texto-3">{a.quantos}</span>}
                  {aba === a.valor && <span aria-hidden className="absolute inset-x-2 -bottom-2 h-0.5 rounded-sm bg-destaque" />}
                </button>
              ))}
            </span>
          }
        >
          {aba === "site" && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse sm:min-w-[34rem]">
                <thead>
                  <tr>
                    <th className={TH}>Pedido</th>
                    <th className={cn(TH, "hidden sm:table-cell")}>Itens</th>
                    <th className={cn(TH, "text-right")}>Valor</th>
                    <th className={cn(TH, "hidden sm:table-cell")}>Chegou</th>
                    <th className={TH}>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {recentes.map((p) => (
                    <tr key={p.numero} onClick={() => roteador.push(`/admin/pedidos/${p.numero}`)} className="cursor-pointer hover:bg-fundo">
                      <td className={TD}>
                        <Link href={`/admin/pedidos/${p.numero}`} className="font-semibold tabular-nums hover:underline">
                          {p.numero}
                        </Link>
                        <span className="block max-w-[9.5rem] truncate text-xs text-texto-3">
                          {p.cliente} · {p.cidade}
                        </span>
                      </td>
                      <td className={cn(TD, "hidden w-[40%] max-w-0 sm:table-cell")}>
                        <ItensDoPedido pedido={p} />
                      </td>
                      <td className={cn(TD, "text-right tabular-nums")}>{formatarPreco(totalDe(p))}</td>
                      <td className={cn(TD, "hidden whitespace-nowrap text-texto-2 sm:table-cell")}>{quandoFoi(p.chegou, instante)}</td>
                      <td className={TD}>
                        <Chip tom={situacoesDoPedido[p.situacao].tom}>{situacoesDoPedido[p.situacao].rotulo}</Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {aba === "receber" &&
            (aguardando.length === 0 ? (
              <p className="px-4 py-8 text-center text-texto-3">Nada esperando pagamento.</p>
            ) : (
              <ul>
                {aguardando.map((p) => (
                  <li key={p.numero} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-linha px-4 py-3 last:border-b-0">
                    <Link href={`/admin/pedidos/${p.numero}`} className="font-semibold hover:underline">
                      Pedido {p.numero}
                    </Link>
                    <span className="text-texto-2">{p.cliente}</span>
                    <span className="text-texto-2">{pagamentos[p.pagamento]}</span>
                    <span className="ml-auto font-semibold tabular-nums">{formatarPreco(totalDe(p))}</span>
                    <Chip tom="aviso">{p.pagarEm ? "Link enviado agora" : "Link enviado"}</Chip>
                  </li>
                ))}
              </ul>
            ))}
          {aba === "buscas" && (
            <div className="grid gap-6 p-4 sm:grid-cols-2">
              <Barras titulo="Mais buscados no site" itens={maisBuscados} />
              <Barras titulo="Buscaram e não acharam" itens={buscaramENaoAcharam} />
              <p className="text-xs text-texto-3 sm:col-span-2">O que procuram e você ainda não tem na vitrine é a pista do que vale encomendar.</p>
            </div>
          )}
        </Cartao>

        <div className="space-y-5">
          <Cartao
            titulo="Próximos testes grátis"
            acoes={
              <Link href="/admin/testes" className="text-xs font-semibold text-texto-2 hover:text-texto">
                Agenda
              </Link>
            }
            corpo="p-0"
          >
            <ul>
              {proximos.map((t) => {
                const produto = produtoPorSlug(t.slug);
                return (
                  <li key={t.id} className="flex items-center gap-3 border-b border-linha px-4 py-2.5 last:border-b-0">
                    {produto && (
                      <Miniatura>
                        <FotoDoProduto produto={produto} sizes="40px" semSombra alt="" />
                      </Miniatura>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{produto?.nomeCurto}</span>
                      <span className="block truncate text-xs text-texto-3">
                        {dias[t.dia] ? rotuloDoDia(dias[t.dia]) : ""}, {t.periodo === "manha" ? "manhã" : "tarde"} · {t.cliente}
                      </span>
                    </span>
                    <Chip tom={situacoesDoTeste[t.situacao].tom}>{situacoesDoTeste[t.situacao].rotulo}</Chip>
                  </li>
                );
              })}
            </ul>
          </Cartao>
          <Cartao titulo="Atividade recente" corpo="p-0">
            <ul>
              {estado.atividade.slice(0, 6).map((e) => (
                <li key={`${e.quando}-${e.texto}`} className="flex gap-3 border-b border-linha px-4 py-2.5 last:border-b-0">
                  <span className="min-w-0 flex-1">{e.texto}</span>
                  <span className="shrink-0 text-xs text-texto-3">{quandoFoi(e.quando, instante)}</span>
                </li>
              ))}
            </ul>
          </Cartao>
        </div>
      </div>

      <Cartao
        className="mt-5"
        titulo="Bancada"
        acoes={
          <Link href="/admin/chamados" className="text-xs font-semibold text-texto-2 hover:text-texto">
            Ver chamados
          </Link>
        }
        corpo="p-0"
      >
        <ul className="grid sm:grid-cols-2">
          {abertos.map((c) => (
            <li key={c.numero} className="flex items-center gap-3 border-b border-linha px-4 py-2.5">
              <span className="w-10 shrink-0 font-semibold tabular-nums">{c.numero}</span>
              <span className="min-w-0 flex-1">
                <AparelhoDoChamado chamado={c} />
              </span>
              <Chip tom={etapasDoChamado[c.etapa].tom}>{etapasDoChamado[c.etapa].rotulo}</Chip>
            </li>
          ))}
        </ul>
      </Cartao>
    </>
  );
}
