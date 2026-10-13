import Link from "next/link";
import { AlternarTema } from "@/components/layout/alternar-tema";
import { BotaoPedido } from "@/components/layout/botao-pedido";
import { BuscaRapida } from "@/components/layout/busca-rapida";
import { Marca } from "@/components/layout/marca";
import { MenuMovel } from "@/components/layout/menu-movel";
import { NavPrincipal } from "@/components/layout/nav-principal";
import { IconeWhatsApp } from "@/components/ui/icones";
import { linkDaConversa } from "@/data/contato";

/**
 * O cabeçalho começa transparente sobre a abertura e ganha vidro ao rolar.
 * A troca é CSS (`animation-timeline: scroll()`), sem ouvir a rolagem em JS:
 * quem não suporta vê o cabeçalho já com fundo, que é o estado seguro.
 * Nenhuma biblioteca de animação mora aqui (regra do prime-collection: o
 * cabeçalho está em toda página).
 */
export function Cabecalho() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="cabecalho-fundo vidro absolute inset-0 border-b border-linha" aria-hidden />
      <div className="recipiente relative flex h-16 items-center gap-3 md:h-[4.5rem]">
        {/* sem prefetch: na home, o logo fazia a página baixar a si mesma */}
        <Link href="/" prefetch={false} className="-ml-1 shrink-0 rounded-lg p-1" aria-label="Visão Sul Informática, página inicial">
          {/* abaixo de 360 px a logo encolhe: com 142 px o botão do menu passava da borda */}
          <Marca arranjo="horizontal" className="w-[124px] min-[360px]:w-[142px] md:w-[168px]" titulo="Visão Sul Informática" />
        </Link>
        <div className="ml-auto flex items-center gap-1.5 md:gap-2">
          <NavPrincipal />
          <span className="mx-2 hidden h-6 w-px bg-linha lg:block" aria-hidden />
          <BuscaRapida />
          {/* no celular o tema fica dentro do menu: a barra não tem lugar para os quatro botões */}
          <AlternarTema className="max-sm:hidden" />
          <BotaoPedido />
          <a
            href={linkDaConversa()}
            target="_blank"
            rel="noopener"
            className="btn btn-primario btn-pequeno ml-1 hidden md:inline-flex"
          >
            <IconeWhatsApp tamanho={18} />
            {/* entre 1024 e 1279 px, com o menu ao lado, só o ícone (o nome fica para o leitor de tela) */}
            <span className="lg:max-xl:sr-only">WhatsApp</span>
          </a>
          <MenuMovel />
        </div>
      </div>
    </header>
  );
}
