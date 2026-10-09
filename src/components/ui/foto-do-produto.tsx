import Image from "next/image";
import { categoriaPorSlug } from "@/data/categorias";
import { fotosComFundoTransparente, fotosDeProduto } from "@/data/fotos-de-produto";
import type { Produto } from "@/data/produtos";
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
 */
export function FotoDoProduto({
  produto,
  sizes,
  prioridade = false,
  className,
}: {
  produto: Pick<Produto, "slug" | "nome" | "categoria">;
  sizes: string;
  prioridade?: boolean;
  className?: string;
}) {
  const foto = fotosDeProduto[produto.slug];
  // O PC montado na loja não tem foto de fabricante: aparece o gabinete desenhado.
  if (produto.categoria === "pc-gamer" && !foto) {
    return (
      <div className={cn("grid aspect-square place-items-center", className)}>
        <GabineteIlustrado className="w-[62%]" />
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
  const comFundo = !fotosComFundoTransparente.has(produto.slug);
  return (
    <div className={cn("relative aspect-square", className)}>
      {comFundo ? (
        <div className="absolute inset-[9%] overflow-hidden rounded-[1.4rem] bg-white shadow-[0_20px_40px_-24px_rgb(0_0_0/0.5)]">
          <Image src={foto} alt={produto.nome} fill sizes={sizes} priority={prioridade} className="object-contain p-[6%]" />
        </div>
      ) : (
        <Image
          src={foto}
          alt={produto.nome}
          fill
          sizes={sizes}
          priority={prioridade}
          className="object-contain drop-shadow-[0_28px_30px_rgb(0_0_0/0.35)]"
        />
      )}
    </div>
  );
}
