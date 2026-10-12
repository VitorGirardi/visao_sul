import Link from "next/link";
import { Marca } from "@/components/layout/marca";
import { IconeInstagram, IconeLocal, IconeRelogio, IconeWhatsApp } from "@/components/ui/icones";
import { categorias } from "@/data/categorias";
import { INSTAGRAM, linkDaConversa, WHATSAPP_EXIBICAO } from "@/data/contato";
import { enderecoOuEmBreve, horarioOuEmBreve } from "@/data/loja";
import { navegacao } from "@/data/navegacao";
import { AVISO_DE_PRECO, LEMA } from "@/data/site";

export function Rodape() {
  return (
    <footer className="longe-da-tela relative overflow-hidden border-t border-linha bg-fundo-2">
      <div className="arcos pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="recipiente relative pb-10 pt-16 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <Marca arranjo="empilhada" className="w-48 md:w-56" />
            <p className="mt-6 font-display text-2xl font-semibold tracking-tight">{LEMA}</p>
            <p className="mt-3 text-texto-2">Online desde 2021. Agora também de portas abertas em Tapejara.</p>
            <a href={linkDaConversa()} target="_blank" rel="noopener" className="btn btn-primario mt-6">
              <IconeWhatsApp />
              {WHATSAPP_EXIBICAO}
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <p className="rotulo-mono mb-4">A loja</p>
              <ul className="space-y-3 text-texto-2">
                <li className="flex gap-2.5">
                  <IconeLocal className="mt-0.5 shrink-0 text-destaque-texto" tamanho={18} />
                  {enderecoOuEmBreve()}
                </li>
                <li className="flex gap-2.5">
                  <IconeRelogio className="mt-0.5 shrink-0 text-destaque-texto" tamanho={18} />
                  {horarioOuEmBreve()}
                </li>
                <li>
                  <a href={INSTAGRAM.href} target="_blank" rel="noopener" className="flex gap-2.5 hover:text-texto">
                    <IconeInstagram className="mt-0.5 shrink-0 text-destaque-texto" tamanho={18} />
                    {INSTAGRAM.usuario}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="rotulo-mono mb-4">Navegue</p>
              <ul className="space-y-2.5">
                {navegacao.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-texto-2 transition-colors hover:text-texto">
                      {item.rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="rotulo-mono mb-4">Categorias</p>
              <ul className="space-y-2.5">
                {categorias.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/produtos?categoria=${c.slug}`} prefetch={false} className="text-texto-2 transition-colors hover:text-texto">
                      {c.nome}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-linha pt-6 text-xs text-texto-3 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Visão Sul Informática · Tapejara/RS</p>
          <p>{AVISO_DE_PRECO}</p>
          <p>Protótipo de site · Amage</p>
        </div>
      </div>
    </footer>
  );
}
