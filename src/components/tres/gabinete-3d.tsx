"use client";

import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { matcap, MATCAPS, type ReceitaDeMatcap } from "@/components/tres/matcap";
import { Palco } from "@/components/tres/palco";
import { prepararRenderizador, Ritmo } from "@/components/tres/ritmo";
import { useTema } from "@/lib/tema";

/**
 * O GABINETE DO MONTE SEU PC, em 3D: vidro lateral, placa-mãe, cooler,
 * memórias, placa de vídeo (do tamanho do nível escolhido) e ventoinhas com
 * a luz na cor escolhida. Balança sozinho mostrando o vidro; com o mouse ou
 * o dedo a pessoa gira até um limite (sem zoom e sem dar a volta: de trás o
 * gabinete é só chapa).
 *
 * Leve de propósito (09/10/2026, o Vitor achou o site travado na Intel UHD
 * dele): nenhuma luz e nenhum ambiente. Chapa, metal e plástico são matcap
 * (uma consulta de textura por pixel); o que acende é cor pura, sem
 * sombreamento; o brilho dentro do gabinete, que era uma luz pontual, virou
 * um degradê somado na frente da placa-mãe. As pás são uma geometria só,
 * feita uma vez e repetida em todas as ventoinhas, e os shaders compilam
 * antes do primeiro quadro (até lá fica o gabinete em CSS).
 */

/*
 * A chapa vai ao contrário das receitas comuns, de propósito. No `matcap()`,
 * a face de frente para a câmera sai do centro da esfera ("luz" e "meio") e a
 * face vista de raspão (o topo da placa de vídeo, da fonte, do teto) sai da
 * borda ("sombra"). Com luz e meio quase pretos e a borda azulada, a chapa
 * fica preta de frente e acende por cima, como o ambiente fazia antes
 * (medido no print antigo: frente ~#0c0d12, topo da placa de vídeo #393c83).
 * No claro, a luz de antes era branca e mais forte: borda cinza.
 */
const CHAPA_ESCURO: ReceitaDeMatcap = { sombra: "#3d4190", meio: "#0b0c12", luz: "#0d0e15", brilho: "#c9ccff", intensidade: 0.3 };
const CHAPA_CLARO: ReceitaDeMatcap = { sombra: "#a0a2ae", meio: "#121318", luz: "#15161c", brilho: "#ffffff", intensidade: 0.3 };
const PLACA: ReceitaDeMatcap = { sombra: "#2c5a48", meio: "#0f1c16", luz: "#13241c", brilho: "#9fe3c4", intensidade: 0.2 };

/* ---------- peças feitas uma vez (no módulo: o three muda tudo isso por fora do React) ---------- */

const PAS = 7;
let rotorGuardado: THREE.BufferGeometry | null = null;

/** As sete pás e o miolo de uma ventoinha de raio 1, numa geometria só (um desenho por ventoinha, não oito). */
function rotor() {
  if (rotorGuardado) return rotorGuardado;
  const partes: THREE.BufferGeometry[] = [];
  for (let i = 0; i < PAS; i++) {
    const pa = new THREE.BoxGeometry(0.64, 0.24, 0.03);
    // inclinada como pá de verdade: girando, cada uma pega o brilho do matcap numa hora
    pa.rotateX(0.5);
    pa.translate(0.56, 0, 0);
    pa.rotateZ((i / PAS) * Math.PI * 2);
    partes.push(pa);
  }
  // o cilindro nasce em pé (eixo Y); a ventoinha gira em Z
  const miolo = new THREE.CylinderGeometry(0.26, 0.26, 0.12, 20);
  miolo.rotateX(Math.PI / 2);
  partes.push(miolo);
  rotorGuardado = mergeGeometries(partes) ?? miolo;
  return rotorGuardado;
}

const aros = new Map<number, THREE.TorusGeometry>();

/** O aro aceso, um por tamanho de ventoinha (são quatro tamanhos). */
function aro(raio: number) {
  let geometria = aros.get(raio);
  if (!geometria) {
    geometria = new THREE.TorusGeometry(raio, 0.035, 8, 48);
    aros.set(raio, geometria);
  }
  return geometria;
}

let brilhoGuardado: THREE.CanvasTexture | null = null;

/** Degradê branco do brilho interno: a cor vem do material, então trocar a cor não refaz a textura. */
function brilhoInterno() {
  if (brilhoGuardado) return brilhoGuardado;
  const tela = document.createElement("canvas");
  tela.width = tela.height = 128;
  const g = tela.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.45)");
    grad.addColorStop(0.7, "rgba(255,255,255,0.1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
  }
  brilhoGuardado = new THREE.CanvasTexture(tela);
  return brilhoGuardado;
}

let reflexoGuardado: THREE.CanvasTexture | null = null;

/**
 * O vidro: um véu quase invisível com dois riscos de reflexo na diagonal.
 * Véu liso clareava a placa inteira por igual; o risco diz "vidro" e deixa
 * o resto do gabinete escuro e legível.
 */
