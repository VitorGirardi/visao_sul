import { negrito, type LinhaDaMensagem } from "@/data/contato";
import { servicoParaEmpresaPorSlug } from "@/data/empresas";
import { coresDeLuz, jogos, nivelPorId, totalDoNivel } from "@/data/pc-gamer";
import { QUANTIDADE_MAXIMA } from "@/data/pedido";
import { produtoPorSlug, produtos } from "@/data/produtos";
import { aparelhoPorValor, locaisDeAtendimento, problemas } from "@/data/servicos";
import { formatarPreco } from "@/lib/utils";

/**
 * A MENSAGEM QUE CHEGA NO WHATSAPP DA LOJA, montada no servidor a partir do
 * que a página manda para `/whatsapp`.
 *
 * Nada do que vem na query é confiado como está: produto, serviço, nível de
 * PC e cor são procurados na lista do site (o nome escrito nunca vem do
 * navegador), quantidade tem teto e texto livre tem tamanho máximo. É o que
 * deixa esta rota ser o lugar certo para gravar o pedido no banco quando o
 * painel existir.
 */
const TETO_CURTO = 80;
const TETO_LONGO = 600;

function texto(valor: string | null, teto: number): string | undefined {
  if (!valor) return undefined;
  const limpo = valor
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, teto);
  return limpo || undefined;
}

function inteiro(valor: string | null, minimo: number, maximo: number): number | undefined {
  const n = Math.floor(Number(valor));
  return Number.isFinite(n) && n >= minimo && n <= maximo ? n : undefined;
}

/** "2026-10-14" → "14/10 (terça-feira)". Data que não existe, some. */
export function diaPorExtenso(iso: string | null): string | undefined {
  const partes = iso ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) : null;
  if (!partes) return undefined;
  const [, ano, mes, dia] = partes;
  const data = new Date(Date.UTC(Number(ano), Number(mes) - 1, Number(dia)));
  if (data.getUTCDate() !== Number(dia) || data.getUTCMonth() !== Number(mes) - 1) return undefined;
  const semana = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "UTC" }).format(data);
  return `${dia}/${mes} (${semana})`;
}

const PERIODOS: Record<string, string> = { manha: "de manhã", tarde: "à tarde", noite: "no fim do dia" };

function entregaPorExtenso(p: URLSearchParams) {
  const cidade = texto(p.get("cidade"), TETO_CURTO);
  if (p.get("entrega") === "entregar") return `Entrega: quero receber em casa${cidade ? ` (${cidade})` : ""}`;
  if (p.get("entrega") === "retirar") return "Entrega: vou retirar na loja";
  return cidade && `Cidade: ${cidade}`;
}

function pedido(p: URLSearchParams): LinhaDaMensagem[] {
  let total = 0;
  const itens = produtos.flatMap((produto) => {
    const qtd = inteiro(p.get(`qtd-${produto.slug}`), 1, QUANTIDADE_MAXIMA);
    if (!qtd) return [];
    total += qtd * produto.preco;
    return [`${negrito(`${qtd}x ${produto.nomeCurto}`)} (${formatarPreco(produto.preco)} no site)`];
  });
  if (itens.length === 0) return ["Quero fazer um pedido. Pode me ajudar a escolher?"];
  const nome = texto(p.get("nome"), TETO_CURTO);
  const obs = texto(p.get("obs"), TETO_LONGO);
  return [
    "Quero fazer um pedido:",
    itens.join("\n"),
    // A linha em branco depois da lista separa o pedido dos detalhes.
    `Total no site: ${formatarPreco(total)}\n`,
    nome && `Nome: ${nome}`,
    entregaPorExtenso(p),
    obs && `Obs.: ${obs}`,
    "Pode confirmar o valor e a disponibilidade?",
  ];
}

function interesse(p: URLSearchParams): LinhaDaMensagem[] {
  const produto = produtoPorSlug(p.get("produto") ?? "");
  if (!produto) return ["Quero saber mais sobre um produto do site."];
  return [`Tenho interesse no ${negrito(produto.nome)} (${formatarPreco(produto.preco)} no site).`, "Tem disponível?"];
}

