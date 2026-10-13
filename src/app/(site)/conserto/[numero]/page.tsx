import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IconeCheck, IconeWhatsApp, iconesPorNome } from "@/components/ui/icones";
import { chamadosDeExemplo } from "@/data/amostra-do-painel";
import { entrouHa, LINHA_DO_CONSERTO, MOMENTO_DO_CONSERTO, previsaoParaOCliente } from "@/data/conserto";
import { linkDaConversa } from "@/data/contato";
import { DONO, horarioOuEmBreve, LOJA } from "@/data/loja";
import { aparelhoPorValor } from "@/data/servicos";
import { cn, formatarPreco } from "@/lib/utils";

/**
 * ACOMPANHE SEU CONSERTO (13/10/2026, prévia da fase 2): o que o cliente vê
 * pelo link que recebe no WhatsApp quando abre o chamado. Uma página por
 * chamado de exemplo do painel (`data/amostra-do-painel.ts`); na fase 2 o
 * chamado vem do banco e a página anda sozinha a cada etapa da bancada.
 * Textos em `data/conserto.ts`.
 */
export function generateStaticParams() {
  return chamadosDeExemplo.map((c) => ({ numero: c.numero }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/conserto/[numero]">): Promise<Metadata> {
  const { numero } = await params;
  return {
    title: `Conserto OS ${numero}`,
    description: "Acompanhe o seu conserto na Visão Sul: diagnóstico, orçamento e quando fica pronto.",
    // é a página de um cliente: nunca no Google, nem depois de o site ir ao ar
    robots: { index: false, follow: false },
  };
}

export default async function PaginaDoConserto({ params }: PageProps<"/conserto/[numero]">) {
  const { numero } = await params;
  const chamado = chamadosDeExemplo.find((c) => c.numero === numero);
  if (!chamado) notFound();

  const aparelho = aparelhoPorValor(chamado.aparelho);
  const Icone = iconesPorNome[aparelho?.icone ?? "chave"];
  const momento = MOMENTO_DO_CONSERTO[chamado.etapa];
  const entregue = chamado.etapa === "entregue";
  const posicao = LINHA_DO_CONSERTO.findIndex((passo) => passo.etapas.includes(chamado.etapa));
  const falar = (acao?: "aprovar" | "duvida" | "retirar") => linkDaConversa("os", acao ? { numero, acao } : { numero });

  return (
    <div className="recipiente max-w-3xl pb-24 pt-28 md:pt-36">
      <p className="sobretitulo">Acompanhe seu conserto</p>
      <h1 className="titulo-1 mt-4">OS {chamado.numero}</h1>
      <div className="mt-6 flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-linha bg-fundo-2 text-destaque-texto">
          <Icone tamanho={24} />
        </span>
        <p className="text-texto-2">
          <strong className="font-display text-lg text-texto">{aparelho?.rotulo ?? "Aparelho"}</strong> · {chamado.problema}
          <br />
          {chamado.local === "loja" ? "Trazido na loja" : `Atendimento em casa, em ${chamado.cidade}`} · entrou {entrouHa(chamado.entrou)}
        </p>
      </div>

      <p className="mt-6 rounded-cartao border border-dashed border-linha-forte px-4 py-3 text-sm text-texto-2">
        <strong className="text-texto">Exemplo da fase 2.</strong> Na loja de verdade, o cliente recebe este link no WhatsApp quando abre o
        chamado, e a página anda sozinha a cada etapa da bancada.
      </p>

      <section className="cartao mt-8 p-6 md:p-8" aria-labelledby="titulo-do-momento">
        <p className="rotulo-mono">{entregue ? "Concluído" : "Agora"}</p>
        <h2 id="titulo-do-momento" className="titulo-2 mt-3">
          {momento.titulo}
        </h2>
        {momento.nota && chamado.anotacao && (
          <div className="mt-6 rounded-2xl border border-linha bg-fundo px-4 py-3">
            <p className="rotulo-mono">{momento.nota}</p>
            <p className="mt-1.5 text-texto">{chamado.anotacao}</p>
          </div>
        )}
        {chamado.etapa === "aprovacao" && chamado.orcamento && (
          <p className="mt-5 flex items-baseline justify-between gap-4 border-b border-linha pb-5">
            <span className="text-texto-2">Valor do conserto</span>
            <strong className="font-display text-3xl font-bold tabular-nums tracking-tight">{formatarPreco(chamado.orcamento)}</strong>
          </p>
        )}
        <p className="texto-grande mt-5">{momento.texto}</p>
        {chamado.etapa === "pronto" && (
          <p className="mt-3 text-texto-2">
            {chamado.local === "loja" ? `Pode passar na loja para retirar. ${horarioOuEmBreve()}.` : "A loja combina com você a hora de levar."}
          </p>
        )}
        {!entregue && chamado.etapa !== "pronto" && <p className="mt-3 text-sm text-texto-2">Previsão: {previsaoParaOCliente(chamado.previsao)}</p>}

        <div className="mt-7 flex flex-wrap gap-3">
          {chamado.etapa === "aprovacao" ? (
            <>
              <a href={falar("aprovar")} target="_blank" rel="noopener" className="btn btn-primario">
                <IconeWhatsApp tamanho={18} />
                Aprovar pelo WhatsApp
              </a>
              <a href={falar("duvida")} target="_blank" rel="noopener" className="btn btn-contorno">
                Tenho uma dúvida
              </a>
            </>
          ) : chamado.etapa === "pronto" ? (
            <a href={falar("retirar")} target="_blank" rel="noopener" className="btn btn-primario">
              <IconeWhatsApp tamanho={18} />
              {chamado.local === "loja" ? "Combinar a retirada" : "Combinar a entrega"}
            </a>
          ) : (
            <a href={falar()} target="_blank" rel="noopener" className="btn btn-contorno">
              <IconeWhatsApp tamanho={18} />
              Falar com o {DONO.primeiroNome}
            </a>
          )}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="titulo-da-linha">
        <h2 id="titulo-da-linha" className="titulo-3">
          Por onde o conserto passa
        </h2>
        <ol className="mt-6">
          {LINHA_DO_CONSERTO.map((passo, i) => {
            const feito = entregue || i < posicao;
            const agora = !entregue && i === posicao;
            return (
              <li key={passo.rotulo} aria-current={agora ? "step" : undefined} className="relative flex gap-4 pb-7 last:pb-0">
                {i < LINHA_DO_CONSERTO.length - 1 && (
                  <span className={cn("absolute left-3 top-7 h-[calc(100%-1.75rem)] w-px -translate-x-1/2", feito ? "bg-destaque" : "bg-linha-forte")} aria-hidden />
                )}
                <span
                  className={cn(
                    "relative grid size-6 shrink-0 place-items-center rounded-full border",
                    feito && "border-destaque bg-destaque text-sobre-destaque",
                    agora && "border-destaque bg-fundo ring-4 ring-destaque/20",
                    !feito && !agora && "border-linha-forte bg-fundo",
                  )}
                  aria-hidden
                >
                  {feito && <IconeCheck tamanho={14} />}
                  {agora && <span className="size-2 rounded-full bg-destaque" />}
                </span>
                <p className={cn("font-display font-semibold leading-6", !feito && !agora && "text-texto-3")}>
                  {passo.rotulo}
                  {agora && chamado.etapa === "peca" && <span className="font-sans font-normal text-texto-2"> · esperando peça</span>}
                  {agora && <span className="ml-2 font-mono text-xs uppercase tracking-wider text-destaque-texto">agora</span>}
                  <span className="sr-only">{feito ? ", concluído" : agora ? "" : ", a seguir"}</span>
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <p className="mt-14 border-t border-linha pt-6 text-sm text-texto-3">
        Visão Sul Informática · {LOJA.cidade}/{LOJA.estado}. Dúvida sobre o conserto?{" "}
        <a href={falar()} target="_blank" rel="noopener" className="text-texto underline underline-offset-4 hover:text-destaque-texto">
          Fale com o {DONO.primeiroNome}
        </a>
        .
      </p>
    </div>
  );
}
