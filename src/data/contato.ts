/**
 * O CANAL DA VISÃO SUL É O WHATSAPP. Todo post do Instagram deles termina
 * com o mesmo número, e é por ele que chegam pedido, orçamento e chamado.
 *
 * Número tirado das legendas do Instagram (@visaosulinformatica) em
 * 09/10/2026. Formato internacional, só dígitos: 55 + DDD + número. É o único
 * lugar do projeto onde ele mora; todo link de conversa sai daqui.
 */
const WHATSAPP = "5554999835707";

export const WHATSAPP_EXIBICAO = "(54) 99983-5707";

export const INSTAGRAM = {
  usuario: "@visaosulinformatica",
  href: "https://www.instagram.com/visaosulinformatica/",
} as const;

/** As redes num lugar só: rodapé, contato e o `sameAs` do JSON-LD. */
export const redes = [{ nome: "Instagram", href: INSTAGRAM.href }] as const;

const SAUDACAO = "Olá, Visão Sul! Vim pelo site.";

/**
 * A MENSAGEM PRONTA DO WHATSAPP. O WhatsApp entende `*negrito*` e quebra de
 * linha dentro do texto do link, e é só isso que estas mensagens usam. O
 * desenho é sempre o mesmo, para a loja reconhecer de longe o que chegou:
 *
 *   Olá, Visão Sul! Vim pelo site.     ← a saudação, sempre igual
 *                                      ← uma linha em branco
 *   Quero fazer um pedido:             ← o que a pessoa quer
 *   *1x HP Victus 15*                  ← o que identifica, em negrito
 *   Entrega: retirar na loja           ← o apoio, quando existe
 */
export const negrito = (texto: string) => `*${texto}*`;

/** Linha que some quando não há o que dizer: `false`, `undefined` e vazio. */
export type LinhaDaMensagem = string | false | undefined | null;

export function mensagemParaALoja(...linhas: LinhaDaMensagem[]): string {
  const corpo = linhas.filter((linha): linha is string => typeof linha === "string" && linha.trim() !== "");
  return corpo.length > 0 ? [SAUDACAO, "", ...corpo].join("\n") : SAUDACAO;
}

/**
 * TODA CONVERSA PASSA POR `/whatsapp` (`app/whatsapp/route.ts`), que monta a
 * mensagem no servidor e só então abre o WhatsApp. É o desenho dos sites da
 * Amage: quando o painel `/admin` existir (fase 2 da proposta), é nessa rota
 * que o pedido, o chamado e o pedido de teste vão ser gravados antes de a
 * conversa abrir. Nenhum link do site precisa mudar nesse dia.
 *
 * O link é um `<a>` comum, NUNCA `next/link`: o `Link` faz prefetch, e cada
 * prefetch de `/whatsapp` seria uma conversa que ninguém pediu.
 */
export const CAMINHO_DA_CONVERSA = "/whatsapp";

export type Assunto = "contato" | "produto" | "pedido" | "teste" | "chamado" | "empresa" | "pc";

export function linkDaConversa(assunto: Assunto = "contato", campos: Record<string, string> = {}) {
  const query = new URLSearchParams({ assunto, ...campos });
  return `${CAMINHO_DA_CONVERSA}?${query.toString()}`;
}

/** O endereço do WhatsApp de verdade, que só a rota `/whatsapp` monta. */
export function enderecoNoWhatsApp(...linhas: LinhaDaMensagem[]) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagemParaALoja(...linhas))}`;
}
