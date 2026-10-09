import { Fragment } from "react";
import { Marca } from "@/components/layout/marca";

/**
 * As marcas que aparecem nos posts e nas prateleiras da loja. Em texto (não
 * em logo): logo de fabricante pede autorização e pesa; o nome basta.
 */
const marcas = ["Apple", "HP", "PlayStation", "JBL", "Xiaomi", "Acer", "Logitech G", "Alexa", "Epson", "TP-Link", "LG", "HyperX", "Garmin", "Google", "Toshiba"];

export function FaixaDeMarcas() {
  const lista = (
    <>
      {marcas.map((marca) => (
        <Fragment key={marca}>
          <span className="faixa-marca px-7 font-display text-[2.2rem] font-bold leading-none tracking-tight md:px-10 md:text-[3.4rem]">{marca}</span>
          <Marca arranjo="simbolo" titulo="" className="w-7 shrink-0 opacity-70 md:w-9" />
        </Fragment>
      ))}
    </>
  );
  return (
    <section aria-label="Marcas que a Visão Sul vende" className="faixa relative overflow-hidden border-y border-linha py-7 md:py-9">
      <div className="faixa-rolante items-center" aria-hidden>
        {lista}
        {lista}
      </div>
      <p className="sr-only">Apple, HP, PlayStation, JBL, Xiaomi, Acer, Logitech G, Alexa, Epson, TP-Link, LG, HyperX, Garmin, Google e Toshiba.</p>
    </section>
  );
}
