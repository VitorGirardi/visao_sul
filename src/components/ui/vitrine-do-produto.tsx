"use client";

import { useState, type CSSProperties } from "react";
import { FotoDoProduto } from "@/components/ui/foto-do-produto";
import { IconeRaio } from "@/components/ui/icones";
import type { Produto } from "@/data/produtos";
import { cn } from "@/lib/utils";

/**
 * A FOTO GRANDE DA FICHA, com o botão "Ver no Raio-X": o mesmo efeito dos
 * cartões, mas ligado por toque (no celular não existe passar o mouse).
 */
export function VitrineDoProduto({ produto }: { produto: Produto }) {
  const [raioX, setRaioX] = useState(false);
  return (
    <div
      className={cn("vitrine-produto relative", raioX && "raio-x-ligado")}
      style={{ "--v": raioX ? 1 : 0 } as CSSProperties}
      data-foto-do-pedido
      data-foto={produto.slug}
    >
      <div className="relative overflow-hidden rounded-squircle border border-linha bg-fundo-2">
        <div className="raio-x relative">
          <div className="raio-x-fundo" aria-hidden />
          <FotoDoProduto produto={produto} sizes="(min-width: 1024px) 50vw, 100vw" prioridade className="raio-x-foto m-[9%]" />
          <div className="raio-x-chapa" aria-hidden>
            <FotoDoProduto produto={produto} sizes="(min-width: 1024px) 50vw, 100vw" className="m-[9%]" />
          </div>
          <div className="raio-x-linha" aria-hidden />
          <ul className="raio-x-rotulos" aria-hidden>
            {produto.raioX.map((linha, i, todas) => (
              <li key={linha} style={{ "--y": 0.16 + (i / Math.max(1, todas.length - 1)) * 0.62 } as CSSProperties}>
                {linha}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setRaioX((v) => !v)}
        aria-pressed={raioX}
        className="btn btn-contorno btn-pequeno absolute bottom-4 right-4 z-10 bg-fundo/80 backdrop-blur-md"
      >
        <IconeRaio tamanho={16} />
        {raioX ? "Ver a foto" : "Ver no Raio-X"}
      </button>
    </div>
  );
}
