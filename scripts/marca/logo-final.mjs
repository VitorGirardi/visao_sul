// Logo final: símbolo reconstruído com geometria (círculos e curvas medidas na lâmina oficial)
// e letreiro vetorizado com suavização forte (8x + desfoque), para ficar limpo em tamanho grande.
import sharp from 'sharp';
import potrace from 'potrace';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const [, , ORIGEM, SAIDA] = process.argv;
fs.mkdirSync(SAIDA, { recursive: true });

// ---------------------------------------------------------------------------
// 1) SÍMBOLO, em coordenadas da lâmina 1080 deslocadas para (470, 427.75)
// ---------------------------------------------------------------------------
const OX = 470, OY = 427.75;
const C = { x: 80.8, y: 56.6 };       // centro do anel (o furo é concêntrico)
const R = 35.2, r = 18.7;              // raio externo e do furo
const T = { x: 35, y: 39.75 };         // ponta da cauda do anel
const ang = (g) => (g * Math.PI) / 180;
const naCirc = (g, raio = R) => ({ x: C.x + raio * Math.cos(ang(g)), y: C.y + raio * Math.sin(ang(g)) });
const f = (n) => Number(n.toFixed(2));
const p = (pt) => `${f(pt.x)} ${f(pt.y)}`;

const topo = naCirc(-90);              // onde a borda de cima da cauda encosta no círculo
const juncao = naCirc(144);            // onde a borda de baixo da cauda volta para o círculo
const tang = { x: -Math.sin(ang(144)), y: Math.cos(ang(144)) }; // tangente no sentido horário (y para baixo)

const anel = [
  `M${p(T)}`,
  `C44 27.5 62 ${f(topo.y)} ${p(topo)}`,
  `A${R} ${R} 0 1 1 ${p(juncao)}`,
  `C${p({ x: juncao.x + 8 * tang.x, y: juncao.y + 8 * tang.y })} 38.5 50 ${p(T)}`,
  'Z',
  // furo (sentido contrário para o evenodd/nonzero darem o mesmo resultado)
  `M${p({ x: C.x + r, y: C.y })}`,
  `A${r} ${r} 0 1 0 ${p({ x: C.x - r, y: C.y })}`,
  `A${r} ${r} 0 1 0 ${p({ x: C.x + r, y: C.y })}`,
  'Z',
].join(' ');

const L = { x: 0, y: 20.25 }, Rb = { x: 110, y: 0 }, B = { x: 31.25, y: 36 };
const lamina = [
  `M${p(L)}`,
  `C22 4 60 0.5 ${p(Rb)}`,
  `C85 2.5 45 17 ${p(B)}`,
  `C24 29.5 10 22 ${p(L)}`,
  'Z',
].join(' ');

// ---------------------------------------------------------------------------
// 2) LETREIRO vetorizado (8x, desfoque, limiar no meio da rampa)
// ---------------------------------------------------------------------------
const E = 8;
const recorte = { left: 350, top: 520, width: 380, height: 140 };
const W = recorte.width * E, H = recorte.height * E;
const { data, info } = await sharp(ORIGEM).extract(recorte).resize(W, H, { kernel: 'lanczos3' }).raw().toBuffer({ resolveWithObject: true });
const CH = info.channels;
const CORTE = (790 / 4 + 410 - recorte.top) * E; // linha entre o nome e "INFORMÁTICA", vinda da medição 4x

function mascara(filtroY) {
  const m = Buffer.alloc(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * CH;
    const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const amarelado = data[i] - data[i + 2] > 40;
    const v = !filtroY(y) || amarelado ? 0 : Math.max(0, Math.min(1, (215 - l) / 150));
    m[y * W + x] = Math.round(255 * (1 - v));
  }
  return m;
}

