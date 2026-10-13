"use client";

import { useState } from "react";
import type { Chamado, EtapaDoChamado } from "@/data/amostra-do-painel";
import { aparelhoPorValor } from "@/data/servicos";
import { cn, formatarPreco } from "@/lib/utils";
import { AparelhoDoChamado, TD, TH } from "../comum";
import { usePainel } from "../estado";
import { etapasDoChamado, haDias, plural, prazo, proximaEtapa } from "../formato";
import { Botao, BotaoLink, Cartao, Chip, Filtros, JanelaDeMensagem, TituloDaPagina } from "../ui";

/**
 * OS CHAMADOS TÉCNICOS, por etapa da bancada (as do ERP de oficina da Amage,
 * encurtadas). Cada um anda com o verbo da vez, e o orçamento e o "está
 * pronto" saem como mensagem pronta para o cliente, sempre com o link da
 * página do conserto (`/conserto/<número>`, 13/10/2026).
 */
type Filtro = EtapaDoChamado | "abertos";

const ORDEM: EtapaDoChamado[] = ["recebido", "diagnostico", "aprovacao", "conserto", "peca", "pronto", "entregue"];
const primeiroNome = (cliente: string) => cliente.split(" ")[0];

/** A página que o cliente acompanha (`/conserto/<número>`). Só roda no navegador: o painel inteiro é montado no cliente. */
const paginaDoConserto = (c: Chamado) => `${window.location.origin}/conserto/${c.numero}`;

function mensagem(c: Chamado) {
  const ola = `Olá, ${primeiroNome(c.cliente)}! Aqui é o Marciano, da Visão Sul.`;
  const aparelho = aparelhoPorValor(c.aparelho)?.rotulo.toLowerCase() ?? "aparelho";
  // toda mensagem leva o link do conserto: o cliente acompanha sem precisar perguntar
  const acompanhe = `\n\nAcompanhe o conserto por aqui: ${paginaDoConserto(c)}`;
  if (c.etapa === "pronto") return `${ola}\nSeu ${aparelho} está pronto (chamado *${c.numero}*). ${c.local === "loja" ? "Pode passar na loja para retirar." : "Combino com você a hora de levar."}${acompanhe}`;
  if (c.etapa === "aprovacao" || c.etapa === "diagnostico")
    return `${ola}\nOrçamento do chamado *${c.numero}* (${aparelho}, ${c.problema.toLowerCase()}):\n${c.anotacao ?? "Diagnóstico feito."}\nValor: *${c.orcamento ? formatarPreco(c.orcamento) : "a combinar"}*\n\nPosso fazer o conserto? Dá para aprovar pela página do conserto.${acompanhe}`;
  return `${ola}\nSobre o chamado *${c.numero}* (${aparelho}): ${etapasDoChamado[c.etapa].rotulo.toLowerCase()}. Qualquer novidade eu aviso por aqui.${acompanhe}`;
}

