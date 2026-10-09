"use client";

import { Environment, Html, Lightformer, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
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

function telaDaVisaoSul() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 640;
  const g = c.getContext("2d");
  if (g) {
    const fundo = g.createLinearGradient(0, 0, 1024, 640);
    fundo.addColorStop(0, "#05042a");
    fundo.addColorStop(0.6, "#120f5c");
    fundo.addColorStop(1, "#2a1f7a");
    g.fillStyle = fundo;
    g.fillRect(0, 0, 1024, 640);
    g.strokeStyle = "rgba(255,255,255,0.06)";
    for (let x = 0; x < 1024; x += 48) g.strokeRect(x, -1, 48, 642);
    for (let y = 0; y < 640; y += 48) g.strokeRect(-1, y, 1026, 48);
    const luz = g.createRadialGradient(512, 300, 0, 512, 300, 320);
    luz.addColorStop(0, "rgba(236,181,0,0.45)");
    luz.addColorStop(1, "rgba(236,181,0,0)");
    g.fillStyle = luz;
    g.fillRect(0, 0, 1024, 640);
    // o olho da marca no meio da tela (símbolo de 116 × 92, escala 2,6)
    const s = 2.6;
    g.save();
    g.translate(512 - 58 * s, 280 - 46 * s);
    g.scale(s, s);
    g.fillStyle = "#ECB500";
    g.shadowColor = "rgba(236,181,0,0.9)";
    g.shadowBlur = 24;
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
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function trilhasDaPlaca() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d");
  if (g) {
    g.fillStyle = "#0b2a22";
    g.fillRect(0, 0, 512, 256);
    g.strokeStyle = "rgba(120,255,200,0.35)";
    g.lineWidth = 1.5;
    for (let i = 0; i < 70; i++) {
      let x = (i * 97) % 512;
      let y = (i * 53) % 256;
      g.beginPath();
      g.moveTo(x, y);
      for (let k = 0; k < 4; k++) {
        if (k % 2 === 0) x += ((i * 31 + k * 17) % 90) - 45;
        else y += ((i * 13 + k * 29) % 70) - 35;
        g.lineTo(x, y);
      }
      g.stroke();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
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

/** Uma chapa só para base e tampa, criada na primeira vez (fica no módulo: muda todo quadro). */
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
  });
}

/* ---------- peças ---------- */

/** Onde fica cada peça dentro da base (para acender e para o rótulo). */
const POSICAO: Record<PecaDoRaioX, [number, number, number]> = {
  processador: [-0.3, 0.12, -0.62],
  "placa-de-video": [0.42, 0.12, -0.62],
  memoria: [-1.0, 0.11, -0.5],
  ssd: [1.12, 0.11, -0.3],
  tela: [0, 1.32, -1.5],
};

type Brilhos = Record<PecaDoRaioX, THREE.MeshStandardMaterial | null>;

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

function posicionarCamera(p: number, camera: THREE.Camera, largura: number, altura: number) {
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
  camera.position.lerp(ALVO, 0.12);
  camera.lookAt(OLHAR);
}

type Partes = {
  tampa: THREE.Group | null;
  ventoinhas: (THREE.Group | null)[];
  carcaca: THREE.MeshStandardMaterial[];
  brilhos: Brilhos;
  tela: THREE.MeshBasicMaterial | null;
  luzDoTeclado: THREE.MeshBasicMaterial | null;
};

/** Tudo o que muda a cada quadro, numa função comum (o three é imperativo). */
function animarNotebook(p: number, camera: THREE.Camera, tamanho: { width: number; height: number }, tempo: number, delta: number, escuro: boolean, partes: Partes) {
  posicionarCamera(p, camera, tamanho.width, tamanho.height);

  const abertura = faixa(p, 0.08, 0.3);
  if (partes.tampa) partes.tampa.rotation.x = -abertura * 1.86;

  const raioX = faixa(p, 0.3, 0.42) * (1 - faixa(p, 0.86, 0.95));
  chapa().uniforms.uForca.value = raioX * (escuro ? 1 : 0.85);
  for (const m of partes.carcaca) {
    m.opacity = 1 - raioX * 0.94;
    const transparente = m.opacity < 0.995;
    if (m.transparent !== transparente) {
      m.transparent = transparente;
      m.depthWrite = !transparente;
      m.needsUpdate = true;
    }
  }
  if (partes.tela) partes.tela.opacity = (0.15 + abertura * 0.85) * (1 - raioX * 0.6 + lombada(p, 0.84, 0.94) * 0.6);
  if (partes.luzDoTeclado) partes.luzDoTeclado.opacity = abertura * (0.55 + Math.sin(tempo * 2) * 0.15) * (1 - raioX);

  for (const e of etapasDoRaioX) {
    const m = partes.brilhos[e.peca];
    if (m) m.emissiveIntensity = 0.15 + lombada(p, e.de, e.ate) * 2.6 + raioX * 0.25;
  }

  const giro = delta * (6 + raioX * 10);
  partes.ventoinhas.forEach((v, i) => {
    if (v) v.rotation.y += i === 0 ? giro : -giro;
  });
}

function Notebook({ escuro }: { escuro: boolean }) {
  const tampa = useRef<THREE.Group>(null);
  const teclas = useRef<THREE.InstancedMesh>(null);
  const ventoinhaA = useRef<THREE.Group>(null);
  const ventoinhaB = useRef<THREE.Group>(null);
  const carcaca = useRef<THREE.MeshStandardMaterial[]>([]);
  const brilhos = useRef<Brilhos>({ processador: null, "placa-de-video": null, memoria: null, ssd: null, tela: null });
  const telaMat = useRef<THREE.MeshBasicMaterial>(null);
  const luzDoTeclado = useRef<THREE.MeshBasicMaterial>(null);
  const [etapa, setEtapa] = useState(-1);

  const textura = useMemo(() => telaDaVisaoSul(), []);
  const trilhas = useMemo(() => trilhasDaPlaca(), []);
  const tubos = useMemo(() => {
    const caminhos = [
      [new THREE.Vector3(-0.3, 0.15, -0.62), new THREE.Vector3(-0.8, 0.15, -0.8), new THREE.Vector3(-1.32, 0.15, -0.86)],
      [new THREE.Vector3(0.42, 0.15, -0.62), new THREE.Vector3(0.95, 0.15, -0.82), new THREE.Vector3(1.38, 0.15, -0.86)],
      [new THREE.Vector3(-0.3, 0.155, -0.7), new THREE.Vector3(0.05, 0.16, -0.78), new THREE.Vector3(0.42, 0.155, -0.7)],
    ];
    return caminhos.map((pts) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.028, 8, false));
  }, []);

  useEffect(
    () => () => {
      textura.dispose();
      trilhas.dispose();
      chapaCompartilhada?.dispose();
      chapaCompartilhada = null;
      tubos.forEach((t) => t.dispose());
    },
    [textura, trilhas, tubos],
  );

  // as teclas: uma malha só, 90 cópias
  useLayoutEffect(() => {
    const malha = teclas.current;
    if (!malha) return;
    let n = 0;
    for (let z = 0; z < TECLAS_Z; z++) {
      for (let x = 0; x < TECLAS_X; x++) {
        MATRIZ.makeTranslation(-1.47 + x * 0.21, 0.205, -0.98 + z * 0.205);
        malha.setMatrixAt(n++, MATRIZ);
      }
    }
    malha.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((estado, delta) => {
    const p = estadoDoRaioX.progresso;
    animarNotebook(p, estado.camera, estado.size, estado.clock.elapsedTime, delta, escuro, {
      tampa: tampa.current,
      ventoinhas: [ventoinhaA.current, ventoinhaB.current],
      carcaca: carcaca.current,
      brilhos: brilhos.current,
      tela: telaMat.current,
      luzDoTeclado: luzDoTeclado.current,
    });
    const atual = etapaAtual(p);
    if (atual !== etapa) setEtapa(atual);
  });

  const guardarCarcaca = (m: THREE.MeshStandardMaterial | null) => {
    if (m && !carcaca.current.includes(m)) carcaca.current.push(m);
  };
  const corDaCarcaca = escuro ? "#454a5c" : "#5a6072";
  const corDoBrilho = "#ECB500";
  const etapaVisivel = etapa >= 0 ? etapasDoRaioX[etapa] : null;

  return (
    <group position={[0, -0.25, 0.2]}>
      {/* BASE */}
      <RoundedBox args={[3.6, 0.2, 2.5]} radius={0.07} smoothness={4} position={[0, 0.1, 0]}>
        <meshStandardMaterial ref={guardarCarcaca} color={corDaCarcaca} metalness={0.6} roughness={0.42} />
      </RoundedBox>
      <RoundedBox args={[3.62, 0.22, 2.52]} radius={0.07} smoothness={4} position={[0, 0.1, 0]} material={chapa()} renderOrder={5} />

      {/* teclado: teclas, luz por baixo e touchpad */}
      <instancedMesh ref={teclas} args={[undefined, undefined, TECLAS_X * TECLAS_Z]}>
        <boxGeometry args={[0.18, 0.025, 0.175]} />
        <meshStandardMaterial ref={guardarCarcaca} color="#17181e" metalness={0.2} roughness={0.7} />
      </instancedMesh>
      <mesh position={[0, 0.2015, -0.47]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[3.2, 1.3]} />
        <meshBasicMaterial ref={luzDoTeclado} color={corDoBrilho} transparent opacity={0} toneMapped={false} />
      </mesh>
      <RoundedBox args={[1.1, 0.01, 0.62]} radius={0.004} smoothness={2} position={[0, 0.203, 0.62]}>
        <meshStandardMaterial ref={guardarCarcaca} color="#30323c" metalness={0.4} roughness={0.35} />
      </RoundedBox>

      {/* POR DENTRO */}
      <mesh position={[0, 0.06, -0.55]}>
        <boxGeometry args={[3.3, 0.02, 1.25]} />
        <meshStandardMaterial map={trilhas} color="#ffffff" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={POSICAO.processador}>
        <boxGeometry args={[0.36, 0.05, 0.36]} />
        <meshStandardMaterial ref={(m) => void (brilhos.current.processador = m)} color="#c9ccd6" metalness={0.8} roughness={0.25} emissive={corDoBrilho} emissiveIntensity={0.15} />
      </mesh>
      <mesh position={POSICAO["placa-de-video"]}>
        <boxGeometry args={[0.5, 0.05, 0.42]} />
        <meshStandardMaterial ref={(m) => void (brilhos.current["placa-de-video"] = m)} color="#2d2f38" metalness={0.7} roughness={0.3} emissive={corDoBrilho} emissiveIntensity={0.15} />
      </mesh>
      {[-0.42, -0.6].map((z) => (
        <mesh key={z} position={[POSICAO.memoria[0], POSICAO.memoria[1], z]}>
          <boxGeometry args={[0.72, 0.025, 0.15]} />
          <meshStandardMaterial ref={z === -0.42 ? (m) => void (brilhos.current.memoria = m) : undefined} color="#1c3f2f" metalness={0.5} roughness={0.4} emissive={corDoBrilho} emissiveIntensity={0.15} />
        </mesh>
      ))}
      <mesh position={POSICAO.ssd}>
        <boxGeometry args={[0.56, 0.018, 0.2]} />
        <meshStandardMaterial ref={(m) => void (brilhos.current.ssd = m)} color="#14162a" metalness={0.5} roughness={0.4} emissive={corDoBrilho} emissiveIntensity={0.15} />
      </mesh>
      {tubos.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshStandardMaterial color="#c97a3c" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      {[
        [ventoinhaA, -1.32],
        [ventoinhaB, 1.38],
      ].map(([ref, x]) => (
        <group key={x as number} ref={ref as RefObject<THREE.Group>} position={[x as number, 0.1, -0.86]}>
          <mesh>
            <cylinderGeometry args={[0.33, 0.33, 0.06, 32, 1, true]} />
            <meshStandardMaterial color="#3a3c48" metalness={0.5} roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
          {Array.from({ length: 9 }, (_, k) => (
            <mesh key={k} rotation-y={(k / 9) * Math.PI * 2} position={[0, 0, 0]}>
              <boxGeometry args={[0.28, 0.012, 0.07]} />
              <meshStandardMaterial color="#5a5d6e" metalness={0.3} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.07, 0.62]}>
        <boxGeometry args={[2.4, 0.06, 0.74]} />
        <meshStandardMaterial color="#1b1d26" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* TAMPA: gira na dobradiça (atrás) */}
      <group ref={tampa} position={[0, 0.2, -1.22]}>
        <RoundedBox args={[3.6, 0.1, 2.42]} radius={0.05} smoothness={4} position={[0, 0.05, 1.21]}>
          <meshStandardMaterial ref={guardarCarcaca} color={corDaCarcaca} metalness={0.65} roughness={0.38} />
        </RoundedBox>
        <RoundedBox args={[3.62, 0.12, 2.44]} radius={0.05} smoothness={4} position={[0, 0.05, 1.21]} material={chapa()} renderOrder={5} />
        <mesh position={[0, -0.002, 1.23]} rotation-x={Math.PI / 2}>
          <planeGeometry args={[3.32, 2.08]} />
          <meshBasicMaterial ref={telaMat} map={textura} transparent opacity={0.15} toneMapped={false} />
        </mesh>
      </group>

      {/* o rótulo da peça acesa */}
      {etapaVisivel && etapaVisivel.peca !== "tela" && (
        <Html position={POSICAO[etapaVisivel.peca]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div className="raio-x-etiqueta" key={etapaVisivel.peca}>
            <span />
            {etapaVisivel.rotulo}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function Notebook3D({ aoFicarPronto }: { aoFicarPronto?: () => void }) {
  const escuro = useTema() === "escuro";
  const caixa = useRef<HTMLDivElement>(null);
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
      <Canvas
        frameloop={visivel ? "always" : "never"}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
        camera={{ fov: 32, near: 0.1, far: 60, position: [5.2, 3.7, 8.2] }}
        onCreated={() => window.requestAnimationFrame(() => aoFicarPronto?.())}
      >
        <ambientLight intensity={escuro ? 0.35 : 0.8} />
        <directionalLight position={[4, 6, 5]} intensity={escuro ? 1.8 : 2.2} />
        <directionalLight position={[-5, 3, -4]} intensity={escuro ? 1.2 : 0.8} color="#9aa0ff" />
        <pointLight position={[0, 1.2, 0.5]} intensity={escuro ? 1.2 : 0.6} color="#ECB500" distance={5} />
        <Notebook escuro={escuro} />
        <Environment resolution={128} frames={1} environmentIntensity={escuro ? 1.1 : 1.3}>
          <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[0, 6, 2]} scale={[10, 4, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[-6, 2, 3]} scale={[4, 6, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={1.2} color="#8f95ff" position={[6, 1, -3]} scale={[4, 6, 1]} target={[0, 0, 0]} />
        </Environment>
      </Canvas>
    </div>
  );
}
