"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { IconeCheck, IconeFechar } from "@/components/ui/icones";
import { cn } from "@/lib/utils";
import type { Tom } from "./formato";
import { IconeCopiar } from "./icones";

/**
 * O KIT DA PRÉVIA DO PAINEL, no desenho do painel mais novo da Amage (o da
 * Prime Collection, refeito em 09/2026 depois de o cliente achar o anterior
 * "amador"): 13 px de base, estado com forma (um quadradinho de cor junto
 * da palavra), o amarelo só no gesto da pessoa e nada com cara de
 * componente de sistema (sem sombra, sem pílula, sem rodinha, sem toast: o
 * recado aparece onde se clicou).
 */

const BOTAO = "inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border px-3 text-[0.8125rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
const TONS_DO_BOTAO = {
  primario: "border-destaque bg-destaque text-sobre-destaque hover:bg-destaque-vivo",
  secundario: "border-linha-forte bg-fundo-2 text-texto hover:bg-fundo-3",
  texto: "border-transparent bg-transparent text-texto-2 hover:bg-fundo-3 hover:text-texto",
  perigo: "border-transparent bg-transparent text-erro hover:bg-erro-tinta",
} as const;

type TomDoBotao = keyof typeof TONS_DO_BOTAO;

export function Botao({ tom = "secundario", className, ...resto }: ComponentProps<"button"> & { tom?: TomDoBotao }) {
  return <button type="button" className={cn(BOTAO, TONS_DO_BOTAO[tom], className)} {...resto} />;
}

export function BotaoLink({ tom = "secundario", className, ...resto }: ComponentProps<typeof Link> & { tom?: TomDoBotao }) {
  return <Link className={cn(BOTAO, TONS_DO_BOTAO[tom], className)} {...resto} />;
}

const TONS: Record<Tom, { chip: string; marca: string; caixa: string }> = {
  neutro: { chip: "border-linha-forte bg-fundo-2 text-texto-2", marca: "bg-texto-3", caixa: "border-linha bg-fundo-3 text-texto-2" },
  apagado: { chip: "border-linha bg-fundo-3 text-texto-3", marca: "bg-texto-3", caixa: "border-linha bg-fundo-3 text-texto-3" },
  ok: { chip: "border-ok/25 bg-ok-tinta text-ok", marca: "bg-ok", caixa: "border-ok/25 bg-ok-tinta text-ok" },
  aviso: { chip: "border-aviso/25 bg-aviso-tinta text-aviso", marca: "bg-aviso", caixa: "border-aviso/25 bg-aviso-tinta text-aviso" },
  erro: { chip: "border-erro/25 bg-erro-tinta text-erro", marca: "bg-erro", caixa: "border-erro/25 bg-erro-tinta text-erro" },
  info: { chip: "border-info/25 bg-info-tinta text-info", marca: "bg-info", caixa: "border-info/25 bg-info-tinta text-info" },
};

export const Marcador = ({ tom }: { tom: Tom }) => <span aria-hidden className={cn("size-1.5 shrink-0 rounded-[1px]", TONS[tom].marca)} />;

export function Chip({ tom, children, className }: { tom: Tom; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex h-[22px] items-center gap-1.5 whitespace-nowrap rounded-sm border px-2 text-xs font-medium", TONS[tom].chip, className)}>
      <Marcador tom={tom} />
      {children}
    </span>
  );
}

/** O número de cima da visão geral: o quadro inteiro leva à lista já filtrada. `curto` é o rótulo do celular. */
export function Tile({ href, icone, numero, rotulo, curto, tom }: { href: string; icone: ReactNode; numero: number; rotulo: string; curto?: string; tom: Tom | "destaque" }) {
  return (
    <Link href={href} className="group flex min-h-16 items-center gap-3 rounded-lg border border-linha bg-fundo-2 px-3.5 py-2.5 transition-colors hover:border-linha-forte">
      <span
        className={cn(
          "grid size-[34px] shrink-0 place-items-center rounded-lg border",
          tom === "destaque" ? "border-destaque/40 bg-destaque/15 text-destaque-texto" : TONS[tom].caixa,
        )}
      >
        {icone}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-[1.375rem] font-semibold leading-tight tabular-nums">{numero}</span>
        <span className="block text-xs leading-snug text-texto-3 sm:hidden">{curto ?? rotulo}</span>
        <span className="hidden truncate text-xs text-texto-3 sm:block">{rotulo}</span>
      </span>
    </Link>
  );
}

export function Cartao({ titulo, acoes, children, className, corpo = "p-4" }: { titulo?: ReactNode; acoes?: ReactNode; children: ReactNode; className?: string; corpo?: string }) {
  return (
    <section className={cn("min-w-0 rounded-lg border border-linha bg-fundo-2", className)}>
      {titulo && (
        <header className="flex min-h-11 items-center justify-between gap-3 border-b border-linha px-4 py-2">
          <h2 className="text-[0.8125rem] font-semibold">{titulo}</h2>
          {acoes}
        </header>
      )}
      <div className={corpo}>{children}</div>
    </section>
  );
}

