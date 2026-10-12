import { Fragment } from "react";
import { SoNaTela } from "@/components/ui/so-na-tela";
import { ANEL, CAIXAS, LAMINA } from "@/data/marca";

/**
 * As marcas que aparecem nos posts e nas prateleiras da loja. Em texto (não
 * em logo): logo de fabricante pede autorização e pesa; o nome basta.
 *
 * O olho entre os nomes é um `<symbol>` desenhado uma vez e repetido por
 * `<use>` (12/10/2026): eram 30 cópias do desenho no HTML.
 */
const marcas = ["Apple", "HP", "PlayStation", "JBL", "Xiaomi", "Acer", "Logitech G", "Alexa", "Epson", "TP-Link", "LG", "HyperX", "Garmin", "Google", "Toshiba"];

export function FaixaDeMarcas() {
  const lista = (
    <>
      {marcas.map((marca) => (
        <Fragment key={marca}>
          <span className="faixa-marca px-7 font-display text-[2.2rem] font-bold leading-none tracking-tight md:px-10 md:text-[3.4rem]">{marca}</span>
          <svg viewBox={CAIXAS.simbolo} className="h-auto w-7 shrink-0 opacity-70 md:w-9" aria-hidden>
            <use href="#olho-da-faixa" />
          </svg>
        </Fragment>
      ))}
    </>
  );
  return (
    <section aria-label="Marcas que a Visão Sul vende" className="faixa relative overflow-hidden border-y border-linha py-7 md:py-9">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <symbol id="olho-da-faixa" viewBox={CAIXAS.simbolo}>
          <path d={LAMINA} style={{ fill: "var(--marca-simbolo)" }} />
          <path d={ANEL} fillRule="evenodd" style={{ fill: "var(--marca-simbolo)" }} />
        </symbol>
      </svg>
      {/* a faixa só anda na tela */}
      <SoNaTela className="faixa-rolante items-center" aria-hidden>
        {lista}
        {lista}
      </SoNaTela>
      <p className="sr-only">Apple, HP, PlayStation, JBL, Xiaomi, Acer, Logitech G, Alexa, Epson, TP-Link, LG, HyperX, Garmin, Google e Toshiba.</p>
    </section>
  );
}
