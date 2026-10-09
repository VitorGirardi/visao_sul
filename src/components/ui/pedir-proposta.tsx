"use client";

import { useState } from "react";
import { IconeWhatsApp } from "@/components/ui/icones";
import { CAMINHO_DA_CONVERSA } from "@/data/contato";
import { servicosParaEmpresas } from "@/data/empresas";

/** Pedido de proposta para empresa: serviço, nome da empresa, cidade e a necessidade. */
export function PedirProposta() {
  const [servico, setServico] = useState<string>(servicosParaEmpresas[0].slug);
  return (
    <form action={CAMINHO_DA_CONVERSA} method="get" target="_blank" className="cartao p-6 md:p-8">
      <input type="hidden" name="assunto" value="empresa" />
      <p className="rotulo-mono">Proposta para empresa</p>
      <p className="mt-1 font-display text-2xl font-bold tracking-tight">Conte o que a empresa precisa</p>
      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-semibold">Serviço</legend>
        <div className="flex flex-wrap gap-2">
          {servicosParaEmpresas.map((s) => (
            <label key={s.slug} className="escolha">
              <input type="radio" name="servico" value={s.slug} checked={servico === s.slug} onChange={() => setServico(s.slug)} />
              {s.titulo}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <input name="empresa" className="campo" placeholder="Nome da empresa" autoComplete="organization" maxLength={80} />
        <input name="cidade" className="campo" placeholder="Cidade" autoComplete="address-level2" maxLength={80} />
      </div>
      <textarea
        name="obs"
        className="campo mt-2 min-h-28 resize-y"
        placeholder="Ex.: 3 impressoras no escritório, umas 2 mil páginas por mês"
        maxLength={600}
      />
      <button type="submit" className="btn btn-primario mt-5 w-full">
        <IconeWhatsApp />
        Pedir proposta no WhatsApp
      </button>
    </form>
  );
}
