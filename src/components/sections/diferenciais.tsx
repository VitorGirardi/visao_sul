import { diferenciais } from "@/data/diferenciais";

/**
 * POR QUE A VISÃO SUL: as quatro promessas que a loja repete nos posts. A
 * palavra grande começa só no contorno e acende de amarelo quando chega na
 * tela (CSS `animation-timeline: view()` na cópia cheia; sem suporte, já vem
 * acesa). No celular viram uma grade 2 × 2, as quatro de uma vez na tela
 * (empilhadas, eram uma tela e meia).
 */
export function Diferenciais() {
  return (
    <section className="longe-da-tela relative overflow-hidden border-y border-linha bg-fundo-2 py-14 md:py-32" aria-labelledby="titulo-dos-diferenciais">
      <div className="arcos pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="recipiente relative">
        <div className="revelar max-w-3xl">
          <p className="sobretitulo">Por que a Visão Sul</p>
          <h2 id="titulo-dos-diferenciais" className="titulo-2 mt-4">
            Compromisso que dá para <span className="acende">conferir.</span>
          </h2>
        </div>
        <ol className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-cartao border border-linha bg-linha md:mt-20 md:block md:divide-y md:divide-linha md:overflow-visible md:rounded-none md:border-x-0 md:bg-transparent">
          {diferenciais.map((d) => (
            <li key={d.titulo} className="flex flex-col gap-3 bg-fundo-2 p-4 md:grid md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12 md:bg-transparent md:px-0 md:py-14">
              <p className="diferencial-destaque font-display font-bold leading-[0.9] tracking-[-0.05em]" aria-hidden>
                <span className="diferencial-contorno">{d.destaque}</span>
                <span className="diferencial-cheio">{d.destaque}</span>
              </p>
              <div className="revelar">
                <h3 className="titulo-3 max-md:text-base max-md:leading-snug">{d.titulo}</h3>
                <p className="texto-grande mt-1.5 max-w-[42ch] max-md:text-sm max-md:leading-snug md:mt-3">{d.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
