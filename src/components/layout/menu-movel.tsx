"use client";

import { useRef, type CSSProperties } from "react";
import { AlternarTema } from "@/components/layout/alternar-tema";
import { IconeFechar, IconeMenu, IconeWhatsApp } from "@/components/ui/icones";
import { INSTAGRAM, linkDaConversa, WHATSAPP_EXIBICAO } from "@/data/contato";
import { navegacao } from "@/data/navegacao";

/**
 * O menu do celular usa a Popover API do navegador (mesmo desenho do site do
 * chef Lucas): abrir, fechar com Esc, fechar tocando fora e devolver o foco
 * vêm de graça. O único JS é fechar quando a pessoa toca num link, porque
 * link não fecha popover sozinho.
 */
export function MenuMovel() {
  const menu = useRef<HTMLDivElement>(null);
  const fechar = () => menu.current?.hidePopover();

  return (
    <>
      <button type="button" popoverTarget="menu-movel" className="btn-icone lg:hidden" aria-label="Abrir menu">
        <IconeMenu />
      </button>
      <div
        id="menu-movel"
        popover="auto"
        ref={menu}
        className="menu-movel m-0 h-dvh max-h-none w-full max-w-none bg-fundo p-0 text-texto"
      >
        <div className="grade-de-fundo pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="recipiente relative flex h-full flex-col pb-8 pt-4">
          <div className="flex items-center justify-between">
            <span className="rotulo-mono">Menu</span>
            <button type="button" popoverTarget="menu-movel" popoverTargetAction="hide" className="btn-icone" aria-label="Fechar menu">
              <IconeFechar />
            </button>
          </div>
          <nav aria-label="Menu do celular" className="mt-10 flex-1">
            <ol className="space-y-1">
              {navegacao.map((item, i) => (
                <li key={item.href} className="menu-movel-item" style={{ "--ordem": i } as CSSProperties}>
                  <a
                    href={item.href}
                    onClick={fechar}
                    className="flex items-baseline gap-4 py-2 font-display text-[2.4rem] font-bold leading-none tracking-tight"
                  >
                    <span className="font-mono text-xs font-medium text-destaque-texto">0{i + 1}</span>
                    {item.rotulo}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="space-y-4">
            <a href={linkDaConversa()} target="_blank" rel="noopener" className="btn btn-primario w-full">
              <IconeWhatsApp />
              Chamar no WhatsApp
            </a>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-texto-3">
                {WHATSAPP_EXIBICAO} · {INSTAGRAM.usuario}
              </p>
              <AlternarTema />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
