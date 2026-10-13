/**
 * OS DADOS DE EXEMPLO DA PRÉVIA DO PAINEL (13/10/2026). A prévia em `/admin`
 * mostra ao Marciano a fase 2 da proposta (painel e pagamento online) com o
 * que o site já manda hoje pela rota `/whatsapp` (`lib/conversa.ts`):
 * pedido, teste grátis e chamado técnico.
 *
 * Nada aqui é real, e a tela diz isso. As pessoas têm primeiro nome e
 * inicial, os telefones são visivelmente fictícios (90000) para não bater com
 * ninguém numa cidade pequena, e os tempos contam a partir de agora, no
 * navegador: a agenda nunca mostra dia passado no dia da reunião.
 */

export type SituacaoDoPedido = "novo" | "aguardando" | "pago" | "pronto" | "saiu" | "entregue" | "cancelado";

export type Pedido = {
  numero: string;
  cliente: string;
  cidade: string;
  telefone: string;
  itens: { slug: string; qtd: number }[];
  entrega: "retirar" | "entregar";
  pagamento: "pix" | "cartao" | "combinar";
  situacao: SituacaoDoPedido;
  /** minutos antes de agora */
  chegou: number;
  nota?: string;
};

export const pedidosDeExemplo: Pedido[] = [
  { numero: "0042", cliente: "Bruno S.", cidade: "Tapejara", telefone: "(54) 90000-0002", itens: [{ slug: "jbl-boombox-3", qtd: 1 }], entrega: "retirar", pagamento: "pix", situacao: "novo", chegou: 95 },
  {
    numero: "0041",
    cliente: "Carla D.",
    cidade: "Sananduva",
    telefone: "(54) 90000-0003",
    itens: [
      { slug: "iphone-17", qtd: 1 },
      { slug: "airpods-4", qtd: 1 },
    ],
    entrega: "entregar",
    pagamento: "cartao",
    situacao: "aguardando",
    chegou: 60 * 5,
  },
  { numero: "0040", cliente: "Diego M.", cidade: "Ibiaçá", telefone: "(54) 90000-0004", itens: [{ slug: "pc-gamer-visao", qtd: 1 }], entrega: "retirar", pagamento: "pix", situacao: "pago", chegou: 60 * 26, nota: "Montar com a luz amarela." },
  { numero: "0039", cliente: "Elisa R.", cidade: "Tapejara", telefone: "(54) 90000-0005", itens: [{ slug: "epson-ecotank-l3250", qtd: 1 }], entrega: "entregar", pagamento: "combinar", situacao: "saiu", chegou: 60 * 30 },
  { numero: "0038", cliente: "Fábio T.", cidade: "Vila Lângaro", telefone: "(54) 90000-0006", itens: [{ slug: "dualsense-preto", qtd: 2 }], entrega: "retirar", pagamento: "pix", situacao: "pronto", chegou: 60 * 50 },
  { numero: "0037", cliente: "Gabi L.", cidade: "Água Santa", telefone: "(54) 90000-0007", itens: [{ slug: "logitech-mk220", qtd: 1 }], entrega: "retirar", pagamento: "pix", situacao: "entregue", chegou: 60 * 76 },
  { numero: "0036", cliente: "Hugo C.", cidade: "Charrua", telefone: "(54) 90000-0008", itens: [{ slug: "hyperx-cloud-stinger-2", qtd: 1 }], entrega: "entregar", pagamento: "cartao", situacao: "entregue", chegou: 60 * 120 },
  { numero: "0035", cliente: "Iara V.", cidade: "Tapejara", telefone: "(54) 90000-0009", itens: [{ slug: "echo-dot-5", qtd: 1 }], entrega: "retirar", pagamento: "pix", situacao: "cancelado", chegou: 60 * 140 },
];

/** O pedido que chega durante a demonstração ("Simular pedido chegando"). */
export const pedidoQueChega: Pedido = {
  numero: "0043",
  cliente: "Ana P.",
  cidade: "Ibiaçá",
  telefone: "(54) 90000-0001",
  itens: [
    { slug: "hp-victus-15", qtd: 1 },
    { slug: "jbl-go-4", qtd: 1 },
  ],
  entrega: "entregar",
  pagamento: "pix",
  situacao: "novo",
  chegou: 0,
};

export type EtapaDoChamado = "recebido" | "diagnostico" | "aprovacao" | "conserto" | "peca" | "pronto" | "entregue";

export type Chamado = {
  numero: string;
  cliente: string;
  cidade: string;
  telefone: string;
  /** o `valor` de `aparelhos` em `data/servicos.ts` */
  aparelho: "notebook" | "computador" | "impressora" | "celular" | "rede";
  problema: string;
  local: "loja" | "domicilio";
  /** dias antes de hoje */
  entrou: number;
  /** dias a partir de hoje; negativo é atrasado */
  previsao: number;
  orcamento?: number;
  etapa: EtapaDoChamado;
  anotacao?: string;
};

