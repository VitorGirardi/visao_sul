import type { SlugDaCategoria } from "@/data/categorias";

/**
 * O CATÁLOGO DE EXEMPLO DO PROTÓTIPO (09/10/2026).
 *
 * Os produtos são os que a Visão Sul mostra: os posts do Instagram (HP
 * Victus, HP touch, Acer, JBL, Xiaomi S20+, Garmin TT 25, PS5), as
 * prateleiras da foto da loja e o que o Vitor contou (iPhone, Chromecast).
 * A ficha técnica é a do fabricante; quando o post da loja trazia a ficha
 * (Victus, HP touch, Acer, JBL, Xiaomi), ela segue o post.
 *
 * PREÇO É DE EXEMPLO: o Vitor pediu preço de exemplo, com aviso, para a
 * vitrine não parecer vazia. A tela sempre mostra `AVISO_DE_PRECO` junto.
 * Quando houver painel, isto sai daqui e vem do banco.
 */
export type Produto = {
  slug: string;
  nome: string;
  nomeCurto: string;
  marca: string;
  categoria: SlugDaCategoria;
  resumo: string;
  /** Em reais, de exemplo. */
  preco: number;
  /** Preço "de", riscado, quando o exemplo é de oferta. */
  precoDe?: number;
  destaques: string[];
  ficha: [rotulo: string, valor: string][];
  /** As linhas que o Raio-X mostra por cima da foto (curtas, em caixa alta). */
  raioX: string[];
  selo?: "Lançamento" | "Mais procurado" | "Montado aqui" | "Oferta";
  /** "Agende um teste gratuito" é a frase que mais aparece nos posts deles. */
  testeGratis: boolean;
};

export const PARCELAS = 10;

