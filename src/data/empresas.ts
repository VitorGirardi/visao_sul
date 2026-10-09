/**
 * PARA EMPRESAS. Locação de impressoras, venda e manutenção de computadores e
 * servidores e suporte especializado são as palavras do post da atleta
 * patrocinada (23/07/2026); "servidores" e "serviços de rede" estão na bio.
 * Planos e valores não existem ainda: tudo vira pedido de proposta.
 */
export const servicosParaEmpresas = [
  {
    slug: "locacao-de-impressoras",
    titulo: "Locação de impressoras",
    texto: "A impressora certa para o volume da empresa, com instalação, suprimento e manutenção num valor mensal. Quebrou, a gente resolve.",
    itens: ["Instalação e configuração na rede", "Toner e tinta inclusos no plano", "Manutenção sem custo extra"],
  },
  {
    slug: "redes-e-servidores",
    titulo: "Redes e servidores",
    texto: "Servidor de arquivos, backup, Wi-Fi que cobre o escritório todo e cabeamento organizado.",
    itens: ["Projeto e instalação de rede", "Servidor e backup", "Wi-Fi corporativo"],
  },
  {
    slug: "suporte-tecnico",
    titulo: "Suporte técnico",
    texto: "Um técnico que conhece a sua estrutura, para chamar quando algo para e para evitar que pare.",
    itens: ["Atendimento no local", "Manutenção preventiva programada", "Prioridade no WhatsApp"],
  },
  {
    slug: "equipamentos",
    titulo: "Equipamentos para a equipe",
    texto: "Notebooks, computadores, monitores e periféricos entregues configurados e prontos para usar.",
    itens: ["Configuração antes da entrega", "Garantia e troca facilitada", "Faturamento para CNPJ"],
  },
] as const;

export const servicoParaEmpresaPorSlug = (slug: string | null) => servicosParaEmpresas.find((s) => s.slug === slug);

export const passosDaLocacao = [
  { titulo: "Conversa", texto: "Entendemos quanto a empresa imprime e onde." },
  { titulo: "Proposta", texto: "Equipamento e plano sob medida, com valor fechado por mês." },
  { titulo: "Instalação", texto: "Levamos, instalamos na rede e treinamos a equipe." },
  { titulo: "Tranquilidade", texto: "Suprimento e manutenção por nossa conta." },
] as const;
