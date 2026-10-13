import type { NextRequest } from "next/server";
import { enderecoNoWhatsApp } from "@/data/contato";
import { montarConversa } from "@/lib/conversa";

/**
 * NÚMERO DE TESTE (13/10/2026). Com `WHATSAPP_DE_TESTE` no ambiente (no
 * `.env.local`, que fica fora do git: só dígitos, com 55 e DDD), toda
 * conversa vai para esse número e a mensagem começa avisando que é teste.
 * É para o Vitor testar no celular antes da reunião sem mandar nada para a
 * loja. Sem a variável, vai para o WhatsApp da loja. Lida quando o servidor
 * sobe: mudou o `.env.local`, suba de novo.
 */
const informado = process.env.WHATSAPP_DE_TESTE?.replace(/\D/g, "") ?? "";
const NUMERO_DE_TESTE = /^55\d{10,11}$/.test(informado) ? informado : undefined;
if (informado && !NUMERO_DE_TESTE) console.warn("WHATSAPP_DE_TESTE ignorado: use 55 + DDD + número, só dígitos (ex.: 5554999999999)");

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
  const linhas = montarConversa(request.nextUrl.searchParams);
  const destino = NUMERO_DE_TESTE
    ? enderecoNoWhatsApp(["*Teste do site* (na reunião, esta mensagem vai para a loja)", ...linhas], NUMERO_DE_TESTE)
    : enderecoNoWhatsApp(linhas);
  return new Response(null, {
    status: 303,
    headers: {
      Location: destino,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
