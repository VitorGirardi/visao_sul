import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalogo } from "@/components/ui/catalogo";
import { IconeCaminhao, IconeCalendario, IconeEscudo } from "@/components/ui/icones";
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
        {/* useSearchParams pede um limite de Suspense para a página sair pronta do build */}
        <Suspense fallback={<div className="h-96 animate-pulse rounded-cartao bg-fundo-2" />}>
          <Catalogo />
        </Suspense>
      </div>
      <p className="mt-12 text-center text-xs text-texto-3">{AVISO_DE_PRECO}</p>
    </div>
  );
}