function reflexoDoVidro() {
  if (reflexoGuardado) return reflexoGuardado;
  const lado = 256;
  const tela = document.createElement("canvas");
  tela.width = tela.height = lado;
  const g = tela.getContext("2d");
  if (g) {
    g.fillStyle = "rgba(199,204,255,0.035)";
    g.fillRect(0, 0, lado, lado);
    g.translate(lado / 2, lado / 2);
    g.rotate(-0.6);
    const riscos: [number, number, number][] = [
      // [deslocamento, largura, força]
      [-62, 70, 0.11],
      [22, 26, 0.07],
    ];
    for (const [x, largura, forca] of riscos) {
      const grad = g.createLinearGradient(x - largura / 2, 0, x + largura / 2, 0);
      grad.addColorStop(0, "rgba(220,224,255,0)");
      grad.addColorStop(0.5, `rgba(220,224,255,${forca})`);
      grad.addColorStop(1, "rgba(220,224,255,0)");
      g.fillStyle = grad;
      g.fillRect(x - largura / 2, -lado, largura, lado * 2);
    }
  }
  reflexoGuardado = new THREE.CanvasTexture(tela);
  reflexoGuardado.colorSpace = THREE.SRGBColorSpace;
  return reflexoGuardado;
}

/** A cor da luz um pouco acima de 1: sem tone mapping ela satura como LED aceso, igual ao emissivo de antes. */
function corAcesa(cor: string) {
  return new THREE.Color(cor).multiplyScalar(1.5);
}

/** Balanço lento mostrando o vidro (o arraste do mouse gira a câmera por cima). */
function balancar(corpo: THREE.Group | null, t: number) {
  if (!corpo) return;
  corpo.position.y = Math.sin(t * 0.9) * 0.04;
  corpo.rotation.y = 0.35 + Math.sin(t * 0.35) * 0.28;
}

/* ---------- cena ---------- */

function Ventoinha({ cor, raio, rapidez = 1, ...resto }: { cor: THREE.Color; raio: number; rapidez?: number } & ThreeElements["group"]) {
  const pas = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (pas.current) pas.current.rotation.z += Math.min(delta, 0.1) * 7 * rapidez;
  });
  return (
    <group {...resto}>
      <mesh geometry={aro(raio)}>
        <meshBasicMaterial color={cor} toneMapped={false} />
      </mesh>
      <mesh ref={pas} geometry={rotor()} scale={raio}>
        <meshMatcapMaterial matcap={matcap(MATCAPS.grafite)} />
      </mesh>
    </group>
  );
}

