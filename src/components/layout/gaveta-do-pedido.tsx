"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { EVENTO_ABRIR_PEDIDO } from "@/lib/pedido";

const carregarCorpo = () => import("@/components/layout/corpo-da-gaveta");
const CorpoDaGaveta = dynamic(carregarCorpo, { ssr: false });

/**
 * A GAVETA "MEU PEDIDO". Um <dialog> modal que entra pela direita: foco
 * preso, Esc fecha e o resto da página fica inerte sem nenhuma biblioteca.
 *
 * Aqui fica só a moldura (12/10/2026). O conteúdo (`corpo-da-gaveta.tsx`),
 * que traz o catálogo e as fotos, carrega quando o navegador fica ocioso
 * depois da página pronta, ou na hora, se a pessoa abrir antes disso. Antes
 * ele entrava no JS de toda página.
 */
export function GavetaDoPedido() {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [aberta, setAberta] = useState(false);

  useEffect(() => {
    const abrir = () => {
      setAberta(true);
      dialogo.current?.showModal();
    };
    window.addEventListener(EVENTO_ABRIR_PEDIDO, abrir);
    // pré-carga sem pressa: quando a pessoa abrir, o conteúdo já está aqui
    // (o Safari não tem requestIdleCallback: lá vai por tempo)
    const temOcioso = "requestIdleCallback" in window;
    const carregar = () => void carregarCorpo();
    const espera = temOcioso ? window.requestIdleCallback(carregar) : window.setTimeout(carregar, 2500);
    return () => {
      window.removeEventListener(EVENTO_ABRIR_PEDIDO, abrir);
      if (temOcioso) window.cancelIdleCallback(espera);
      else window.clearTimeout(espera);
    };
  }, []);

  const fechar = () => dialogo.current?.close();

  return (
    <dialog
      ref={dialogo}
      className="gaveta"
      aria-labelledby="titulo-do-pedido"
      onClick={(e) => {
        // toque no fundo escurecido fecha
        if (e.target === e.currentTarget) fechar();
      }}
    >
      {aberta && <CorpoDaGaveta fechar={fechar} />}
    </dialog>
  );
}
