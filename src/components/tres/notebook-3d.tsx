"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useEffectEvent, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { MATCAPS, matcap, type ReceitaDeMatcap } from "@/components/tres/matcap";
import { Palco } from "@/components/tres/palco";
import { prepararRenderizador, Ritmo } from "@/components/tres/ritmo";
import { ANEL, LAMINA } from "@/data/marca";
import { etapaAtual, etapasDoRaioX, type PecaDoRaioX } from "@/data/raio-x";
import { estadoDoRaioX } from "@/lib/raio-x";
import { useTema } from "@/lib/tema";

/**
 * O NOTEBOOK DO RAIO-X, montado em código (nada de modelo baixado): base,
 * teclado com luz, tampa com a tela da Visão Sul e, por dentro, placa-mãe,
 * processador, placa de vídeo, memórias, SSD, ventoinhas, heat pipes e
 * bateria. É um notebook gamer genérico; o rótulo na tela diz que a ficha é
 * a do HP Victus 15.
 *
 * Com a rolagem (`estadoDoRaioX.progresso`): a tampa abre e a tela acende
 * (até 0,3), a câmera sobe e a carcaça vira chapa de raio-x (0,3 a 0,42),
 * cada peça acende na sua etapa (`data/raio-x.ts`), e no fim tudo volta ao
 * normal para o preço.
 *
 * Leve de propósito (09/10/2026, o Vitor achou o site travado na Intel UHD
 * dele): tudo é matcap (`matcap.ts`), sem luz, sem ambiente (PMREM) e sem
 * material físico. Os shaders compilam em paralelo antes de a cena aparecer
 * (`prepararCena`), com a foto do produto segurando o lugar até lá.
 */

const limitar = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const suave = (t: number) => t * t * (3 - 2 * t);
const faixa = (p: number, de: number, ate: number) => suave(limitar((p - de) / (ate - de)));
/** Sobe e desce dentro de um trecho: 0 fora, 1 no meio. */
const lombada = (p: number, de: number, ate: number) => {
  const borda = Math.min(0.03, (ate - de) / 3);
  return faixa(p, de - borda, de + borda) * (1 - faixa(p, ate - borda, ate + borda));
};

/* ---------- texturas desenhadas em canvas ---------- */

/**
 * Textura de canvas ainda em branco. O desenho vem depois, em
 * `prepararCena`, uma por quadro e enquanto a GPU compila: desenhar texto e
 * gradiente na montagem engrossava a tarefa que trava a rolagem na chegada.
 */
function texturaEmBranco(largura: number, altura: number) {
  const c = document.createElement("canvas");
  c.width = largura;
  c.height = altura;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function pincel(t: THREE.CanvasTexture) {
  return (t.image as HTMLCanvasElement).getContext("2d");
}

/**
 * A tela da Visão Sul, em 768 × 480 (era 1024 × 640) e sem `shadowBlur`: o
 * desfoque de sombra do canvas é caro de rasterizar e o canvas maior pesava
 * no envio para a GPU. O halo do olho virou gradiente radial, que custa
 * quase nada. As coordenadas continuam as de 1024 × 640, só que reduzidas.
 */
function desenharTela(t: THREE.CanvasTexture) {
  const g = pincel(t);
  if (!g) return;
  g.scale(0.75, 0.75);
  const fundo = g.createLinearGradient(0, 0, 1024, 640);
  fundo.addColorStop(0, "#05042a");
  fundo.addColorStop(0.6, "#120f5c");
  fundo.addColorStop(1, "#2a1f7a");
  g.fillStyle = fundo;
  g.fillRect(0, 0, 1024, 640);
  // a grade num traço só (um retângulo por casa riscava cada linha duas vezes, daí o 0,11)
  g.strokeStyle = "rgba(255,255,255,0.11)";
  g.lineWidth = 1 / 0.75;
  g.beginPath();
  for (let x = 0; x <= 1024; x += 48) {
    g.moveTo(x, 0);
    g.lineTo(x, 640);
  }
  for (let y = 0; y <= 640; y += 48) {
    g.moveTo(0, y);
    g.lineTo(1024, y);
  }
  g.stroke();
  const luz = g.createRadialGradient(512, 300, 0, 512, 300, 320);
  luz.addColorStop(0, "rgba(236,181,0,0.45)");
  luz.addColorStop(1, "rgba(236,181,0,0)");
  g.fillStyle = luz;
  g.fillRect(0, 0, 1024, 640);
  // o halo colado no olho (era o shadowBlur)
  const halo = g.createRadialGradient(512, 280, 40, 512, 280, 200);
  halo.addColorStop(0, "rgba(255,200,40,0.5)");
  halo.addColorStop(0.55, "rgba(236,181,0,0.18)");
  halo.addColorStop(1, "rgba(236,181,0,0)");
  g.fillStyle = halo;
  g.fillRect(0, 0, 1024, 640);
  // o olho da marca no meio da tela (símbolo de 116 × 92, escala 2,6)
  const s = 2.6;
  g.save();
  g.translate(512 - 58 * s, 280 - 46 * s);
  g.scale(s, s);
  g.fillStyle = "#ECB500";
  g.fill(new Path2D(LAMINA));
  g.fill(new Path2D(ANEL), "evenodd");
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.85)";
  g.font = "600 30px monospace";
  g.textAlign = "center";
  g.fillText("RAIO-X VISÃO SUL", 512, 560);
  g.fillStyle = "rgba(236,181,0,0.9)";
  g.font = "600 22px monospace";
  g.fillText("144 HZ · FULL HD", 512, 600);
  t.needsUpdate = true;
}

