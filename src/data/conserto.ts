import type { EtapaDoChamado } from "@/data/amostra-do-painel";

/**
 * A PÁGINA DO CONSERTO, do lado do cliente (13/10/2026, prévia da fase 2).
 * Quando o chamado é aberto, o cliente recebe no WhatsApp um link para
 * `/conserto/<número>` e acompanha a bancada por ali: o que foi visto, o
 * orçamento para aprovar, quando fica pronto. A loja para de responder "já
 * está pronto?" o dia inteiro.
 *
 * Os textos dizem só o que a loja já promete (diagnóstico explicado, nada
 * trocado sem aprovar, devolvido funcionando: as etapas de "Como funciona" da
 * assistência).
 */

/** As etapas na ordem em que o cliente as vê. "Aguardando peça" fica no lugar do conserto. */
export const LINHA_DO_CONSERTO: { etapas: EtapaDoChamado[]; rotulo: string }[] = [
  { etapas: ["recebido"], rotulo: "Recebido" },
  { etapas: ["diagnostico"], rotulo: "Diagnóstico" },
  { etapas: ["aprovacao"], rotulo: "Orçamento" },
  { etapas: ["conserto", "peca"], rotulo: "Conserto" },
  { etapas: ["pronto"], rotulo: "Pronto" },
  { etapas: ["entregue"], rotulo: "Entregue" },
];

/**
 * O cartão do momento, para cada etapa. O título fala do conserto, nunca do
 * aparelho: "o seu impressora" e "pronto/pronta" não fecham em português.
 * `nota` é o rótulo da anotação do técnico, quando ela aparece.
 */
export const MOMENTO_DO_CONSERTO: Record<EtapaDoChamado, { titulo: string; texto: string; nota?: string }> = {
  recebido: {
    titulo: "Chamado recebido",
    texto: "O diagnóstico começa em seguida. Quando a gente souber o que é, o orçamento aparece aqui e chega no seu WhatsApp.",
  },
  diagnostico: {
    titulo: "Em diagnóstico",
    texto: "O técnico está vendo o que aconteceu. Nada é trocado sem você aprovar.",
  },
  aprovacao: {
    titulo: "Orçamento pronto para você aprovar",
    texto: "Nada é feito sem você aprovar. Se tiver dúvida, é só perguntar.",
    nota: "O que o técnico encontrou",
  },
  conserto: {
    titulo: "Em conserto na bancada",
    texto: "Com a peça certa. Quando ficar pronto, você recebe o aviso aqui e no WhatsApp.",
    nota: "O que está sendo feito",
  },
  peca: {
    titulo: "Esperando uma peça",
    texto: "A peça foi pedida. Assim que chegar, o conserto continua, e você fica sabendo por aqui.",
    nota: "O que está sendo feito",
  },
  pronto: {
    titulo: "Conserto pronto",
    texto: "Testado, limpo e com as suas coisas no lugar.",
    nota: "O que foi feito",
  },
  entregue: {
    titulo: "Entregue",
    texto: "Obrigado pela confiança. Se precisar de qualquer coisa com esse conserto, é só chamar.",
    nota: "O que foi feito",
  },
};

/** "Entrou ontem", "há 3 dias". */
export function entrouHa(dias: number) {
  if (dias === 0) return "hoje";
  if (dias === 1) return "ontem";
  return `há ${dias} dias`;
}

/** A previsão como o cliente lê. Atrasado não vira cobrança: a loja avisa. */
export function previsaoParaOCliente(dias: number) {
  if (dias < 0) return "levando um pouco mais que o previsto; a loja te avisa";
  if (dias === 0) return "hoje";
  if (dias === 1) return "amanhã";
  return `em ${dias} dias`;
}
