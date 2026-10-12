import Link from "next/link";
import type { CSSProperties } from "react";
import { BotaoAdicionar } from "@/components/ui/botao-adicionar";
import { FotoDoProduto } from "@/components/ui/foto-do-produto";
import { Inclinacao } from "@/components/ui/inclinacao";
import { Preco } from "@/components/ui/preco";
import type { Produto } from "@/data/produtos";
import { cn } from "@/lib/utils";

/**
 * O CARTÃO DO PRODUTO, com o RAIO-X: ao passar o mouse, uma linha de luz
 * desce pela foto e o produto vira "chapa de raio-x" (negativo amarelo no
 * escuro, azul no claro), com a ficha técnica aparecendo conforme a linha
 * passa. É o conceito do site em miniatura: Visão Sul, enxergar por dentro.
 *
 * Tudo em CSS, com transições de `opacity` e `translate` (`globals.css`);
 * o JS daqui é só a inclinação e o botão de adicionar.
 */
export function CartaoProduto({
  produto,
  prioridade = false,
  className,
  ...dados
}: {
  produto: Produto;
  prioridade?: boolean;
  className?: string;
  /** marcas para quem filtra os cartões no navegador (o catálogo) */
  [dado: `data-${string}`]: string | number;
}) {
  // A foto ocupa de 240 a 295 px do cartão em qualquer grade acima de 640 px
  // (conta feita em 640, 768, 1024, 1280 e 1440). Com 256, a tela comum baixa
  // a de 256 em vez da de 384; a de alta densidade dobra sozinha.
  const sizes = "(min-width: 640px) 256px, 76vw";
  return (
    <Inclinacao className={cn("cartao-produto group relative", className)} {...dados}>
      <article className="cartao-produto-corpo relative flex h-full flex-col overflow-hidden rounded-cartao border border-linha bg-fundo-2">
        {/* sem prefetch: cada cartão que aparecia na tela baixava a ficha inteira (41 fetches em /produtos) */}
        <Link href={`/produtos/${produto.slug}`} prefetch={false} className="absolute inset-0 z-10" aria-label={produto.nome} />

        <div className="raio-x relative" data-foto-do-pedido data-foto={produto.slug}>
          <div className="raio-x-fundo" aria-hidden />
          <FotoDoProduto produto={produto} sizes={sizes} prioridade={prioridade} className="raio-x-foto m-[8%]" />
          <div className="raio-x-chapa" aria-hidden>
            <div className="raio-x-chapa-filme">
              <FotoDoProduto produto={produto} sizes={sizes} semSombra className="m-[8%]" />
            </div>
          </div>
          <div className="raio-x-linha" aria-hidden>
            <span />
          </div>
          <ul className="raio-x-rotulos" aria-hidden>
            {produto.raioX.slice(0, 4).map((linha, i, todas) => (
              <li key={linha} style={{ "--y": 0.2 + (i / Math.max(1, todas.length - 1)) * 0.55 } as CSSProperties}>
                {linha}
              </li>
            ))}
          </ul>
          <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
            {produto.selo && (
              <span className="rounded-full bg-destaque px-2.5 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-wider text-sobre-destaque">
                {produto.selo}
              </span>
            )}
          </div>
          {produto.testeGratis && (
            <span className="absolute bottom-3 left-4 rounded-full border border-linha bg-fundo/90 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-texto-2">
              Teste grátis na loja
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 px-5 pb-5 pt-2">
          <div>
            <p className="rotulo-mono">{produto.marca}</p>
            <h3 className="mt-1 font-display text-[1.08rem] font-semibold leading-snug tracking-tight text-texto">{produto.nomeCurto}</h3>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {produto.destaques.slice(0, 3).map((d) => (
              <li key={d} className="rounded-full bg-fundo-3 px-2 py-0.5 text-[0.7rem] font-medium text-texto-2">
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-end justify-between gap-3 pt-2">
            <Preco valor={produto.preco} de={produto.precoDe} />
            <BotaoAdicionar slug={produto.slug} compacto rotulo={`Adicionar ${produto.nomeCurto} ao pedido`} />
          </div>
        </div>
      </article>
    </Inclinacao>
  );
}
