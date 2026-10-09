"use client";

import { useState } from "react";
import { IconeWhatsApp, iconesPorNome } from "@/components/ui/icones";
import { CAMINHO_DA_CONVERSA } from "@/data/contato";
import { LOJA } from "@/data/loja";
import { aparelhos, locaisDeAtendimento, problemas } from "@/data/servicos";
import { cn } from "@/lib/utils";

/**
 * ABRIR CHAMADO: aparelho → problema → onde atender → WhatsApp.
 * "Abre o chamado e vamos até vocês" é frase dos posts da loja. Formulário
 * nativo (GET para `/whatsapp`): a rota confere aparelho e problema nas
 * listas de `data/servicos.ts` antes de escrever a mensagem.
 */
export function AbrirChamado({ className, compacto = false }: { className?: string; compacto?: boolean }) {
  const [aparelho, setAparelho] = useState<string>("notebook");
  const [local, setLocal] = useState<string>("loja");
  const opcoes = problemas[aparelho] ?? [];

  return (
    <form
      action={CAMINHO_DA_CONVERSA}
      method="get"
      target="_blank"
      className={cn("cartao relative overflow-hidden p-6 md:p-8", className)}
    >
      <input type="hidden" name="assunto" value="chamado" />
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="rotulo-mono">Chamado técnico</p>
          <p className="mt-1 font-display text-2xl font-bold tracking-tight">Abra em 30 segundos</p>
        </div>
        <span className="relative flex size-3">
          <span className="absolute inline-flex size-full rounded-full bg-[#25D366] opacity-75 [animation:pulso_1.6s_infinite]" />
          <span className="relative inline-flex size-3 rounded-full bg-[#25D366]" />
        </span>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-semibold">
          <span className="mr-2 font-mono text-destaque-texto">01</span>Qual aparelho?
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {aparelhos.map((a) => {
            const Icone = iconesPorNome[a.icone];
            return (
              <label key={a.valor} className="escolha !flex-col !gap-1.5 !rounded-2xl !px-2 !py-3 text-center !text-[0.8rem]">
                <input type="radio" name="aparelho" value={a.valor} checked={aparelho === a.valor} onChange={() => setAparelho(a.valor)} />
                <Icone tamanho={22} />
                {a.rotulo}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-semibold">
          <span className="mr-2 font-mono text-destaque-texto">02</span>O que está acontecendo?
        </legend>
        <div className="flex flex-wrap gap-2" key={aparelho}>
          {opcoes.map((problema, i) => (
            <label key={problema} className="escolha">
              <input type="radio" name="problema" value={problema} defaultChecked={i === 0} />
              {problema}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-semibold">
          <span className="mr-2 font-mono text-destaque-texto">03</span>Onde atendemos?
        </legend>
        <div className="flex flex-wrap gap-2">
          {locaisDeAtendimento.map((l) => (
            <label key={l.valor} className="escolha">
              <input type="radio" name="local" value={l.valor} checked={local === l.valor} onChange={() => setLocal(l.valor)} />
              {l.rotulo}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={cn("mt-6 grid gap-2", !compacto && "sm:grid-cols-2")}>
        <input name="nome" className="campo" placeholder="Seu nome" autoComplete="given-name" maxLength={80} />
        {local === "domicilio" ? (
          <input name="cidade" className="campo" placeholder={`Cidade (ex.: ${LOJA.cidade})`} autoComplete="address-level2" maxLength={80} />
        ) : (
          !compacto && <input name="obs" className="campo" placeholder="Algum detalhe? (opcional)" maxLength={600} />
        )}
      </div>

      <button type="submit" className="btn btn-primario mt-6 w-full">
        <IconeWhatsApp />
        Abrir chamado no WhatsApp
      </button>
      <p className="mt-3 text-center text-xs text-texto-3">A mensagem chega pronta para a loja. Diagnóstico explicado antes de qualquer troca.</p>
    </form>
  );
}