/**
 * As trilhas da placa-mãe, num traço só. Mais claras que antes: o matcap só
 * multiplica (escurece) a cor, e não há mais luz nenhuma para clarear.
 */
function desenharTrilhas(t: THREE.CanvasTexture) {
  const g = pincel(t);
  if (!g) return;
  g.fillStyle = "#1f5c45";
  g.fillRect(0, 0, 512, 256);
  g.strokeStyle = "rgba(150,255,210,0.5)";
  g.lineWidth = 1.5;
  g.beginPath();
  for (let i = 0; i < 70; i++) {
    let x = (i * 97) % 512;
    let y = (i * 53) % 256;
    g.moveTo(x, y);
    for (let k = 0; k < 4; k++) {
      if (k % 2 === 0) x += ((i * 31 + k * 17) % 90) - 45;
      else y += ((i * 13 + k * 29) % 70) - 35;
      g.lineTo(x, y);
    }
  }
  g.stroke();
  t.needsUpdate = true;
}

/**
 * O reflexo violeta do lado esquerdo da tampa e do tampo, que antes vinha do
 * ambiente (PMREM) batendo no metal. O matcap não faz isso (face plana tem
 * uma cor só), então ele virou um gradiente pintado uma vez e SOMADO por
 * cima da carcaça: mesma cara, custo de um plano.
 */
function desenharReflexo(t: THREE.CanvasTexture) {
  const g = pincel(t);
  if (!g) return;
  // o plano deita com o topo do canvas para trás: a esquerda do canvas é a esquerda do notebook
  const luz = g.createRadialGradient(-20, 80, 0, -20, 80, 160);
  luz.addColorStop(0, "rgba(112,120,228,1)");
  luz.addColorStop(0.5, "rgba(96,102,205,0.36)");
  luz.addColorStop(1, "rgba(96,102,205,0)");
  g.fillStyle = luz;
  g.fillRect(0, 0, 256, 128);
  t.needsUpdate = true;
}

type Texturas = { tela: THREE.CanvasTexture; trilhas: THREE.CanvasTexture; reflexo: THREE.CanvasTexture };

function criarTexturas(): Texturas {
  const tela = texturaEmBranco(768, 480);
  tela.anisotropy = 4;
  return { tela, trilhas: texturaEmBranco(512, 256), reflexo: texturaEmBranco(256, 128) };
}

/* ---------- geometria e cópias montadas uma vez ---------- */

/** Os três heat pipes numa geometria só (uma chamada de desenho). */
function criarCanos() {
  const caminhos = [
    [new THREE.Vector3(-0.3, 0.15, -0.62), new THREE.Vector3(-0.8, 0.15, -0.8), new THREE.Vector3(-1.32, 0.15, -0.86)],
    [new THREE.Vector3(0.42, 0.15, -0.62), new THREE.Vector3(0.95, 0.15, -0.82), new THREE.Vector3(1.38, 0.15, -0.86)],
    [new THREE.Vector3(-0.3, 0.155, -0.7), new THREE.Vector3(0.05, 0.16, -0.78), new THREE.Vector3(0.42, 0.155, -0.7)],
  ];
  const canos = caminhos.map((pts) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.028, 8, false));
  const unica = mergeGeometries(canos);
  canos.forEach((c) => c.dispose());
  return unica;
}

/**
 * Põe cada cópia de uma malha instanciada no lugar, uma vez na montagem.
 * Teclas, pás das ventoinhas e pentes de memória são cópias: uma chamada de
 * desenho cada grupo, e o mesmo shader (as 9 pás eram 9 malhas por ventoinha).
 */