export function ListaDeChamados() {
  const { estado, acoes } = usePainel();
  const [filtro, setFiltro] = useState<Filtro>("abertos");
  const [aberto, setAberto] = useState<string | null>(estado.chamados.find((c) => c.etapa === "aprovacao")?.numero ?? null);
  const [janela, setJanela] = useState<{ titulo: string; texto: string; para: string } | null>(null);

  const abertos = estado.chamados.filter((c) => c.etapa !== "entregue");
  const lista = estado.chamados
    .filter((c) => (filtro === "abertos" ? c.etapa !== "entregue" : c.etapa === filtro))
    .sort((a, b) => ORDEM.indexOf(a.etapa) - ORDEM.indexOf(b.etapa) || a.previsao - b.previsao);
  const escolhido = estado.chamados.find((c) => c.numero === aberto);
  const atrasados = abertos.filter((c) => c.previsao < 0 && c.etapa !== "pronto");

  const opcoes: { valor: Filtro; rotulo: string; quantos?: number }[] = [
    { valor: "abertos", rotulo: "Abertos", quantos: abertos.length },
    ...ORDEM.map((e) => ({ valor: e, rotulo: etapasDoChamado[e].rotulo, quantos: estado.chamados.filter((c) => c.etapa === e).length })),
  ];

  const avancar = (c: Chamado) => {
    const proxima = proximaEtapa[c.etapa];
    if (!proxima) return;
    acoes.mudarChamado(c.numero, proxima.etapa);
    // o orçamento e o "está pronto" já saem como mensagem para o cliente
    if (proxima.etapa === "aprovacao" || proxima.etapa === "pronto") {
      setJanela({
        titulo: proxima.etapa === "pronto" ? "Avisar que está pronto" : "Mandar orçamento para aprovar",
        texto: mensagem({ ...c, etapa: proxima.etapa }),
        para: `${c.cliente}, ${c.telefone}`,
      });
    }
  };

  return (
    <>
      <TituloDaPagina
        titulo="Chamados técnicos"
        linha={`${plural(abertos.length, "chamado aberto", "chamados abertos")} · ${plural(abertos.filter((c) => c.etapa === "aprovacao").length, "esperando aprovação", "esperando aprovação")}${atrasados.length ? ` · ${plural(atrasados.length, "atrasado", "atrasados")}` : ""}`}
      />
      <Filtros opcoes={opcoes} valor={filtro} aoMudar={setFiltro} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 overflow-hidden rounded-lg border border-linha bg-fundo-2">
          {lista.length === 0 ? (
            <p className="px-4 py-10 text-center text-texto-3">Nenhum chamado nesta etapa. Quando alguém abrir um pelo site, ele aparece aqui.</p>
          ) : (
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr>
                  <th className={cn(TH, "w-[8.5rem]")}>Chamado</th>
                  <th className={TH}>Aparelho</th>
                  <th className={cn(TH, "hidden w-40 2xl:table-cell")}>Atendimento</th>
                  <th className={cn(TH, "hidden w-28 md:table-cell")}>Previsão</th>
                  <th className={cn(TH, "hidden w-24 text-right sm:table-cell")}>Orçamento</th>
                  <th className={cn(TH, "w-[11.5rem]")}>Situação</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((c) => (
                  <tr key={c.numero} className={cn("cursor-pointer hover:bg-fundo", c.numero === aberto && "bg-fundo")} onClick={() => setAberto(c.numero)}>
                    <td className={TD}>
                      <button type="button" onClick={() => setAberto(c.numero)} className="font-semibold tabular-nums hover:underline" aria-pressed={c.numero === aberto}>
                        OS {c.numero}
                      </button>
                      <span className="block truncate text-xs text-texto-3">
                        {c.cliente} · {haDias(c.entrou)}
                      </span>
                    </td>
                    <td className={cn(TD, "max-w-0")}>
                      <AparelhoDoChamado chamado={c} />
                    </td>
                    <td className={cn(TD, "hidden truncate text-texto-2 2xl:table-cell")}>{c.local === "loja" ? "Trouxe na loja" : `Domicílio em ${c.cidade}`}</td>
                    <td className={cn(TD, "hidden md:table-cell", c.previsao < 0 && c.etapa !== "pronto" && c.etapa !== "entregue" ? "font-semibold text-erro" : "text-texto-2")}>
                      {c.etapa === "entregue" ? "entregue" : prazo(c.previsao)}
                    </td>
                    <td className={cn(TD, "hidden text-right tabular-nums sm:table-cell")}>{c.orcamento ? formatarPreco(c.orcamento) : <span className="text-texto-3">a fazer</span>}</td>
                    <td className={TD}>
                      <Chip tom={etapasDoChamado[c.etapa].tom}>{etapasDoChamado[c.etapa].rotulo}</Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {escolhido ? (
          <Cartao titulo={`OS ${escolhido.numero}`} acoes={<Chip tom={etapasDoChamado[escolhido.etapa].tom}>{etapasDoChamado[escolhido.etapa].rotulo}</Chip>} className="self-start">
            <AparelhoDoChamado chamado={escolhido} />
            <dl className="mt-4 space-y-2">
              <div className="flex justify-between gap-3">
                <dt className="text-texto-3">Cliente</dt>
                <dd className="text-right">
                  {escolhido.cliente}, {escolhido.telefone}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-texto-3">Atendimento</dt>
                <dd>{escolhido.local === "loja" ? "Trouxe na loja" : `Domicílio em ${escolhido.cidade}`}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-texto-3">Entrada</dt>
                <dd>{haDias(escolhido.entrou)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-texto-3">Orçamento</dt>
                <dd className="tabular-nums">{escolhido.orcamento ? formatarPreco(escolhido.orcamento) : "a fazer"}</dd>
              </div>
            </dl>
            {escolhido.anotacao && <p className="mt-4 rounded-md border border-linha bg-fundo px-3 py-2 text-texto-2">{escolhido.anotacao}</p>}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-linha pt-4">
              {proximaEtapa[escolhido.etapa] && (
                <Botao tom="primario" onClick={() => avancar(escolhido)}>
                  {proximaEtapa[escolhido.etapa]?.verbo}
                </Botao>
              )}
              {escolhido.etapa !== "entregue" && (
                <Botao onClick={() => setJanela({ titulo: "Avisar no WhatsApp", texto: mensagem(escolhido), para: `${escolhido.cliente}, ${escolhido.telefone}` })}>Avisar no WhatsApp</Botao>
              )}
              {/* a página de exemplo mostra a etapa da amostra, não a que foi andada aqui */}
              <BotaoLink href={`/conserto/${escolhido.numero}`} prefetch={false} target="_blank" rel="noopener">
                Ver como o cliente vê
              </BotaoLink>
            </div>
          </Cartao>
        ) : (
          <p className="self-start rounded-lg border border-dashed border-linha-forte px-4 py-8 text-center text-texto-3">Escolha um chamado para ver e andar com ele.</p>
        )}
      </div>

      <JanelaDeMensagem aberta={janela !== null} aoFechar={() => setJanela(null)} titulo={janela?.titulo ?? ""} para={janela?.para ?? ""} texto={janela?.texto ?? ""} />
    </>
  );
}