export const produtos: Produto[] = [
  // NOTEBOOKS ------------------------------------------------------------
  {
    slug: "hp-victus-15",
    nome: "Notebook Gamer HP Victus 15",
    nomeCurto: "HP Victus 15",
    marca: "HP",
    categoria: "notebooks",
    resumo: "Gamer de verdade sem pagar por modelo premium: roda jogos atuais em Full HD com boa fluidez e aguenta projeto pesado.",
    preco: 5999,
    precoDe: 6499,
    destaques: ["Ryzen 7 7445HS", "RTX 4050 6 GB", "16 GB DDR5", "Tela 144 Hz"],
    ficha: [
      ["Processador", "AMD Ryzen 7 7445HS (até 4,7 GHz)"],
      ["Placa de vídeo", "NVIDIA GeForce RTX 4050 com 6 GB"],
      ["Memória", "16 GB DDR5"],
      ["Armazenamento", "SSD de 512 GB PCIe Gen 4"],
      ["Tela", "15,6 polegadas IPS Full HD, 144 Hz"],
      ["Conexões", "Wi-Fi 6 e Bluetooth 5.4"],
      ["Som", "DTS:X Ultra"],
      ["Sistema", "Windows 11"],
    ],
    raioX: ["RYZEN 7 7445HS", "RTX 4050 · 6 GB", "16 GB DDR5", "SSD 512 GB GEN 4", "TELA 144 HZ"],
    selo: "Mais procurado",
    testeGratis: true,
  },
  {
    slug: "hp-15-touch",
    nome: "Notebook HP 15 Touch-screen",
    nomeCurto: "HP 15 Touch",
    marca: "HP",
    categoria: "notebooks",
    resumo: "Tela sensível ao toque, leve e rápido para trabalho, estudo e entretenimento do dia a dia.",
    preco: 3299,
    destaques: ["Intel Core i3", "Tela touch", "SSD 256 GB", "Wi-Fi 6"],
    ficha: [
      ["Processador", "Intel Core i3 de 6 núcleos (até 4,4 GHz)"],
      ["Memória", "8 GB"],
      ["Armazenamento", "SSD de 256 GB"],
      ["Tela", "15,6 polegadas touch-screen"],
      ["Conexões", "Wi-Fi 6"],
      ["Sistema", "Windows 11"],
      ["Cor", "Azul prateado"],
    ],
    raioX: ["CORE I3 · 6 NÚCLEOS", "8 GB RAM", "SSD 256 GB", "TELA TOUCH 15,6"],
    testeGratis: true,
  },
  {
    slug: "acer-aspire-5",
    nome: "Notebook Acer Aspire 5",
    nomeCurto: "Acer Aspire 5",
    marca: "Acer",
    categoria: "notebooks",
    resumo: "Adeus travamento: Core i7, SSD NVMe e tela Full HD para qualquer tipo de atividade.",
    preco: 4299,
    destaques: ["Intel Core i7", "Iris Xe", "SSD NVMe 512 GB", "Full HD"],
    ficha: [
      ["Processador", "Intel Core i7 de 4 núcleos"],
      ["Gráficos", "Intel Iris Xe"],
      ["Memória", "8 GB DDR4"],
      ["Armazenamento", "SSD NVMe de 512 GB"],
      ["Tela", "15,6 polegadas Full HD (1920 × 1080)"],
      ["Sistema", "Windows 11"],
    ],
    raioX: ["CORE I7", "IRIS XE", "SSD NVME 512 GB", "TELA FULL HD"],
    testeGratis: true,
  },

  // IPHONE E APPLE ---------------------------------------------------------
  {
    slug: "iphone-17-pro",
    nome: "iPhone 17 Pro 256 GB",
    nomeCurto: "iPhone 17 Pro",
    marca: "Apple",
    categoria: "celulares",
    resumo: "O Pro da linha 17 por um preço que ficou melhor: três câmeras de 48 MP, tela ProMotion e 256 GB.",
    preco: 9999,
    precoDe: 11499,
    destaques: ["Chip A19 Pro", "Três câmeras 48 MP", "ProMotion 120 Hz", "256 GB"],
    ficha: [
      ["Tela", "6,3 polegadas Super Retina XDR com ProMotion"],
      ["Chip", "A19 Pro"],
      ["Câmeras traseiras", "Três de 48 MP (principal, ultra-angular e teleobjetiva)"],
      ["Câmera frontal", "18 MP"],
      ["Armazenamento", "256 GB"],
      ["Conector", "USB-C"],
      ["Cor", "Laranja-cósmico"],
    ],
    raioX: ["CHIP A19 PRO", "3 × 48 MP", "PROMOTION 120 HZ", "256 GB"],
    selo: "Oferta",
    testeGratis: false,
  },
  {
    slug: "iphone-17",
    nome: "iPhone 17 256 GB",
    nomeCurto: "iPhone 17",
    marca: "Apple",
    categoria: "celulares",
    resumo: "Tela ProMotion pela primeira vez no iPhone padrão, câmera dupla de 48 MP e 256 GB de base.",
    preco: 7999,
    destaques: ["Chip A19", "Câmera dupla 48 MP", "ProMotion 120 Hz", "256 GB"],
    ficha: [
      ["Tela", "6,3 polegadas Super Retina XDR com ProMotion"],
      ["Chip", "A19"],
      ["Câmeras traseiras", "Duas de 48 MP (principal e ultra-angular)"],
      ["Câmera frontal", "18 MP"],
      ["Armazenamento", "256 GB"],
      ["Conector", "USB-C"],
      ["Cor", "Lavanda"],
    ],
    raioX: ["CHIP A19", "2 × 48 MP", "PROMOTION 120 HZ", "256 GB"],
    testeGratis: false,
  },
  {
    slug: "iphone-16",
    nome: "iPhone 16 128 GB",
    nomeCurto: "iPhone 16",
    marca: "Apple",
    categoria: "celulares",
    resumo: "Botão de Ação, Controle da Câmera e chip A18 pelo melhor preço da linha.",
    preco: 5799,
    precoDe: 6299,
    destaques: ["Chip A18", "Câmera 48 MP", "Controle da Câmera", "128 GB"],
    ficha: [
      ["Tela", "6,1 polegadas Super Retina XDR"],
      ["Chip", "A18"],
      ["Câmeras traseiras", "48 MP principal e 12 MP ultra-angular"],
      ["Botões", "Botão de Ação e Controle da Câmera"],
      ["Armazenamento", "128 GB"],
      ["Conector", "USB-C"],
      ["Cor", "Ultramarino"],
    ],
    raioX: ["CHIP A18", "48 MP", "CONTROLE DA CÂMERA", "128 GB"],
    selo: "Oferta",
    testeGratis: false,
  },
  {
    slug: "airpods-4",
    nome: "Apple AirPods 4",
    nomeCurto: "AirPods 4",
    marca: "Apple",
    categoria: "celulares",
    resumo: "O AirPods redesenhado, mais confortável, com áudio espacial e estojo USB-C.",
    preco: 1199,
    destaques: ["Chip H2", "Áudio espacial", "Estojo USB-C", "Até 30 h"],
    ficha: [
      ["Chip", "H2"],
      ["Áudio", "Áudio espacial personalizado"],
      ["Bateria", "Até 30 horas com o estojo"],
      ["Estojo", "Carregamento por USB-C"],
      ["Resistência", "Poeira, suor e água (IP54)"],
    ],
    raioX: ["CHIP H2", "ÁUDIO ESPACIAL", "ATÉ 30 H", "USB-C"],
    testeGratis: false,
  },

  // GAMES ----------------------------------------------------------------
  {
    slug: "ps5-slim-digital",
    nome: "Console PlayStation 5 Slim Edição Digital",
    nomeCurto: "PS5 Slim Digital",
    marca: "Sony",
    categoria: "games",
    resumo: "O PS5 mais fino, com SSD de 825 GB, jogos em 4K e o controle DualSense na caixa.",
    preco: 3599,
    destaques: ["SSD 825 GB", "4K até 120 fps", "Ray tracing", "DualSense incluso"],
    ficha: [
      ["Armazenamento", "SSD de 825 GB"],
      ["Mídia", "Edição digital (sem leitor de disco)"],
      ["Vídeo", "Até 4K e até 120 fps"],
      ["Gráficos", "Ray tracing"],
      ["Na caixa", "Console, controle DualSense e cabos"],
    ],
    raioX: ["SSD 825 GB", "4K · 120 FPS", "RAY TRACING", "DUALSENSE"],
    selo: "Mais procurado",
    testeGratis: true,
  },
  {
    slug: "dualsense-preto",
    nome: "Controle DualSense Midnight Black",
    nomeCurto: "DualSense preto",
    marca: "Sony",
    categoria: "games",
    resumo: "Feedback tátil e gatilhos adaptáveis para sentir o jogo na mão.",
    preco: 449,
    destaques: ["Feedback tátil", "Gatilhos adaptáveis", "Microfone", "USB-C"],
    ficha: [
      ["Compatível", "PlayStation 5 e PC"],
      ["Recursos", "Feedback tátil e gatilhos adaptáveis"],
      ["Áudio", "Microfone embutido e entrada P2"],
      ["Carregamento", "USB-C"],
    ],
    raioX: ["FEEDBACK TÁTIL", "GATILHOS ADAPTÁVEIS", "MICROFONE"],
    testeGratis: false,
  },
  {
    slug: "logitech-driving-force-shifter",
    nome: "Câmbio Logitech G Driving Force Shifter",
    nomeCurto: "Câmbio Driving Force",
    marca: "Logitech G",
    categoria: "games",
    resumo: "Seis marchas e ré em H para quem leva simulador a sério.",
    preco: 449,
    destaques: ["6 marchas + ré", "Aço e couro", "G29, G920 e G923"],
    ficha: [
      ["Marchas", "6 marchas e ré, em H"],
      ["Construção", "Haste de aço e coifa de couro"],
      ["Compatível", "Volantes Logitech G29, G920 e G923"],
    ],
    raioX: ["6 MARCHAS + RÉ", "AÇO E COURO", "G29 · G920 · G923"],
    testeGratis: true,
  },

  // SOM E CASA ---------------------------------------------------------------
  {
    slug: "jbl-boombox-3",
    nome: "Caixa de Som JBL Boombox 3 Camuflada",
    nomeCurto: "JBL Boombox 3",
    marca: "JBL",
    categoria: "som-e-casa",
    resumo: "Aquele som que surpreende todo mundo: 24 horas de bateria e graves de verdade.",
    preco: 2999,
    destaques: ["Até 24 h de bateria", "À prova d'água IP67", "Até 180 W RMS"],
    ficha: [
      ["Potência", "Até 180 W RMS (na tomada)"],
      ["Bateria", "Até 24 horas"],
      ["Resistência", "À prova d'água e poeira (IP67)"],
      ["Conexão", "Bluetooth e PartyBoost"],
      ["Cor", "Camuflada"],
    ],
    raioX: ["180 W RMS", "24 H DE BATERIA", "IP67"],
    selo: "Mais procurado",
    testeGratis: true,
  },
  {
    slug: "jbl-partybox-encore-essential",
    nome: "Caixa de Som JBL PartyBox Encore Essential",
    nomeCurto: "PartyBox Encore Essential",
    marca: "JBL",
    categoria: "som-e-casa",
    resumo: "Show de luzes, karaokê e 100 W RMS numa caixa que vai de um lado para o outro pela alça.",
    preco: 2199,
    destaques: ["100 W RMS", "Show de luzes", "Karaokê", "Até 6 h"],
    ficha: [
      ["Potência", "100 W RMS"],
      ["Bateria", "Até 6 horas"],
      ["Luzes", "Show de luzes sincronizado"],
      ["Karaokê", "Entrada para microfone"],
      ["Resistência", "Respingos (IPX4)"],
    ],
    raioX: ["100 W RMS", "SHOW DE LUZES", "KARAOKÊ"],
    testeGratis: true,
  },
  {
    slug: "jbl-charge-5",
    nome: "Caixa de Som JBL Charge 5",
    nomeCurto: "JBL Charge 5",
    marca: "JBL",
    categoria: "som-e-casa",
    resumo: "20 horas de festa, à prova d'água e ainda carrega o seu celular.",
    preco: 899,
    destaques: ["Até 20 h", "IP67", "Power bank", "30 W + 10 W RMS"],
    ficha: [
      ["Potência", "30 W RMS no woofer e 10 W RMS no tweeter"],
      ["Bateria", "Até 20 horas, funciona como power bank"],
      ["Resistência", "À prova d'água e poeira (IP67)"],
      ["Conexão", "Bluetooth 5.1 e PartyBoost"],
    ],
    raioX: ["40 W RMS", "20 H", "POWER BANK", "IP67"],
    testeGratis: true,
  },
  {
    slug: "jbl-go-4",
    nome: "Caixa de Som JBL Go 4",
    nomeCurto: "JBL Go 4",
    marca: "JBL",
    categoria: "som-e-casa",
    resumo: "Pequena no tamanho, grande no som. Vai pendurada na mochila.",
    preco: 349,
    destaques: ["Até 7 h", "IP67", "Bluetooth 5.3", "Alça"],
    ficha: [
      ["Bateria", "Até 7 horas"],
      ["Resistência", "À prova d'água e poeira (IP67)"],
      ["Conexão", "Bluetooth 5.3"],
      ["Extra", "Alça para pendurar"],
    ],
    raioX: ["7 H", "IP67", "BLUETOOTH 5.3"],
    testeGratis: true,
  },
  {
    slug: "echo-dot-5",
    nome: "Echo Dot 5ª geração com Alexa",
    nomeCurto: "Echo Dot 5ª geração",
    marca: "Amazon",
    categoria: "som-e-casa",
    resumo: "A Alexa que toca música, responde e controla a casa inteligente.",
    preco: 429,
    destaques: ["Alexa", "Som mais potente", "Sensor de temperatura"],
    ficha: [
      ["Assistente", "Alexa, em português"],
      ["Som", "Alto-falante com graves mais fortes"],
      ["Sensores", "Temperatura"],
      ["Casa inteligente", "Controla lâmpadas, tomadas e mais"],
    ],
    raioX: ["ALEXA", "SENSOR DE TEMPERATURA", "CASA INTELIGENTE"],
    testeGratis: true,
  },
  {
    slug: "echo-show-5",
    nome: "Echo Show 5 (3ª geração)",
    nomeCurto: "Echo Show 5",
    marca: "Amazon",
    categoria: "som-e-casa",
    resumo: "A Alexa com tela: relógio, receitas, câmeras da casa e chamada de vídeo.",
    preco: 649,
    destaques: ["Tela 5,5\"", "Câmera com tampa", "Alexa"],
    ficha: [
      ["Tela", "5,5 polegadas"],
      ["Câmera", "2 MP com tampa de privacidade"],
      ["Assistente", "Alexa, em português"],
      ["Chamadas", "Voz e vídeo"],
    ],
    raioX: ["TELA 5,5", "CÂMERA 2 MP", "ALEXA"],
    testeGratis: true,
  },
  {
    slug: "chromecast-google-tv",
    nome: "Chromecast com Google TV 4K",
    nomeCurto: "Chromecast Google TV",
    marca: "Google",
    categoria: "som-e-casa",
    resumo: "Transforma qualquer TV com HDMI em smart, com controle por voz e os principais apps de streaming.",
    preco: 349,
    destaques: ["4K HDR", "Controle por voz", "Google TV"],
    ficha: [
      ["Resolução", "Até 4K HDR"],
      ["Controle", "Remoto com Google Assistente"],
      ["Sistema", "Google TV"],
    ],
    raioX: ["4K HDR", "CONTROLE POR VOZ", "GOOGLE TV"],
    testeGratis: true,
  },
  {
    slug: "xiaomi-robot-vacuum-s20-plus",
    nome: "Robô Aspirador Xiaomi S20+",
    nomeCurto: "Robô Xiaomi S20+",
    marca: "Xiaomi",
    categoria: "som-e-casa",
    resumo: "Aspira e passa pano sozinho, mapeia a casa a laser e obedece à Alexa.",
    preco: 2499,
    destaques: ["6000 Pa", "Navegação a laser", "Aspira e passa pano"],
    ficha: [
      ["Sucção", "Até 6000 Pa"],
      ["Navegação", "Laser LDS, com mapa de vários andares"],
      ["Limpeza", "2 em 1, aspira e esfrega com esfregões giratórios"],
      ["Recursos", "Detecta tapete automaticamente"],
      ["Controle", "App Xiaomi Home, Alexa e Google Assistente"],
    ],
    raioX: ["6000 PA", "LASER LDS", "ASPIRA + PANO"],
    testeGratis: true,
  },

  // PC GAMER -----------------------------------------------------------------
  {
    slug: "pc-gamer-visao",
    nome: "PC Gamer Visão Sul RTX 5060",
    nomeCurto: "PC Gamer Visão Sul",
    marca: "Visão Sul",
    categoria: "pc-gamer",
    resumo: "Montado, configurado e testado na bancada da loja. Sai daqui pronto para jogar.",
    preco: 6490,
    destaques: ["Ryzen 5 7600", "RTX 5060 8 GB", "16 GB DDR5", "SSD 1 TB"],
    ficha: [
      ["Processador", "AMD Ryzen 5 7600"],
      ["Placa de vídeo", "NVIDIA GeForce RTX 5060 com 8 GB"],
      ["Memória", "16 GB DDR5"],
      ["Armazenamento", "SSD NVMe de 1 TB"],
      ["Fonte", "650 W 80 Plus"],
      ["Gabinete", "Vidro lateral com 4 fans ARGB"],
      ["Montagem", "Feita e testada na Visão Sul"],
    ],
    raioX: ["RYZEN 5 7600", "RTX 5060 · 8 GB", "16 GB DDR5", "SSD 1 TB"],
    selo: "Montado aqui",
    testeGratis: true,
  },

  // PERIFÉRICOS --------------------------------------------------------------
  {
    slug: "logitech-mk220",
    nome: "Kit Teclado e Mouse sem fio Logitech MK220",
    nomeCurto: "Logitech MK220",
    marca: "Logitech",
    categoria: "perifericos",
    resumo: "Compacto, silencioso e sem fio, com um receptor só para os dois.",
    preco: 159,
    destaques: ["Sem fio", "Receptor único", "Compacto"],
    ficha: [
      ["Conexão", "Sem fio, receptor USB único"],
      ["Formato", "Teclado compacto e mouse de 3 botões"],
      ["Pilhas", "Teclado e mouse com longa duração"],
    ],
    raioX: ["SEM FIO", "RECEPTOR ÚNICO", "COMPACTO"],
    testeGratis: false,
  },
  {
    slug: "hyperx-cloud-stinger-2",
    nome: "Headset Gamer HyperX Cloud Stinger 2",
    nomeCurto: "HyperX Cloud Stinger 2",
    marca: "HyperX",
    categoria: "perifericos",
    resumo: "Leve, confortável e com microfone que muta só de levantar.",
    preco: 299,
    destaques: ["Drivers 50 mm", "Gire para mutar", "Leve"],
    ficha: [
      ["Drivers", "50 mm"],
      ["Microfone", "Com cancelamento de ruído, gire para mutar"],
      ["Áudio", "DTS Headphone:X no PC"],
      ["Conexão", "P2 (3,5 mm)"],
    ],
    raioX: ["DRIVERS 50 MM", "GIRE PARA MUTAR", "DTS HEADPHONE:X"],
    testeGratis: true,
  },
  {
    slug: "monitor-gamer-24",
    nome: "Monitor Gamer LG UltraGear 24\" 180 Hz",
    nomeCurto: "LG UltraGear 24\"",
    marca: "LG",
    categoria: "perifericos",
    resumo: "IPS Full HD a 180 Hz e 1 ms: imagem lisa no jogo e cor certa no trabalho.",
    preco: 999,
    destaques: ["IPS 180 Hz", "1 ms", "Full HD", "FreeSync"],
    ficha: [
      ["Tela", "24 polegadas IPS Full HD"],
      ["Taxa", "180 Hz"],
      ["Resposta", "1 ms (GtG)"],
      ["Recursos", "HDR10 e AMD FreeSync"],
    ],
    raioX: ["IPS 180 HZ", "1 MS", "FREESYNC"],
    testeGratis: true,
  },
  {
    slug: "toshiba-canvio-basics",
    nome: "HD Externo Toshiba Canvio Basics 1 TB",
    nomeCurto: "HD Externo 1 TB",
    marca: "Toshiba",
    categoria: "perifericos",
    resumo: "Backup das fotos e dos documentos num HD que cabe no bolso.",
    preco: 399,
    destaques: ["1 TB", "USB 3.2", "Plug and play"],
    ficha: [
      ["Capacidade", "1 TB"],
      ["Conexão", "USB 3.2 Gen 1"],
      ["Uso", "Plug and play, sem instalar nada"],
    ],
    raioX: ["1 TB", "USB 3.2", "PLUG AND PLAY"],
    testeGratis: false,
  },

  // REDES ----------------------------------------------------------------
  {
    slug: "tp-link-deco-m4",
    nome: "Roteador Wi-Fi Mesh TP-Link Deco M4 (kit com 3)",
    nomeCurto: "Deco M4 (kit com 3)",
    marca: "TP-Link",
    categoria: "redes",
    resumo: "Acaba com o canto sem sinal: Wi-Fi em casa toda, com a mesma rede de ponta a ponta.",
    preco: 899,
    destaques: ["Wi-Fi mesh", "AC1200", "Até 100 aparelhos"],
    ficha: [
      ["Tipo", "Wi-Fi mesh, kit com 3 unidades"],
      ["Velocidade", "AC1200 (dual band)"],
      ["Aparelhos", "Até 100 conectados"],
      ["Configuração", "Pelo app Deco, em minutos"],
    ],
    raioX: ["MESH AC1200", "3 UNIDADES", "100 APARELHOS"],
    testeGratis: false,
  },

  // IMPRESSORAS ----------------------------------------------------------
  {
    slug: "epson-ecotank-l3250",
    nome: "Multifuncional Epson EcoTank L3250 Wi-Fi",
    nomeCurto: "Epson EcoTank L3250",
    marca: "Epson",
    categoria: "impressoras",
    resumo: "Imprime, copia e digitaliza com tanque de tinta: milhares de páginas por kit.",
    preco: 1199,
    destaques: ["Tanque de tinta", "Wi-Fi", "Imprime, copia e digitaliza"],
    ficha: [
      ["Funções", "Impressão, cópia e digitalização"],
      ["Conexão", "Wi-Fi e Wi-Fi Direct"],
      ["Rendimento", "Até 4.500 páginas em preto ou 7.500 coloridas por kit"],
      ["Tinta", "Tanque recarregável EcoTank"],
    ],
    raioX: ["ECOTANK", "WI-FI", "4.500 PÁGINAS"],
    testeGratis: false,
  },

  // CAMPO ----------------------------------------------------------------
  {
    slug: "garmin-tt25",
    nome: "Coleira GPS Garmin TT 25 para cães",
    nomeCurto: "Garmin TT 25",
    marca: "Garmin",
    categoria: "campo",
    resumo: "Rastreamento e treinamento de cães de caça, com GPS preciso e bateria de até 68 horas.",
    preco: 3990,
    destaques: ["GPS e Galileo", "Até 68 h", "LED multicolorido"],
    ficha: [
      ["Posicionamento", "GPS e Galileo"],
      ["Bateria", "Até 68 horas"],
      ["Visibilidade", "LED multicolorido"],
      ["Treinamento", "Tom, vibração e estímulo"],
      ["Compatível", "Portáteis Garmin Alpha 100, 200 e 300, entre outros"],
    ],
    raioX: ["GPS + GALILEO", "68 H", "LED"],
    testeGratis: false,
  },
];

export const produtoPorSlug = (slug: string) => produtos.find((p) => p.slug === slug);

export const produtosDaCategoria = (categoria: string) => produtos.filter((p) => p.categoria === categoria);

/** A vitrine "mais procurados" da página inicial, na ordem em que aparece. */
export const maisProcurados = [
  "hp-victus-15",
  "iphone-17-pro",
  "ps5-slim-digital",
  "jbl-boombox-3",
  "pc-gamer-visao",
  "xiaomi-robot-vacuum-s20-plus",
  "iphone-16",
  "jbl-partybox-encore-essential",
]
  .map(produtoPorSlug)
  .filter((p): p is Produto => Boolean(p));
