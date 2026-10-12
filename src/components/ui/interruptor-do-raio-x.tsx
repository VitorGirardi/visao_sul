"use client";

import { useState, type ReactNode } from "react";
import { IconeRaio } from "@/components/ui/icones";
import { cn } from "@/lib/utils";

/**
 * O botão "Ver no Raio-X" da ficha e a caixa que ele liga. As fotos chegam
 * prontas do servidor (`children`): só o botão e a classe `raio-x-ligado`
 * precisam de JS (12/10/2026; antes a foto inteira era componente de
 * cliente e levava o mapa de fotos para o navegador).
 */
export function InterruptorDoRaioX({ slug, children }: { slug: string; children: ReactNode }) {
  const [ligado, setLigado] = useState(false);
  return (
    <div className={cn("vitrine-produto relative", ligado && "raio-x-ligado")} data-foto-do-pedido data-foto={slug}>
      {children}
      <button
        type="button"
        onClick={() => setLigado((v) => !v)}
        aria-pressed={ligado}
        className="btn btn-contorno btn-pequeno absolute bottom-4 right-4 z-10 bg-fundo/90"
      >
        <IconeRaio tamanho={16} />
        {ligado ? "Ver a foto" : "Ver no Raio-X"}
      </button>
    </div>
  );
}
