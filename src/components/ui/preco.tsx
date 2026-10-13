import { PARCELAS } from "@/data/produtos";
import { cn, formatarPreco, parcela } from "@/lib/utils";

/**
 * O PREÇO, sempre com o selo "ilustrativo": é protótipo, e o Vitor pediu o
 * aviso visível junto do preço de exemplo (09/10/2026).
 */
export function Preco({
  valor,
  de,
  tamanho = "medio",
  densa = false,
  className,
}: {
  valor: number;
  de?: number;
  tamanho?: "medio" | "grande";
  /** o cartão das duas colunas do celular: preço menor, sem a parcela, e o selo continua */
  densa?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("leading-tight", className)}>
      {de && <s className="block text-xs text-texto-3">{formatarPreco(de)}</s>}
      <p
        className={cn(
          "font-display font-bold tracking-tight text-texto",
          tamanho === "grande" ? "text-[2.4rem] leading-none md:text-5xl" : "text-[1.4rem]",
          densa && "max-sm:text-[1.1rem]",
        )}
      >
        {formatarPreco(valor)}
      </p>
      <p className={cn("mt-1 text-texto-3", tamanho === "grande" ? "text-sm" : "text-xs")}>
        <span className={cn(densa && "max-sm:hidden")}>
          ou {PARCELAS}x de {formatarPreco(parcela(valor, PARCELAS))} sem juros
        </span>
        <span
          className={cn(
            "ml-1.5 inline-block rounded-full border border-linha px-1.5 py-px align-middle font-mono text-[0.6rem] uppercase tracking-wider",
            densa && "max-sm:ml-0",
          )}
        >
          ilustrativo
        </span>
      </p>
    </div>
  );
}
