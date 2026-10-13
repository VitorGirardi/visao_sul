import { nivelPorId, totalDoNivel } from "@/data/pc-gamer";
import { formatarPreco } from "@/lib/utils";

/**
 * "QUAL NOTEBOOK É PARA VOCÊ?" (13/10/2026): duas perguntas e a loja indica
 * um dos notebooks da vitrine, no estilo do Monte seu PC. Os motivos saem
 * do resumo e dos destaques de cada ficha (`data/produtos.ts`), nada além:
 * a memória e o tamanho do SSD do Acer e do HP Touch dependem da máquina do
 * Marciano (PENDENCIAS.md) e não entram como promessa.
 */

export const USOS = [
  { id: "estudar", rotulo: "Estudar e o dia a dia", exemplo: "aulas, trabalhos, internet e filmes" },
  { id: "trabalhar", rotulo: "Trabalhar com muita coisa aberta", exemplo: "planilhas, sistemas, várias abas e reuniões" },
  { id: "jogar", rotulo: "Jogar", exemplo: "jogos atuais, em Full HD" },
  { id: "editar", rotulo: "Editar foto e vídeo", exemplo: "programas pesados e projetos grandes" },
] as const;

export const PRIORIDADES = [
  { id: "economia", rotulo: "Gastar menos" },
  { id: "folga", rotulo: "Mais desempenho" },
] as const;

export type Uso = (typeof USOS)[number]["id"];
export type Prioridade = (typeof PRIORIDADES)[number]["id"];

/** O porquê de cada notebook, por uso: só o que a ficha garante. */
const MOTIVOS: Record<string, Partial<Record<Uso, string[]>>> = {
  "hp-15-touch": {
    estudar: ["Leve e rápido para estudo e o dia a dia", "Tela sensível ao toque e Wi-Fi 6", "O notebook mais em conta da vitrine"],
  },
  "acer-aspire-5": {
    estudar: ["Core i7 e SSD NVMe: folga para os próximos anos", "Gráficos Intel Iris Xe e tela Full HD", "Sai por menos que um notebook gamer"],
    trabalhar: ["Core i7 e SSD NVMe: adeus travamento com muita coisa aberta", "Gráficos Intel Iris Xe e tela Full HD", "Sai por menos que um notebook gamer"],
  },
  "hp-victus-15": {
    jogar: ["RTX 4050 com 6 GB: jogos atuais em Full HD com boa fluidez", "Tela de 144 Hz, imagem lisa no jogo rápido", "Ryzen 7 e 16 GB DDR5"],
    editar: ["Aguenta projeto pesado", "Placa de vídeo dedicada RTX 4050 com 6 GB", "Ryzen 7 e 16 GB DDR5"],
  },
};

const pcDeEntrada = nivelPorId("entrada");
const precoDoPcDeEntrada = pcDeEntrada ? formatarPreco(totalDoNivel(pcDeEntrada)) : "";

export type Alternativa = { href: string; texto: string };
export type Indicacao = { principal: string; motivos: string[]; alternativa?: Alternativa };

const alternativa = (slug: string, texto: string): Alternativa => ({ href: `/produtos/${slug}`, texto });
const pcGamer = (texto: string): Alternativa => ({ href: "/monte-seu-pc", texto });

/** A indicação para cada combinação das duas respostas. */
const TABELA: Record<Uso, Record<Prioridade, { principal: string; alternativa?: Alternativa }>> = {
  estudar: {
    economia: { principal: "hp-15-touch", alternativa: alternativa("acer-aspire-5", "Quer folga para os próximos anos? O Acer Aspire 5 tem Core i7.") },
    folga: { principal: "acer-aspire-5", alternativa: alternativa("hp-15-touch", "Se o orçamento apertar, o HP 15 Touch dá conta do dia a dia.") },
  },
  trabalhar: {
    economia: { principal: "acer-aspire-5", alternativa: alternativa("hp-15-touch", "Para uso mais leve, o HP 15 Touch sai por menos.") },
    folga: { principal: "acer-aspire-5", alternativa: alternativa("hp-victus-15", "Roda programa pesado? O HP Victus 15 aguenta projeto pesado.") },
  },
  jogar: {
    economia: {
      principal: "hp-victus-15",
      alternativa: pcGamer(`Não precisa levar para lá e para cá? O PC gamer de entrada, montado pela loja, sai a partir de ${precoDoPcDeEntrada}.`),
    },
    folga: { principal: "hp-victus-15", alternativa: pcGamer("Joga em casa? No Monte seu PC, a loja indica o PC certo para os seus jogos.") },
  },
  editar: {
    economia: { principal: "hp-victus-15", alternativa: alternativa("acer-aspire-5", "Edição leve de foto? O Acer Aspire 5, com Core i7, sai por menos.") },
    folga: { principal: "hp-victus-15", alternativa: pcGamer("Projeto grande todo dia? No Monte seu PC, a loja monta uma máquina de mesa para isso.") },
  },
};

export function indicacao(uso: Uso, prioridade: Prioridade): Indicacao {
  const { principal, alternativa } = TABELA[uso][prioridade];
  return { principal, motivos: MOTIVOS[principal]?.[uso] ?? [], alternativa };
}

/** Os notebooks que o guia pode indicar (as fichas que a página prepara). */
export const NOTEBOOKS_DO_GUIA = ["hp-15-touch", "acer-aspire-5", "hp-victus-15"] as const;
