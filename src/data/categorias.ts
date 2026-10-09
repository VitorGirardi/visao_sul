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
