"use client";

import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";
import { Marca } from "@/components/layout/marca";
import { podeUsar3D } from "@/lib/abertura";
import { cn } from "@/lib/utils";

/*
 * O 3D (three + R3F, o pedaço pesado do site) entra por `next/dynamic` de
 * componente e só no navegador: a página chega pronta e leve, e o olho
 * desenhado em SVG fica no lugar até o 3D desenhar o primeiro quadro. Sem
 * WebGL, ou com "menos movimento", o SVG fica e pronto.
 */
const Olho3D = dynamic(() => import("@/components/tres/olho-3d"), { ssr: false });

const semAssinatura = () => () => {};

export function CenaDoOlho() {
  const pode3D = useSyncExternalStore(semAssinatura, podeUsar3D, () => false);
  const [pronto, setPronto] = useState(false);
  return (
    <>
      <div className={cn("abertura-simbolo", pronto && "abertura-simbolo-saiu")} aria-hidden>
        <Marca arranjo="simbolo" titulo="" className="w-full" />
      </div>
      {pode3D && <Olho3D aoFicarPronto={() => setPronto(true)} />}
    </>
  );
}
