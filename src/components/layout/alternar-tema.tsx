"use client";

import { IconeLua, IconeSol } from "@/components/ui/icones";
import { alternarTema, useTema } from "@/lib/tema";
import { cn } from "@/lib/utils";

/**
 * O botão que troca escuro e claro. A página nova entra num círculo que nasce
 * do próprio botão (ver `lib/tema.ts`). O ícone mostra para onde vai: sol no
 * escuro (vai clarear), lua no claro.
 */
export function AlternarTema({ className, comRotulo = false }: { className?: string; comRotulo?: boolean }) {
  const tema = useTema();
  const proximo = tema === "escuro" ? "claro" : "escuro";
  return (
    <button
      type="button"
      onClick={(e) => {
        const caixa = e.currentTarget.getBoundingClientRect();
        alternarTema({ x: caixa.left + caixa.width / 2, y: caixa.top + caixa.height / 2 });
      }}
      className={cn(comRotulo ? "btn btn-contorno btn-pequeno" : "btn-icone", className)}
      aria-label={`Mudar para o tema ${proximo}`}
      title={`Tema ${proximo}`}
    >
      <span className="relative grid size-5 place-items-center">
        <IconeSol className="absolute transition-all duration-500 escuro:rotate-0 escuro:scale-100 escuro:opacity-100 claro:-rotate-90 claro:scale-50 claro:opacity-0" />
        <IconeLua className="absolute transition-all duration-500 escuro:rotate-90 escuro:scale-50 escuro:opacity-0 claro:rotate-0 claro:scale-100 claro:opacity-100" />
      </span>
      {comRotulo && <span>Tema {proximo}</span>}
    </button>
  );
}