function espalhar(malha: THREE.InstancedMesh | null, posicionar: (i: number, m: THREE.Matrix4) => void) {
  if (!malha) return;
  for (let i = 0; i < malha.count; i++) {
    posicionar(i, MATRIZ.identity());
    malha.setMatrixAt(i, MATRIZ);
  }
  malha.instanceMatrix.needsUpdate = true;
}

/* ---------- chapa de raio-x: brilho só nas bordas (fresnel) ---------- */

const sombreadorDeVertice = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vVista;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vVista = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const sombreadorDeFragmento = /* glsl */ `
  uniform vec3 uCor;
  uniform float uForca;
  varying vec3 vNormal;
  varying vec3 vVista;
  void main() {
    float borda = pow(1.0 - abs(dot(vNormal, vVista)), 2.0);
    gl_FragColor = vec4(uCor, (borda * 0.9 + 0.06) * uForca);
  }
`;

/**
 * Uma chapa só para base e tampa, criada na primeira vez (fica no módulo:
 * muda todo quadro). Não é descartada ao desmontar: o R3F derruba o contexto
 * WebGL junto com o canvas, e zerar a variável deixava as malhas com a chapa
 * velha quando o modo estrito do React desmonta e remonta os efeitos.
 */
let chapaCompartilhada: THREE.ShaderMaterial | null = null;
const chapa = () => (chapaCompartilhada ??= criarChapa());

function criarChapa() {
  return new THREE.ShaderMaterial({
    uniforms: { uCor: { value: new THREE.Color("#ECB500") }, uForca: { value: 0 } },
    vertexShader: sombreadorDeVertice,
    fragmentShader: sombreadorDeFragmento,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    // soma de luz não depende da ordem: as duas faces num desenho só, e um shader a menos
    forceSinglePass: true,
  });
}

/* ---------- matcaps (a cena não tem luz nenhuma) ---------- */

/**
 * O chassi: marinho puxado para o violeta, o mesmo tom que a luz e o
 * ambiente davam antes ao cinza (#454a5c). Não é o grafite do `matcap.ts`:
 * com a câmera alta, a tampa e o tampo olham para a borda de cima da esfera,
 * e no grafite isso é quase preto.
 */
const CHASSI: ReceitaDeMatcap = { sombra: "#0c1030", meio: "#262c66", luz: "#7078d0", brilho: "#e0e4ff", intensidade: 0.5 };
/** No claro, um marinho mais acinzentado, como o cinza de antes (#5a6072) com o ambiente mais forte. */
const CHASSI_CLARO: ReceitaDeMatcap = { sombra: "#1c2238", meio: "#3a4366", luz: "#8a92c8", brilho: "#eef0ff", intensidade: 0.5 };

/**
 * As peças usam a prata como "forma" (luz, sombra e brilho) e a cor do
 * material dá o tom. Acesa, a cor passa de 1 (o emissive fazia isso antes):
 * sem tone mapping (`flat`), o vermelho satura e o verde fica abaixo, então
 * o topo vira amarelo quente (#ffd040) e as laterais, ouro. Com o verde
 * alto também saturava e o amarelo ia para o limão.
 */
const ACESO = new THREE.Color().setRGB(2.2, 1.2, 0.1);
const BASE_DA_PECA: Partial<Record<PecaDoRaioX, THREE.Color>> = {
  processador: new THREE.Color("#e9ebf2"),
  "placa-de-video": new THREE.Color("#3b3e4c"),
  memoria: new THREE.Color("#2f6b4c"),
  ssd: new THREE.Color("#2b3058"),
};
/** Com a chapa ligada, toda peça puxa um pouco para o amarelo (a acesa vai até o fim). */
const TOM_DO_RAIO_X = 0.4;

/* ---------- peças ---------- */

/** Onde fica cada peça dentro da base (para acender e para o rótulo). */
const POSICAO: Record<PecaDoRaioX, [number, number, number]> = {
  processador: [-0.3, 0.12, -0.62],
  "placa-de-video": [0.42, 0.12, -0.62],
  memoria: [-1.0, 0.11, -0.5],
  ssd: [1.12, 0.11, -0.3],
  tela: [0, 1.32, -1.5],
};

type Brilhos = Record<PecaDoRaioX, THREE.MeshMatcapMaterial | null>;

const TECLAS_X = 15;
const TECLAS_Z = 6;
const MATRIZ = new THREE.Matrix4();
const ALVO = new THREE.Vector3();
const OLHAR = new THREE.Vector3();

