// Letreiro da logo em curvas lisas: contorno subpixel (d3-contour) da máscara 8x suavizada,
// cantos detectados pelo ângulo de virada e curvas de Bézier ajustadas entre os cantos (fit-curve).
import sharp from 'sharp';
import { contours } from 'd3-contour';
import fitCurve from 'fit-curve';
import fs from 'node:fs';
import path from 'node:path';

const [, , DIR] = process.argv;
const E = 8;
const recorte = { left: 350, top: 520 };
const OX = 470, OY = 427.75;

// Média gaussiana dos pontos. Em trecho aberto as pontas (os cantos) ficam fixas e a janela
// encolhe perto delas, para a suavização não arredondar o canto.
function suavizar(pontos, sigma, fechado) {
  const n = pontos.length, raio = Math.ceil(sigma * 2.5), pesos = [];
  for (let k = -raio; k <= raio; k++) pesos.push(Math.exp(-(k * k) / (2 * sigma * sigma)));
  return pontos.map((p, i) => {
    if (!fechado && (i === 0 || i === n - 1)) return p;
    let sx = 0, sy = 0, sw = 0;
    for (let k = -raio; k <= raio; k++) {
      let j = i + k;
      if (fechado) j = (j + n) % n;
      else if (j < 0 || j >= n || Math.abs(k) > Math.min(i, n - 1 - i)) continue;
      const w = pesos[k + raio];
      sx += pontos[j][0] * w; sy += pontos[j][1] * w; sw += w;
    }
    return [sx / sw, sy / sw];
  });
}

function anelParaCaminho(anel, { janela = 9, limiteGraus = 40, erro = 3.5, sigma = 9 } = {}) {
  // d3 fecha o anel repetindo o primeiro ponto no fim
  const pts = anel.slice(0, -1);
  const n = pts.length;
  const virada = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    const a = pts[(i - janela + n) % n], b = pts[i], c = pts[(i + janela) % n];
    const v1 = [b[0] - a[0], b[1] - a[1]], v2 = [c[0] - b[0], c[1] - b[1]];
    const ang = Math.atan2(v1[0] * v2[1] - v1[1] * v2[0], v1[0] * v2[0] + v1[1] * v2[1]);
    virada[i] = Math.abs((ang * 180) / Math.PI);
  }
  // cantos: máximos locais acima do limite, um por janela
  const cantos = [];
  for (let i = 0; i < n; i++) {
    if (virada[i] < limiteGraus) continue;
    let maximo = true;
    for (let k = -janela; k <= janela; k++) if (k && virada[(i + k + n) % n] > virada[i]) { maximo = false; break; }
    if (maximo && !cantos.some((c) => Math.min(Math.abs(c - i), n - Math.abs(c - i)) <= janela)) cantos.push(i);
  }
  cantos.sort((x, y) => x - y);

  const curvas = [];
  if (cantos.length === 0) {
    // anel liso (o, furo do a): ajusta inteiro, começando e terminando no mesmo ponto
    const liso = suavizar(pts, sigma * 1.5, true);
    const fechado = [...liso, liso[0]];
    curvas.push(...fitCurve(fechado, erro));
  } else {
    for (let j = 0; j < cantos.length; j++) {
      const ini = cantos[j], fim = cantos[(j + 1) % cantos.length];
      const trecho = [];
      for (let i = ini; ; i = (i + 1) % n) { trecho.push(pts[i]); if (i === fim) break; }
      const a = trecho[0], b = trecho.at(-1);
      const corda = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      // trecho quase reto (haste, perna do V, pingo do i) vira reta de canto a canto
      const desvio = Math.max(...trecho.map((q) => Math.abs((b[0] - a[0]) * (a[1] - q[1]) - (a[0] - q[0]) * (b[1] - a[1])) / corda));
      if (trecho.length < 3 || desvio < Math.max(5, corda * 0.025)) { curvas.push([a, a, b, b]); continue; }
      curvas.push(...fitCurve(suavizar(trecho, sigma, false), erro));
    }
  }
  return { curvas, cantos: cantos.length };
}

const fmt = (v) => String(Number(v.toFixed(2)));
const paraLogo = ([x, y]) => [x / E + recorte.left - OX, y / E + recorte.top - OY];

async function letreiro(nome) {
  const { data, info } = await sharp(path.join(DIR, `mascara8-${nome}.png`)).greyscale().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const valores = new Float64Array(W * H);
  for (let i = 0; i < W * H; i++) valores[i] = 1 - data[i * info.channels] / 255; // 1 = tinta
  const [multi] = contours().size([W, H]).smooth(true).thresholds([0.5])(Array.from(valores));
  let d = '', totalCurvas = 0, totalCantos = 0;
  for (const poligono of multi.coordinates) {
    for (const anel of poligono) {
      if (anel.length < 12) continue;
      const { curvas, cantos } = anelParaCaminho(anel);
      totalCurvas += curvas.length; totalCantos += cantos;
      const p0 = paraLogo(curvas[0][0]);
      d += `M${fmt(p0[0])} ${fmt(p0[1])}`;
      for (const [, c1, c2, p] of curvas) {
        const a = paraLogo(c1), b = paraLogo(c2), c = paraLogo(p);
        d += `C${fmt(a[0])} ${fmt(a[1])} ${fmt(b[0])} ${fmt(b[1])} ${fmt(c[0])} ${fmt(c[1])}`;
      }
      d += 'Z';
    }
  }
  console.log(nome, 'curvas', totalCurvas, 'cantos', totalCantos, 'tamanho', d.length);
  return d;
}

const caminhos = JSON.parse(fs.readFileSync(path.join(DIR, 'logo-caminhos.json'), 'utf8'));
caminhos.nome = await letreiro('nome');
caminhos.informatica = await letreiro('informatica');
fs.writeFileSync(path.join(DIR, 'logo-caminhos-v2.json'), JSON.stringify(caminhos, null, 2));

const svg = (cores) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${caminhos.viewBox}">
<path fill="${cores.simbolo}" d="${caminhos.lamina}"/>
<path fill="${cores.simbolo}" fill-rule="evenodd" d="${caminhos.anel}"/>
<path fill="${cores.nome}" fill-rule="evenodd" d="${caminhos.nome}"/>
<path fill="${cores.info}" fill-rule="evenodd" d="${caminhos.informatica}"/>
</svg>`;
const oficial = svg({ simbolo: '#ECB500', nome: '#060523', info: '#060523' });
fs.writeFileSync(path.join(DIR, 'logo-v2-oficial.svg'), oficial);
fs.writeFileSync(path.join(DIR, 'logo-v2-letreiro.svg'), svg({ simbolo: '#ECB500', nome: '#FFFFFF', info: '#ECB500' }));
await sharp(Buffer.from(oficial)).resize({ width: 2400 }).flatten({ background: '#EEEEEE' }).png().toFile(path.join(DIR, 'v2-oficial.png'));
await sharp(path.join(DIR, 'v2-oficial.png')).extract({ left: 0, top: 760, width: 1300, height: 640 }).toFile(path.join(DIR, 'v2-zoom.png'));
