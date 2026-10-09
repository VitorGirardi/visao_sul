/**
 * Identidade do site para buscadores e redes.
 *
 * O DOMÍNIO PRÓPRIO AINDA NÃO EXISTE (09/10/2026): este é o protótipo da
 * proposta. Até ele chegar, a URL absoluta sai da Vercel
 * (`VERCEL_PROJECT_PRODUCTION_URL`, injetada no build). Quando o domínio for
 * registrado, defina a variável abaixo e nada mais muda:
 *
 *     NEXT_PUBLIC_URL_DO_SITE=https://www.visaosulinformatica.com.br
 *
 * Ela entra em canonical, sitemap, Open Graph e JSON-LD. Apontar pro lugar
 * errado é pior do que não ter: a prévia do link no WhatsApp sai quebrada.
 */
const urlDaVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const URL_DO_SITE =
  process.env.NEXT_PUBLIC_URL_DO_SITE ?? (urlDaVercel ? `https://${urlDaVercel}` : "http://localhost:3010");

export const NOME_DA_LOJA = "Visão Sul Informática";

export const NOME_DO_SITE = "Visão Sul Informática | Tapejara/RS";

/**
 * A frase que está na parede da loja, em letra amarela, debaixo do letreiro
 * aceso (foto de 09/10/2026). A terceira linha estava escondida atrás de uma
 * caixa; as duas primeiras são estas. É o lema deles, não slogan nosso.
 */
export const LEMA = "Tecnologia com compromisso.";

export const DESCRICAO_PADRAO =
  "Notebooks, iPhones, games, som, redes e impressoras em Tapejara/RS, com assistência técnica, teste grátis antes de comprar e atendimento direto com o Marciano pelo WhatsApp.";

/**
 * O SITE É UM PROTÓTIPO DE PROPOSTA. Preço, parcela e estoque são de exemplo
 * (o Vitor pediu preço de exemplo em 09/10/2026, com o aviso visível). Este
 * texto aparece junto de todo preço e no rodapé.
 */
export const AVISO_DE_PRECO = "Valores ilustrativos do protótipo. Confirme o preço do dia no WhatsApp.";

/** Caminho absoluto a partir de um caminho interno. */
export const urlAbsoluta = (caminho: string) => new URL(caminho, URL_DO_SITE).toString();
