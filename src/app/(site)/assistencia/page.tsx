import type { Metadata } from "next";
import Image from "next/image";
import { AbrirChamado } from "@/components/ui/abrir-chamado";
import { IconeCasa, IconeLoja, IconeWhatsApp, iconesPorNome } from "@/components/ui/icones";
import { linkDaConversa } from "@/data/contato";
import { DONO, LOJA } from "@/data/loja";
import { servicos } from "@/data/servicos";
import fotoDaPastaTermica from "@/fotos/instagram/pasta-termica.webp";

export const metadata: Metadata = {
  title: "Assistência técnica",
  description: "Conserto, manutenção preventiva, upgrade, formatação, impressoras e redes em Tapejara/RS. Abra o chamado pelo WhatsApp: na loja ou na sua casa.",
  alternates: { canonical: "/assistencia" },
};

const passos = [
  { titulo: "Você abre o chamado", texto: "Pelo site ou pelo WhatsApp, em meio minuto." },
  { titulo: "Diagnóstico explicado", texto: "O que tem, por que aconteceu e quanto custa, antes de mexer." },
  { titulo: "Conserto com peça certa", texto: "Na bancada da loja ou no seu endereço." },
  { titulo: "Devolvido funcionando", texto: "Testado, limpo e com as suas coisas no lugar." },
];

/*
 * Perguntas comuns. As respostas usam só o que a loja já diz nos posts;
 * prazo, valor de visita e garantia de serviço entram quando o Marciano
 * confirmar (PENDENCIAS.md).
 */
const perguntas = [
  { p: "Vocês vão até a minha casa?", r: "Sim. É só escolher “Venham até mim” no chamado: a loja combina o horário pelo WhatsApp." },
  { p: "Atendem empresas?", r: "Sim, com suporte técnico, redes, servidores e locação de impressoras. Veja a página de empresas." },
  { p: "Preciso pagar para saber o que tem?", r: "O diagnóstico vem explicado e o orçamento é passado antes de qualquer conserto. Nada é feito sem o seu ok." },
  { p: "Fazem backup antes de formatar?", r: "Sim: seus arquivos são salvos antes, e voltam para o lugar depois." },
];

export default function PaginaDaAssistencia() {
  return (
    <div className="pb-28">
      <section className="granulado relative overflow-hidden pb-20 pt-32 md:pt-40">
        <div className="arcos pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="recipiente relative grid gap-12 lg:grid-cols-[1fr_minmax(0,30rem)] lg:gap-16">
          <div className="lg:pt-6">
            <p className="sobretitulo">Assistência técnica</p>
            <h1 className="titulo-1 mt-5 max-w-[12ch]">
              Seu equipamento em <span className="acende">boas mãos.</span>
            </h1>
            <p className="texto-grande mt-6 max-w-[44ch]">
              Notebook, computador, impressora, celular ou a rede da casa. Diagnóstico explicado, peça certa e atendimento na loja
              ou no seu endereço, em {LOJA.regiao.join(", ")} e região.
            </p>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
              <div className="cartao flex items-center gap-3 p-4">
                <IconeLoja className="shrink-0 text-destaque-texto" />
                <p className="text-sm">
                  <strong className="block">Na loja</strong>
                  <span className="text-texto-2">Traz que a gente olha na hora</span>
                </p>
              </div>
              <div className="cartao flex items-center gap-3 p-4">
                <IconeCasa className="shrink-0 text-destaque-texto" />
                <p className="text-sm">
                  <strong className="block">Na sua casa</strong>
                  <span className="text-texto-2">&ldquo;Abre o chamado e vamos até vocês&rdquo;</span>
                </p>
              </div>
            </div>
          </div>
          <div id="chamado">
            <AbrirChamado />
          </div>
        </div>
      </section>

      <section className="recipiente py-16 md:py-24" aria-labelledby="titulo-servicos">
        <h2 id="titulo-servicos" className="titulo-2 revelar">
          O que a gente <span className="acende">resolve</span>
        </h2>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map((s) => {
            const Icone = iconesPorNome[s.icone];
            return (
              <li key={s.slug} className="revelar-escala cartao p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-destaque text-sobre-destaque">
                  <Icone tamanho={24} />
                </span>
                <h3 className="titulo-3 mt-6">{s.titulo}</h3>
                <p className="mt-2 leading-relaxed text-texto-2">{s.texto}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-y border-linha bg-fundo-2 py-16 md:py-24" aria-labelledby="titulo-como-funciona">
        <div className="recipiente">
          <h2 id="titulo-como-funciona" className="titulo-2 revelar">
            Como <span className="acende">funciona</span>
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {passos.map((passo, i) => (
              <li key={passo.titulo} className="revelar relative border-t border-linha-forte pt-6">
                <span className="absolute -top-px left-0 h-px w-12 bg-destaque shadow-[0_0_12px_var(--brilho)]" />
                <span className="font-mono text-sm text-destaque-texto">0{i + 1}</span>
                <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">{passo.titulo}</h3>
                <p className="mt-2 text-texto-2">{passo.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="recipiente grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2" aria-labelledby="titulo-preventiva">
        <figure className="revelar-escala relative overflow-hidden rounded-squircle border border-linha">
          <Image src={fotoDaPastaTermica} alt="Placa de notebook com a pasta térmica aplicada errado, de um atendimento da Visão Sul" sizes="(min-width: 1024px) 45vw, 90vw" className="h-auto w-full" />
          <figcaption className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-white backdrop-blur-md">
            Da bancada da loja
          </figcaption>
        </figure>
        <div className="revelar">
          <p className="sobretitulo">Manutenção preventiva</p>
          <h2 id="titulo-preventiva" className="titulo-2 mt-4">
            O defeito que você não vê é o <span className="acende">mais caro.</span>
          </h2>
          <p className="texto-grande mt-6">
            Pasta térmica ressecada ou mal aplicada faz a máquina esquentar, travar e, no fim, queimar a placa. Uma limpeza com troca
            de pasta no tempo certo custa muito menos do que o conserto depois.
          </p>
          <a href={linkDaConversa("chamado", { aparelho: "notebook", problema: "Esquentando muito" })} target="_blank" rel="noopener" className="btn btn-primario mt-8">
            <IconeWhatsApp tamanho={18} />
            Agendar uma preventiva
          </a>
        </div>
      </section>

      <section className="recipiente py-12" aria-labelledby="titulo-perguntas">
        <h2 id="titulo-perguntas" className="titulo-3">
          Perguntas frequentes
        </h2>
        <div className="mt-6 divide-y divide-linha border-y border-linha">
          {perguntas.map((item) => (
            <details key={item.p} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold">
                {item.p}
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-linha transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-texto-2">{item.r}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-texto-2">
          Ficou alguma dúvida?{" "}
          <a href={linkDaConversa()} target="_blank" rel="noopener" className="font-semibold text-texto underline decoration-destaque decoration-2 underline-offset-4">
            Fala com o {DONO.primeiroNome}
          </a>
          .
        </p>
      </section>
    </div>
  );
}