function Gabinete({ cor, porte, escuro }: { cor: string; porte: number; escuro: boolean }) {
  const corpo = useRef<THREE.Group>(null);
  // relógio próprio: o do R3F volta a zero sempre que a cena pausa fora da tela
  const tempo = useRef(0);
  useFrame((_, delta) => {
    tempo.current += Math.min(delta, 0.1);
    balancar(corpo.current, tempo.current);
  });
  const comprimentoDaPlaca = 1.7 + porte * 1.5;
  const ventoinhasDaPlaca = porte > 0.8 ? 3 : 2;
  const acesa = corAcesa(cor);
  const texturaDaChapa = matcap(escuro ? CHAPA_ESCURO : CHAPA_CLARO);
  const chapa = <meshMatcapMaterial matcap={texturaDaChapa} />;
  return (
    <group ref={corpo}>
      {/* chassi em painéis: teto, base, fundo, lado direito e frente */}
      <mesh position={[0, 2.15, 0]}>
        <boxGeometry args={[2.1, 0.07, 4.4]} />
        {chapa}
      </mesh>
      <mesh position={[0, -2.15, 0]}>
        <boxGeometry args={[2.1, 0.07, 4.4]} />
        {chapa}
      </mesh>
      <mesh position={[0, 0, -2.18]}>
        <boxGeometry args={[2.1, 4.3, 0.06]} />
        {/* o fundo aparece de raspão pelo vidro e pegaria a mesma borda acesa do topo: mais escuro, fica parede na sombra */}
        <meshMatcapMaterial matcap={texturaDaChapa} color="#8a8da0" />
      </mesh>
      <mesh position={[1.04, 0, 0]}>
        <boxGeometry args={[0.06, 4.3, 4.4]} />
        {chapa}
      </mesh>
      <mesh position={[0, 0, 2.18]}>
        <boxGeometry args={[2.1, 4.3, 0.06]} />
        <meshMatcapMaterial matcap={texturaDaChapa} transparent opacity={0.9} />
      </mesh>
      {/* filete de luz na quina da frente */}
      <mesh position={[-1.04, 0, 2.2]}>
        <boxGeometry args={[0.04, 4.2, 0.04]} />
        <meshBasicMaterial color={acesa} toneMapped={false} />
      </mesh>
      {/* placa-mãe */}
      <mesh position={[0.97, 0.45, -0.25]}>
        <boxGeometry args={[0.04, 2.7, 2.9]} />
        <meshMatcapMaterial matcap={matcap(PLACA)} />
      </mesh>
      {/* a luz da cor escolhida batendo na placa (no lugar da luz pontual, que custava em cada pixel) */}
      <mesh position={[0.93, 0.3, 0.55]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[3.4, 3.4]} />
        <meshBasicMaterial map={brilhoInterno()} color={cor} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* cooler do processador */}
      <group position={[0.6, 1.05, -0.35]}>
        <mesh>
          <boxGeometry args={[0.6, 0.85, 0.85]} />
          <meshMatcapMaterial matcap={matcap(MATCAPS.grafite)} />
        </mesh>
        <Ventoinha cor={acesa} raio={0.34} position={[-0.31, 0, 0]} rotation-y={Math.PI / 2} />
      </group>
      {/* memórias com luz no topo */}
      {[0.32, 0.47, 0.62, 0.77].map((z) => (
        <group key={z} position={[0.74, 1.05, z]}>
          <mesh>
            <boxGeometry args={[0.38, 0.9, 0.06]} />
            {chapa}
          </mesh>
          <mesh position={[0, 0.47, 0]}>
            <boxGeometry args={[0.38, 0.06, 0.065]} />
            <meshBasicMaterial color={acesa} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* placa de vídeo: cresce com o nível */}
      <group position={[0.42, -0.6, 1.0 - comprimentoDaPlaca / 2]}>
        <mesh>
          <boxGeometry args={[0.95, 0.42, comprimentoDaPlaca]} />
          {chapa}
        </mesh>
        <mesh position={[-0.48, 0.05, 0]}>
          <boxGeometry args={[0.02, 0.06, comprimentoDaPlaca * 0.9]} />
          <meshBasicMaterial color={acesa} toneMapped={false} />
        </mesh>
        {Array.from({ length: ventoinhasDaPlaca }, (_, i) => (
          <Ventoinha
            key={i}
            cor={acesa}
            raio={0.29}
            rapidez={1.3}
            position={[0, -0.22, (i - (ventoinhasDaPlaca - 1) / 2) * (comprimentoDaPlaca / ventoinhasDaPlaca)]}
            rotation-x={Math.PI / 2}
          />
        ))}
      </group>
      {/* tampa da fonte */}
      <mesh position={[0.02, -1.72, 0]}>
        <boxGeometry args={[2.0, 0.8, 4.3]} />
        {chapa}
      </mesh>
      {/* ventoinhas da frente (por dentro) e de trás */}
      {[1.25, 0.1, -1.05].map((y) => (
        <Ventoinha key={y} cor={acesa} raio={0.46} position={[0, y + 0.3, 1.98]} />
      ))}
      <Ventoinha cor={acesa} raio={0.42} position={[0, 1.15, -2.0]} />
      {/* vidro lateral, do lado que a câmera vê: um plano (a câmera nunca passa para o outro lado) */}
      <mesh position={[-1.045, 0, 0]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[4.32, 4.22]} />
        <meshBasicMaterial map={reflexoDoVidro()} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/**
 * Compila os shaders ANTES do primeiro quadro (em paralelo, quando o
 * navegador sabe fazer isso) e só então libera a cena. Sem isso a primeira
 * pintura compila tudo de uma vez e trava a página.
 */
function Compilar({ aoTerminar }: { aoTerminar: () => void }) {
  const gl = useThree((estado) => estado.gl);
  const cena = useThree((estado) => estado.scene);
  const camera = useThree((estado) => estado.camera);
  // evento de efeito: um aviso novo a cada render (trocar cor, nível) não manda compilar de novo
  const terminar = useEffectEvent(aoTerminar);
  useEffect(() => {
    let ativo = true;
    gl.compileAsync(cena, camera).then(() => {
      if (ativo) terminar();
    });
    return () => {
      ativo = false;
    };
  }, [gl, cena, camera]);
  return null;
}

const assinarAba = (aviso: () => void) => {
  document.addEventListener("visibilitychange", aviso);
  return () => document.removeEventListener("visibilitychange", aviso);
};
const abaEstaVisivel = () => document.visibilityState === "visible";

export default function Gabinete3D({ cor, porte, aoFicarPronto }: { cor: string; porte: number; aoFicarPronto?: () => void }) {
  const escuro = useTema() === "escuro";
  const caixa = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);
  const [pronto, setPronto] = useState(false);
  const abaVisivel = useSyncExternalStore(assinarAba, abaEstaVisivel, () => true);
  const ativo = pronto && visivel && abaVisivel;

  // Fora da tela ou com a aba escondida, a cena para de desenhar.
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const observador = new IntersectionObserver(([entrada]) => setVisivel(entrada.isIntersecting), { rootMargin: "150px" });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={caixa} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: pronto ? 1 : 0 }}>
      <Palco
        flat
        frameloop={ativo ? "demand" : "never"}
        dpr={[1, 1.25]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 30, position: [-12.4, 2.8, 4.4] }}
        onCreated={prepararRenderizador}
      >
        <Gabinete cor={cor} porte={porte} escuro={escuro} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 1.4}
          maxAzimuthAngle={-Math.PI / 6}
        />
        <Compilar
          aoTerminar={() => {
            setPronto(true);
            aoFicarPronto?.();
          }}
        />
        {ativo && <Ritmo />}
      </Palco>
    </div>
  );
}