/** O recado depois de um clique, no próprio cartão. */
export function Recado({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="flex items-start gap-2 rounded-md border border-ok/25 bg-ok-tinta px-3 py-2 text-ok">
      <IconeCheck tamanho={16} className="mt-px shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function TituloDaPagina({ titulo, linha, acoes }: { titulo: ReactNode; linha?: ReactNode; acoes?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{titulo}</h1>
        {linha && <p className="mt-1 text-texto-2">{linha}</p>}
      </div>
      {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
    </div>
  );
}

/** Filtros-botão com contagem ("Todos · Novos 3 · ..."). */
export function Filtros<T extends string>({ opcoes, valor, aoMudar }: { opcoes: { valor: T; rotulo: string; quantos?: number }[]; valor: T; aoMudar: (v: T) => void }) {
  return (
    <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
      {opcoes.map((o) => (
        <button
          key={o.valor}
          type="button"
          aria-pressed={valor === o.valor}
          onClick={() => aoMudar(o.valor)}
          className={cn(
            "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors",
            valor === o.valor ? "border-destaque bg-destaque/15 text-texto" : "border-linha bg-fundo-2 text-texto-2 hover:border-linha-forte",
          )}
        >
          {o.rotulo}
          {o.quantos !== undefined && <span className="tabular-nums text-texto-3">{o.quantos}</span>}
        </button>
      ))}
    </div>
  );
}

/** O `*negrito*` do WhatsApp virando negrito de verdade na bolha. */
function comNegrito(texto: string) {
  return texto.split(/(\*[^*\n]+\*)/g).map((parte, i) => (parte.startsWith("*") && parte.endsWith("*") && parte.length > 2 ? <strong key={i}>{parte.slice(1, -1)}</strong> : parte));
}

/** A bolha de conversa, como aparece no WhatsApp. */
export function Bolha({ texto, lado = "esquerda" }: { texto: string; lado?: "esquerda" | "direita" }) {
  return (
    <div
      className={cn(
        "whitespace-pre-wrap break-words rounded-lg px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-[#111b21]",
        lado === "direita" ? "rounded-tr-sm bg-[#d9fdd3]" : "rounded-tl-sm border border-linha bg-white",
      )}
    >
      {comNegrito(texto)}
    </div>
  );
}

async function copiar(texto: string) {
  // no celular pela rede (http) não existe a área de transferência moderna: vai pelo jeito antigo
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(texto);
  const campo = document.createElement("textarea");
  campo.value = texto;
  campo.style.position = "fixed";
  campo.style.opacity = "0";
  document.body.appendChild(campo);
  campo.select();
  document.execCommand("copy");
  campo.remove();
}

/**
 * A JANELA DA MENSAGEM PRONTA. Na prévia ela não abre o WhatsApp: o número
 * de exemplo poderia ser de alguém de verdade. Mostra a mensagem e copia.
 */
export function JanelaDeMensagem({ aberta, titulo, para, texto, aoFechar, rodape }: { aberta: boolean; titulo: string; para: string; texto: string; aoFechar: () => void; rodape?: ReactNode }) {
  const caixa = useRef<HTMLDialogElement>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const d = caixa.current;
    if (!d) return;
    if (aberta && !d.open) d.showModal();
    if (!aberta && d.open) d.close();
  }, [aberta]);

  return (
    <dialog
      ref={caixa}
      onClose={() => {
        setCopiado(false);
        aoFechar();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-auto w-[min(92vw,28rem)] rounded-lg border border-linha bg-fundo-2 p-0 text-texto backdrop:bg-[rgb(6_5_35/0.45)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-linha px-4 py-3">
        <div className="min-w-0">
          <p className="font-semibold">{titulo}</p>
          <p className="truncate text-xs text-texto-3">Para {para}</p>
        </div>
        <button type="button" onClick={() => caixa.current?.close()} className="grid size-8 place-items-center rounded-md text-texto-2 hover:bg-fundo-3" aria-label="Fechar">
          <IconeFechar tamanho={18} />
        </button>
      </div>
      <div className="space-y-3 bg-[#efeae2] px-4 py-4">
        <Bolha texto={texto} lado="direita" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-linha px-4 py-3">
        <p className="text-xs text-texto-3">{rodape ?? "Na versão de verdade, este botão abre a conversa com o cliente."}</p>
        <Botao
          tom="primario"
          onClick={async () => {
            await copiar(texto);
            setCopiado(true);
          }}
        >
          {copiado ? <IconeCheck tamanho={16} /> : <IconeCopiar tamanho={16} />}
          {copiado ? "Copiada" : "Copiar mensagem"}
        </Botao>
      </div>
    </dialog>
  );
}

/** A miniatura de produto das tabelas (foto quadrada, fundo do cartão). */
export function Miniatura({ children }: { children: ReactNode }) {
  return <span className="block size-10 shrink-0 overflow-hidden rounded-md border border-linha bg-white">{children}</span>;
}
