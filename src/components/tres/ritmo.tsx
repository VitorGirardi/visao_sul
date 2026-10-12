"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import type { WebGLRenderer } from "three";
import { relogioDe60 } from "@/lib/sessenta-quadros";

/**
 * No máximo 60 quadros por segundo nas cenas do R3F (`lib/sessenta-quadros.ts`):
 * com `frameloop="always"` ele desenha na taxa da tela, e a do Vitor é de
 * 144 Hz. Use com `frameloop="demand"`: este relógio pede um quadro a cada
 * 1/60 s, e quem precisa de mais (o arraste do OrbitControls) continua
 * pedindo os seus.
 */
export function Ritmo() {
  const invalidate = useThree((estado) => estado.invalidate);
  useEffect(() => {
    const relogio = relogioDe60();
    let pedido = 0;
    const tique = (agora: number) => {
      pedido = requestAnimationFrame(tique);
      if (relogio.hora(agora)) invalidate();
    };
    pedido = requestAnimationFrame(tique);
    return () => cancelAnimationFrame(pedido);
  }, [invalidate]);
  return null;
}

/**
 * Em produção o three não precisa conferir cada shader depois de compilar
 * (são uns 20 ms no primeiro quadro de cada cena). Em dev a checagem fica,
 * porque é ela que mostra o erro quando um shader quebra.
 */
export function prepararRenderizador({ gl }: { gl: WebGLRenderer }) {
  gl.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
}