/** Quadros-chave da câmera: [progresso, posição, para onde olha]. */
const CAMERA: [number, [number, number, number], [number, number, number]][] = [
  [0, [5.2, 3.7, 8.2], [0, 0.3, 0]],
  [0.28, [4.5, 3.3, 7.1], [0, 0.6, -0.3]],
  [0.42, [1.4, 6.6, 4.1], [0, 0, -0.4]],
  [0.53, [0.4, 5.2, 2.8], [-0.25, 0, -0.6]],
  [0.64, [1.3, 5.2, 2.8], [0.4, 0, -0.6]],
  [0.74, [-0.9, 5.0, 3.0], [-0.85, 0, -0.5]],
  [0.84, [1.9, 5.0, 3.1], [0.95, 0, -0.35]],
  [0.92, [0.3, 2.4, 6.4], [0, 1.15, -1.2]],
  [1, [4.9, 3.3, 7.8], [0, 0.4, -0.1]],
];

function posicionarCamera(p: number, camera: THREE.Camera, largura: number, altura: number, delta: number) {
  // Tela larga: o canvas ocupa a seção inteira e a imagem anda 17% para a direita,
  // deixando o texto livre à esquerda sem cortar o notebook na borda do canvas.
  const cam = camera as THREE.PerspectiveCamera;
  // Em pé, o contrário: desce 10% para o notebook não encostar no cabeçalho.
  const deslocamento = largura >= 1024 ? -largura * 0.17 : 0;
  const descida = largura / Math.max(1, altura) < 1.25 ? -altura * 0.1 : 0;
  if (!cam.view || cam.view.offsetX !== deslocamento || cam.view.offsetY !== descida || cam.view.fullWidth !== largura || cam.view.fullHeight !== altura) {
    if (deslocamento === 0 && descida === 0) cam.clearViewOffset();
    else cam.setViewOffset(largura, altura, deslocamento, descida, largura, altura);
  }
  let i = 0;
  while (i < CAMERA.length - 2 && p > CAMERA[i + 1][0]) i++;
  const [p0, c0, o0] = CAMERA[i];
  const [p1, c1, o1] = CAMERA[i + 1];
  const t = suave(limitar((p - p0) / (p1 - p0)));
  ALVO.set(c0[0] + (c1[0] - c0[0]) * t, c0[1] + (c1[1] - c0[1]) * t, c0[2] + (c1[2] - c0[2]) * t);
  OLHAR.set(o0[0] + (o1[0] - o0[0]) * t, o0[1] + (o1[1] - o0[1]) * t, o0[2] + (o1[2] - o0[2]) * t);
  // Tela em pé (celular): a câmera recua na proporção, para o notebook caber.
  const proporcao = largura / Math.max(1, altura);
  if (proporcao < 1.25) ALVO.sub(OLHAR).multiplyScalar(Math.min(1.9, 1.3 / proporcao)).add(OLHAR);
  // 12% do caminho a cada 1/60 s, em qualquer ritmo de quadros (era 12% por quadro: a 144 Hz corria 2,4 vezes mais)
  camera.position.lerp(ALVO, 1 - Math.pow(0.88, delta * 60));
  camera.lookAt(OLHAR);
}

type Partes = {
  tampa: THREE.Group | null;
  ventoinhas: (THREE.Object3D | null)[];
  carcaca: THREE.MeshMatcapMaterial[];
  reflexos: (THREE.MeshBasicMaterial | null)[];
  brilhos: Brilhos;
  tela: THREE.MeshBasicMaterial | null;
  luzDoTeclado: THREE.MeshBasicMaterial | null;
};

