import type { ReactNode } from "react";
import { BotaoWhatsApp } from "@/components/layout/botao-whatsapp";
import { Cabecalho } from "@/components/layout/cabecalho";
import { GavetaDoPedido } from "@/components/layout/gaveta-do-pedido";
import { MarcadorDeRolagem } from "@/components/layout/marcador-de-rolagem";
import { Rodape } from "@/components/layout/rodape";

/**
 * O SITE PÚBLICO mora em `(site)`; o painel da loja (fase 2: produtos,
 * pedidos, chamados) vai morar em `app/admin`, com layout próprio, como no
 * vivenna-imoveis. O layout raiz não lê nada dinâmico: a página sai pronta
 * do build e é servida pelo CDN.
 */
export default function LayoutDoSite({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="progresso" aria-hidden />
      <Cabecalho />
      <main id="conteudo">{children}</main>
      <Rodape />
      <BotaoWhatsApp />
      <GavetaDoPedido />
      <MarcadorDeRolagem />
    </>
  );
}
