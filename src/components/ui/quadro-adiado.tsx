"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * UM QUADRO DA GALERIA DA FICHA QUE ENTRA DEPOIS DA PÁGINA PRONTA (13/10/2026):
 * no `load`, com o navegador ocioso, ou na hora, se a pessoa rolar o trilho
 * antes. Mesmo fora da tela, a segunda foto baixava junto com a capa e, no
 * 4G lento, dividia a banda com ela (o LCP da ficha piorava uns 200 ms). As
 * fotos chegam prontas do servidor (`children`).
 */
export function QuadroAdiado({ className, children }: { className: string; children: ReactNode }) {
  const quadro = useRef<HTMLDivElement>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const liberar = () => setPronto(true);
    const trilho = quadro.current?.parentElement;
    trilho?.addEventListener("scroll", liberar, { once: true, passive: true });
    // o Safari não tem requestIdleCallback: lá vai por tempo
    const temOcioso = "requestIdleCallback" in window;
    let espera = 0;
    const agendar = () => {
      espera = temOcioso ? window.requestIdleCallback(liberar) : window.setTimeout(liberar, 500);
    };
    if (document.readyState === "complete") agendar();
    else window.addEventListener("load", agendar, { once: true });
    return () => {
      trilho?.removeEventListener("scroll", liberar);
      window.removeEventListener("load", agendar);
      if (temOcioso) window.cancelIdleCallback(espera);
      else window.clearTimeout(espera);
    };
  }, []);

  return (
    <div ref={quadro} className={className}>
      {pronto && children}
    </div>
  );
}
