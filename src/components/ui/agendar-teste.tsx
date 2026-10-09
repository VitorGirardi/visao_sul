"use client";

import { useState, useSyncExternalStore } from "react";
import { IconeCalendario } from "@/components/ui/icones";
import { CAMINHO_DA_CONVERSA } from "@/data/contato";

/**
 * AGENDAR TESTE GRÁTIS na loja: escolhe o dia (os próximos seis, sem
 * domingo) e o período, e a mensagem vai pronta. "Hoje" só existe no
 * navegador: a página sai do build, e os dias são calculados aqui, com
 * `useSyncExternalStore` (no servidor, os botões aparecem sem data).
 */
const semAssinatura = () => () => {};
const hojeNoNavegador = () => new Date().toDateString();

const PERIODOS = [
  { valor: "manha", rotulo: "Manhã" },
  { valor: "tarde", rotulo: "Tarde" },
] as const;

function proximosDias(hoje: string | null) {
  if (!hoje) return [];
  const base = new Date(hoje);
  const dias: { iso: string; semana: string; dia: string }[] = [];
  for (let i = 1; dias.length < 6 && i < 10; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    if (d.getDay() === 0) continue;
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    dias.push({
      iso,
      semana: new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(d).replace(".", ""),
      dia: String(d.getDate()),
    });
  }
  return dias;
}

export function AgendarTeste({ slug, nome }: { slug: string; nome: string }) {
  const hoje = useSyncExternalStore(semAssinatura, hojeNoNavegador, () => null);
  const dias = proximosDias(hoje);
  const [dia, setDia] = useState<string | null>(null);
  const escolhido = dia ?? dias[0]?.iso ?? "";

  return (
    <form action={CAMINHO_DA_CONVERSA} method="get" target="_blank" className="cartao p-5 md:p-6">
      <input type="hidden" name="assunto" value="teste" />
      <input type="hidden" name="produto" value={slug} />
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-destaque text-sobre-destaque">
          <IconeCalendario tamanho={20} />
        </span>
        <div>
          <p className="font-display text-lg font-semibold leading-tight">Teste grátis na loja</p>
          <p className="text-sm text-texto-2">Venha usar o {nome} antes de decidir.</p>
        </div>
      </div>
      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-semibold">Dia</legend>
        <div className="grid grid-cols-6 gap-1.5">
          {dias.length === 0
            ? Array.from({ length: 6 }, (_, i) => <span key={i} className="h-16 rounded-2xl border border-linha" />)
            : dias.map((d) => (
                <label key={d.iso} className="escolha !min-h-16 !flex-col !gap-0 !rounded-2xl !px-1 !py-2">
                  <input type="radio" name="dia" value={d.iso} checked={escolhido === d.iso} onChange={() => setDia(d.iso)} />
                  <span className="font-mono text-[0.62rem] uppercase tracking-wider text-texto-3">{d.semana}</span>
                  <span className="font-display text-lg">{d.dia}</span>
                </label>
              ))}
        </div>
      </fieldset>
      <fieldset className="mt-4 flex gap-2">
        <legend className="mb-2 text-sm font-semibold">Período</legend>
        {PERIODOS.map((p, i) => (
          <label key={p.valor} className="escolha flex-1 justify-center">
            <input type="radio" name="periodo" value={p.valor} defaultChecked={i === 0} />
            {p.rotulo}
          </label>
        ))}
      </fieldset>
      <input name="nome" className="campo mt-4" placeholder="Seu nome" autoComplete="given-name" maxLength={80} />
      <button type="submit" className="btn btn-primario mt-4 w-full">
        Agendar pelo WhatsApp
      </button>
    </form>
  );
}
