import Image from "next/image";
import { Marca } from "@/components/layout/marca";
import { IconeCalendario, IconeInstagram, IconeLocal, IconeRelogio, IconeWhatsApp } from "@/components/ui/icones";
import { SoNaTela } from "@/components/ui/so-na-tela";
import { INSTAGRAM, linkDaConversa, WHATSAPP_EXIBICAO } from "@/data/contato";
import { DONO, enderecoOuEmBreve, horarioOuEmBreve, LOJA } from "@/data/loja";
import fotoDoLetreiro from "@/fotos/loja/loja-letreiro.jpg";
import fotoDaLoja from "@/fotos/loja/loja-retrato.jpg";

/**
 * A LOJA FÍSICA E O MARCIANO, logo depois do mergulho. A foto é a de
 * 09/10/2026 (a loja ainda estava sendo montada, por isso o recorte para
 * antes da mesa da frente). Endereço e horário aparecem como "em breve" até
 * o Marciano passar (PENDENCIAS.md).
 */
export function ALoja() {
  const anos = new Date().getFullYear() - LOJA.desde;
  return (
    <section
      id="loja"
      className="relative z-10 -mt-10 overflow-hidden rounded-t-[2.5rem] border-t border-linha bg-fundo py-14 md:-mt-14 md:rounded-t-[3.5rem] md:py-32"
      aria-labelledby="titulo-da-loja"
    >
      <div className="recipiente grid items-center gap-14 lg:grid-cols-[1.02fr_1fr] lg:gap-20">
        <div className="revelar relative mx-auto w-full max-w-[34rem] lg:max-w-none">
          {/* mais baixa no celular: em 4 × 5 a foto sozinha passava de meia tela */}
          <figure className="relative aspect-[6/5] overflow-hidden rounded-squircle border border-linha shadow-[var(--sombra)] md:aspect-[4/5]">
            <Image
              src={fotoDaLoja}
              alt="Interior da Visão Sul em Tapejara: prateleiras com PS5, caixas JBL, Alexa e roteadores, e o letreiro aceso no fundo"
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              placeholder="blur"
              className="object-cover object-[55%_50%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <figcaption className="absolute left-5 top-5 flex md:bottom-5 md:top-auto items-center gap-2 rounded-full bg-black/70 px-3.5 py-2 font-mono text-[0.68rem] uppercase tracking-wider text-white">
              <SoNaTela className="size-2 rounded-full bg-amarelo shadow-[0_0_10px_#ecb500] [animation:pulso_2s_infinite]" />
              Loja nova · {LOJA.cidade}/{LOJA.estado}
            </figcaption>
          </figure>
          <div className="absolute -bottom-10 -right-3 w-[46%] overflow-hidden rounded-3xl border border-amarelo/40 shadow-[0_30px_60px_-20px_rgb(236_181_0/0.45)] md:-right-8">
            <Image src={fotoDoLetreiro} alt="O letreiro aceso da Visão Sul na parede da loja" sizes="(min-width: 1024px) 22vw, 45vw" placeholder="blur" className="h-auto w-full" />
          </div>
        </div>

        <div className="revelar">
          <p className="sobretitulo">A loja</p>
          <h2 id="titulo-da-loja" className="titulo-2 mt-4">
            Agora dá para ver, <span className="acende">testar</span> e sair com tudo configurado.
          </h2>
          <p className="texto-grande mt-6">
            Foram {anos} anos atendendo pelo WhatsApp e entregando na porta. A loja nova em {LOJA.cidade} junta a vitrine, a
            assistência técnica e o atendimento direto com quem entende.
          </p>

          <div className="cartao mt-7 flex gap-5 p-5 md:mt-9 md:p-6">
            <div className="relative grid size-16 shrink-0 place-items-center rounded-full bg-fundo-3 ring-2 ring-destaque/70 ring-offset-4 ring-offset-fundo-2">
              <Marca arranjo="simbolo" titulo="" className="w-9" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold">{DONO.primeiroNome}</p>
              <p className="rotulo-mono">Dono da Visão Sul</p>
              <p className="mt-3 text-[0.97rem] leading-relaxed text-texto-2">{DONO.apresentacao}</p>
            </div>
          </div>

          <ul className="mt-6 grid gap-3 text-[0.97rem] text-texto-2 sm:grid-cols-2 md:mt-8">
            <li className="flex items-center gap-3">
              <IconeLocal className="shrink-0 text-destaque-texto" />
              {enderecoOuEmBreve()}
            </li>
            <li className="flex items-center gap-3">
              <IconeRelogio className="shrink-0 text-destaque-texto" />
              {horarioOuEmBreve()}
            </li>
            <li className="flex items-center gap-3">
              <IconeWhatsApp className="shrink-0 text-destaque-texto" />
              {WHATSAPP_EXIBICAO}
            </li>
            <li>
              <a href={INSTAGRAM.href} target="_blank" rel="noopener" className="flex items-center gap-3 hover:text-texto">
                <IconeInstagram className="shrink-0 text-destaque-texto" />
                {INSTAGRAM.usuario}
              </a>
            </li>
          </ul>

          <div className="mt-7 flex flex-wrap gap-3 md:mt-9">
            <a href={linkDaConversa("teste")} target="_blank" rel="noopener" className="btn btn-primario">
              <IconeCalendario tamanho={18} />
              Agendar um teste grátis
            </a>
            <a href={linkDaConversa()} target="_blank" rel="noopener" className="btn btn-contorno">
              <IconeWhatsApp tamanho={18} />
              Falar com o {DONO.primeiroNome}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
