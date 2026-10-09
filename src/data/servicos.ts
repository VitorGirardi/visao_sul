/**
 * ASSISTÊNCIA TÉCNICA. A bio deles diz "prestação de serviços em
 * informática", os posts mostram manutenção preventiva (a pasta térmica mal
 * aplicada), atendimento a domicílio ("abre o chamado e vamos até vocês") e
 * redes. A lista abaixo detalha isso no que uma assistência faz no dia a dia;
 * confirmar com o Marciano o que entra e o que não entra (PENDENCIAS.md).
 */
export const servicos = [
  {
    slug: "manutencao-preventiva",
    titulo: "Manutenção preventiva",
    texto: "Limpeza interna, troca de pasta térmica e revisão completa para a máquina não esquentar nem travar.",
    icone: "ventoinha",
  },
  {
    slug: "reparo",
    titulo: "Conserto de notebook e PC",
    texto: "Não liga, desliga sozinho, tela, teclado, carcaça. Diagnóstico explicado antes de qualquer troca.",
    icone: "chave",
  },
  {
    slug: "upgrade",
    titulo: "Upgrade de SSD e memória",
    texto: "O jeito mais barato de fazer um computador lento voltar a voar, com os seus arquivos no lugar.",
    icone: "chip",
  },
  {
    slug: "formatacao",
    titulo: "Formatação e backup",
    texto: "Sistema limpo, programas instalados e seus arquivos salvos antes de tudo.",
    icone: "disco",
  },
  {
    slug: "impressoras",
    titulo: "Impressoras",
    texto: "Manutenção, suprimentos e instalação na rede. É a especialidade de anos do Marciano.",
    icone: "impressora",
  },
  {
    slug: "redes",
    titulo: "Redes e Wi-Fi",
    texto: "Sinal na casa inteira, rede mesh, cabeamento e configuração de roteador.",
    icone: "wifi",
  },
] as const;

/** O que a pessoa escolhe para abrir um chamado. O texto vai para o WhatsApp. */
export const aparelhos = [
  { valor: "notebook", rotulo: "Notebook", icone: "notebook" },
  { valor: "computador", rotulo: "Computador", icone: "gabinete" },
  { valor: "impressora", rotulo: "Impressora", icone: "impressora" },
  { valor: "celular", rotulo: "Celular", icone: "celular" },
  { valor: "rede", rotulo: "Internet e Wi-Fi", icone: "wifi" },
  { valor: "outro", rotulo: "Outro", icone: "chave" },
] as const;

export const problemas: Record<string, readonly string[]> = {
  notebook: ["Está lento", "Não liga", "Esquentando muito", "Tela quebrada", "Teclado com defeito", "Formatar"],
  computador: ["Está lento", "Não liga", "Esquentando muito", "Upgrade de peças", "Vírus", "Formatar"],
  impressora: ["Não imprime", "Falhando cor", "Atolando papel", "Instalar na rede", "Recarga de tinta"],
  celular: ["Configurar aparelho novo", "Passar dados do antigo", "Bateria", "Outro problema"],
  rede: ["Sem sinal em parte da casa", "Internet caindo", "Instalar roteador", "Rede da empresa"],
  outro: ["Quero explicar no WhatsApp"],
};

export const locaisDeAtendimento = [
  { valor: "loja", rotulo: "Levo na loja" },
  { valor: "domicilio", rotulo: "Venham até mim" },
] as const;

export const aparelhoPorValor = (valor: string | null) => aparelhos.find((a) => a.valor === valor);
