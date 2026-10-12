import Link from "next/link";
import { CenaDoNotebook } from "@/components/sections/cena-do-notebook";
import { ControleDoRaioX } from "@/components/sections/controle-do-raio-x";
import { BotaoAdicionar } from "@/components/ui/botao-adicionar";
import { FotoDoProduto } from "@/components/ui/foto-do-produto";
import { IconeCalendario } from "@/components/ui/icones";
import { Preco } from "@/components/ui/preco";
import { linkDaConversa } from "@/data/contato";
import { produtoPorSlug } from "@/data/produtos";
import { etapasDoRaioX, PRODUTO_DO_RAIO_X } from "@/data/raio-x";

/**
 * RAIO-X VISÃO SUL: o conceito do site em escala grande. O notebook abre,
 * vira chapa de raio-x e cada peça acende com a ficha técnica ao lado.
 * A lista acompanha a cena pelo `data-etapa` que o controle escreve.
 */
export function RaioX() {
  const produto = produtoPorSlug(PRODUTO_DO_RAIO_X);
  if (!produto) return null;
  return (
    // o percurso é mais alto que a tela: a seção fica presa (sticky) enquanto a rolagem passa pelas peças
    <div className="raio-x-percurso">
      <section id="raio-x" className="raio-x-secao sticky top-0 h-svh min-h-[640px] overflow-hidden" data-etapa="-1" aria-labelledby="titulo-raio-x">
        <div className="raio-x-ceu absolute inset-0" aria-hidden />
        <div className="absolute inset-x-0 top-16 h-[50%] lg:inset-0 lg:h-full">
          <CenaDoNotebook>
            <FotoDoProduto produto={produto} sizes="(min-width: 1024px) 50vw, 90vw" className="w-[min(80%,34rem)]" />
          </CenaDoNotebook>
        </div>

        {/* véu à esquerda: o texto fica legível quando o notebook passa por baixo dele */}
        <div className="raio-x-veu pointer-events-none absolute inset-0 z-[5] hidden lg:block" aria-hidden />
        <div className="recipiente pointer-events-none relative z-10 flex h-full flex-col justify-end pb-10 lg:justify-center lg:pb-0">
          <div className="pointer-events-auto max-w-[27rem]">
            <p className="sobretitulo">Raio-X Visão Sul</p>
            <h2 id="titulo-raio-x" className="titulo-2 mt-4 !text-[clamp(1.9rem,3.6vw,3.3rem)]">
              Veja por dentro <span className="acende">antes de levar.</span>
            </h2>
            <p className="mt-4 hidden text-texto-2 sm:block">
              A gente abre a ficha, explica cada peça e deixa você testar na loja. No exemplo, o {produto.nomeCurto}.
            </p>

            <ol className="raio-x-etapas mt-6 space-y-1 lg:mt-8">
              {etapasDoRaioX.map((etapa, i) => (
                <li key={etapa.peca} data-i={i} className="raio-x-passo">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-destaque-texto">
                    0{i + 1} · {etapa.rotulo}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold leading-snug tracking-tight">{etapa.titulo}</p>
                  <p className="raio-x-passo-texto text-sm leading-relaxed text-texto-2">{etapa.texto}</p>
                </li>
              ))}
            </ol>

            <div className="raio-x-final mt-6 flex flex-wrap items-end gap-4">
              <Preco valor={produto.preco} de={produto.precoDe} />
              <div className="flex gap-2">
                <BotaoAdicionar slug={produto.slug} compacto rotulo={`Adicionar ${produto.nomeCurto} ao pedido`} />
                <a href={linkDaConversa("teste", { produto: produto.slug })} target="_blank" rel="noopener" className="btn btn-primario btn-pequeno">
                  <IconeCalendario tamanho={16} />
                  Testar grátis
                </a>
                <Link href={`/produtos/${produto.slug}`} className="btn btn-contorno btn-pequeno">
                  Ficha
                </Link>
              </div>
            </div>
          </div>
        </div>
        <ControleDoRaioX alvo="raio-x" />
      </section>
    </div>
  );
}
