import { Marca } from "@/components/layout/marca";
import { IconeWhatsApp } from "@/components/ui/icones";
import { linkDaConversa, WHATSAPP_EXIBICAO } from "@/data/contato";
import { DONO, LOJA } from "@/data/loja";

/** O fecho da página: o letreiro aceso e o WhatsApp. */
export function ChamadaFinal() {
  return (
    <section className="longe-da-tela relative overflow-hidden py-24 md:py-36" aria-labelledby="titulo-chamada-final">
      <div className="absolute left-1/2 top-1/2 size-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--brilho),transparent_62%)] opacity-60" aria-hidden />
      <div className="recipiente relative flex flex-col items-center text-center">
        <Marca arranjo="simbolo" titulo="" className="revelar-escala w-20 drop-shadow-[0_0_30px_rgb(236_181_0/0.6)] md:w-24" />
        <h2 id="titulo-chamada-final" className="titulo-1 revelar mt-8 max-w-[14ch]">
          Bora <span className="acende">conversar?</span>
        </h2>
        <p className="texto-grande revelar mt-6 max-w-[40ch]">
          Orçamento, dúvida, teste grátis ou chamado técnico: fala direto com o {DONO.primeiroNome} pelo WhatsApp. Atendimento em{" "}
          {LOJA.regiao.join(" e ")} e região.
        </p>
        <a href={linkDaConversa()} target="_blank" rel="noopener" className="btn btn-primario revelar mt-10 !min-h-16 !px-9 text-lg">
          <IconeWhatsApp tamanho={24} />
          {WHATSAPP_EXIBICAO}
        </a>
      </div>
    </section>
  );
}
