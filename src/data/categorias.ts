/**
 * AS CATEGORIAS DA VITRINE, tiradas do que a loja mostra: os posts do
 * Instagram (notebooks, JBL, robô aspirador, coleira Garmin, PS5) e as
 * prateleiras da foto de 09/10/2026 (PS5, controles, Alexa, Deco, câmbio
 * Logitech, nobreak, teclados), mais o que o Vitor contou (iPhones,
 * Chromecast). A ordem é a da vitrine na página inicial.
 */
export const categorias = [
  {
    slug: "notebooks",
    nome: "Notebooks",
    chamada: "Para estudar, trabalhar e jogar",
    capa: "hp-victus-15",
  },
  {
    slug: "celulares",
    nome: "iPhone e Apple",
    chamada: "iPhone, AirPods e acessórios",
    capa: "iphone-17-pro",
  },
  {
    slug: "games",
    nome: "Games",
    chamada: "Console, controle e simulação",
    capa: "ps5-slim-digital",
  },
  {
    slug: "som-e-casa",
    nome: "Som e casa inteligente",
    chamada: "JBL, Alexa, Chromecast e robô",
    capa: "jbl-boombox-3",
  },
  {
    slug: "pc-gamer",
    nome: "PC gamer",
    chamada: "Montado e testado aqui",
    capa: "pc-gamer-visao",
  },
  {
    slug: "perifericos",
    nome: "Periféricos",
    chamada: "Teclado, mouse, headset e monitor",
    capa: "logitech-mk220",
  },
  {
    slug: "redes",
    nome: "Redes e Wi-Fi",
    chamada: "Sinal na casa e na empresa toda",
    capa: "tp-link-deco-m4",
  },
  {
    slug: "impressoras",
    nome: "Impressoras",
    chamada: "Venda, suprimentos e locação",
    capa: "epson-ecotank-l3250",
  },
  {
    slug: "campo",
    nome: "Campo e caça",
    chamada: "Rastreamento GPS para cães",
    capa: "garmin-tt25",
  },
] as const;

export type SlugDaCategoria = (typeof categorias)[number]["slug"];

export const categoriaPorSlug = (slug: string) => categorias.find((c) => c.slug === slug);

/**
 * "COMBINA COM ESTE" NA FICHA: o que completa cada categoria, em ordem
 * (13/10/2026). Antes a ficha mostrava a mesma categoria e completava com o
 * começo do catálogo: o HP Victus sugeria dois iPhones. O próprio produto é
 * pulado, e o que faltar vem da mesma categoria.
 */
export const combinaCom: Record<SlugDaCategoria, string[]> = {
  notebooks: ["hyperx-cloud-stinger-2", "logitech-mk220", "monitor-gamer-24", "toshiba-canvio-basics"],
  celulares: ["airpods-4", "jbl-go-4", "jbl-charge-5", "iphone-17", "iphone-16", "chromecast-google-tv"],
  games: ["ps5-slim-digital", "dualsense-preto", "logitech-driving-force-shifter", "hyperx-cloud-stinger-2", "monitor-gamer-24"],
  "som-e-casa": ["echo-dot-5", "jbl-go-4", "jbl-charge-5", "chromecast-google-tv", "tp-link-deco-m4", "echo-show-5"],
  "pc-gamer": ["monitor-gamer-24", "hyperx-cloud-stinger-2", "logitech-mk220", "dualsense-preto"],
  perifericos: ["monitor-gamer-24", "logitech-mk220", "hyperx-cloud-stinger-2", "toshiba-canvio-basics", "pc-gamer-visao"],
  redes: ["echo-dot-5", "chromecast-google-tv", "echo-show-5", "xiaomi-robot-vacuum-s20-plus"],
  impressoras: ["hp-15-touch", "acer-aspire-5", "toshiba-canvio-basics", "tp-link-deco-m4"],
  campo: ["jbl-charge-5", "jbl-go-4", "iphone-16", "airpods-4"],
};
