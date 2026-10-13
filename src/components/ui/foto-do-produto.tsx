import { getImageProps } from "next/image";
import { categoriaPorSlug } from "@/data/categorias";
import { fotosComFundoTransparente, fotosDeProduto } from "@/data/fotos-de-produto";
import type { Produto } from "@/data/produtos";
import type { SegundaFoto } from "@/data/segundas-fotos";
import { Marca } from "@/components/layout/marca";
import { GabineteIlustrado } from "@/components/ui/gabinete-ilustrado";
import { cn } from "@/lib/utils";

/**
 * A FOTO DO PRODUTO, igual em toda a loja (cartão, ficha, gaveta).
 *
 * Quase todas as fotos estão sem fundo (vieram assim do fabricante ou o
 * `scripts/preparar-imagens.mjs` tirou o branco): o produto flutua sobre o
 * tema. As de produto branco (Deco, Chromecast) mantêm o fundo e ganham um
 * cartão claro, para não sumirem no tema claro nem virarem um quadrado no
 * escuro. Produto ainda sem foto mostra a marca da loja no lugar.
 *
 * `getImageProps` + `<img>` comum (12/10/2026), como a foto da abertura: o
 * `<Image>` é componente de cliente, e a home hidratava 33 deles só para
 * mostrar foto parada (mais 8,9 KB gz de JS). O `srcset` otimizado é o mesmo.
 */
export function FotoDoProduto({
  produto,
  sizes,
  outroAngulo,
  alt,
  prioridade = false,
  semSombra = false,
  className,
}: {
  produto: Pick<Produto, "slug" | "nome" | "categoria">;
  sizes: string;
  /**
   * o segundo ângulo no lugar da capa (a galeria da ficha). Chega de quem
   * chama: o mapa dele é só do servidor, e este componente vai na gaveta
   */
  outroAngulo?: SegundaFoto;
  /** vazio na miniatura da galeria, que já tem nome no botão */
  alt?: string;
  prioridade?: boolean;
  /** a cópia da chapa do Raio-X não leva sombra (o filtro a viraria brilho) */
  semSombra?: boolean;
  className?: string;
}) {
  const foto = outroAngulo?.foto ?? fotosDeProduto[produto.slug];
  // O PC montado na loja não tem foto de fabricante: aparece o gabinete desenhado (parado, como uma foto).
  if (produto.categoria === "pc-gamer" && !foto) {
    return (
      <div className={cn("grid aspect-square place-items-center", className)}>
        <GabineteIlustrado parado className="w-[62%]" />
      </div>
    );
  }
  if (!foto) {
    return (
      <div className={cn("grid aspect-square place-items-center", className)}>
        <div className="grid w-1/2 place-items-center gap-3 text-center">
          <Marca arranjo="simbolo" className="w-2/3 opacity-80" titulo="" />
          <span className="rotulo-mono">{categoriaPorSlug(produto.categoria)?.nome}</span>
        </div>
      </div>
    );
  }
  const comFundo = outroAngulo ? outroAngulo.comFundo : !fotosComFundoTransparente.has(produto.slug);
  const texto = alt ?? (outroAngulo ? `${produto.nome}, outro ângulo` : produto.nome);
  // Prioridade sem `loading="eager"`, de propósito: o React põe uma dica de
  // pré-carga para todo <img> do servidor que não é lazy, e a dica viaja no
  // prefetch. A home pré-carregava as fotos dos primeiros cartões de
  // /produtos só por ter o link no menu (12/10/2026).
  const { props } = getImageProps({
    src: foto,
    alt: texto,
    fill: true,
    sizes,
    ...(prioridade ? { fetchPriority: "high" } : {}),
  });
  return (
    <div className={cn("relative aspect-square", className)}>
      {comFundo ? (
        <div className="absolute inset-[9%] overflow-hidden rounded-[1.4rem] bg-white shadow-[0_20px_40px_-24px_rgb(0_0_0/0.5)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- otimizada: o srcset vem do getImageProps */}
          <img {...props} alt={texto} className="object-contain p-[6%]" />
        </div>
      ) : (
        <>
          {/* A sombra no chão é um degradê, não um filtro: drop-shadow borrado
              em cada foto da vitrine era caro de pintar (09/10/2026). */}
          {!semSombra && <span className="foto-sombra" aria-hidden />}
          {/* eslint-disable-next-line @next/next/no-img-element -- otimizada: o srcset vem do getImageProps */}
          <img {...props} alt={texto} className="object-contain" />
        </>
      )}
    </div>
  );
}
