"use client";

import { useState } from "react";
import { FotoDoProduto } from "@/components/ui/foto-do-produto";
import type { SituacaoDoTeste, Teste } from "@/data/amostra-do-painel";
import { produtoPorSlug } from "@/data/produtos";
import { cn } from "@/lib/utils";
import { TD, TH } from "../comum";
import { useAgora, usePainel } from "../estado";
import { diasDaAgenda, plural, rotuloDoDia, situacoesDoTeste } from "../formato";
import { Botao, Cartao, Chip, JanelaDeMensagem, Miniatura, TituloDaPagina } from "../ui";

/**
 * A AGENDA DOS TESTES GRÁTIS: o mesmo recorte do agendamento do site (os
 * próximos seis dias de loja, manhã e tarde). "Teste grátis antes de
 * comprar" é a promessa que mais aparece nos posts da loja; aqui ela ganha
 * um número: quantos testes viraram venda.
 */
const PERIODOS = [
  { valor: "manha", rotulo: "Manhã" },
  { valor: "tarde", rotulo: "Tarde" },
] as const;

const primeiroNome = (cliente: string) => cliente.split(" ")[0];

export function AgendaDeTestes() {
  const { estado, acoes } = usePainel();
  const [janela, setJanela] = useState<{ texto: string; para: string } | null>(null);
  const agora = useAgora();
  const dias = diasDaAgenda(new Date(agora));
  const ordenados = [...estado.testes].sort((a, b) => a.dia - b.dia || (a.periodo === "manha" ? -1 : 1));
  const { feitos, viraramVenda } = estado.testesNoMes;
  const taxa = feitos ? Math.round((viraramVenda / feitos) * 100) : 0;

  const quando = (t: Teste) => `${dias[t.dia] ? rotuloDoDia(dias[t.dia]) : ""}, ${t.periodo === "manha" ? "de manhã" : "à tarde"}`;
  const aviso = (t: Teste) =>
    `Olá, ${primeiroNome(t.cliente)}! Aqui é o Marciano, da Visão Sul.\nSeu *teste grátis* do *${produtoPorSlug(t.slug)?.nomeCurto}* está confirmado: ${quando(t)}.\nTe espero na loja!`;

  const acoesDoTeste = (t: Teste) => {
    const botoes: { rotulo: string; situacao: SituacaoDoTeste; tom?: "primario" | "secundario" | "texto" }[] = [];
    if (t.situacao === "a-confirmar") botoes.push({ rotulo: "Confirmar", situacao: "confirmado", tom: "primario" });
    if (t.situacao === "confirmado") {
      botoes.push({ rotulo: "Veio", situacao: "veio" }, { rotulo: "Virou venda", situacao: "virou-venda", tom: "primario" }, { rotulo: "Não veio", situacao: "nao-veio", tom: "texto" });
    }
    if (t.situacao === "veio") botoes.push({ rotulo: "Virou venda", situacao: "virou-venda", tom: "primario" });
    return botoes;
  };

  return (
    <>
      <TituloDaPagina titulo="Testes grátis" linha={`${plural(feitos, "teste no mês", "testes no mês")} · ${viraramVenda} viraram venda (${taxa}%)`} />

      <Cartao titulo="Semana" corpo="overflow-x-auto p-0">
        <table className="w-full min-w-[46rem] table-fixed border-collapse">
          <thead>
            <tr>
              <th className={cn(TH, "w-20")}>
                <span className="sr-only">Período</span>
              </th>
              {dias.map((d) => (
                <th key={d.toDateString()} className={cn(TH, "first-letter:uppercase")}>
                  {rotuloDoDia(d)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODOS.map((p) => (
              <tr key={p.valor}>
                <th scope="row" className="border-b border-linha px-3 text-left align-top text-xs font-semibold text-texto-3">
                  <span className="block pt-3">{p.rotulo}</span>
                </th>
                {dias.map((d, i) => {
                  const aqui = estado.testes.filter((t) => t.dia === i && t.periodo === p.valor);
                  return (
                    <td key={d.toDateString()} className="h-24 border-b border-l border-linha p-1.5 align-top">
                      {aqui.map((t) => {
                        const produto = produtoPorSlug(t.slug);
                        return (
                          <div key={t.id} className={cn("rounded-md border px-2 py-1.5", t.situacao === "virou-venda" ? "border-ok/30 bg-ok-tinta" : "border-linha bg-fundo")}>
                            <p className="truncate font-semibold">{produto?.nomeCurto}</p>
                            <p className="truncate text-xs text-texto-3">{t.cliente}</p>
                            <Chip tom={situacoesDoTeste[t.situacao].tom} className="mt-1">
                              {situacoesDoTeste[t.situacao].rotulo}
                            </Chip>
                          </div>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Cartao>

      <Cartao titulo="Agendados" className="mt-5" corpo="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse">
            <thead>
              <tr>
                <th className={TH}>Quando</th>
                <th className={TH}>Produto</th>
                <th className={TH}>Cliente</th>
                <th className={TH}>Situação</th>
                <th className={TH}>
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((t) => {
                const produto = produtoPorSlug(t.slug);
                return (
                  <tr key={t.id}>
                    <td className={cn(TD, "whitespace-nowrap first-letter:uppercase")}>{quando(t)}</td>
                    <td className={TD}>
                      <span className="flex items-center gap-2.5">
                        {produto && (
                          <Miniatura>
                            <FotoDoProduto produto={produto} sizes="40px" semSombra alt="" />
                          </Miniatura>
                        )}
                        <span className="font-semibold">{produto?.nomeCurto}</span>
                      </span>
                    </td>
                    <td className={cn(TD, "text-texto-2")}>{t.cliente}</td>
                    <td className={TD}>
                      <Chip tom={situacoesDoTeste[t.situacao].tom}>{situacoesDoTeste[t.situacao].rotulo}</Chip>
                    </td>
                    <td className={cn(TD, "whitespace-nowrap text-right")}>
                      <span className="inline-flex gap-1.5">
                        {acoesDoTeste(t).map((b) => (
                          <Botao key={b.situacao} tom={b.tom ?? "secundario"} onClick={() => acoes.mudarTeste(t.id, b.situacao)}>
                            {b.rotulo}
                          </Botao>
                        ))}
                        {(t.situacao === "a-confirmar" || t.situacao === "confirmado") && (
                          <Botao tom="texto" onClick={() => setJanela({ texto: aviso(t), para: `${t.cliente}, ${t.telefone}` })}>
                            Avisar
                          </Botao>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Cartao>

      <JanelaDeMensagem aberta={janela !== null} aoFechar={() => setJanela(null)} titulo="Confirmar o teste no WhatsApp" para={janela?.para ?? ""} texto={janela?.texto ?? ""} />
    </>
  );
}
