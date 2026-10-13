"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navegacao } from "@/data/navegacao";
import { cn } from "@/lib/utils";

/** O menu da tela larga, com a página atual marcada por um ponto amarelo. */
export function NavPrincipal() {
  const caminho = usePathname();
  return (
    <nav aria-label="Principal" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {navegacao.map((item) => {
          const atual = item.href !== "/#loja" && (caminho === item.href || caminho.startsWith(`${item.href}/`));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                // "A loja" é a própria página inicial: sem prefetch, a home não baixa a si mesma (34 KB)
                prefetch={item.href.startsWith("/#") ? false : undefined}
                aria-current={atual ? "page" : undefined}
                // entre 1024 e 1279 px a folga encolhe: com a lupa no topo, "Monte seu PC" quebrava em duas linhas
                className={cn(
                  "group relative inline-flex h-10 items-center whitespace-nowrap rounded-full px-3 text-[0.94rem] font-semibold transition-colors hover:text-texto xl:px-4",
                  atual ? "text-texto" : "text-texto-2",
                )}
              >
                {item.rotulo}
                <span
                  className={cn(
                    "absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-destaque shadow-[0_0_10px_var(--brilho)] transition-opacity",
                    atual ? "opacity-100" : "opacity-0 group-hover:opacity-60",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
