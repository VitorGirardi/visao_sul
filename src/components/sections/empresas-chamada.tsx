import Link from "next/link";
import { IconeCheck, IconeEmpresa, IconeSeta } from "@/components/ui/icones";
import { servicosParaEmpresas } from "@/data/empresas";

/**
 * Para empresas: locação de impressoras, redes, servidores e suporte. No
 * celular os quatro cartões ficam lado a lado num trilho de arrastar, com o
 * próximo aparecendo na borda (empilhados, eram duas telas e meia).
 */
export function EmpresasChamada() {
  return (
    <section className="longe-da-tela py-14 md:py-32" aria-labelledby="titulo-empresas">
      <div className="recipiente">
        <div className="revelar grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="sobretitulo">Para empresas</p>
            <h2 id="titulo-empresas" className="titulo-2 mt-4 max-w-[18ch]">
              Sua empresa funcionando, <span className="acende">sem dor de cabeça.</span>
            </h2>
          </div>
          <Link href="/empresas" className="btn btn-contorno">
            <IconeEmpresa tamanho={18} />
            Soluções para empresas
          </Link>
        </div>
        <ul className="-mx-[clamp(1.25rem,4vw,3rem)] mt-8 flex snap-x snap-mandatory scroll-px-[clamp(1.25rem,4vw,3rem)] gap-3 overflow-x-auto px-[clamp(1.25rem,4vw,3rem)] pb-2 [scrollbar-width:none] md:mx-0 md:mt-12 md:grid md:snap-none md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {servicosParaEmpresas.map((s, i) => (
            <li key={s.slug} className="revelar-escala w-[82%] shrink-0 snap-start md:w-auto">
              <Link
                href={`/empresas#${s.slug}`}
                className="group flex h-full flex-col rounded-cartao border border-linha bg-fundo-2 p-5 transition-colors hover:border-destaque md:p-6"
              >
                <span className="font-mono text-sm text-destaque-texto">0{i + 1}</span>
                <h3 className="titulo-3 mt-4 md:mt-6">{s.titulo}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-texto-2">{s.texto}</p>
                <ul className="mt-6 space-y-2 border-t border-linha pt-5 text-sm text-texto-2">
                  {s.itens.map((item) => (
                    <li key={item} className="flex gap-2">
                      <IconeCheck tamanho={16} className="mt-0.5 shrink-0 text-destaque-texto" />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-texto transition-colors group-hover:text-destaque-texto">
                  Saber mais <IconeSeta tamanho={16} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
