"use client";

import { createRoot, extend, type ReconcilerRoot, type RenderProps } from "@react-three/fiber";
import { Suspense, useEffect, useInsertionEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { BoxGeometry, ExtrudeGeometry, Group, InstancedMesh, Mesh, MeshBasicMaterial, MeshMatcapMaterial, PlaneGeometry, TorusGeometry } from "three";

/**
 * O PALCO DAS CENAS DO R3F, no lugar do `<Canvas>` (13/10/2026). O Canvas
 * registra o three inteiro (`extend(THREE)`) para aceitar qualquer elemento,
 * e o chunk do Raio-X e do Monte seu PC levava a biblioteca toda. Aqui entra
 * só o que as cenas desenham; o resto do three sai do JS.
 *
 * Elemento novo numa cena (um `<sphereGeometry>`, um `<lineSegments>`)
 * precisa entrar neste `extend`, senão o R3F para dizendo que não conhece.
 * O `RoundedBox` do drei desenha `<extrudeGeometry>`; o `OrbitControls` usa
 * `<primitive>`, que já vem no R3F. Sem eventos do R3F: nenhuma cena usa
 * clique em objeto, e o OrbitControls ouve a própria tela.
 */
extend({ BoxGeometry, ExtrudeGeometry, Group, InstancedMesh, Mesh, MeshBasicMaterial, MeshMatcapMaterial, PlaneGeometry, TorusGeometry });

type Configuracao = Pick<RenderProps<HTMLCanvasElement>, "frameloop" | "dpr" | "flat" | "gl" | "camera" | "onCreated">;
type Tamanho = { width: number; height: number; top: number; left: number };

export function Palco({ children, ...configuracao }: Configuracao & { children: ReactNode }) {
  const caixa = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const raiz = useRef<ReconcilerRoot<HTMLCanvasElement> | null>(null);
  const [tamanho, setTamanho] = useState<Tamanho | null>(null);
  const [, setRenderizadorPronto] = useState(false);

  // o tamanho da caixa (a primeira medida chega sozinha quando o observador começa)
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const observador = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setTamanho({ width: r.width, height: r.height, top: r.top, left: r.left });
    });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // Como o Canvas: a cada renderização, reconfigura (só o que mudou é
  // aplicado) e manda os filhos de novo. O renderizador nasce assíncrono no
  // R3F 9: enquanto ele não fica pronto, espera e renderiza de novo.
  useLayoutEffect(() => {
    const canvas = tela.current;
    if (!canvas || !tamanho || tamanho.width === 0 || tamanho.height === 0) return;
    raiz.current ??= createRoot(canvas);
    const r = raiz.current;
    r.configure({ ...configuracao, size: tamanho }).catch((erro: unknown) => console.error("palco 3D:", erro));
    if (r.ready.status === "fulfilled") r.render(<Suspense fallback={null}>{children}</Suspense>);
    else if (r.ready.status === "pending") r.ready.then(() => setRenderizadorPronto(true));
  });

  // A raiz só sai quando o palco sai de vez. Efeito de inserção, como no
  // Canvas: o StrictMode refaz os efeitos comuns, e soltar o contexto WebGL
  // no meio deixaria a tela preta.
  useInsertionEffect(
    () => () => {
      raiz.current?.unmount();
      raiz.current = null;
    },
    [],
  );

  return (
    <div ref={caixa} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <canvas ref={tela} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
