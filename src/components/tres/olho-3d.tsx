"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { ANEL, LAMINA, SIMBOLO } from "@/data/marca";
import { estadoDaAbertura } from "@/lib/abertura";
import { useTema } from "@/lib/tema";

/**
 * O OLHO DA VISÃO SUL EM 3D, a peça central da abertura.
 *
 * A geometria sai dos MESMOS caminhos da logo (`data/marca.ts`), extrudados
 * com chanfro: é a marca deles, não um enfeite parecido. O centro do furo do
 * anel fica na origem, porque é por ele que a câmera mergulha.
 *
 * O que acontece a cada quadro:
 *   1. o olho acompanha o mouse (e balança sozinho no celular);
 *   2. com a rolagem (`estadoDaAbertura.progresso`), ele encara a câmera e a
 *      câmera avança até atravessar o furo;
 *   3. a posição e o raio do furo NA TELA vão para a camada da foto da loja
 *      (`--portal-x/y/r`), que é recortada num círculo do mesmo tamanho:
 *      a loja aparece por dentro do olho e cresce até tomar a tela.
 */

const ESCALA = 1 / 40;
const PROFUNDIDADE = 13;
const CHANFRO = 2.2;
/** O chanfro come um pouco do furo; o círculo da foto acompanha o furo visível. */
const RAIO_DO_FURO = (SIMBOLO.raioDoFuro - CHANFRO * 0.7) * ESCALA;

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
  const geo = new THREE.ExtrudeGeometry(formas, {
    depth: PROFUNDIDADE,
    bevelEnabled: true,
    bevelThickness: 3.2,
    bevelSize: CHANFRO,
    bevelOffset: -0.6,
    bevelSegments: 12,
    curveSegments: 128,
  });
  // O SVG tem y para baixo. Girar meia volta no eixo X inverte y sem virar as
  // faces do avesso (escala negativa viraria).
  geo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI));
  geo.scale(ESCALA, ESCALA, ESCALA);
  geo.translate(-SIMBOLO.centroDoAnel.x * ESCALA, SIMBOLO.centroDoAnel.y * ESCALA, (PROFUNDIDADE * ESCALA) / 2);
  return geo;
}

/** O halo atrás do olho: o letreiro da loja é aceso e solta luz na parede. */
function criarHalo() {
  const tela = document.createElement("canvas");
  tela.width = tela.height = 256;
  const g = tela.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,214,90,0.95)");
    grad.addColorStop(0.3, "rgba(236,181,0,0.4)");
    grad.addColorStop(0.65, "rgba(236,181,0,0.08)");
    grad.addColorStop(1, "rgba(236,181,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
  }
  const textura = new THREE.CanvasTexture(tela);
  textura.colorSpace = THREE.SRGBColorSpace;
  return textura;
}

/** Ponto de trabalho da projeção do furo (fora do componente: muda todo quadro). */
const CENTRO = new THREE.Vector3();

