import Image from "next/image";
import Link from "next/link";
import { AbrirChamado } from "@/components/ui/abrir-chamado";
import { IconeSeta, iconesPorNome } from "@/components/ui/icones";
import { servicos } from "@/data/servicos";
import fotoDaPastaTermica from "@/fotos/instagram/pasta-termica.webp";

/**
 * A assistência técnica na página inicial: o que fazem e o chamado aberto ali
 * mesmo. No celular os serviços ficam só com o nome, em duas colunas (a
 * explicação de cada um está na página da assistência): a seção passava de
 * duas telas e meia e escondia o chamado lá embaixo (13/10/2026).
 */
export function AssistenciaChamada() {
  return (
    <section id="assistencia" className="longe-da-tela py-14 md:py-32" aria-labelledby="titulo-da-assistencia">
      <div className="recipiente grid gap-10 md:gap-14 lg:grid-cols-[1fr_minmax(0,30rem)] lg:gap-20">
        <div className="revelar">
          <p className="sobretitulo">Assistência técnica</p>
          <h2 id="titulo-da-assistencia" className="titulo-2 mt-4">
            Travou, esquentou ou quebrou? <span className="acende">A gente resolve.</span>
          </h2>
          <p className="texto-grande mt-6 max-w-[46ch]">
            Na bancada da loja ou na sua casa. Diagnóstico explicado, peça certa e a máquina de volta funcionando.
          </p>

          <ul className="mt-7 grid grid-cols-2 gap-x-3 gap-y-3 md:mt-10 md:gap-x-8 md:gap-y-6">
            {servicos.map((s) => {
              const Icone = iconesPorNome[s.icone];
              return (
                <li key={s.slug} className="flex items-center gap-3 md:items-start md:gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-linha bg-fundo-2 text-destaque-texto md:size-11">
                    <Icone tamanho={22} />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-semibold leading-tight tracking-tight md:text-base md:leading-normal">{s.titulo}</h3>
                    <p className="mt-1 text-[0.94rem] leading-relaxed text-texto-2 max-md:hidden">{s.texto}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <figure className="mt-8 flex items-center gap-5 rounded-cartao border border-linha bg-fundo-2 p-4 md:mt-12">
            <Image
              src={fotoDaPastaTermica}
              alt="Placa de notebook com a pasta térmica aplicada errado, de um atendimento da Visão Sul"
              sizes="112px"
              className="size-24 shrink-0 rounded-2xl object-cover md:size-28"
            />
            <figcaption>
              <p className="rotulo-mono">Da bancada da loja</p>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-texto-2">
                &ldquo;Aplicação da pasta térmica totalmente errada, podendo ocasionar graves problemas à placa.&rdquo; Por isso a
                manutenção preventiva existe.
              </p>
            </figcaption>
          </figure>

          <Link href="/assistencia" className="btn btn-contorno mt-6 md:mt-8">
            Tudo sobre a assistência
            <IconeSeta tamanho={18} />
          </Link>
        </div>

        <div className="revelar lg:sticky lg:top-28 lg:self-start">
          <AbrirChamado compacto />
        </div>
      </div>
    </section>
  );
}