/** Tudo o que muda a cada quadro, numa função comum (o three é imperativo). */
function animarNotebook(p: number, camera: THREE.Camera, tamanho: { width: number; height: number }, tempo: number, delta: number, escuro: boolean, partes: Partes) {
  posicionarCamera(p, camera, tamanho.width, tamanho.height, delta);

  const abertura = faixa(p, 0.08, 0.3);
  if (partes.tampa) partes.tampa.rotation.x = -abertura * 1.86;

  const raioX = faixa(p, 0.3, 0.42) * (1 - faixa(p, 0.86, 0.95));
  chapa().uniforms.uForca.value = raioX * (escuro ? 1 : 0.85);
  for (const m of partes.carcaca) {
    m.opacity = 1 - raioX * 0.94;
    // só troca na passagem (a versão transparente já foi compilada em `prepararCena`)
    const transparente = m.opacity < 0.995;
    if (m.transparent !== transparente) {
      m.transparent = transparente;
      m.depthWrite = !transparente;
      m.needsUpdate = true;
    }
  }
  // o reflexo some com a carcaça (e nem desenha quando zerado)
  for (const m of partes.reflexos) {
    if (!m) continue;
    m.opacity = 1 - raioX;
    m.visible = m.opacity > 0.004;
  }
  if (partes.tela) partes.tela.opacity = (0.15 + abertura * 0.85) * (1 - raioX * 0.6 + lombada(p, 0.84, 0.94) * 0.6);
  if (partes.luzDoTeclado) partes.luzDoTeclado.opacity = abertura * (0.55 + Math.sin(tempo * 2) * 0.15) * (1 - raioX);

  for (const e of etapasDoRaioX) {
    const m = partes.brilhos[e.peca];
    const base = BASE_DA_PECA[e.peca];
    if (m && base) m.color.copy(base).lerp(ACESO, Math.min(1, lombada(p, e.de, e.ate) + raioX * TOM_DO_RAIO_X));
  }

  const giro = delta * (6 + raioX * 10);
  partes.ventoinhas.forEach((v, i) => {
    if (v) v.rotation.y += i === 0 ? giro : -giro;
  });
}

/* ---------- a etiqueta da peça acesa ---------- */

/** Onde o grupo do notebook fica na cena (as posições das peças são relativas a ele). */
const ORIGEM_DO_NOTEBOOK = new THREE.Vector3(0, -0.25, 0.2);
const PONTO = new THREE.Vector3();

type MarcaDaEtiqueta = { etapa: number; x: number; y: number };

/**
 * A etiqueta era um `<Html>` do drei: cada etapa nova virava estado do React
 * (a cena inteira renderizava de novo) e o drei criava uma raiz React só
 * para ela. Agora é um elemento comum: o texto troca quando a etapa muda e a
 * posição acompanha a peça a cada quadro, escrita só quando muda.
 */
function posicionarEtiqueta(ancora: HTMLDivElement | null, marca: MarcaDaEtiqueta, p: number, camera: THREE.Camera, tamanho: { width: number; height: number }, pronta: boolean) {
  if (!ancora) return;
  const atual = pronta ? etapaAtual(p) : -1;
  const etapa = atual >= 0 && etapasDoRaioX[atual].peca !== "tela" ? etapasDoRaioX[atual] : null;
  if (atual !== marca.etapa) {
    marca.etapa = atual;
    marca.x = marca.y = Number.NaN;
    if (etapa) {
      // elemento novo a cada etapa: a animação de entrada (`etiqueta-entra`) roda de novo
      const rotulo = document.createElement("div");
      rotulo.className = "raio-x-etiqueta";
      rotulo.append(document.createElement("span"), etapa.rotulo);
      ancora.replaceChildren(rotulo);
    } else ancora.replaceChildren();
  }
  if (!etapa) return;
  camera.updateMatrixWorld();
  PONTO.set(...POSICAO[etapa.peca]).add(ORIGEM_DO_NOTEBOOK).project(camera);
  const x = Math.round((PONTO.x * 0.5 + 0.5) * tamanho.width);
  const y = Math.round((0.5 - PONTO.y * 0.5) * tamanho.height);
  if (x !== marca.x || y !== marca.y) {
    marca.x = x;
    marca.y = y;
    ancora.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  }
}

const proximoQuadro = () => new Promise<void>((pronto) => requestAnimationFrame(() => pronto()));

/**
 * Compila os shaders sem travar a página. `compileAsync` usa a compilação
 * paralela do navegador (KHR_parallel_shader_compile) e só resolve quando
 * tudo está pronto; até lá o notebook fica invisível e a foto do produto
 * segura o lugar. Antes, o primeiro quadro compilava tudo de uma vez na
 * thread principal (uns 5 s na Intel UHD do Vitor).
 *
 * A carcaça compila nas duas versões, opaca e transparente: o raio-x troca
 * uma pela outra no meio da rolagem, e a troca não pode custar compilação.
 * As duas versões vão juntas para a GPU (`compile` só dispara, não espera);
 * o último `compileAsync` só confere se as opacas também já terminaram.
 */
async function compilarAsDuasVersoes(gl: THREE.WebGLRenderer, cena: THREE.Scene, camera: THREE.Camera, carcaca: THREE.Material[]) {
  gl.compile(cena, camera);
  for (const m of carcaca) m.transparent = true;
  await gl.compileAsync(cena, camera);
  for (const m of carcaca) {
    m.transparent = false;
    m.needsUpdate = true;
  }
  await gl.compileAsync(cena, camera);
}

