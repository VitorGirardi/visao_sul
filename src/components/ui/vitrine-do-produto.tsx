import type { CSSProperties } from "react";
import { FotoDoProduto } from "@/components/ui/foto-do-produto";
import { InterruptorDoRaioX } from "@/components/ui/interruptor-do-raio-x";
import type { Produto } from "@/data/produtos";

/**
 * A FOTO GRANDE DA FICHA, com o botão "Ver no Raio-X": o mesmo efeito dos
 * cartões, mas ligado por toque (no celular não existe passar o mouse). As
 * fotos saem do servidor; o botão é o `InterruptorDoRaioX`.
 */
export function VitrineDoProduto({ produto }: { produto: Produto }) {
  return (
    <InterruptorDoRaioX slug={produto.slug}>
      <div className="relative overflow-hidden rounded-squircle border border-linha bg-fundo-2">
        <div className="raio-x relative">
          <div className="raio-x-fundo" aria-hidden />
          <FotoDoProduto produto={produto} sizes="(min-width: 1024px) 50vw, 100vw" prioridade className="raio-x-foto m-[9%]" />
          <div className="raio-x-chapa" aria-hidden>
            <div className="raio-x-chapa-filme">
              <FotoDoProduto produto={produto} sizes="(min-width: 1024px) 50vw, 100vw" semSombra className="m-[9%]" />
            </div>
          </div>
          <div className="raio-x-linha" aria-hidden>
            <span />
          </div>
          <ul className="raio-x-rotulos" aria-hidden>
            {produto.raioX.map((linha, i, todas) => (
              <li key={linha} style={{ "--y": 0.16 + (i / Math.max(1, todas.length - 1)) * 0.62 } as CSSProperties}>
                {linha}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </InterruptorDoRaioX>
  );
}
