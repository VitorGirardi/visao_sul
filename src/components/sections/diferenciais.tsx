import { diferenciais } from "@/data/diferenciais";

/**
 * POR QUE A VISÃO SUL: as quatro promessas que a loja repete nos posts. A
 * palavra grande começa só no contorno e acende de amarelo quando chega na
 * tela (CSS `animation-timeline: view()` na cópia cheia; sem suporte, já vem
 * acesa).
 */
export function Diferenciais() {
  return (
    <section className="longe-da-tela relative overflow-hidden border-y border-linha bg-fundo-2 py-24 md:py-32" aria-labelledby="titulo-dos-diferenciais">
      <div className="arcos pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="recipiente relative">
        <div className="revelar max-w-3xl">
          <p className="sobretitulo">Por que a Visão Sul</p>
          <h2 id="titulo-dos-diferenciais" className="titulo-2 mt-4">
            Compromisso que dá para <span className="acende">conferir.</span>
          </h2>
        </div>
        <ol className="mt-14 divide-y divide-linha border-y border-linha md:mt-20">
          {diferenciais.map((d) => (
            <li key={d.titulo} className="grid items-center gap-4 py-10 md:grid-cols-[1.1fr_1fr] md:gap-12 md:py-14">
              <p className="diferencial-destaque font-display font-bold leading-[0.9] tracking-[-0.05em]" aria-hidden>
                <span className="diferencial-contorno">{d.destaque}</span>
                <span className="diferencial-cheio">{d.destaque}</span>
              </p>
              <div className="revelar">
                <h3 className="titulo-3">{d.titulo}</h3>
                <p className="texto-grande mt-3 max-w-[42ch]">{d.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
