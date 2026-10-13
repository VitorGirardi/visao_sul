import type { Metadata } from "next";
import Link from "next/link";
import { BotaoAdicionar } from "@/components/ui/botao-adicionar";
import { FotoDoProduto } from "@/components/ui/foto-do-produto";
import { GuiaDeNotebook } from "@/components/ui/guia-de-notebook";
import { IconeCalendario } from "@/components/ui/icones";
import { Preco } from "@/components/ui/preco";
import { linkDaConversa } from "@/data/contato";
import { produtoPorSlug, type Produto } from "@/data/produtos";
import { NOTEBOOKS_DO_GUIA } from "@/data/qual-notebook";
import { AVISO_DE_PRECO } from "@/data/site";

export const metadata: Metadata = {
  title: "Qual notebook é para você?",
  description: "Duas perguntas e a Visão Sul indica o notebook certo para estudar, trabalhar, jogar ou editar. Teste grátis na loja antes de levar.",
  alternates: { canonical: "/qual-notebook" },
};

/** A ficha do notebook indicado: foto, preço e os três caminhos (sacola, ficha, teste grátis). */
function FichaIndicada({ produto }: { produto: Produto }) {
  return (
    <>
      <div className="mt-4 flex items-center gap-5">
        <div className="w-32 shrink-0 rounded-2xl bg-fundo-2 p-2 sm:w-40">
          <FotoDoProduto produto={produto} sizes="160px" />
        </div>
        <div className="min-w-0">
          <p className="rotulo-mono">{produto.marca}</p>
          <p className="font-display text-2xl font-bold leading-tight tracking-tight">{produto.nomeCurto}</p>
          <div className="mt-2">
            <Preco valor={produto.preco} de={produto.precoDe} />
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <BotaoAdicionar slug={produto.slug} />
        <Link href={`/produtos/${produto.slug}`} className="btn btn-contorno">
          Ver a ficha
        </Link>
        {produto.testeGratis && (
          <a href={linkDaConversa("teste", { produto: produto.slug })} target="_blank" rel="noopener" className="btn btn-contorno">
            <IconeCalendario tamanho={18} />
            Testar grátis
          </a>
        )}
      </div>
    </>
  );
}

/**
 * "QUAL NOTEBOOK É PARA VOCÊ?" (13/10/2026): o guia no estilo do Monte seu
 * PC, para quem chega em dúvida entre os notebooks da vitrine. A página
 * prepara a ficha de cada notebook que o guia pode indicar; a escolha e os
 * motivos ficam com o guia (`ui/guia-de-notebook.tsx`).
 */
export default function PaginaQualNotebook() {
  const fichas = Object.fromEntries(
    NOTEBOOKS_DO_GUIA.map((slug) => {
      const produto = produtoPorSlug(slug);
      return [slug, produto ? <FichaIndicada produto={produto} /> : null];
    }),
  );

  return (
    <div className="recipiente pb-24 pt-28 md:pt-36">
      <p className="sobretitulo">Notebooks</p>
      <h1 className="titulo-1 mt-4 max-w-[16ch]">
        Qual notebook é <span className="acende">para você?</span>
      </h1>
      <p className="texto-grande mt-6 max-w-[46ch]">Duas perguntas e a loja indica. Depois, é testar grátis na loja antes de levar.</p>
      <div className="mt-12">
        <GuiaDeNotebook fichas={fichas} />
      </div>
      <p className="mt-10 text-xs text-texto-3">{AVISO_DE_PRECO}</p>
    </div>
  );
}