/**
 * Deixa a cena pronta em pedaços pequenos, enquanto a GPU compila: a cada
 * quadro, uma textura de canvas é desenhada e já sobe para a GPU (os
 * matcaps, pequenos, sobem juntos). Nenhum passo segura a rolagem de quem
 * está chegando na seção, e o tempo total é o da compilação.
 */
async function prepararCena(gl: THREE.WebGLRenderer, cena: THREE.Scene, camera: THREE.Camera, carcaca: THREE.Material[], texturas: Texturas, matcaps: THREE.Texture[]) {
  const compilando = compilarAsDuasVersoes(gl, cena, camera, carcaca);
  const passos: [(t: THREE.CanvasTexture) => void, THREE.CanvasTexture][] = [
    [desenharTela, texturas.tela],
    [desenharTrilhas, texturas.trilhas],
    [desenharReflexo, texturas.reflexo],
  ];
  for (const [desenhar, textura] of passos) {
    await proximoQuadro();
    desenhar(textura);
    gl.initTexture(textura);
  }
  await proximoQuadro();
  for (const t of matcaps) gl.initTexture(t);
  await compilando;
}

function Notebook({ escuro, etiqueta, aoFicarPronto }: { escuro: boolean; etiqueta: RefObject<HTMLDivElement | null>; aoFicarPronto?: () => void }) {
  const gl = useThree((s) => s.gl);
  const cena = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const tampa = useRef<THREE.Group>(null);
  const teclas = useRef<THREE.InstancedMesh>(null);
  const pentes = useRef<THREE.InstancedMesh>(null);
  const ventoinhaA = useRef<THREE.InstancedMesh>(null);
  const ventoinhaB = useRef<THREE.InstancedMesh>(null);
  const carcaca = useRef<THREE.MeshMatcapMaterial[]>([]);
  const brilhos = useRef<Brilhos>({ processador: null, "placa-de-video": null, memoria: null, ssd: null, tela: null });
  const telaMat = useRef<THREE.MeshBasicMaterial>(null);
  const luzDoTeclado = useRef<THREE.MeshBasicMaterial>(null);
  const reflexoDaTampa = useRef<THREE.MeshBasicMaterial>(null);
  const reflexoDoTampo = useRef<THREE.MeshBasicMaterial>(null);
  const preparo = useRef<Promise<void> | null>(null);
  const marca = useRef<MarcaDaEtiqueta>({ etapa: -2, x: Number.NaN, y: Number.NaN });
  // relógio próprio: o do R3F volta a zero sempre que a cena pausa fora da tela
  const tempo = useRef(0);
  const [pronta, setPronta] = useState(false);

  const texturas = useMemo(() => criarTexturas(), []);
  const canos = useMemo(() => criarCanos(), []);
  // as texturas de matcap são do `matcap.ts` (guardadas por receita, divididas com as outras cenas): não se descartam aqui
  const mc = useMemo(
    () => ({
      chassi: matcap(CHASSI),
      chassiClaro: matcap(CHASSI_CLARO),
      plastico: matcap(MATCAPS.plastico),
      grafite: matcap(MATCAPS.grafite),
      prata: matcap(MATCAPS.prata),
      cobre: matcap(MATCAPS.cobre),
    }),
    [],
  );

  useEffect(
    () => () => {
      texturas.tela.dispose();
      texturas.trilhas.dispose();
      texturas.reflexo.dispose();
      canos.dispose();
    },
    [texturas, canos],
  );

  // as cópias: 90 teclas, 9 pás em cada ventoinha e os 2 pentes de memória
  useLayoutEffect(() => {
    espalhar(teclas.current, (i, m) => m.makeTranslation(-1.47 + (i % TECLAS_X) * 0.21, 0.205, -0.98 + Math.floor(i / TECLAS_X) * 0.205));
    espalhar(ventoinhaA.current, (i, m) => m.makeRotationY((i / 9) * Math.PI * 2));
    espalhar(ventoinhaB.current, (i, m) => m.makeRotationY((i / 9) * Math.PI * 2));
    espalhar(pentes.current, (i, m) => m.makeTranslation(0, 0, i === 0 ? -0.42 : -0.6));
  }, []);

  // compila escondido e só então mostra (o preparo fica guardado: o modo estrito roda o efeito duas vezes)
  useEffect(() => {
    let vivo = true;
    preparo.current ??= prepararCena(gl, cena, camera, carcaca.current, texturas, Object.values(mc));
    preparo.current.then(() => {
      if (vivo) setPronta(true);
    });
    return () => {
      vivo = false;
    };
  }, [gl, cena, camera, texturas, mc]);

  // a foto sai dois quadros depois: o primeiro desenha o notebook, o segundo já está na tela
  const avisar = useEffectEvent(() => aoFicarPronto?.());
  useEffect(() => {
    if (!pronta) return;
    let quadro = requestAnimationFrame(() => {
      quadro = requestAnimationFrame(() => avisar());
    });
    return () => cancelAnimationFrame(quadro);
  }, [pronta]);

  useFrame((estado, delta) => {
    const p = estadoDoRaioX.progresso;
    // a volta de uma pausa longa não vira um salto
    const passo = Math.min(delta, 0.1);
    tempo.current += passo;
    animarNotebook(p, estado.camera, estado.size, tempo.current, passo, escuro, {
      tampa: tampa.current,
      ventoinhas: [ventoinhaA.current, ventoinhaB.current],
      carcaca: carcaca.current,
      reflexos: [reflexoDaTampa.current, reflexoDoTampo.current],
      brilhos: brilhos.current,
      tela: telaMat.current,
      luzDoTeclado: luzDoTeclado.current,
    });
    posicionarEtiqueta(etiqueta.current, marca.current, p, estado.camera, estado.size, pronta);
  });

  const guardarCarcaca = (m: THREE.MeshMatcapMaterial | null) => {
    if (m && !carcaca.current.includes(m)) carcaca.current.push(m);
  };
  const chassi = escuro ? mc.chassi : mc.chassiClaro;
  const corDoBrilho = "#ECB500";
  // o reflexo, somado por cima da tampa e do tampo (um plano rente a cada face)
  const materialDoReflexo = (ref: RefObject<THREE.MeshBasicMaterial | null>) => (
    <meshBasicMaterial ref={ref} map={texturas.reflexo} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
  );

  return (
    <group position={[0, -0.25, 0.2]} visible={pronta}>
      {/* BASE (suavidade 3: com 4 eram milhares de vértices a mais e ninguém via a diferença) */}
      <RoundedBox args={[3.6, 0.2, 2.5]} radius={0.07} smoothness={3} bevelSegments={2} position={[0, 0.1, 0]}>
        <meshMatcapMaterial ref={guardarCarcaca} matcap={chassi} />
      </RoundedBox>
      <RoundedBox args={[3.62, 0.22, 2.52]} radius={0.07} smoothness={3} bevelSegments={2} position={[0, 0.1, 0]} material={chapa()} renderOrder={5} />
      <mesh position={[0, 0.2008, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[3.46, 2.36]} />
        {materialDoReflexo(reflexoDoTampo)}
      </mesh>

      {/* teclado: teclas, luz por baixo e touchpad (caixa reta: o arredondado de 4 mm não aparecia) */}
      <instancedMesh ref={teclas} args={[undefined, undefined, TECLAS_X * TECLAS_Z]}>
        <boxGeometry args={[0.18, 0.025, 0.175]} />
        <meshMatcapMaterial ref={guardarCarcaca} matcap={mc.plastico} />
      </instancedMesh>
      <mesh position={[0, 0.2015, -0.47]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[3.2, 1.3]} />
        <meshBasicMaterial ref={luzDoTeclado} color={corDoBrilho} transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.203, 0.62]}>
        <boxGeometry args={[1.1, 0.01, 0.62]} />
        <meshMatcapMaterial ref={guardarCarcaca} matcap={chassi} color={[0.55, 0.55, 0.62]} />
      </mesh>

      {/* POR DENTRO */}
      <mesh position={[0, 0.06, -0.55]}>
        <boxGeometry args={[3.3, 0.02, 1.25]} />
        <meshMatcapMaterial matcap={mc.prata} map={texturas.trilhas} />
      </mesh>
      <mesh position={POSICAO.processador}>
        <boxGeometry args={[0.36, 0.05, 0.36]} />
        <meshMatcapMaterial ref={(m) => void (brilhos.current.processador = m)} matcap={mc.prata} />
      </mesh>
      <mesh position={POSICAO["placa-de-video"]}>
        <boxGeometry args={[0.5, 0.05, 0.42]} />
        <meshMatcapMaterial ref={(m) => void (brilhos.current["placa-de-video"] = m)} matcap={mc.prata} />
      </mesh>
      {/* os dois pentes são cópias de uma malha, com um material só: acendem juntos (16 GB = 2 × 8 GB) */}
      <instancedMesh ref={pentes} args={[undefined, undefined, 2]} position={[POSICAO.memoria[0], POSICAO.memoria[1], 0]}>
        <boxGeometry args={[0.72, 0.025, 0.15]} />
        <meshMatcapMaterial ref={(m) => void (brilhos.current.memoria = m)} matcap={mc.prata} />
      </instancedMesh>
      <mesh position={POSICAO.ssd}>
        <boxGeometry args={[0.56, 0.018, 0.2]} />
        <meshMatcapMaterial ref={(m) => void (brilhos.current.ssd = m)} matcap={mc.prata} />
      </mesh>
      <mesh geometry={canos}>
        <meshMatcapMaterial matcap={mc.cobre} />
      </mesh>
      {[
        [ventoinhaA, -1.32],
        [ventoinhaB, 1.38],
      ].map(([ref, x]) => (
        <group key={x as number} position={[x as number, 0.1, -0.86]}>
          {/* o aro é um toro (fechado): o cilindro aberto pedia face dupla, que é outro shader */}
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.33, 0.022, 6, 40]} />
            <meshMatcapMaterial matcap={mc.grafite} color="#5c5e6a" />
          </mesh>
          <instancedMesh ref={ref as RefObject<THREE.InstancedMesh>} args={[undefined, undefined, 9]}>
            <boxGeometry args={[0.28, 0.012, 0.07]} />
            <meshMatcapMaterial matcap={mc.prata} color="#6a6d7c" />
          </instancedMesh>
        </group>
      ))}
      {/* bateria: plástico fosco (o brilho do matcap, com a câmera alta, deixava a peça cinza-clara) */}
      <mesh position={[0, 0.07, 0.62]}>
        <boxGeometry args={[2.4, 0.06, 0.74]} />
        <meshMatcapMaterial matcap={mc.plastico} color="#7d7e8a" />
      </mesh>

      {/* TAMPA: gira na dobradiça (atrás) */}
      <group ref={tampa} position={[0, 0.2, -1.22]}>
        <RoundedBox args={[3.6, 0.1, 2.42]} radius={0.05} smoothness={3} bevelSegments={2} position={[0, 0.05, 1.21]}>
          <meshMatcapMaterial ref={guardarCarcaca} matcap={chassi} />
        </RoundedBox>
        <RoundedBox args={[3.62, 0.12, 2.44]} radius={0.05} smoothness={3} bevelSegments={2} position={[0, 0.05, 1.21]} material={chapa()} renderOrder={5} />
        <mesh position={[0, 0.1008, 1.21]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[3.5, 2.32]} />
          {materialDoReflexo(reflexoDaTampa)}
        </mesh>
        <mesh position={[0, -0.002, 1.23]} rotation-x={Math.PI / 2}>
          <planeGeometry args={[3.32, 2.08]} />
          <meshBasicMaterial ref={telaMat} map={texturas.tela} transparent opacity={0.15} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Um quadro de folga entre criar o contexto WebGL e montar o notebook: duas
 * tarefas curtas no lugar de uma longa, bem quando a pessoa está rolando até
 * a seção.
 */
