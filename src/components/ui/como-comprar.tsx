import { COMO_COMPRAR } from "@/data/como-comprar";
import { cn } from "@/lib/utils";

/**
 * Os três passos da compra pelo WhatsApp (`data/como-comprar.ts`), em três
 * jeitos: `ficha` (com título, três colunas na tela larga), `lista` (a
 * sacola vazia explica o caminho) e `linha` (a sacola cheia, uma linha só
 * acima do botão de enviar). Sem hook: serve à ficha, que é do servidor, e à
 * gaveta, que é do cliente.
 */
export function ComoComprar({ jeito, className }: { jeito: "ficha" | "lista" | "linha"; className?: string }) {
  if (jeito === "linha") {
    return (
      <ol className={cn("grid grid-cols-3 gap-2 text-[0.72rem] leading-snug text-texto-2", className)} aria-label="Como comprar">
        {COMO_COMPRAR.map((passo, i) => (
          <li key={passo.titulo} className="flex gap-1.5">
            <span className="font-mono font-semibold text-destaque-texto">{i + 1}</span>
            {passo.curto}
          </li>
        ))}
      </ol>
    );
  }

  const passos = (
    <ol className={cn("grid gap-4", jeito === "ficha" ? "mt-5 sm:grid-cols-3" : "text-left")}>
      {COMO_COMPRAR.map((passo, i) => (
        <li key={passo.titulo} className={cn("flex gap-3", jeito === "ficha" && "sm:flex-col sm:gap-2.5")}>
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-destaque/60 font-mono text-sm font-semibold text-destaque-texto">{i + 1}</span>
          <div>
            <p className="font-display font-semibold leading-snug">{passo.titulo}</p>
            <p className="mt-1 text-sm leading-relaxed text-texto-2">{passo.texto}</p>
          </div>
        </li>
      ))}
    </ol>
  );

  if (jeito === "lista") return <div className={className}>{passos}</div>;

  return (
    <section className={cn("rounded-cartao border border-linha p-6", className)} aria-labelledby="titulo-como-comprar">
      <h2 id="titulo-como-comprar" className="titulo-3">
        Como comprar
      </h2>
      {passos}
    </section>
  );
}
