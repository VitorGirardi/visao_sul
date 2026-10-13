/**
 * COMO O CLIENTE ESCREVE → COMO O CATÁLOGO ESCREVE (13/10/2026). "ps5",
 * "wifi" e "fone de ouvido" não achavam nada na vitrine. A palavra da
 * esquerda procura só as da direita, no começo de uma palavra do produto
 * (a própria palavra enganava: "fone" achava o "microfone" do controle).
 * Só entra o que a vitrine tem: o resto cai na busca vazia, que vira pedido
 * de encomenda no WhatsApp.
 *
 * Tudo já no formato da busca: minúsculo, sem acento.
 */
export const SINONIMOS: Record<string, string[]> = {
  ps5: ["playstation"],
  play: ["playstation"],
  videogame: ["console", "playstation"],
  joystick: ["controle", "dualsense"],
  laptop: ["notebook"],
  computador: ["pc", "notebook"],
  desktop: ["pc"],
  smartphone: ["iphone"],
  telefone: ["iphone"],
  fone: ["headset", "airpods"],
  ouvido: ["headset", "airpods"],
  headphone: ["headset"],
  speaker: ["caixa"],
  caixinha: ["caixa"],
  internet: ["roteador", "mesh"],
  cachorro: ["caes", "coleira"],
  cao: ["caes", "coleira"],
};

/** Palavras que não dizem o que a pessoa procura ("fone de ouvido" é "fone" e "ouvido"). */
export const PALAVRAS_VAZIAS = new Set(["a", "as", "o", "os", "um", "uma", "de", "da", "das", "do", "dos", "e", "em", "na", "no", "com", "para", "pra", "sem"]);
