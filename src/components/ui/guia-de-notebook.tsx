"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { IconeCheck, IconeSeta, IconeWhatsApp } from "@/components/ui/icones";
import { linkDaConversa } from "@/data/contato";
import { indicacao, PRIORIDADES, USOS, type Prioridade, type Uso } from "@/data/qual-notebook";
import { cn } from "@/lib/utils";

/**
 * O GUIA "QUAL NOTEBOOK É PARA VOCÊ?": duas perguntas à esquerda, a
 * indicação à direita, mudando na hora. As fichas dos notebooks (foto, preço
 * e botões) chegam prontas do servidor em `fichas`; aqui só se escolhe qual
 * mostrar, com os motivos de `data/qual-notebook.ts`.
 */
export function GuiaDeNotebook({ fichas }: { fichas: Record<string, ReactNode> }) {
  const [uso, setUso] = useState<Uso | null>(null);
  const [prioridade, setPrioridade] = useState<Prioridade>("economia");
  const resultado = uso ? indicacao(uso, prioridade) : null;
  const rotuloDoUso = USOS.find((u) => u.id === uso)?.rotulo.toLowerCase();

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
      <div className="space-y-10">
        <fieldset>
          <legend className="flex items-baseline gap-3 font-display text-xl font-semibold">
            <span className="font-mono text-sm text-destaque-texto">01</span>Para que você vai usar?
          </legend>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {USOS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setUso(u.id)}
                aria-pressed={uso === u.id}
                className={cn(
                  "flex flex-col items-start rounded-2xl border p-4 text-left transition-colors",
                  uso === u.id ? "border-destaque bg-destaque/10" : "border-linha-forte hover:border-destaque",
                )}
              >
                <span className="flex items-center gap-2 font-display text-lg font-semibold">
                  {uso === u.id && <IconeCheck tamanho={18} className="text-destaque-texto" />}
                  {u.rotulo}
                </span>
                <span className="mt-1 text-sm text-texto-2">{u.exemplo}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="flex items-baseline gap-3 font-display text-xl font-semibold">
            <span className="font-mono text-sm text-destaque-texto">02</span>O que pesa mais?
          </legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {PRIORIDADES.map((p) => (
              <button key={p.id} type="button" onClick={() => setPrioridade(p.id)} aria-pressed={prioridade === p.id} className="escolha">
                {prioridade === p.id && <IconeCheck tamanho={16} />}
                {p.rotulo}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div aria-live="polite">
          {resultado ? (
            <div className="cartao p-6 md:p-7">
              <p className="rotulo-mono">A loja indica</p>
              {fichas[resultado.principal]}
              <ul className="mt-6 space-y-2.5 border-t border-linha pt-5">
                {resultado.motivos.map((m) => (
                  <li key={m} className="flex gap-2.5 text-[0.97rem]">
                    <IconeCheck tamanho={18} className="mt-0.5 shrink-0 text-destaque-texto" />
                    {m}
                  </li>
                ))}
              </ul>
              {resultado.alternativa && (
                <Link href={resultado.alternativa.href} className="mt-5 flex items-start justify-between gap-3 rounded-2xl border border-linha bg-fundo px-4 py-3 text-sm transition-colors hover:border-destaque">
                  <span className="text-texto-2">{resultado.alternativa.texto}</span>
                  <IconeSeta tamanho={16} className="mt-0.5 shrink-0" />
                </Link>
              )}
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center rounded-cartao border border-dashed border-linha-forte p-8 text-center text-texto-2">
              Escolha para que você vai usar, e a loja indica o notebook.
            </div>
          )}
        </div>
        <p className="mt-4 text-sm text-texto-2">
          Procura outro modelo?{" "}
          <a
            href={linkDaConversa("encomenda", { busca: rotuloDoUso ? `outro notebook para ${rotuloDoUso}` : "outro notebook" })}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 font-semibold text-texto underline underline-offset-4 hover:text-destaque-texto"
          >
            <IconeWhatsApp tamanho={16} />
            Pergunte no WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
