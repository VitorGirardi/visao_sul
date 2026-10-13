import { getImageProps } from "next/image";
import { categoriaPorSlug } from "@/data/categorias";
import { fotosDeProduto } from "@/data/fotos-de-produto";
import { indiceDoProduto, type ItemDaBuscaRapida } from "@/data/indice-de-busca";
import { produtos } from "@/data/produtos";

/**
 * O ÍNDICE DA BUSCA DO TOPO (13/10/2026), em JSON, pronto no build. A lupa
 * do cabeçalho só o baixa quando é aberta (ou quando o dedo/mouse chega
 * nela): nenhuma página leva o catálogo no JS, como desde 12/10.
 */
export const dynamic = "force-static";

export function GET() {
  const itens: ItemDaBuscaRapida[] = produtos.map((p) => {
    const capa = fotosDeProduto[p.slug];
    const foto = capa ? getImageProps({ src: capa, alt: "", width: 64, height: Math.round((64 * capa.height) / capa.width) }).props : undefined;
    return {
      slug: p.slug,
      nome: p.nomeCurto,
      categoria: categoriaPorSlug(p.categoria)?.nome ?? "",
      preco: p.preco,
      busca: indiceDoProduto(p),
      foto: foto && { src: foto.src, srcSet: foto.srcSet, width: Number(foto.width), height: Number(foto.height) },
    };
  });
  return Response.json(itens);
}
