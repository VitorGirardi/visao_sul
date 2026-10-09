import Link from "next/link";
import { CartaoProduto } from "@/components/ui/cartao-produto";
import { IconeRaio, IconeSeta } from "@/components/ui/icones";
import { TrilhoHorizontal } from "@/components/ui/trilho-horizontal";
import { maisProcurados } from "@/data/produtos";

/** "Os mais procurados": a vitrine que anda de lado, com o Raio-X em cada cartão. */
export function Vitrine() {
  return (
    <section className="vitrine relative py-20 lg:py-0" aria-labelledby="titulo-da-vitrine">
      <TrilhoHorizontal
        cabeca={
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="sobretitulo">Vitrine</p>
              <h2 id="titulo-da-vitrine" className="titulo-2 mt-4">
                Os mais <span className="acende">procurados</span>
              </h2>
              <p className="mt-4 flex items-center gap-2 text-texto-2">
                <IconeRaio tamanho={18} className="text-destaque-texto" />
                <span>
                  Passe o mouse num produto e veja por dentro: é o <strong className="text-texto">Raio-X Visão Sul</strong>.
                </span>
              </p>
            </div>
            <Link href="/produtos" className="btn btn-contorno">
              Ver a loja inteira
              <IconeSeta tamanho={18} />
            </Link>
          </div>
        }
      >
        {maisProcurados.map((produto) => (
          <CartaoProduto key={produto.slug} produto={produto} className="w-[78vw] shrink-0 snap-start sm:w-[320px]" />
        ))}
        <Link
          href="/produtos"
          className="group flex w-[60vw] shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-cartao border border-dashed border-linha-forte text-center sm:w-[260px]"
        >
          <span className="grid size-16 place-items-center rounded-full bg-destaque text-sobre-destaque transition-transform group-hover:scale-110">
            <IconeSeta />
          </span>
          <span className="font-display text-xl font-semibold">Ver todos os produtos</span>
        </Link>
        <span className="w-[clamp(1.25rem,4vw,3rem)] shrink-0" aria-hidden />
      </TrilhoHorizontal>
    </section>
  );
}
