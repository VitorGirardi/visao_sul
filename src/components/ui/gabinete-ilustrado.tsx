import type { CSSProperties } from "react";
import { Marca } from "@/components/layout/marca";
import { cn } from "@/lib/utils";

/**
 * Um gabinete gamer desenhado em CSS (vidro, placa de vídeo, três fans com
 * luz girando). É a ilustração leve da chamada do "Monte seu PC" na página
 * inicial; o 3D de verdade fica na página do montador, para a inicial não
 * carregar dois mundos 3D.
 */
export function GabineteIlustrado({ cor = "#ECB500", className }: { cor?: string; className?: string }) {
  return (
    <div className={cn("gabinete", className)} style={{ "--rgb": cor } as CSSProperties} aria-hidden>
      <div className="gabinete-corpo">
        <div className="gabinete-vidro">
          <div className="gabinete-placa-mae">
            <div className="gabinete-cooler">
              <span className="gabinete-fan gabinete-fan-pequeno" />
            </div>
            <div className="gabinete-memorias">
              <span />
              <span />
            </div>
          </div>
          <div className="gabinete-placa-de-video">
            <span className="gabinete-fan gabinete-fan-gpu" />
            <span className="gabinete-fan gabinete-fan-gpu" />
            <i>GEFORCE RTX</i>
          </div>
        </div>
        <div className="gabinete-frente">
          <span className="gabinete-fan" />
          <span className="gabinete-fan" />
          <span className="gabinete-fan" />
        </div>
        <Marca arranjo="simbolo" titulo="" className="gabinete-logo" />
      </div>
    </div>
  );
}
