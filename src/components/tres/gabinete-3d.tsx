"use client";

import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useTema } from "@/lib/tema";

/**
 * O GABINETE DO MONTE SEU PC, em 3D: vidro lateral, placa-mãe, cooler,
 * memórias, placa de vídeo (do tamanho do nível escolhido) e ventoinhas com
 * a luz na cor escolhida. Balança sozinho mostrando o vidro; com o mouse ou
 * o dedo a pessoa gira até um limite (sem zoom e sem dar a volta: de trás o
 * gabinete é só chapa).
 */

function Ventoinha({ cor, raio = 0.42, rapidez = 1, ...resto }: { cor: string; raio?: number; rapidez?: number } & ThreeElements["group"]) {
  const pas = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (pas.current) pas.current.rotation.z += delta * 7 * rapidez;
  });
  return (
    <group {...resto}>
      <mesh>
        <torusGeometry args={[raio, 0.035, 12, 48]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
      <group ref={pas}>
        {Array.from({ length: 7 }, (_, i) => (
          <mesh key={i} rotation-z={(i / 7) * Math.PI * 2} position={[0, 0, 0]}>
            <boxGeometry args={[raio * 0.9, 0.09, 0.02]} />
            <meshStandardMaterial color="#1c1d26" metalness={0.3} roughness={0.5} transparent opacity={0.85} />
          </mesh>
        ))}
        <mesh>
          <cylinderGeometry args={[raio * 0.25, raio * 0.25, 0.05, 24]} />
          <meshStandardMaterial color="#111219" />
        </mesh>
      </group>
    </group>
  );
}

function Gabinete({ cor, porte }: { cor: string; porte: number }) {
  const corpo = useRef<THREE.Group>(null);
  useFrame((estado) => {
    const t = estado.clock.elapsedTime;
    if (!corpo.current) return;
    corpo.current.position.y = Math.sin(t * 0.9) * 0.04;
    // balança devagar mostrando o vidro (o arraste do mouse soma por cima)
    corpo.current.rotation.y = 0.35 + Math.sin(t * 0.35) * 0.28;
  });
  const comprimentoDaPlaca = 1.7 + porte * 1.5;
  const ventoinhasDaPlaca = porte > 0.8 ? 3 : 2;
  const chapa = <meshStandardMaterial color="#15161f" metalness={0.7} roughness={0.35} />;
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
        {chapa}
      </mesh>
      <mesh position={[1.04, 0, 0]}>
        <boxGeometry args={[0.06, 4.3, 4.4]} />
        {chapa}
      </mesh>
      <mesh position={[0, 0, 2.18]}>
        <boxGeometry args={[2.1, 4.3, 0.06]} />
        <meshStandardMaterial color="#101119" metalness={0.5} roughness={0.5} transparent opacity={0.9} />
      </mesh>
      {/* filete de luz na quina da frente */}
      <mesh position={[-1.04, 0, 2.2]}>
        <boxGeometry args={[0.04, 4.2, 0.04]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      {/* vidro lateral, do lado que a câmera vê */}
      <mesh position={[-1.04, 0, 0]}>
        <boxGeometry args={[0.025, 4.22, 4.32]} />
        <meshPhysicalMaterial color="#c7ccff" transparent opacity={0.1} roughness={0.04} metalness={0} clearcoat={1} clearcoatRoughness={0.02} />
      </mesh>
      {/* placa-mãe */}
      <mesh position={[0.97, 0.45, -0.25]}>
        <boxGeometry args={[0.04, 2.7, 2.9]} />
        <meshStandardMaterial color="#0e1814" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* cooler do processador */}
      <group position={[0.6, 1.05, -0.35]}>
        <mesh>
          <boxGeometry args={[0.6, 0.85, 0.85]} />
          <meshStandardMaterial color="#30323f" metalness={0.85} roughness={0.22} />
        </mesh>
        <Ventoinha cor={cor} raio={0.34} position={[-0.31, 0, 0]} rotation-y={Math.PI / 2} />
      </group>
      {/* memórias com luz no topo */}
      {[0.32, 0.47, 0.62, 0.77].map((z) => (
        <group key={z} position={[0.74, 1.05, z]}>
          <mesh>
            <boxGeometry args={[0.38, 0.9, 0.06]} />
            <meshStandardMaterial color="#1d1f2a" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.47, 0]}>
            <boxGeometry args={[0.38, 0.06, 0.065]} />
            <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* placa de vídeo: cresce com o nível */}
      <group position={[0.42, -0.6, 1.0 - comprimentoDaPlaca / 2]}>
        <mesh>
          <boxGeometry args={[0.95, 0.42, comprimentoDaPlaca]} />
          <meshStandardMaterial color="#262833" metalness={0.8} roughness={0.28} />
        </mesh>
        <mesh position={[-0.48, 0.05, 0]}>
          <boxGeometry args={[0.02, 0.06, comprimentoDaPlaca * 0.9]} />
          <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
        {Array.from({ length: ventoinhasDaPlaca }, (_, i) => (
          <Ventoinha
            key={i}
            cor={cor}
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
        <meshStandardMaterial color="#17181f" metalness={0.6} roughness={0.45} />
      </mesh>
      {/* ventoinhas da frente (por dentro) e de trás */}
      {[1.25, 0.1, -1.05].map((y) => (
        <Ventoinha key={y} cor={cor} raio={0.46} position={[0, y + 0.3, 1.98]} />
      ))}
      <Ventoinha cor={cor} raio={0.42} position={[0, 1.15, -2.0]} />
      <pointLight position={[-0.2, 0.3, 0.6]} color={cor} intensity={7} distance={4.5} />
    </group>
  );
}

export default function Gabinete3D({ cor, porte }: { cor: string; porte: number }) {
  const escuro = useTema() === "escuro";
  return (
    <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }} camera={{ fov: 30, position: [-12.4, 2.8, 4.4] }}>
      <ambientLight intensity={escuro ? 0.35 : 0.8} />
      <directionalLight position={[-5, 6, 5]} intensity={escuro ? 1.3 : 2} />
      <Gabinete cor={cor} porte={porte} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-Math.PI / 1.4}
        maxAzimuthAngle={-Math.PI / 6}
      />
      <Environment resolution={128} frames={1} environmentIntensity={escuro ? 0.8 : 1.1}>
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[-4, 5, 4]} scale={[6, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[5, 2, -3]} scale={[4, 6, 1]} target={[0, 0, 0]} />
      </Environment>
    </Canvas>
  );
}