function DepoisDoPrimeiroQuadro({ children }: { children: ReactNode }) {
  const [pode, setPode] = useState(false);
  useEffect(() => {
    const quadro = requestAnimationFrame(() => setPode(true));
    return () => cancelAnimationFrame(quadro);
  }, []);
  return pode ? children : null;
}

export default function Notebook3D({ aoFicarPronto }: { aoFicarPronto?: () => void }) {
  const escuro = useTema() === "escuro";
  const caixa = useRef<HTMLDivElement>(null);
  const etiqueta = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const observador = new IntersectionObserver(([entrada]) => setVisivel(entrada.isIntersecting), { rootMargin: "200px" });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={caixa} className="absolute inset-0">
      {/* `flat` = sem tone mapping: o matcap já é a cor final, e o ACES desbotava o amarelo.
          `demand` + `Ritmo`: no máximo 60 quadros por segundo, mesmo na tela de 144 Hz */}
      <Palco
        frameloop={visivel ? "demand" : "never"}
        dpr={[1, 1.25]}
        flat
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 32, near: 0.1, far: 60, position: [5.2, 3.7, 8.2] }}
        onCreated={prepararRenderizador}
      >
        <DepoisDoPrimeiroQuadro>
          <Notebook escuro={escuro} etiqueta={etiqueta} aoFicarPronto={aoFicarPronto} />
        </DepoisDoPrimeiroQuadro>
        {visivel && <Ritmo />}
      </Palco>
      {/* a etiqueta da peça acesa (posta no lugar por `posicionarEtiqueta`, a cada quadro) */}
      <div ref={etiqueta} className="pointer-events-none absolute left-0 top-0 z-20" style={{ willChange: "transform" }} aria-hidden />
    </div>
  );
}
