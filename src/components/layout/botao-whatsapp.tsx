"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconeWhatsApp } from "@/components/ui/icones";
import { CAMINHO_DA_CONVERSA, linkDaConversa, WHATSAPP_EXIBICAO } from "@/data/contato";
import { cn } from "@/lib/utils";

/** Todo outro caminho para o WhatsApp: links da conversa e o botão de envio dos formulários. */
const OUTROS_CAMINHOS = `a[href^="${CAMINHO_DA_CONVERSA}"], form[action="${CAMINHO_DA_CONVERSA}"] button[type="submit"]`;

/**
 * O botão flutuante do WhatsApp, só no celular (na tela larga o cabeçalho já
 * tem o botão). Fica acima da barra de gestos do iPhone.
 *
 * Sai de cena enquanto outro caminho para o WhatsApp está na tela
 * (13/10/2026): ele cobria o botão do chamado técnico e o fim das linhas de
 * texto, e ficava repetido do lado do "Comprar no WhatsApp".
 */
export function BotaoWhatsApp() {
  const botao = useRef<HTMLAnchorElement>(null);
  const caminho = usePathname();
  const [escondido, setEscondido] = useState(false);

  useEffect(() => {
    const proprio = botao.current;
    if (!proprio) return;
    const visiveis = new Set<Element>();
    const observador = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.target === proprio) continue;
        if (e.isIntersecting) visiveis.add(e.target);
        else visiveis.delete(e.target);
      }
      setEscondido(visiveis.size > 0);
    });
    // o próprio botão entra só para garantir a primeira contagem numa página sem outro caminho
    observador.observe(proprio);
    for (const el of document.querySelectorAll(OUTROS_CAMINHOS)) if (el !== proprio) observador.observe(el);
    return () => observador.disconnect();
  }, [caminho]);

  return (
    <aside aria-label="Atendimento pelo WhatsApp">
      <a
        ref={botao}
        href={linkDaConversa()}
        target="_blank"
        rel="noopener"
        aria-label={`Chamar a Visão Sul no WhatsApp, ${WHATSAPP_EXIBICAO}`}
        inert={escondido}
        className={cn(
          "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_-10px_rgb(37_211_102/0.7)] transition-[translate,scale,opacity] duration-300 active:scale-95 md:hidden",
          escondido && "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <IconeWhatsApp tamanho={28} />
      </a>
    </aside>
  );
}
