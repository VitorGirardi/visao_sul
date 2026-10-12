import * as THREE from "three";

/**
 * MATCAP: a "foto de uma esfera iluminada" que o material usa no lugar de
 * luz, sombra e reflexo de ambiente. Mudança de 09/10/2026 (o Vitor achou o
 * site travado): com material físico + ambiente (PMREM), cada shader levava
 * centenas de ms para compilar na Intel UHD dele e cada quadro pesava. Matcap
 * é uma consulta de textura por pixel: o ouro continua ouro, girando com o
 * mouse, a uma fração do custo.
 *
 * As esferas são pintadas em canvas (nada de imagem baixada) e guardadas por
 * receita: a cena que pede "ouro" duas vezes recebe a mesma textura.
 */
export type ReceitaDeMatcap = {
  /** sombra (borda de baixo), meio-tom, luz e o brilho especular */
  sombra: string;
  meio: string;
  luz: string;
  brilho: string;
  /** força do brilho especular, 0 a 1 */
  intensidade?: number;
};

export const MATCAPS = {
  ouro: { sombra: "#5c3b00", meio: "#e3a900", luz: "#ffcd2e", brilho: "#fff6d6", intensidade: 0.9 },
  grafite: { sombra: "#08090d", meio: "#2c303c", luz: "#6b7186", brilho: "#dfe4ff", intensidade: 0.55 },
  plastico: { sombra: "#030305", meio: "#15161c", luz: "#383a46", brilho: "#9aa0b8", intensidade: 0.35 },
  prata: { sombra: "#2a2c33", meio: "#9a9eaa", luz: "#d9dce6", brilho: "#ffffff", intensidade: 0.9 },
  cobre: { sombra: "#3a1604", meio: "#b8652a", luz: "#f0a46a", brilho: "#fff0e0", intensidade: 0.85 },
  vidro: { sombra: "#1c1f3a", meio: "#5c63a8", luz: "#b9bfff", brilho: "#ffffff", intensidade: 0.9 },
} as const satisfies Record<string, ReceitaDeMatcap>;

const guardadas = new Map<string, THREE.CanvasTexture>();

export function matcap(receita: ReceitaDeMatcap): THREE.CanvasTexture {
  const chave = JSON.stringify(receita);
  const pronta = guardadas.get(chave);
  if (pronta) return pronta;

  const lado = 256;
  const tela = document.createElement("canvas");
  tela.width = tela.height = lado;
  const g = tela.getContext("2d");
  if (g) {
    const c = lado / 2;
    g.fillStyle = receita.sombra;
    g.fillRect(0, 0, lado, lado);
    // corpo: luz vindo de cima à esquerda
    const corpo = g.createRadialGradient(c * 0.72, c * 0.62, 0, c, c, c);
    corpo.addColorStop(0, receita.luz);
    corpo.addColorStop(0.55, receita.meio);
    corpo.addColorStop(1, receita.sombra);
    g.fillStyle = corpo;
    g.beginPath();
    g.arc(c, c, c, 0, Math.PI * 2);
    g.fill();
    // contraluz fino na borda de baixo à direita (dá volume ao chanfro). O
    // círculo de início TEM de ficar dentro do de fim: fora dele o canvas faz um
    // cone e pinta a última cor na esfera quase toda (todo matcap saía pastel;
    // achado do agente do Raio-X em 09/10/2026).
    const borda = g.createRadialGradient(c * 0.85, c * 0.8, c * 0.7, c, c, c);
    borda.addColorStop(0, "rgba(255,255,255,0)");
    borda.addColorStop(0.85, "rgba(255,255,255,0)");
    borda.addColorStop(1, `${receita.luz}aa`);
    g.fillStyle = borda;
    g.beginPath();
    g.arc(c, c, c, 0, Math.PI * 2);
    g.fill();
    // brilho especular
    const alfa = Math.round((receita.intensidade ?? 0.8) * 255).toString(16).padStart(2, "0");
    const brilho = g.createRadialGradient(c * 0.62, c * 0.5, 0, c * 0.62, c * 0.5, c * 0.42);
    brilho.addColorStop(0, `${receita.brilho}${alfa}`);
    brilho.addColorStop(1, `${receita.brilho}00`);
    g.fillStyle = brilho;
    g.fillRect(0, 0, lado, lado);
  }
  const textura = new THREE.CanvasTexture(tela);
  textura.colorSpace = THREE.SRGBColorSpace;
  guardadas.set(chave, textura);
  return textura;
}
