"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { ExtrudeGeometry, Group, MathUtils, Matrix4, Mesh, MeshMatcapMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MATCAPS, matcap } from "@/components/tres/matcap";
import { ANEL, LAMINA, SIMBOLO } from "@/data/marca";
import { estadoDaAbertura } from "@/lib/abertura";
import { relogioDe60 } from "@/lib/sessenta-quadros";

/**
 * O OLHO DA VISÃO SUL EM 3D, a peça central da abertura.
 *
 * A geometria sai dos MESMOS caminhos da logo (`data/marca.ts`), extrudados
 * com chanfro: é a marca deles, não um enfeite parecido. O centro do furo do
 * anel fica na origem, porque é por ele que a câmera mergulha.
 *
 * A cada quadro:
 *   1. o olho acompanha o mouse (e balança sozinho no celular);
 *   2. com a rolagem (`estadoDaAbertura.progresso`), ele encara a câmera e a
 *      câmera avança até atravessar o furo;
 *   3. a posição e o raio do furo NA TELA vão para a seção (`--portal-x/y/r`
 *      e `--portal-escala`), que recorta a foto da loja e abre os arcos.
 *
 * Leveza (09/10/2026, o Vitor achou o site travado): material matcap (sem
 * luz, sem ambiente, sem material físico), no máximo 60 quadros por segundo
 * (a tela dele é de 144 Hz), parado fora da tela, e as variáveis do portal só
 * são escritas quando mudam de verdade. E three puro, sem o R3F: é a
 * primeira cena do site, e o R3F (o reconciliador do React e o catálogo do
 * three inteiro) pesava no carregamento justo de quem acabou de chegar. As
 * outras cenas, que entram depois e têm controles e etiquetas, continuam no
 * R3F.
 */

const ESCALA = 1 / 40;
const PROFUNDIDADE = 13;
const CHANFRO = 2.2;
/** O chanfro come um pouco do furo; o círculo da foto acompanha o furo visível. */
const RAIO_DO_FURO = (SIMBOLO.raioDoFuro - CHANFRO * 0.7) * ESCALA;
/** Raio de referência dos arcos no CSS (`.abertura-arcos span` têm 100 px de diâmetro). */
const RAIO_BASE_DOS_ARCOS = 50;

const limitar = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const suave = (t: number) => t * t * (3 - 2 * t);
const acelera = (t: number) => t * t * t;
const misturar = (a: number, b: number, t: number) => a + (b - a) * t;

function criarGeometria() {
  const { paths } = new SVGLoader().parse(
    `<svg xmlns="http://www.w3.org/2000/svg"><path d="${LAMINA}"/><path fill-rule="evenodd" d="${ANEL}"/></svg>`,
  );
  // toShapes() decide os furos por par-ou-ímpar, o mesmo evenodd da logo
  const formas = paths.flatMap((caminho) => caminho.toShapes());
  const geo = new ExtrudeGeometry(formas, {
    depth: PROFUNDIDADE,
    bevelEnabled: true,
    bevelThickness: 3.2,
    bevelSize: CHANFRO,
    bevelOffset: -0.6,
    // o ExtrudeGeometry sombreia cada triângulo chapado: é a subdivisão que
    // deixa o chanfro liso no brilho do ouro (com 4 dá para ver os degraus)
    bevelSegments: 7,
    curveSegments: 64,
  });
  // O SVG tem y para baixo. Girar meia volta no eixo X inverte y sem virar as
  // faces do avesso (escala negativa viraria).
  geo.applyMatrix4(new Matrix4().makeRotationX(Math.PI));
  geo.scale(ESCALA, ESCALA, ESCALA);
  geo.translate(-SIMBOLO.centroDoAnel.x * ESCALA, SIMBOLO.centroDoAnel.y * ESCALA, (PROFUNDIDADE * ESCALA) / 2);
  return geo;
}

