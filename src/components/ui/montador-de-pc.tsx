"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { GabineteIlustrado } from "@/components/ui/gabinete-ilustrado";
import { IconeCheck, IconeWhatsApp } from "@/components/ui/icones";
import { CAMINHO_DA_CONVERSA } from "@/data/contato";
import { coresDeLuz, jogos, niveis, nivelParaOsJogos, totalDoNivel } from "@/data/pc-gamer";
import { PARCELAS } from "@/data/produtos";
import { AVISO_DE_PRECO } from "@/data/site";
import { podeUsar3D } from "@/lib/abertura";
import { cn, formatarPreco, parcela } from "@/lib/utils";

const Gabinete3D = dynamic(() => import("@/components/tres/gabinete-3d"), { ssr: false });
const semAssinatura = () => () => {};

/**
 * O MONTADOR: jogos → nível recomendado (a pessoa pode trocar) → cor da luz
 * → lista de peças com o total → orçamento no WhatsApp. Os jogos chegam
 * pela URL quando a pessoa clica num jogo da página inicial.
 */
export function MontadorDePc() {
  const parametros = useSearchParams();
  const daUrl = (parametros.get("jogos") ?? "").split("|").filter((nome) => jogos.some((j) => j.nome === nome));
  const [marcados, setMarcados] = useState<string[]>(daUrl);
  const [escolhaManual, setEscolhaManual] = useState<string | null>(null);
  const [cor, setCor] = useState<string>(coresDeLuz[0].valor);
  const pode3D = useSyncExternalStore(semAssinatura, podeUsar3D, () => false);

  const recomendado = nivelParaOsJogos(marcados);
  const nivel = niveis.find((n) => n.id === (escolhaManual ?? recomendado)) ?? niveis[0];
  const total = totalDoNivel(nivel);

  const alternarJogo = (nome: string) => {
    setMarcados((atual) => (atual.includes(nome) ? atual.filter((n) => n !== nome) : [...atual, nome]));
    setEscolhaManual(null);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative aspect-square overflow-hidden rounded-squircle border border-linha bg-marinho">
          <div className="grade-de-fundo absolute inset-0 opacity-50" aria-hidden />
          <div className="absolute inset-0 transition-[background] duration-700" style={{ background: `radial-gradient(55% 55% at 50% 55%, ${cor}33, transparent 70%)` }} aria-hidden />
          {pode3D ? (
            <Gabinete3D cor={cor} porte={nivel.porteDaPlaca} />
          ) : (
            <div className="grid h-full place-items-center">
              <GabineteIlustrado cor={cor} className="w-[58%]" />
            </div>
          )}
          <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center font-mono text-[0.68rem] uppercase tracking-[0.2em] text-white/50">
            {pode3D ? "Arraste para girar" : "PC Gamer Visão Sul"}
          </p>
        </div>
      </div>

      <form action={CAMINHO_DA_CONVERSA} method="get" target="_blank" className="space-y-10">
        <input type="hidden" name="assunto" value="pc" />
        <input type="hidden" name="nivel" value={nivel.id} />
        <input type="hidden" name="cor" value={cor} />
        <input type="hidden" name="jogos" value={marcados.join("|")} />

        <fieldset>
          <legend className="flex items-baseline gap-3 font-display text-xl font-semibold">
            <span className="font-mono text-sm text-destaque-texto">01</span>O que você joga?
          </legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {jogos.map((jogo) => (
              <button key={jogo.nome} type="button" className="escolha" aria-pressed={marcados.includes(jogo.nome)} onClick={() => alternarJogo(jogo.nome)}>
                {marcados.includes(jogo.nome) && <IconeCheck tamanho={16} />}
                {jogo.nome}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="flex items-baseline gap-3 font-display text-xl font-semibold">
            <span className="font-mono text-sm text-destaque-texto">02</span>O nível do PC
          </legend>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {niveis.map((n) => (
              <label
                key={n.id}
                className={cn(
                  "relative flex cursor-pointer flex-col rounded-2xl border p-4 transition-colors",
                  n.id === nivel.id ? "border-destaque bg-destaque/10" : "border-linha-forte hover:border-destaque",
                )}
              >
                <input type="radio" name="nivel-visivel" value={n.id} checked={n.id === nivel.id} onChange={() => setEscolhaManual(n.id)} className="sr-only" />
                <span className="flex items-center justify-between gap-2">
                  <span className="font-display text-lg font-semibold">{n.nome}</span>
                  <span className="h-1.5 w-8 rounded-full" style={{ background: n.cor, boxShadow: `0 0 10px ${n.cor}` }} />
                </span>
                <span className="text-sm text-texto-2">{n.promessa}</span>
                <span className="mt-2 font-mono text-xs text-texto-3">{formatarPreco(totalDoNivel(n))}</span>
                {n.id === recomendado && marcados.length > 0 && (
                  <span className="absolute -top-2.5 right-3 rounded-full bg-destaque px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-sobre-destaque">
                    Indicado
                  </span>
                )}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="flex items-baseline gap-3 font-display text-xl font-semibold">
            <span className="font-mono text-sm text-destaque-texto">03</span>A cor da luz
          </legend>
          <div className="mt-4 flex flex-wrap gap-3">
            {coresDeLuz.map((c) => (
              <button
                key={c.valor}
                type="button"
                onClick={() => setCor(c.valor)}
                aria-pressed={cor === c.valor}
                aria-label={c.nome}
                title={c.nome}
                className={cn("size-11 rounded-full border-2 transition-transform", cor === c.valor ? "scale-110 border-texto" : "border-transparent hover:scale-105")}
                style={{ background: c.valor, boxShadow: `0 0 18px ${c.valor}88` }}
              />
            ))}
          </div>
        </fieldset>

        <div className="cartao p-6">
          <p className="rotulo-mono">Seu PC · {nivel.nome}</p>
          <ul className="mt-4 divide-y divide-linha">
            {nivel.pecas.map(([peca, modelo, preco]) => (
              <li key={peca} className="grid grid-cols-[minmax(0,7.5rem)_1fr_auto] gap-3 py-2.5 text-sm">
                <span className="text-texto-3">{peca}</span>
                <span className="font-medium">{modelo}</span>
                <span className="font-mono text-texto-2">{formatarPreco(preco)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-linha pt-5">
            <div>
              <p className="text-sm text-texto-2">Total montado e testado</p>
              <p className="font-display text-4xl font-bold tracking-tight">{formatarPreco(total)}</p>
              <p className="text-xs text-texto-3">
                ou {PARCELAS}x de {formatarPreco(parcela(total, PARCELAS))} sem juros
              </p>
            </div>
          </div>
          <button type="submit" className="btn btn-primario mt-6 w-full">
            <IconeWhatsApp />
            Pedir orçamento deste PC
          </button>
          <p className="mt-3 text-center text-xs text-texto-3">{AVISO_DE_PRECO}</p>
        </div>
      </form>
    </div>
  );
}
