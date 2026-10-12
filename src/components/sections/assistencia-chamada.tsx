import Image from "next/image";
import Link from "next/link";
import { AbrirChamado } from "@/components/ui/abrir-chamado";
import { IconeSeta, iconesPorNome } from "@/components/ui/icones";
import { servicos } from "@/data/servicos";
import fotoDaPastaTermica from "@/fotos/instagram/pasta-termica.webp";

/** A assistência técnica na página inicial: o que fazem e o chamado aberto ali mesmo. */
export function AssistenciaChamada() {
  return (
    <section id="assistencia" className="longe-da-tela py-24 md:py-32" aria-labelledby="titulo-da-assistencia">
      <div className="recipiente grid gap-14 lg:grid-cols-[1fr_minmax(0,30rem)] lg:gap-20">
        <div className="revelar">
          <p className="sobretitulo">Assistência técnica</p>
          <h2 id="titulo-da-assistencia" className="titulo-2 mt-4">
            Travou, esquentou ou quebrou? <span className="acende">A gente resolve.</span>
          </h2>
          <p className="texto-grande mt-6 max-w-[46ch]">
            Na bancada da loja ou na sua casa. Diagnóstico explicado, peça certa e a máquina de volta funcionando.
          </p>

          <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {servicos.map((s) => {
              const Icone = iconesPorNome[s.icone];
              return (
                <li key={s.slug} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-linha bg-fundo-2 text-destaque-texto">
                    <Icone tamanho={22} />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold tracking-tight">{s.titulo}</h3>
                    <p className="mt-1 text-[0.94rem] leading-relaxed text-texto-2">{s.texto}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <figure className="mt-12 flex items-center gap-5 rounded-cartao border border-linha bg-fundo-2 p-4">
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

          <Link href="/assistencia" className="btn btn-contorno mt-8">
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