type Olho = {
  camera: PerspectiveCamera;
  grupo: Group;
  largura: number;
  altura: number;
  /** relógio próprio, só anda com a cena desenhando (o balanço não pula depois de uma pausa) */
  tempo: number;
  giro: { x: number; y: number };
  /** último portal escrito no CSS */
  escrito: { x: number; y: number; r: number };
};

/** Ponto de trabalho (fora do componente: muda todo quadro). */
const CENTRO = new Vector3();

function escreverPortal(olho: Olho, portal: HTMLElement, x: number, y: number, r: number) {
  // Só escreve quando muda meio pixel: cada escrita é a foto da loja redesenhada.
  const { escrito } = olho;
  if (Math.abs(x - escrito.x) < 0.5 && Math.abs(y - escrito.y) < 0.5 && Math.abs(r - escrito.r) < 0.5) return;
  escrito.x = x;
  escrito.y = y;
  escrito.r = r;
  portal.style.setProperty("--portal-x", `${x.toFixed(1)}px`);
  portal.style.setProperty("--portal-y", `${y.toFixed(1)}px`);
  portal.style.setProperty("--portal-r", `${r.toFixed(1)}px`);
  portal.style.setProperty("--portal-escala", (Math.min(r, 4000) / RAIO_BASE_DOS_ARCOS).toFixed(3));
}

/** Tudo o que muda a cada quadro, numa função comum (o three é imperativo). */
function animarOlho(olho: Olho, delta: number) {
  const { camera, grupo, largura, altura, giro } = olho;
  const p = estadoDaAbertura.progresso;
  olho.tempo += delta;
  const t = olho.tempo;

  // Enquadramento inicial: olho à direita do texto na tela larga; no terço de
  // baixo, centralizado, na tela em pé. A câmera olha sempre reto para a frente.
  const emPe = largura / altura < 0.85;
  const inicio = emPe ? { x: -0.57, y: 1.98, z: 15.2 } : { x: -1.7, y: 0.28, z: 8.6 };
  const alinhar = suave(limitar(p / 0.55));
  const avancar = acelera(limitar((p - 0.06) / 0.82));
  camera.position.set(misturar(inicio.x, 0, alinhar), misturar(inicio.y, 0, alinhar), misturar(inicio.z, -1.2, avancar));
  const fov = misturar(30, 56, acelera(limitar((p - 0.45) / 0.45)));
  if (Math.abs(camera.fov - fov) > 0.01) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }

  // Livre: segue o mouse e balança. Quanto mais mergulha, mais encara a câmera.
  // O giro é em volta do furo, então o centro do furo não sai do lugar e a
  // foto da loja não precisa ser recortada de novo enquanto ele balança.
  const livre = 1 - suave(limitar(p * 2.2));
  const { x: mx, y: my } = estadoDaAbertura.ponteiro;
  const alvoY = (mx * 0.6 + Math.sin(t * 0.5) * 0.14) * livre;
  const alvoX = (-my * 0.38 + Math.sin(t * 0.7) * 0.06) * livre;
  const k = 1 - Math.exp(-delta * 3.5);
  giro.x += (alvoX - giro.x) * k;
  giro.y += (alvoY - giro.y) * k;
  grupo.rotation.set(giro.x, giro.y, Math.sin(t * 0.4) * 0.03 * livre);

  const portal = estadoDaAbertura.portal;
  if (!portal) return;
  grupo.updateMatrixWorld();
  camera.updateMatrixWorld();
  CENTRO.set(0, 0, 0).applyMatrix4(grupo.matrixWorld);
  const distancia = camera.position.z - CENTRO.z;
  CENTRO.project(camera);
  const x = (CENTRO.x * 0.5 + 0.5) * largura;
  const y = (-CENTRO.y * 0.5 + 0.5) * altura;
  const meiaAltura = distancia * Math.tan(MathUtils.degToRad(camera.fov / 2));
  const raio = distancia > 0.02 ? (RAIO_DO_FURO / meiaAltura) * (altura / 2) : 20000;
  escreverPortal(olho, portal, x, y, Math.min(raio, 20000));
}

