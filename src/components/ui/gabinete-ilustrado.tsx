import type { CSSProperties } from "react";
import { Marca } from "@/components/layout/marca";
import { SoNaTela } from "@/components/ui/so-na-tela";
import { cn } from "@/lib/utils";

/**
 * Um gabinete gamer desenhado em CSS (vidro, placa de vídeo, três fans com
 * luz girando). É a ilustração leve da chamada do "Monte seu PC" na página
 * inicial; o 3D de verdade fica na página do montador, para a inicial não
 * carregar dois mundos 3D.
 *
 * `parado`: sem animação nenhuma, para a foto do PC no cartão de produto
 * (duas cópias por cartão, uma delas escondida na chapa do Raio-X: eram 14
 * animações infinitas contando à toa). Nos outros lugares, os fans só giram
 * com o gabinete na tela.
 */
export function GabineteIlustrado({ cor = "#ECB500", parado = false, className }: { cor?: string; parado?: boolean; className?: string }) {
  const corpo = (
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
  );
  const estilo = { "--rgb": cor } as CSSProperties;
  if (parado) {
    return (
      <div className={cn("gabinete gabinete-parado", className)} style={estilo} aria-hidden>
        {corpo}
      </div>
    );
  }
  return (
    <SoNaTela className={cn("gabinete", className)} style={estilo} aria-hidden>
      {corpo}
    </SoNaTela>
  );
}
