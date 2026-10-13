/**
 * O RAIO-X DO NOTEBOOK (página inicial): a ficha do HP Victus 15, peça por
 * peça, na ordem em que a câmera passa por elas. Os números são os do post da
 * própria loja (26/12/2025) e os da HP para o Ryzen 7 7445HS.
 *
 * `de` e `ate` são o trecho do progresso da rolagem (0 a 1) em que a peça
 * acende; a cena e a lista lateral leem os mesmos números.
 */
export const PRODUTO_DO_RAIO_X = "hp-victus-15";

export type PecaDoRaioX = "processador" | "placa-de-video" | "memoria" | "ssd" | "tela";

export const etapasDoRaioX: { peca: PecaDoRaioX; rotulo: string; titulo: string; texto: string; de: number; ate: number }[] = [
  {
    peca: "processador",
    rotulo: "RYZEN 7 7445HS",
    titulo: "Processador AMD Ryzen 7 7445HS",
    texto: "Seis núcleos e doze threads, até 4,7 GHz. Jogo, edição e projeto sem engasgar.",
    de: 0.42,
    ate: 0.53,
  },
  {
    peca: "placa-de-video",
    rotulo: "RTX 4050 · 6 GB",
    titulo: "GeForce RTX 4050 com 6 GB",
    texto: "Ray tracing e DLSS: jogos atuais em Full HD com boa fluidez.",
    de: 0.53,
    ate: 0.64,
  },
  {
    peca: "memoria",
    rotulo: "16 GB DDR5",
    titulo: "16 GB de memória DDR5",
    texto: "Jogo, navegador e Discord abertos ao mesmo tempo.",
    de: 0.64,
    ate: 0.74,
  },
  {
    peca: "ssd",
    rotulo: "SSD 512 GB GEN 4",
    titulo: "SSD de 512 GB PCIe Gen 4",
    texto: "Liga em segundos e carrega o jogo antes de você piscar.",
    de: 0.74,
    ate: 0.84,
  },
  {
    peca: "tela",
    rotulo: "15,6\" · 144 HZ",
    titulo: "Tela Full HD de 144 Hz",
    texto: "Imagem lisa no jogo rápido, cor certa no trabalho.",
    de: 0.84,
    ate: 0.94,
  },
];

/** Em que etapa o progresso está (−1 = nenhuma). */
export function etapaAtual(progresso: number) {
  return etapasDoRaioX.findIndex((e) => progresso >= e.de && progresso < e.ate);
}
