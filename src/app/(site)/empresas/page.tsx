import type { Metadata } from "next";
import { IconeCheck, IconeEmpresa, IconeImpressora, IconeWifi, IconeChave, IconeNotebook } from "@/components/ui/icones";
import { PedirProposta } from "@/components/ui/pedir-proposta";
import { passosDaLocacao, servicosParaEmpresas } from "@/data/empresas";

export const metadata: Metadata = {
  title: "Para empresas",
  description: "Locação de impressoras, redes, servidores, suporte técnico e equipamentos para empresas em Tapejara/RS e região.",
  alternates: { canonical: "/empresas" },
};

const icones = [IconeImpressora, IconeWifi, IconeChave, IconeNotebook];

export default function PaginaDeEmpresas() {
  return (
    <div className="pb-28">
      <section className="granulado relative overflow-hidden pb-16 pt-32 md:pt-40">
        <div className="grade-de-fundo pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="recipiente relative max-w-4xl text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-destaque text-sobre-destaque">
            <IconeEmpresa tamanho={28} />
          </span>
          <p className="sobretitulo mt-8 justify-center">Para empresas</p>
          <h1 className="titulo-1 mt-5">
            Tecnologia que não para a <span className="acende">sua empresa.</span>
          </h1>
          <p className="texto-grande mx-auto mt-6 max-w-[48ch]">
            Impressora que imprime, rede que não cai, computador que liga. Com quem atende a região há anos e resolve no local.
          </p>
          <a href="#proposta" className="btn btn-primario mt-9">
            Pedir uma proposta
          </a>
        </div>
      </section>

      <div className="recipiente space-y-4 py-12">
        {servicosParaEmpresas.map((s, i) => {
          const Icone = icones[i];
          return (
            <section
              key={s.slug}
              id={s.slug}
              className="revelar grid gap-8 rounded-squircle border border-linha bg-fundo-2 p-7 md:grid-cols-[auto_1fr_1fr] md:items-center md:p-10"
            >
              <span className="grid size-16 place-items-center rounded-3xl border border-linha bg-fundo text-destaque-texto">
                <Icone tamanho={30} />
              </span>
              <div>
                <span className="font-mono text-sm text-destaque-texto">0{i + 1}</span>
                <h2 className="titulo-3 mt-2 !text-[clamp(1.5rem,2.4vw,2.1rem)]">{s.titulo}</h2>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-texto-2">{s.texto}</p>
              </div>
              <ul className="space-y-3">
                {s.itens.map((item) => (
                  <li key={item} className="flex gap-3">
                    <IconeCheck className="mt-0.5 shrink-0 text-destaque-texto" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="recipiente py-16" aria-labelledby="titulo-locacao">
        <p className="sobretitulo">Locação de impressoras</p>
        <h2 id="titulo-locacao" className="titulo-2 mt-4 max-w-[18ch]">
          Do pedido à primeira página <span className="acende">impressa.</span>
        </h2>
        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {passosDaLocacao.map((passo, i) => (
            <li key={passo.titulo} className="revelar relative border-t border-linha-forte pt-6">
              <span className="absolute -top-px left-0 h-px w-12 bg-destaque shadow-[0_0_12px_var(--brilho)]" />
              <span className="font-mono text-sm text-destaque-texto">0{i + 1}</span>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">{passo.titulo}</h3>
              <p className="mt-2 text-texto-2">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="proposta" className="recipiente grid gap-12 py-16 lg:grid-cols-[1fr_minmax(0,34rem)]" aria-labelledby="titulo-proposta">
        <div className="revelar lg:pt-8">
          <p className="sobretitulo">Proposta</p>
          <h2 id="titulo-proposta" className="titulo-2 mt-4">
            Uma conversa e a proposta <span className="acende">sai sob medida.</span>
          </h2>
          <p className="texto-grande mt-6 max-w-[42ch]">
            Sem pacote fechado: a loja entende o volume, a estrutura e o orçamento da empresa e monta a solução. A mensagem chega
            pronta no WhatsApp.
          </p>
        </div>
        <div className="revelar">
          <PedirProposta />
        </div>
      </section>
    </div>
  );
}
