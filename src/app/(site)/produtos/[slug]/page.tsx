import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgendarTeste } from "@/components/ui/agendar-teste";
import { BotaoAdicionar } from "@/components/ui/botao-adicionar";
import { CartaoProduto } from "@/components/ui/cartao-produto";
import { ComoComprar } from "@/components/ui/como-comprar";
import { IconeCaminhao, IconeEscudo, IconeWhatsApp } from "@/components/ui/icones";
import { Preco } from "@/components/ui/preco";
import { VitrineDoProduto } from "@/components/ui/vitrine-do-produto";
import { DadosEstruturados } from "@/components/dados-estruturados";
import { categoriaPorSlug, combinaCom } from "@/data/categorias";
import { linkDaConversa } from "@/data/contato";
import { fotosDeProduto } from "@/data/fotos-de-produto";
import { produtoPorSlug, produtos } from "@/data/produtos";
import { segundasFotos } from "@/data/segundas-fotos";
import { AVISO_DE_PRECO, NOME_DA_LOJA, urlAbsoluta } from "@/data/site";

/** Uma página por produto, pronta no build (o catálogo de exemplo é fixo). */
export function generateStaticParams() {
  return produtos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produtos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const produto = produtoPorSlug(slug);
  if (!produto) return {};
  const foto = fotosDeProduto[produto.slug];
  return {
    title: produto.nome,
    description: produto.resumo,
    alternates: { canonical: `/produtos/${produto.slug}` },
    openGraph: { title: `${produto.nome} | ${NOME_DA_LOJA}`, description: produto.resumo, images: foto ? [{ url: foto.src }] : undefined },
  };
}

export default async function PaginaDoProduto({ params }: PageProps<"/produtos/[slug]">) {
  const { slug } = await params;
  const produto = produtoPorSlug(slug);
  if (!produto) notFound();
  const categoria = categoriaPorSlug(produto.categoria);
  // o que completa a categoria; se faltar, a mesma categoria e por fim o resto da vitrine
  const combina = [...combinaCom[produto.categoria], ...produtos.filter((p) => p.categoria === produto.categoria).map((p) => p.slug), ...produtos.map((p) => p.slug)]
    .filter((s, i, todos) => s !== produto.slug && todos.indexOf(s) === i)
    .map((s) => produtoPorSlug(s))
    .filter((p) => p !== undefined)
    .slice(0, 4);
  const fotos = [fotosDeProduto[produto.slug], segundasFotos[produto.slug]?.foto].filter((f) => f !== undefined);

  const dados = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.nome,
    brand: { "@type": "Brand", name: produto.marca },
    description: produto.resumo,
    image: fotos.length ? fotos.map((f) => urlAbsoluta(f.src)) : undefined,
    offers: { "@type": "Offer", priceCurrency: "BRL", price: produto.preco, availability: "https://schema.org/InStock", seller: { "@type": "Organization", name: NOME_DA_LOJA } },
  };

  return (
    <div className="pb-24 pt-24 md:pt-32">
      <div className="recipiente">
        <nav aria-label="Caminho" className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-texto-3">
          <Link href="/produtos" className="hover:text-texto">
            Produtos
          </Link>
          <span>/</span>
          {categoria && (
            <>
              <Link href={`/produtos?categoria=${categoria.slug}`} className="hover:text-texto">
                {categoria.nome}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-texto-2">{produto.nomeCurto}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.08fr_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <VitrineDoProduto produto={produto} />
          </div>

          <div>
            <p className="rotulo-mono">{produto.marca}</p>
            <h1 className="mt-2 font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.035em]">{produto.nome}</h1>
            <p className="texto-grande mt-4">{produto.resumo}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {produto.destaques.map((d) => (
                <li key={d} className="rounded-full border border-linha bg-fundo-2 px-3 py-1.5 text-sm font-medium">
                  {d}
                </li>
              ))}
            </ul>
            {produto.categoria === "notebooks" && (
              <p className="mt-4 text-sm text-texto-2">
                Não sabe se é este?{" "}
                <Link href="/qual-notebook" className="font-semibold text-texto underline underline-offset-4 hover:text-destaque-texto">
                  Veja qual notebook é para você
                </Link>
              </p>
            )}

            <div className="mt-8 rounded-cartao border border-linha bg-fundo-2 p-6">
              <Preco valor={produto.preco} de={produto.precoDe} tamanho="grande" />
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <BotaoAdicionar slug={produto.slug} className="w-full" />
                <a href={linkDaConversa("produto", { produto: produto.slug })} target="_blank" rel="noopener" className="btn btn-contorno w-full">
                  <IconeWhatsApp tamanho={18} />
                  Comprar no WhatsApp
                </a>
              </div>
              <ul className="mt-6 grid gap-3 border-t border-linha pt-5 text-sm text-texto-2 sm:grid-cols-2">
                <li className="flex gap-2.5">
                  <IconeEscudo tamanho={18} className="shrink-0 text-destaque-texto" />
                  Defeito de fábrica em 30 dias: troca na hora
                </li>
                <li className="flex gap-2.5">
                  <IconeCaminhao tamanho={18} className="shrink-0 text-destaque-texto" />
                  Entrega imediata, configurado
                </li>
              </ul>
            </div>

            <ComoComprar jeito="ficha" className="mt-6" />

            {produto.testeGratis && (
              <div className="mt-6">
                <AgendarTeste slug={produto.slug} nome={produto.nomeCurto} />
              </div>
            )}

            <section className="mt-10" aria-labelledby="titulo-ficha">
              <h2 id="titulo-ficha" className="titulo-3">
                Ficha técnica
              </h2>
              <dl className="mt-4 divide-y divide-linha border-y border-linha">
                {produto.ficha.map(([rotulo, valor]) => (
                  <div key={rotulo} className="grid grid-cols-[minmax(0,10rem)_1fr] gap-4 py-3.5 text-[0.95rem]">
                    <dt className="text-texto-3">{rotulo}</dt>
                    <dd className="font-medium">{valor}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-texto-3">{AVISO_DE_PRECO}</p>
            </section>
          </div>
        </div>
      </div>

      <section className="recipiente mt-24" aria-labelledby="titulo-parecidos">
        <h2 id="titulo-parecidos" className="titulo-2 !text-[clamp(1.7rem,3vw,2.6rem)]">
          Combina com <span className="acende">este</span>
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {combina.map((p) => (
            <CartaoProduto key={p.slug} produto={p} densa />
          ))}
        </div>
      </section>
      <DadosEstruturados dados={dados} />
    </div>
  );
}
