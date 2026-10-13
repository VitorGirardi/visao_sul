import type { Metadata } from "next";
import { CartaoProduto } from "@/components/ui/cartao-produto";
import { Catalogo, type ItemDoCatalogo } from "@/components/ui/catalogo";
import { IconeCaminhao, IconeCalendario, IconeEscudo } from "@/components/ui/icones";
import { categorias } from "@/data/categorias";
import { indiceDoProduto } from "@/data/indice-de-busca";
import { produtos } from "@/data/produtos";
import { AVISO_DE_PRECO } from "@/data/site";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Notebooks, iPhone, PS5, JBL, Alexa, roteadores, impressoras e periféricos na Visão Sul Informática, em Tapejara/RS.",
  alternates: { canonical: "/produtos" },
};

const garantias = [
  { Icone: IconeCalendario, texto: "Teste grátis na loja antes de levar" },
  { Icone: IconeEscudo, texto: "Defeito em 30 dias: troca na hora" },
  { Icone: IconeCaminhao, texto: "Entrega imediata em Tapejara" },
];

/* O que o filtro do navegador precisa saber de cada cartão (o resto já vem desenhado). */
const porPreco = [...produtos].sort((a, b) => a.preco - b.preco).map((p) => p.slug);
const itens: ItemDoCatalogo[] = produtos.map((p) => ({
  slug: p.slug,
  categoria: p.categoria,
  busca: indiceDoProduto(p),
  porPreco: porPreco.indexOf(p.slug),
}));
const contagem = categorias.map((c) => ({ slug: c.slug, nome: c.nome, quantos: produtos.filter((p) => p.categoria === c.slug).length }));

export default function PaginaDeProdutos() {
  return (
    <div className="recipiente pb-28 pt-28 md:pt-36">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="sobretitulo">A vitrine</p>
          <h1 className="titulo-1 mt-4">
            Produtos<span className="acende">.</span>
          </h1>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-texto-2">
          {garantias.map(({ Icone, texto }) => (
            <li key={texto} className="flex items-center gap-2">
              <Icone tamanho={18} className="text-destaque-texto" />
              {texto}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10">
        {/* os 26 cartões saem no HTML; o catálogo (cliente) só filtra e ordena */}
        <Catalogo itens={itens} categorias={contagem}>
          {/* o nome de cada cartão é h3: sem este h2, o leitor de tela pulava do h1 direto para eles */}
          <h2 className="sr-only">Lista de produtos</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {produtos.map((produto, i) => (
              <CartaoProduto key={produto.slug} produto={produto} prioridade={i < 4} densa data-produto={produto.slug} />
            ))}
          </div>
        </Catalogo>
      </div>
      <p className="mt-12 text-center text-xs text-texto-3">{AVISO_DE_PRECO}</p>
    </div>
  );
}
