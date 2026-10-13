"use client";

import dynamic from "next/dynamic";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { IconeLupa } from "@/components/ui/icones";
import { carregarIndiceDaBusca } from "@/lib/indice-da-busca";

const carregarCorpo = () => import("@/components/layout/corpo-da-busca");
const CorpoDaBusca = dynamic(carregarCorpo, { ssr: false });

/** Chegar perto da lupa já baixa o miolo e o índice: ao tocar, está tudo aqui. */
const preparar = () => {
  void carregarCorpo();
  void carregarIndiceDaBusca();
};

/**
 * A BUSCA DO TOPO (13/10/2026), em toda página. Antes só a vitrine tinha
 * busca, e quem chegava pela home precisava abrir o menu e ir em Produtos
 * para procurar um PS5.
 *
 * Aqui fica só a lupa e a moldura (um <dialog> modal: foco preso, Esc fecha,
 * o resto da página inerte), como na gaveta do pedido. O miolo
 * (`corpo-da-busca.tsx`) e o índice dos produtos carregam quando a pessoa
 * chega perto da lupa: nenhuma página leva o catálogo no JS. Atalhos: "/" e
 * Ctrl+K (⌘K no Mac).
 */
export function BuscaRapida() {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [montada, setMontada] = useState(false);
  // a cada fechada o miolo nasce de novo: a próxima busca começa em branco
  const [vez, setVez] = useState(0);

  const abrir = () => {
    const d = dialogo.current;
    if (!d || d.open) return;
    preparar();
    setMontada(true);
    d.showModal();
  };
  const fechar = () => dialogo.current?.close();

  const tecla = useEffectEvent((e: KeyboardEvent) => {
    const digitando = e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable='true']");
    if ((e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !digitando)) {
      e.preventDefault();
      abrir();
    }
  });
  useEffect(() => {
    const ouvir = (e: KeyboardEvent) => tecla(e);
    window.addEventListener("keydown", ouvir);
    return () => window.removeEventListener("keydown", ouvir);
  }, []);

  return (
    <>
      <button type="button" onClick={abrir} onPointerEnter={preparar} onFocus={preparar} className="btn-icone" aria-label="Buscar produtos" aria-keyshortcuts="Control+K /">
        <IconeLupa />
      </button>
      <dialog
        ref={dialogo}
        className="busca-rapida"
        aria-label="Buscar produtos"
        onClick={(e) => {
          // toque no fundo escurecido fecha
          if (e.target === e.currentTarget) fechar();
        }}
        onClose={() => setVez((v) => v + 1)}
      >
        {montada && <CorpoDaBusca key={vez} fechar={fechar} />}
      </dialog>
    </>
  );
}
