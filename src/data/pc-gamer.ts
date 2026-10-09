/**
 * MONTE SEU PC. "PCs Gamers" está na bio da loja e a bancada é deles; aqui o
 * cliente escolhe o que quer jogar e sai com uma configuração para pedir
 * orçamento. Peças e valores são de EXEMPLO (protótipo): o Marciano ajusta à
 * tabela dele, e quando houver painel isto vem do banco.
 */
export type Nivel = {
  id: "entrada" | "intermediario" | "avancado" | "extremo";
  nome: string;
  promessa: string;
  pecas: [peca: string, modelo: string, preco: number][];
  /** Cor-guia do nível na tela (o RGB do gabinete começa nela). */
  cor: string;
  /** Tamanho da placa de vídeo no gabinete 3D (0 a 1). */
  porteDaPlaca: number;
};

export const niveis: Nivel[] = [
  {
    id: "entrada",
    nome: "Entrada",
    promessa: "eSports liso em Full HD",
    cor: "#3DD6F5",
    porteDaPlaca: 0.55,
    pecas: [
      ["Processador", "AMD Ryzen 5 5600", 699],
      ["Placa de vídeo", "GeForce RTX 5050 8 GB", 1799],
      ["Memória", "16 GB DDR4 3200", 349],
      ["Armazenamento", "SSD NVMe 1 TB", 449],
      ["Placa-mãe", "B550M", 649],
      ["Fonte", "550 W 80 Plus Bronze", 349],
      ["Gabinete", "Vidro lateral, 3 fans ARGB", 296],
    ],
  },
  {
    id: "intermediario",
    nome: "Intermediário",
    promessa: "Tudo no ultra em Full HD",
    cor: "#ECB500",
    porteDaPlaca: 0.72,
    pecas: [
      ["Processador", "AMD Ryzen 5 7600", 1099],
      ["Placa de vídeo", "GeForce RTX 5060 Ti 16 GB", 3199],
      ["Memória", "32 GB DDR5 6000", 799],
      ["Armazenamento", "SSD NVMe 1 TB Gen 4", 549],
      ["Placa-mãe", "B650M", 1099],
      ["Fonte", "650 W 80 Plus Gold", 549],
      ["Gabinete", "Vidro lateral, 4 fans ARGB", 396],
    ],
  },
  {
    id: "avancado",
    nome: "Avançado",
    promessa: "Alto FPS em 1440p",
    cor: "#FF4FD8",
    porteDaPlaca: 0.86,
    pecas: [
      ["Processador", "AMD Ryzen 7 7800X3D", 2399],
      ["Placa de vídeo", "GeForce RTX 5070 12 GB", 4999],
      ["Memória", "32 GB DDR5 6000", 799],
      ["Armazenamento", "SSD NVMe 2 TB Gen 4", 999],
      ["Placa-mãe", "B650", 1399],
      ["Fonte", "750 W 80 Plus Gold", 699],
      ["Gabinete", "Aquário, 6 fans ARGB", 696],
    ],
  },
  {
    id: "extremo",
    nome: "Extremo",
    promessa: "4K sem abrir mão de nada",
    cor: "#9B6BFF",
    porteDaPlaca: 1,
    pecas: [
      ["Processador", "AMD Ryzen 7 9800X3D", 3299],
      ["Placa de vídeo", "GeForce RTX 5080 16 GB", 9999],
      ["Memória", "64 GB DDR5 6000", 1599],
      ["Armazenamento", "SSD NVMe 2 TB Gen 5", 1499],
      ["Placa-mãe", "X870", 2299],
      ["Fonte", "1000 W 80 Plus Platinum", 1299],
      ["Refrigeração", "Water cooler 360 mm", 899],
      ["Gabinete", "Aquário, 9 fans ARGB", 996],
    ],
  },
];

/** Os jogos que a pessoa marca. `nivel` é o mínimo para rodar bem. */
export const jogos = [
  { nome: "Valorant", nivel: "entrada" },
  { nome: "CS2", nivel: "entrada" },
  { nome: "League of Legends", nivel: "entrada" },
  { nome: "Fortnite", nivel: "entrada" },
  { nome: "Minecraft", nivel: "entrada" },
  { nome: "EA Sports FC", nivel: "intermediario" },
  { nome: "GTA V", nivel: "intermediario" },
  { nome: "Warzone", nivel: "intermediario" },
  { nome: "Forza Horizon 5", nivel: "intermediario" },
  { nome: "Cyberpunk 2077", nivel: "avancado" },
  { nome: "Black Myth: Wukong", nivel: "avancado" },
  { nome: "Flight Simulator", nivel: "extremo" },
] as const;

/** As cores de luz que dá para escolher no gabinete. */
export const coresDeLuz = [
  { nome: "Amarelo Visão", valor: "#ECB500" },
  { nome: "Ciano", valor: "#3DD6F5" },
  { nome: "Magenta", valor: "#FF4FD8" },
  { nome: "Violeta", valor: "#9B6BFF" },
  { nome: "Verde", valor: "#3DF58A" },
  { nome: "Branco", valor: "#F4F4FF" },
] as const;

const ordem: Nivel["id"][] = ["entrada", "intermediario", "avancado", "extremo"];

/** O nível que dá conta de todos os jogos marcados. */
export function nivelParaOsJogos(nomes: readonly string[]): Nivel["id"] {
  let maior = 0;
  for (const nome of nomes) {
    const jogo = jogos.find((j) => j.nome === nome);
    if (jogo) maior = Math.max(maior, ordem.indexOf(jogo.nivel));
  }
  return ordem[maior];
}

export const nivelPorId = (id: string | null) => niveis.find((n) => n.id === id);

export const totalDoNivel = (nivel: Nivel) => nivel.pecas.reduce((soma, [, , preco]) => soma + preco, 0);
