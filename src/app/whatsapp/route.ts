import type { NextRequest } from "next/server";
import { enderecoNoWhatsApp } from "@/data/contato";
import { montarConversa } from "@/lib/conversa";

/**
 * A PORTA DE TODA CONVERSA DO SITE. Recebe o que a página mandou (pedido,
 * interesse num produto, teste grátis, chamado técnico, proposta para
 * empresa, PC gamer), monta a mensagem no servidor e abre o WhatsApp da loja
 * com ela escrita.
 *
 * 303 e não 302/307: é a resposta certa para "terminei o formulário, agora vá
 * para lá" e garante que o destino é aberto com GET.
 *
 * O PRÓXIMO PASSO MORA AQUI: quando o painel existir (fase 2), esta rota
 * grava o pedido, o chamado e o agendamento no Convex antes de redirecionar.
 * Nenhum link do site muda nesse dia.
 */
export function GET(request: NextRequest) {
  const destino = enderecoNoWhatsApp(...montarConversa(request.nextUrl.searchParams));
  return new Response(null, {
    status: 303,
    headers: {
      Location: destino,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