function teste(p: URLSearchParams): LinhaDaMensagem[] {
  const produto = produtoPorSlug(p.get("produto") ?? "");
  const dia = diaPorExtenso(p.get("dia"));
  const periodo = PERIODOS[p.get("periodo") ?? ""];
  const nome = texto(p.get("nome"), TETO_CURTO);
  return [
    produto ? `Quero agendar um ${negrito("teste grátis")} do ${negrito(produto.nomeCurto)} na loja.` : `Quero agendar um ${negrito("teste grátis")} na loja.`,
    // Sem dia escolhido o pedido vai mesmo assim: a loja combina pela conversa.
    dia ? `Dia: ${dia}${periodo ? `, ${periodo}` : ""}` : "Dia: a combinar",
    nome && `Nome: ${nome}`,
  ];
}

function chamado(p: URLSearchParams): LinhaDaMensagem[] {
  const aparelho = aparelhoPorValor(p.get("aparelho"));
  const problemaInformado = p.get("problema");
  const problema = aparelho && problemas[aparelho.valor]?.includes(problemaInformado ?? "") ? problemaInformado : undefined;
  const local = locaisDeAtendimento.find((l) => l.valor === p.get("local"));
  const cidade = texto(p.get("cidade"), TETO_CURTO);
  const nome = texto(p.get("nome"), TETO_CURTO);
  const obs = texto(p.get("obs"), TETO_LONGO);
  return [
    `Quero abrir um ${negrito("chamado técnico")}:`,
    aparelho ? `Aparelho: ${negrito(aparelho.rotulo)}` : "Aparelho: vou explicar",
    problema && `Problema: ${problema}`,
    local?.valor === "domicilio" ? `Atendimento: venham até mim${cidade ? ` (${cidade})` : ""}` : local ? "Atendimento: levo na loja" : undefined,
    nome && `Nome: ${nome}`,
    obs && `Detalhes: ${obs}`,
  ];
}

function empresa(p: URLSearchParams): LinhaDaMensagem[] {
  const servico = servicoParaEmpresaPorSlug(p.get("servico"));
  const nomeDaEmpresa = texto(p.get("empresa"), TETO_CURTO);
  const cidade = texto(p.get("cidade"), TETO_CURTO);
  const obs = texto(p.get("obs"), TETO_LONGO);
  return [
    `Quero uma ${negrito("proposta para empresa")}${servico ? `: ${negrito(servico.titulo)}` : "."}`,
    nomeDaEmpresa && `Empresa: ${nomeDaEmpresa}`,
    cidade && `Cidade: ${cidade}`,
    obs && `Sobre a necessidade: ${obs}`,
  ];
}

function pc(p: URLSearchParams): LinhaDaMensagem[] {
  const nivel = nivelPorId(p.get("nivel"));
  const cor = coresDeLuz.find((c) => c.valor === p.get("cor"));
  const marcados = (p.get("jogos") ?? "").split("|").filter((nome) => jogos.some((j) => j.nome === nome));
  if (!nivel) return [`Quero montar um ${negrito("PC gamer")}. Pode me ajudar?`];
  return [
    `Quero orçamento de um ${negrito(`PC gamer ${nivel.nome}`)} (${nivel.promessa}):`,
    nivel.pecas.map(([peca, modelo]) => `• ${peca}: ${modelo}`).join("\n"),
    `Total no site: ${formatarPreco(totalDoNivel(nivel))}\n`,
    marcados.length > 0 && `Jogos: ${marcados.join(", ")}`,
    cor && `Cor da luz: ${cor.nome}`,
  ];
}

export function montarConversa(p: URLSearchParams): LinhaDaMensagem[] {
  switch (p.get("assunto")) {
    case "pedido":
      return pedido(p);
    case "produto":
      return interesse(p);
    case "teste":
      return teste(p);
    case "chamado":
      return chamado(p);
    case "empresa":
      return empresa(p);
    case "pc":
      return pc(p);
    default:
      return ["Quero falar com a Visão Sul."];
  }
}