function Olho({ escuro }: { escuro: boolean }) {
  const grupo = useRef<THREE.Group>(null);
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  const giro = useRef({ x: 0, y: 0 });
  const geometria = useMemo(() => criarGeometria(), []);
  const texturaDoHalo = useMemo(() => criarHalo(), []);

  useEffect(
    () => () => {
      geometria.dispose();
      texturaDoHalo.dispose();
    },
    [geometria, texturaDoHalo],
  );

  useFrame((estado, delta) => {
    const g = grupo.current;
    if (!g) return;
    const camera = estado.camera as THREE.PerspectiveCamera;
    const { width, height } = estado.size;
    const p = estadoDaAbertura.progresso;
    const t = estado.clock.elapsedTime;

    // Enquadramento inicial: olho à direita do texto na tela larga; embaixo
    // do texto, centralizado, na tela em pé.
    const emPe = width / height < 0.85;
    // (em pé: olho no terço de baixo, abaixo do texto e dos botões)
    const inicio = emPe ? { x: -0.57, y: 1.98, z: 15.2 } : { x: -1.7, y: 0.28, z: 8.6 };
    const alinhar = suave(limitar(p / 0.55));
    const avancar = acelera(limitar((p - 0.06) / 0.82));
    // A câmera olha sempre reto para a frente: o deslocamento é o que põe o olho ao
    // lado do texto. (O R3F aponta a câmera para a origem ao criar; aqui desfaz.)
    camera.rotation.set(0, 0, 0);
    camera.position.set(misturar(inicio.x, 0, alinhar), misturar(inicio.y, 0, alinhar), misturar(inicio.z, -1.2, avancar));
    const fov = misturar(30, 56, acelera(limitar((p - 0.45) / 0.45)));
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    // Livre: segue o mouse e balança. Quanto mais mergulha, mais encara a câmera.
    const livre = 1 - suave(limitar(p * 2.2));
    const { x: mx, y: my } = estadoDaAbertura.ponteiro;
    const alvoY = (mx * 0.6 + Math.sin(t * 0.5) * 0.14) * livre;
    const alvoX = (-my * 0.38 + Math.sin(t * 0.7) * 0.06) * livre;
    const k = 1 - Math.exp(-delta * 3.5);
    giro.current.x += (alvoX - giro.current.x) * k;
    giro.current.y += (alvoY - giro.current.y) * k;
    g.rotation.set(giro.current.x, giro.current.y, Math.sin(t * 0.4) * 0.03 * livre);
    g.position.y = Math.sin(t * 1.1) * 0.06 * livre;

    if (halo.current) halo.current.opacity = (escuro ? 0.9 : 0.55) * (1 - limitar((p - 0.25) / 0.3));

    // O furo na tela, para a foto da loja aparecer por dentro dele.
    const portal = estadoDaAbertura.portal;
    if (portal) {
      g.updateMatrixWorld();
      CENTRO.set(0, 0, 0).applyMatrix4(g.matrixWorld);
      const distancia = camera.position.z - CENTRO.z;
      CENTRO.project(camera);
      const x = (CENTRO.x * 0.5 + 0.5) * width;
      const y = (-CENTRO.y * 0.5 + 0.5) * height;
      const meiaAltura = distancia * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const raio = distancia > 0.02 ? (RAIO_DO_FURO / meiaAltura) * (height / 2) : 20000;
      portal.style.setProperty("--portal-x", `${x.toFixed(1)}px`);
      portal.style.setProperty("--portal-y", `${y.toFixed(1)}px`);
      portal.style.setProperty("--portal-r", `${Math.min(raio, 20000).toFixed(1)}px`);
    }
  });

  return (
    <>
      <mesh position={[-0.5, 0.25, -1]} scale={escuro ? 8 : 6.5}>
        <planeGeometry />
        <meshBasicMaterial
          ref={halo}
          map={texturaDoHalo}
          transparent
          depthWrite={false}
          toneMapped={false}
          blending={escuro ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </mesh>
      <group ref={grupo}>
        <mesh geometry={geometria}>
          {/* ouro do letreiro: metal com verniz; no escuro, um fio de luz própria */}
          <meshPhysicalMaterial
            color="#ECB500"
            metalness={0.55}
            roughness={0.3}
            clearcoat={1}
            clearcoatRoughness={0.08}
            emissive="#ECB500"
            emissiveIntensity={escuro ? 0.12 : 0.02}
          />
        </mesh>
      </group>
    </>
  );
}

export default function Olho3D({ aoFicarPronto }: { aoFicarPronto?: () => void }) {
  const escuro = useTema() === "escuro";
  const caixa = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(true);

  // Fora da tela, a cena para de desenhar (bateria do celular agradece).
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const observador = new IntersectionObserver(([entrada]) => setVisivel(entrada.isIntersecting), { rootMargin: "100px" });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={caixa} className="absolute inset-0">
      <Canvas
        frameloop={visivel ? "always" : "never"}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.NeutralToneMapping }}
        camera={{ fov: 30, near: 0.05, far: 80, position: [-1.7, 0.28, 8.6] }}
        onCreated={() => window.requestAnimationFrame(() => aoFicarPronto?.())}
      >
        <ambientLight intensity={escuro ? 0.25 : 0.7} />
        <directionalLight position={[3, 4, 6]} intensity={escuro ? 1.3 : 1.9} />
        <directionalLight position={[-4, -2, 3]} intensity={escuro ? 0.5 : 0.8} />
        <Olho escuro={escuro} />
        <Environment resolution={256} frames={1} environmentIntensity={escuro ? 1.05 : 1.35}>
          {/* o painel grande atrás da câmera é o que a face do olho reflete: sem ele, o ouro escurece */}
          <Lightformer form="rect" intensity={1.3} color="#ffffff" position={[0, 0.5, 14]} scale={[18, 10, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={3.2} color="#ffffff" position={[0, 5, -1]} rotation-x={Math.PI / 2} scale={[12, 3, 1]} />
          <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[-6, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 9, 1]} />
          <Lightformer form="rect" intensity={2.6} color="#ffffff" position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[4, 7, 1]} />
          {/* luz branca: luz amarela no metal amarelo puxaria o ouro para o laranja */}
          <Lightformer form="ring" intensity={3} color="#ffffff" position={[2, 2, 7]} scale={3} />
          <Lightformer form="rect" intensity={1.2} color="#7f86ff" position={[0, -5, 1]} rotation-x={-Math.PI / 2} scale={[10, 3, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}
