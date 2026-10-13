import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Concha } from "./concha";

/**
 * A PRÉVIA DO PAINEL DA LOJA (13/10/2026): a fase 2 da proposta mostrada ao
 * Marciano com dados de exemplo e sem backend. Mora em `/admin`, onde o
 * painel de verdade vai morar (como no vivenna-imoveis e na Prime), com
 * layout próprio: sem o cabeçalho, o rodapé e o botão de WhatsApp do site.
 * Fora do Google e sem link no site público.
 */
export const metadata: Metadata = {
  title: { default: "Painel da loja", template: "%s · Painel da loja" },
  robots: { index: false, follow: false },
};

export default function LayoutDoPainel({ children }: { children: ReactNode }) {
  return <Concha>{children}</Concha>;
}