async function tracar(buf, nome) {
  const png = await sharp(buf, { raw: { width: W, height: H, channels: 1 } }).blur(3.2).png().toBuffer();
  fs.writeFileSync(path.join(SAIDA, `mascara8-${nome}.png`), png);
  const t = new potrace.Potrace();
  t.setParameters({ turdSize: 400, alphaMax: 1.05, optCurve: true, optTolerance: 0.5, threshold: 128, blackOnWhite: true });
  await promisify(t.loadImage.bind(t))(png);
  return /d="([^"]+)"/.exec(t.getPathTag('#000'))[1];
}
const nomeD = await tracar(mascara((y) => y < CORTE), 'nome');
const infoD = await tracar(mascara((y) => y >= CORTE), 'informatica');

// Converte o caminho do potrace (coordenadas 8x do recorte) para o mesmo sistema do símbolo,
// reduzindo a precisão para 2 casas.
function reposicionar(d) {
  // potrace só emite M, L (implícito), C e Z com coordenadas absolutas
  return d.replace(/-?\d+(\.\d+)?/g, (() => {
    let eixo = 0;
    return (n) => {
      const v = Number(n);
      const out = eixo === 0 ? v / E + recorte.left - OX : v / E + recorte.top - OY;
      eixo = 1 - eixo;
      return String(Number(out.toFixed(2)));
    };
  })());
}
const nome = reposicionar(nomeD);
const informatica = reposicionar(infoD);

// caixa do conjunto: do símbolo (0..116 x 0..92) ao letreiro (recorte 360..705 x 528..650)
const vb = { x: 360 - OX - 6, y: -6, w: 0, h: 0 };
vb.w = 712 - 360 + 12;
vb.h = 652 - OY + 6;
const viewBox = `${f(vb.x)} ${f(vb.y)} ${f(vb.w)} ${f(vb.h)}`;

const camadas = { lamina, anel, nome, informatica };
fs.writeFileSync(path.join(SAIDA, 'logo-caminhos.json'), JSON.stringify({ viewBox, ...camadas }, null, 2));

const svg = (cores, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${extra}
<path fill="${cores.simbolo}" fill-rule="evenodd" d="${lamina}"/>
<path fill="${cores.simbolo}" fill-rule="evenodd" d="${anel}"/>
<path fill="${cores.nome}" fill-rule="evenodd" d="${nome}"/>
<path fill="${cores.info}" fill-rule="evenodd" d="${informatica}"/>
</svg>`;
fs.writeFileSync(path.join(SAIDA, 'logo-final-oficial.svg'), svg({ simbolo: '#ECB500', nome: '#060523', info: '#060523' }));
fs.writeFileSync(path.join(SAIDA, 'logo-final-letreiro.svg'), svg({ simbolo: '#ECB500', nome: '#FFFFFF', info: '#ECB500' }));

// prévia grande e sobreposição com o original (vetor em vermelho translúcido)
await sharp(Buffer.from(svg({ simbolo: '#ECB500', nome: '#060523', info: '#060523' }))).resize({ width: 1600 }).flatten({ background: '#EEEEEE' }).png().toFile(path.join(SAIDA, 'final-oficial.png'));
await sharp(Buffer.from(svg({ simbolo: '#ECB500', nome: '#FFFFFF', info: '#ECB500' }))).resize({ width: 1600 }).flatten({ background: '#010029' }).png().toFile(path.join(SAIDA, 'final-letreiro.png'));
const larg = 1600, esc = larg / vb.w, alt = Math.round(vb.h * esc);
const fundo = await sharp(ORIGEM).extract({ left: Math.round(OX + vb.x), top: Math.round(OY + vb.y), width: Math.round(vb.w), height: Math.round(vb.h) }).resize(larg, alt).png().toBuffer();
const sobre = await sharp(Buffer.from(svg({ simbolo: 'rgba(255,0,0,0.45)', nome: 'rgba(255,0,0,0.45)', info: 'rgba(255,0,0,0.45)' }))).resize(larg, alt).png().toBuffer();
await sharp(fundo).composite([{ input: sobre }]).png().toFile(path.join(SAIDA, 'final-sobreposto.png'));
console.log('viewBox', viewBox, '| nome', nome.length, '| info', informatica.length);
