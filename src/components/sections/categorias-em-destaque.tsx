import Link from "next/link";
import { FotoDoProduto } from "@/components/ui/foto-do-produto";
import { IconeSeta, IconeSetaDiagonal } from "@/components/ui/icones";
import { Inclinacao } from "@/components/ui/inclinacao";
import { categorias } from "@/data/categorias";
import { produtoPorSlug, produtos } from "@/data/produtos";
import { cn } from "@/lib/utils";

/**
 * "O QUE VOCÊ PROCURA?": as categorias num mosaico (bento). Notebooks e
 * iPhone ganham os quadros grandes porque são o que mais aparece nos posts
 * da loja. Cada quadro leva à vitrine já filtrada.
 *
 * No celular o quadro pequeno tem uns 130 px úteis: a seta e a chamada saem,
 * e a contagem sobe para baixo do nome. Com elas, "iPhone e Apple" quebrava
 * em três linhas e a foto cobria a contagem (13/10/2026). E os quadros são
 * mais baixos, com a foto menor: o mosaico ocupava mais de duas telas.
 */
/** Quadros largos e baixos: a foto fica menor, senão sai pelo teto. */
const largo: Record<string, boolean> = { celulares: true, campo: true };

const tamanho: Record<string, string> = {
  notebooks: "md:col-span-2 md:row-span-2",
  celulares: "md:col-span-2",
  campo: "md:col-span-2",
};

const contagem = (quantos: number) => `${quantos} ${quantos === 1 ? "produto" : "produtos"}`;

export function CategoriasEmDestaque() {
  return (
    <section className="py-14 md:py-32" aria-labelledby="titulo-das-categorias">
      <div className="recipiente">
        <div className="revelar flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="sobretitulo">Categorias</p>
            <h2 id="titulo-das-categorias" className="titulo-2 mt-4 max-w-[14ch]">
              O que você procura <span className="acende">hoje?</span>
            </h2>
          </div>
          <Link href="/produtos" className="btn btn-contorno">
            Ver todos os produtos
            <IconeSeta tamanho={18} />
          </Link>
        </div>

        <div className="mt-8 grid auto-rows-[minmax(9.5rem,auto)] grid-cols-2 gap-3 md:mt-12 md:auto-rows-[16.5rem] md:grid-cols-4 md:gap-4">
          {categorias.map((categoria) => {
            const capa = produtoPorSlug(categoria.capa);
            const quantos = produtos.filter((p) => p.categoria === categoria.slug).length;
            const grande = categoria.slug === "notebooks";
            return (
              <Inclinacao key={categoria.slug} intensidade={5} className={cn("revelar-escala group [perspective:1000px]", tamanho[categoria.slug], grande && "col-span-2 md:row-span-2")}>
                {/* sem prefetch: os nove quadros baixavam a mesma página de produtos ao aparecer */}
                <Link
                  href={`/produtos?categoria=${categoria.slug}`}
                  prefetch={false}
                  className="categoria-quadro relative flex h-full flex-col overflow-hidden rounded-cartao border border-linha bg-fundo-2 p-5 md:p-6"
                >
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div>
                      <h3 className={cn("font-display font-bold tracking-tight", grande ? "text-3xl md:text-4xl" : "text-lg leading-snug md:text-2xl")}>{categoria.nome}</h3>
                      <p className={cn("mt-1 text-sm text-texto-2", !grande && "max-md:hidden")}>{categoria.chamada}</p>
                      {!grande && <p className="mt-1.5 rotulo-mono md:hidden">{contagem(quantos)}</p>}
                    </div>
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-full border border-linha transition-colors group-hover:border-destaque group-hover:bg-destaque group-hover:text-sobre-destaque",
                        !grande && "max-md:hidden",
                      )}
                    >
                      <IconeSetaDiagonal tamanho={18} />
                    </span>
                  </div>
                  <p className={cn("relative z-10 mt-auto rotulo-mono", !grande && "max-md:hidden")}>{contagem(quantos)}</p>
                  {capa && (
                    <div
                      className={cn(
                        "categoria-capa pointer-events-none absolute",
                        grande
                          ? "-bottom-[12%] -right-[4%] w-[46%] md:-bottom-[6%] md:-right-[6%] md:w-[82%]"
                          : largo[categoria.slug]
                            ? "-bottom-[10%] right-[2%] w-[38%]"
                            : "-bottom-[14%] -right-[8%] w-[50%] md:-bottom-[12%] md:-right-[10%] md:w-[66%]",
                      )}
                    >
                      {/* sizes medidos na largura real da capa em 390, 768 e 1440 px (antes vinha foto até 2,4 vezes maior) */}
                      <FotoDoProduto
                        produto={capa}
                        sizes={grande ? "(min-width: 768px) 34vw, 42vw" : largo[categoria.slug] ? "(min-width: 768px) 16vw, 17vw" : "(min-width: 768px) 14vw, 22vw"}
                      />
                    </div>
                  )}
                </Link>
              </Inclinacao>
            );
          })}
          <Link
            href="/monte-seu-pc"
            className="revelar-escala col-span-2 flex flex-col justify-between overflow-hidden rounded-cartao bg-destaque p-5 text-sobre-destaque transition-transform hover:-translate-y-1 md:p-6"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em]">Não achou?</p>
            <div className="flex items-end justify-between gap-4">
              <p className="font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                A gente encomenda,
                <br />
                monta e configura.
              </p>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sobre-destaque text-destaque">
                <IconeSeta />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
