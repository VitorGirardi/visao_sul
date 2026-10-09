"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FotoDoProduto } from "@/components/ui/foto-do-produto";
import { PRODUTO_DO_RAIO_X } from "@/data/raio-x";
import { produtoPorSlug } from "@/data/produtos";
import { podeUsar3D } from "@/lib/abertura";
import { cn } from "@/lib/utils";

const Notebook3D = dynamic(() => import("@/components/tres/notebook-3d"), { ssr: false });
const semAssinatura = () => () => {};

/**
 * Monta o notebook 3D só quando a seção chega perto da tela (o three já veio
 * com a abertura; aqui é só a cena). Até lá, e sem WebGL, fica a foto do
 * produto.
 */
export function CenaDoNotebook() {
  const pode3D = useSyncExternalStore(semAssinatura, podeUsar3D, () => false);
  const caixa = useRef<HTMLDivElement>(null);
  const [perto, setPerto] = useState(false);
  const [pronto, setPronto] = useState(false);
  const produto = produtoPorSlug(PRODUTO_DO_RAIO_X);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setPerto(true);
          observador.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={caixa} className="absolute inset-0">
      {produto && (
        <div className={cn("absolute inset-0 grid place-items-center transition-opacity duration-700", pronto && "opacity-0")}>
          <FotoDoProduto produto={produto} sizes="(min-width: 1024px) 50vw, 90vw" className="w-[min(80%,34rem)]" />
        </div>
      )}
      {pode3D && perto && <Notebook3D aoFicarPronto={() => setPronto(true)} />}
    </div>
  );
}
