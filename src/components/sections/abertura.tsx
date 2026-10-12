import { getImageProps } from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CenaDoOlho } from "@/components/sections/cena-do-olho";
import { ControleDaAbertura } from "@/components/sections/controle-da-abertura";
import { IconeCheck, IconeSeta, IconeWhatsApp } from "@/components/ui/icones";
import { SoNaTela } from "@/components/ui/so-na-tela";
import { linkDaConversa } from "@/data/contato";
import { LOJA } from "@/data/loja";
import fotoDaLojaDeitada from "@/fotos/loja/loja-paisagem.jpg";
import fotoDaLojaEmPe from "@/fotos/loja/loja-retrato.jpg";

/**
 * A ABERTURA: o olho da marca em 3D e o mergulho para dentro da loja.
 *
 * Camadas, de trás para a frente:
 *   fundo (marinho e grade) → arcos (as ondas da lâmina da marca, centradas
 *   no furo do olho) → foto da loja (recortada num círculo do tamanho do
 *   furo: `--portal-x/y/r`, escritos pela cena) → cena 3D → texto.
 *
 * Rolando, a câmera atravessa o furo e a loja toma a tela: "online desde
 * 2021, agora de portas abertas". A foto é a que o Vitor tirou na loja em
 * 09/10/2026.
 */
const palavras = ["Tecnologia", "com"];

/*
 * A foto do portal muda com a orientação (deitada na tela larga, em pé no
 * celular, puxada para o letreiro aceso). Um <picture> só, montado com
 * getImageProps: o navegador baixa UMA das duas, e cedo, porque é a maior
 * imagem da primeira tela (o LCP), mesmo recortada no círculo do furo.
 */
const comum = { alt: "", fill: true, sizes: "100vw", quality: 85 } as const;
const { props: deitada } = getImageProps({ ...comum, src: fotoDaLojaDeitada });
const { props: emPe } = getImageProps({ ...comum, src: fotoDaLojaEmPe });

export function Abertura() {
  return (
    // o percurso é mais alto que a tela: a seção fica presa (sticky) enquanto a rolagem conduz o mergulho
    <div className="abertura-percurso">
      <section id="abertura" className="abertura sticky top-0 h-svh min-h-[640px] overflow-hidden" aria-labelledby="titulo-da-abertura">
        <div className="abertura-fundo absolute inset-0" aria-hidden>
          <div className="grade-de-fundo absolute inset-0 opacity-60" />
        </div>

        <div className="abertura-halo" aria-hidden />

        <div className="abertura-arcos" aria-hidden>
          {[1.75, 2.6, 3.7, 5.2, 7.2].map((k, i) => (
            <span key={k} style={{ "--k": k, "--o": 0.95 - i * 0.16 } as CSSProperties} />
          ))}
        </div>

        <div className="abertura-portal absolute inset-0" aria-hidden>
          <picture>
            <source media="(orientation: landscape)" srcSet={deitada.srcSet} sizes={deitada.sizes} />
            <img {...emPe} alt="" loading="eager" fetchPriority="high" className="object-cover portrait:object-[75%_50%]" />
          </picture>
          <div className="abertura-portal-sombra absolute inset-0" />
        </div>

        <CenaDoOlho />

        <div className="abertura-texto recipiente pointer-events-none relative z-10 flex h-full flex-col justify-start pt-28 md:justify-center md:pt-12">
          <div className="pointer-events-auto max-w-[36rem]">
            <p className="sobretitulo abertura-entra" style={{ "--i": 0 } as CSSProperties}>
              Visão Sul Informática · {LOJA.cidade}/{LOJA.estado}
            </p>
            <h1 id="titulo-da-abertura" className="abertura-titulo mt-5">
              {palavras.map((palavra, i) => (
                <span key={palavra} className="abertura-entra inline-block" style={{ "--i": i + 1 } as CSSProperties}>
                  {palavra}&nbsp;
                </span>
              ))}
              <span className="abertura-entra acende inline-block" style={{ "--i": 3 } as CSSProperties}>
                compromisso.
              </span>
            </h1>
            <p className="texto-grande abertura-entra mt-5 max-w-[34ch] md:mt-6" style={{ "--i": 4 } as CSSProperties}>
              Notebooks, iPhone, games, som e assistência técnica<span className="hidden sm:inline"> com quem entende do assunto. Online desde {LOJA.desde}, agora
              com loja em {LOJA.cidade}</span>.
            </p>
            <div className="abertura-entra mt-6 flex flex-wrap gap-2.5 md:mt-8 md:gap-3" style={{ "--i": 5 } as CSSProperties}>
              <Link href="/produtos" className="btn btn-primario max-sm:btn-pequeno">
                Ver produtos
                <IconeSeta tamanho={18} />
              </Link>
              <a href={linkDaConversa()} target="_blank" rel="noopener" className="btn btn-contorno max-sm:btn-pequeno">
                <IconeWhatsApp tamanho={18} />
                <span className="sm:hidden">WhatsApp</span>
                <span className="max-sm:hidden">Chamar no WhatsApp</span>
              </a>
            </div>
            <ul className="abertura-entra mt-9 hidden flex-wrap gap-x-6 gap-y-2 text-sm text-texto-2 sm:flex" style={{ "--i": 6 } as CSSProperties}>
              {["Teste grátis na loja", "Troca na hora em 30 dias", "Entrega imediata"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <IconeCheck tamanho={16} className="text-destaque-texto" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="abertura-chegada pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="recipiente pb-14 pt-40 md:pb-20">
            <p className="sobretitulo !text-amarelo">Bem-vindo à Visão Sul</p>
            <p className="titulo-2 mt-4 max-w-[15ch] text-white">Online desde {LOJA.desde}. Agora, de portas abertas.</p>
          </div>
        </div>

        <div className="abertura-dica pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex" aria-hidden>
          <span className="rotulo-mono">Role para entrar na loja</span>
          <SoNaTela className="relative h-12 w-px overflow-hidden bg-linha-forte">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-destaque [animation:descer_1.9s_var(--ease-entrada-saida)_infinite]" />
          </SoNaTela>
        </div>

        <ControleDaAbertura alvo="abertura" />
      </section>
    </div>
  );
}