export const chamadosDeExemplo: Chamado[] = [
  {
    numero: "0108",
    cliente: "Jonas B.",
    cidade: "Ibiaçá",
    telefone: "(54) 90000-0010",
    aparelho: "notebook",
    problema: "Não liga",
    local: "domicilio",
    entrou: 1,
    previsao: 1,
    orcamento: 280,
    etapa: "aprovacao",
    anotacao: "Conector de carga solto. Troca do conector e limpeza.",
  },
  { numero: "0107", cliente: "Karen F.", cidade: "Tapejara", telefone: "(54) 90000-0011", aparelho: "impressora", problema: "Falhando cor", local: "loja", entrou: 3, previsao: 0, orcamento: 120, etapa: "pronto", anotacao: "Limpeza de cabeça e alinhamento." },
  { numero: "0106", cliente: "Luiz A.", cidade: "Tapejara", telefone: "(54) 90000-0012", aparelho: "computador", problema: "Está lento", local: "loja", entrou: 2, previsao: 1, orcamento: 350, etapa: "conserto", anotacao: "Troca do HD por SSD de 480 GB, com os arquivos." },
  { numero: "0105", cliente: "Marta O.", cidade: "Sananduva", telefone: "(54) 90000-0013", aparelho: "notebook", problema: "Esquentando muito", local: "loja", entrou: 4, previsao: -1, orcamento: 150, etapa: "peca", anotacao: "Cooler com folga. Peça pedida ao fornecedor." },
  { numero: "0104", cliente: "Nei P.", cidade: "Tapejara", telefone: "(54) 90000-0014", aparelho: "rede", problema: "Sem sinal em parte da casa", local: "domicilio", entrou: 0, previsao: 2, etapa: "recebido" },
  { numero: "0103", cliente: "Olga S.", cidade: "Tapejara", telefone: "(54) 90000-0015", aparelho: "celular", problema: "Passar dados do antigo", local: "loja", entrou: 6, previsao: -4, orcamento: 80, etapa: "entregue" },
];

export type SituacaoDoTeste = "a-confirmar" | "confirmado" | "veio" | "nao-veio" | "virou-venda";

export type Teste = {
  id: string;
  slug: string;
  cliente: string;
  telefone: string;
  /** posição nos próximos seis dias de loja (sem domingo), como no site */
  dia: number;
  periodo: "manha" | "tarde";
  situacao: SituacaoDoTeste;
};

export const testesDeExemplo: Teste[] = [
  { id: "t1", slug: "iphone-17-pro", cliente: "Pedro H.", telefone: "(54) 90000-0016", dia: 0, periodo: "manha", situacao: "confirmado" },
  { id: "t2", slug: "hp-victus-15", cliente: "Rafa N.", telefone: "(54) 90000-0017", dia: 0, periodo: "tarde", situacao: "a-confirmar" },
  { id: "t3", slug: "jbl-partybox-encore-essential", cliente: "Sônia K.", telefone: "(54) 90000-0018", dia: 1, periodo: "tarde", situacao: "confirmado" },
  { id: "t4", slug: "ps5-slim-digital", cliente: "Tiago W.", telefone: "(54) 90000-0019", dia: 2, periodo: "manha", situacao: "a-confirmar" },
  { id: "t5", slug: "acer-aspire-5", cliente: "Úrsula M.", telefone: "(54) 90000-0020", dia: 3, periodo: "tarde", situacao: "confirmado" },
];

/** Os testes que já aconteceram no mês, antes dos da agenda. */
export const testesDoMes = { feitos: 7, viraramVenda: 4 };

/** Estoque de exemplo; quem não está aqui tem 4. No mínimo ou abaixo, a tela avisa. */
export const ESTOQUE_MINIMO = 1;
export const estoqueDeExemplo: Record<string, number> = {
  "hp-victus-15": 3,
  "iphone-17-pro": 1,
  "iphone-17": 2,
  "ps5-slim-digital": 1,
  "airpods-4": 6,
  "jbl-go-4": 8,
  "pc-gamer-visao": 2,
};
export const estoqueInicial = (slug: string) => estoqueDeExemplo[slug] ?? 4;

/** O que se buscou no site (a contagem de verdade é da fase 2). */
export const maisBuscados = [
  { termo: "notebook gamer", vezes: 38 },
  { termo: "iphone 17", vezes: 31 },
  { termo: "jbl", vezes: 24 },
  { termo: "ssd", vezes: 17 },
  { termo: "ps5", vezes: 15 },
];
export const buscaramENaoAcharam = [
  { termo: "cartucho hp 667", vezes: 9 },
  { termo: "rtx 5070", vezes: 7 },
  { termo: "cadeira gamer", vezes: 6 },
  { termo: "xbox series s", vezes: 4 },
  { termo: "carregador dell", vezes: 3 },
];

/** O começo da "Atividade recente" (minutos antes de agora). */
export const atividadeDeExemplo = [
  { ha: 95, texto: "Site recebeu o pedido 0042" },
  { ha: 140, texto: "Chamado 0107 marcado como pronto" },
  { ha: 60 * 5, texto: "Link de pagamento do pedido 0041 enviado" },
  { ha: 60 * 20, texto: "Teste do iPhone 17 Pro virou venda" },
  { ha: 60 * 26, texto: "Pix do pedido 0040 confirmado sozinho" },
];