/**
 * Monta a cena dentro da caixa e devolve a função que desmonta. Os shaders
 * compilam ANTES do primeiro quadro (em paralelo, quando o navegador sabe):
 * desenhar antes obrigaria a esperar a compilação ali mesmo, travando a
 * página. Até o primeiro quadro, o olho em SVG fica na tela.
 */
function montarOlho(caixa: HTMLDivElement, aoFicarPronto: () => void) {
  const renderizador = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  // sem tone mapping (o padrão do three puro): o matcap mostra o amarelo exato da marca
  renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  // conferir cada shader depois de compilar custa ~20 ms; em dev fica, porque é o que mostra o erro
  renderizador.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
  const tela = renderizador.domElement;
  tela.style.cssText = "display:block;width:100%;height:100%;pointer-events:none";
  caixa.appendChild(tela);

  const geometria = criarGeometria();
  const material = new MeshMatcapMaterial({ matcap: matcap(MATCAPS.ouro) });
  const grupo = new Group();
  grupo.add(new Mesh(geometria, material));
  const cena = new Scene();
  cena.add(grupo);
  const camera = new PerspectiveCamera(30, 1, 0.05, 80);

  const olho: Olho = { camera, grupo, largura: 1, altura: 1, tempo: 0, giro: { x: 0, y: 0 }, escrito: { x: -1, y: -1, r: -1 } };

  const medir = () => {
    const largura = Math.max(1, caixa.clientWidth);
    const altura = Math.max(1, caixa.clientHeight);
    if (largura === olho.largura && altura === olho.altura) return;
    olho.largura = largura;
    olho.altura = altura;
    renderizador.setSize(largura, altura, false);
    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();
    olho.escrito.r = -1; // a tela mudou: o portal tem de ser reescrito
  };
  medir();

  const relogio = relogioDe60();
  let vivo = true;
  let pronto = false;
  let visivel = true;
  let avisou = false;
  let pedido = 0;
  let ultimoQuadro = 0;

  const tique = (agora: number) => {
    pedido = requestAnimationFrame(tique);
    if (!relogio.hora(agora)) return;
    const delta = Math.min(Math.max(0, agora - ultimoQuadro) / 1000, 0.1);
    ultimoQuadro = agora;
    animarOlho(olho, delta);
    renderizador.render(cena, camera);
    if (!avisou) {
      avisou = true;
      aoFicarPronto();
    }
  };

  const ligar = () => {
    if (!vivo || !pronto || !visivel || pedido) return;
    ultimoQuadro = performance.now();
    relogio.zerar(ultimoQuadro);
    pedido = requestAnimationFrame(tique);
  };
  const desligar = () => {
    cancelAnimationFrame(pedido);
    pedido = 0;
  };

  // Fora da tela, a cena para de desenhar (bateria do celular agradece).
  const observador = new IntersectionObserver(
    ([entrada]) => {
      visivel = entrada.isIntersecting;
      if (visivel) ligar();
      else desligar();
    },
    { rootMargin: "100px" },
  );
  observador.observe(caixa);
  const redimensionar = new ResizeObserver(medir);
  redimensionar.observe(caixa);

  renderizador
    .compileAsync(cena, camera)
    .catch(() => {})
    .finally(() => {
      pronto = true;
      ligar();
    });

  return () => {
    vivo = false;
    desligar();
    observador.disconnect();
    redimensionar.disconnect();
    geometria.dispose();
    material.dispose();
    renderizador.dispose();
    // devolve o contexto WebGL já (o navegador limita quantos ficam vivos)
    renderizador.forceContextLoss();
    tela.remove();
  };
}

export default function Olho3D({ aoFicarPronto }: { aoFicarPronto?: () => void }) {
  const caixa = useRef<HTMLDivElement>(null);
  // evento de efeito: um aviso novo a cada render não remonta a cena
  const avisar = useEffectEvent(() => aoFicarPronto?.());

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    return montarOlho(el, () => avisar());
  }, []);

  return <div ref={caixa} className="absolute inset-0" />;
}
