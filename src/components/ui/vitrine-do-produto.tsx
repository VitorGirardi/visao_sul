import type { CSSProperties } from "react";
import { FotoDoProduto } from "@/components/ui/foto-do-produto";
import { InterruptorDoRaioX } from "@/components/ui/interruptor-do-raio-x";
import { MiniaturasDaVitrine } from "@/components/ui/miniaturas-da-vitrine";
import { QuadroAdiado } from "@/components/ui/quadro-adiado";
import type { Produto } from "@/data/produtos";
import { segundasFotos, type SegundaFoto } from "@/data/segundas-fotos";

const SIZES = "(min-width: 1024px) 50vw, 100vw";
const QUADRO = "relative w-full shrink-0 snap-center snap-always";

/**
 * A FOTO GRANDE DA FICHA, com o botão "Ver no Raio-X": o mesmo efeito dos
 * cartões, mas ligado por toque (no celular não existe passar o mouse). As
 * fotos saem do servidor; o botão é o `InterruptorDoRaioX`.
 *
 * GALERIA (13/10/2026): o produto com foto de outro ângulo ganha um trilho
 * com encaixe (arrasta no celular, rola de lado no trackpad) e miniaturas
 * embaixo. Cada foto leva a sua chapa, então o Raio-X mostra o ângulo que
 * está na tela. A segunda foto só entra depois da página pronta
 * (`QuadroAdiado`), para não disputar a banda com a capa.
 */
export function VitrineDoProduto({ produto }: { produto: Produto }) {
  const segunda = segundasFotos[produto.slug];
  // a capa (sem `outroAngulo`) e, se houver, o segundo ângulo
  const quadros: (SegundaFoto | undefined)[] = segunda ? [undefined, segunda] : [undefined];
  const trilho = `fotos-${produto.slug}`;
  return (
    <>
      <InterruptorDoRaioX slug={produto.slug}>
        <div className="relative overflow-hidden rounded-squircle border border-linha bg-fundo-2">
          <div className="raio-x relative">
            <div className="raio-x-fundo" aria-hidden />
            {/* com duas fotos o trilho rola: precisa de foco (as setas do teclado trocam a foto) e de nome */}
            <div
              id={trilho}
              {...(quadros.length > 1 ? { tabIndex: 0, role: "group", "aria-label": `Fotos do ${produto.nomeCurto}` } : {})}
              className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {quadros.map((outroAngulo, i) => {
                const fotos = (
                  <>
                    <FotoDoProduto produto={produto} outroAngulo={outroAngulo} sizes={SIZES} prioridade={i === 0} className="raio-x-foto m-[9%]" />
                    <div className="raio-x-chapa" aria-hidden>
                      <div className="raio-x-chapa-filme">
                        <FotoDoProduto produto={produto} outroAngulo={outroAngulo} sizes={SIZES} semSombra className="m-[9%]" />
                      </div>
                    </div>
                  </>
                );
                return i === 0 ? (
                  <div key={i} className={QUADRO}>
                    {fotos}
                  </div>
                ) : (
                  <QuadroAdiado key={i} className={QUADRO}>
                    {fotos}
                  </QuadroAdiado>
                );
              })}
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
      {quadros.length > 1 && (
        <MiniaturasDaVitrine
          key={produto.slug}
          trilho={trilho}
          fotos={quadros.map((outroAngulo, i) => (
            <FotoDoProduto key={i} produto={produto} outroAngulo={outroAngulo} sizes="64px" semSombra alt="" />
          ))}
        />
      )}
    </>
  );
}
