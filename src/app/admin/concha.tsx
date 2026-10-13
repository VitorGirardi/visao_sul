"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore, type ReactNode } from "react";
import { Marca } from "@/components/layout/marca";
import { IconeCalendario, IconeCasa, IconeChave, IconeNotebook, IconeSacola, IconeSetaDiagonal } from "@/components/ui/icones";
import { DONO } from "@/data/loja";
import { produtos } from "@/data/produtos";
import { cn } from "@/lib/utils";
import { ProvedorDoPainel, usePainel } from "./estado";
import { IconeSino } from "./icones";

/**
 * A MOLDURA DO PAINEL, no desenho dos painéis da Amage: lateral fixa de
 * 232 px, barra fina no topo e o conteúdo num fundo claro. No celular a
 * lateral vira uma fila de abas de 44 px. O painel é claro mesmo com o site
 * no escuro (`data-tema="claro"` na moldura).
 *
 * O conteúdo só aparece no navegador: tudo nele conta a partir de agora
 * (pedido "há 3 min", agenda dos próximos dias), e o HTML do build não sabe
 * que horas são. Até lá, o esqueleto da tela.
 */
const semAssinatura = () => () => {};

type Area = { href: string; rotulo: string; curto: string; Icone: typeof IconeCasa; grupo?: string };

const AREAS: Area[] = [
  { href: "/admin", rotulo: "Visão geral", curto: "Início", Icone: IconeCasa },
  { href: "/admin/pedidos", rotulo: "Pedidos", curto: "Pedidos", Icone: IconeSacola, grupo: "Vendas" },
  { href: "/admin/chamados", rotulo: "Chamados técnicos", curto: "Chamados", Icone: IconeChave, grupo: "Assistência" },
  { href: "/admin/testes", rotulo: "Testes grátis", curto: "Testes", Icone: IconeCalendario },
  { href: "/admin/produtos", rotulo: "Produtos", curto: "Produtos", Icone: IconeNotebook, grupo: "Catálogo" },
];

const ativa = (caminho: string, href: string) => (href === "/admin" ? caminho === "/admin" : caminho.startsWith(href));

function useContagens() {
  const { estado } = usePainel();
  return {
    "/admin/pedidos": estado.pedidos.filter((p) => p.situacao === "novo").length,
    "/admin/chamados": estado.chamados.filter((c) => c.etapa !== "entregue").length,
    "/admin/testes": estado.testes.filter((t) => t.situacao === "a-confirmar" || t.situacao === "confirmado").length,
    "/admin/produtos": produtos.length,
  } as Record<string, number>;
}

function Lateral() {
  const caminho = usePathname();
  const contagens = useContagens();
  return (
    <aside className="sticky top-0 hidden h-dvh w-[232px] shrink-0 flex-col self-start border-r border-linha bg-fundo-2 px-2.5 py-3.5 md:flex">
      <Link href="/admin" className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
        <Marca arranjo="simbolo" className="w-[30px]" titulo="" />
        <span className="leading-tight">
          <span className="block font-display text-sm font-semibold">Visão Sul</span>
          <span className="block text-xs text-texto-3">Painel da loja</span>
        </span>
      </Link>
      <nav aria-label="Áreas do painel" className="mt-5 flex flex-1 flex-col gap-0.5">
        {AREAS.map(({ href, rotulo, Icone, grupo }) => (
          <div key={href}>
            {grupo && <p className="mb-1 mt-4 px-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-texto-3">{grupo}</p>}
            <Link
              href={href}
              aria-current={ativa(caminho, href) ? "page" : undefined}
              className={cn(
                "relative flex h-8 items-center gap-2.5 rounded-md px-2 transition-colors",
                ativa(caminho, href) ? "bg-fundo-3 font-semibold text-texto" : "text-texto-2 hover:bg-fundo-3 hover:text-texto",
              )}
            >
              {ativa(caminho, href) && <span aria-hidden className="absolute -left-2.5 inset-y-2 w-0.5 rounded-sm bg-destaque" />}
              <Icone tamanho={16} />
              {rotulo}
              {contagens[href] !== undefined && <span className="ml-auto rounded-[10px] bg-fundo-3 px-[7px] text-[0.6875rem] tabular-nums text-texto-2">{contagens[href]}</span>}
            </Link>
          </div>
        ))}
        <p className="mt-0.5 flex h-8 items-center gap-2.5 px-2 text-texto-3" title="Fase 2: o estoque vem do sistema da loja">
          <span className="size-4" aria-hidden />
          Estoque do sistema
          <span className="ml-auto rounded-sm border border-linha px-1.5 text-[0.625rem] uppercase tracking-wider">breve</span>
        </p>
      </nav>
      <div className="flex items-center gap-2.5 border-t border-linha px-2 pt-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tinta text-xs font-semibold text-white">MT</span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-semibold">{DONO.primeiroNome} Teixeira</span>
          <span className="block text-xs text-texto-3">Proprietário</span>
        </span>
        <span className="ml-auto rounded-sm border border-aviso/30 bg-aviso-tinta px-1.5 text-[0.625rem] font-semibold uppercase tracking-wider text-aviso">Prévia</span>
      </div>
    </aside>
  );
}

function BarraDoTopo() {
  const caminho = usePathname();
  const roteador = useRouter();
  const { estado, acoes } = usePainel();
  const area = AREAS.find((a) => ativa(caminho, a.href));
  return (
    <header className="sticky top-0 z-20 flex h-[50px] shrink-0 items-center gap-3 border-b border-linha bg-fundo px-4 md:px-6">
      <Link href="/admin" className="md:hidden" aria-label="Visão geral do painel">
        <Marca arranjo="simbolo" className="w-[26px]" titulo="" />
      </Link>
      <p className="min-w-0 truncate text-texto-3">
        Painel <span aria-hidden>›</span> <span className="text-texto">{area?.rotulo ?? "Visão geral"}</span>
      </p>
      <div className="ml-auto flex items-center gap-1.5">
        <a href="/" target="_blank" rel="noopener" className="hidden h-8 items-center gap-1.5 rounded-md px-2.5 text-texto-2 hover:bg-fundo-3 hover:text-texto sm:inline-flex">
          Ver site
          <IconeSetaDiagonal tamanho={14} />
        </a>
        <button
          type="button"
          onClick={() => {
            acoes.apagarSino();
            roteador.push("/admin/pedidos");
          }}
          aria-label={estado.sino ? "Pedido novo chegou: ver pedidos" : "Pedidos"}
          className="relative grid size-8 place-items-center rounded-md text-texto-2 hover:bg-fundo-3 hover:text-texto"
        >
          <IconeSino />
          {estado.sino && <span aria-hidden className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destaque ring-2 ring-fundo" />}
        </button>
      </div>
    </header>
  );
}

function AbasDoCelular() {
  const caminho = usePathname();
  const contagens = useContagens();
  return (
    <nav aria-label="Áreas do painel" className="flex gap-1 overflow-x-auto border-b border-linha bg-fundo-2 px-2 [scrollbar-width:none] md:hidden">
      {AREAS.map(({ href, curto, Icone }) => (
        <Link
          key={href}
          href={href}
          aria-current={ativa(caminho, href) ? "page" : undefined}
          className={cn(
            "relative flex h-11 shrink-0 items-center gap-1.5 px-2.5 text-[0.8125rem]",
            ativa(caminho, href) ? "font-semibold text-texto" : "text-texto-2",
          )}
        >
          <Icone tamanho={16} />
          {curto}
          {href !== "/admin" && href !== "/admin/produtos" && contagens[href] > 0 && <span className="tabular-nums text-texto-3">{contagens[href]}</span>}
          {ativa(caminho, href) && <span aria-hidden className="absolute inset-x-2 bottom-0 h-0.5 rounded-sm bg-destaque" />}
        </Link>
      ))}
    </nav>
  );
}

function Esqueleto() {
  return (
    <div aria-hidden className="animate-pulse space-y-4">
      <div className="h-8 w-56 rounded-md bg-fundo-3" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-fundo-3" />
        ))}
      </div>
      <div className="h-72 rounded-lg bg-fundo-3" />
    </div>
  );
}

export function Concha({ children }: { children: ReactNode }) {
  const noNavegador = useSyncExternalStore(semAssinatura, () => true, () => false);
  return (
    <ProvedorDoPainel>
      <div data-painel data-tema="claro" className="flex min-h-dvh bg-fundo text-[0.8125rem] leading-[1.45] text-texto">
        <Lateral />
        <div className="flex min-w-0 flex-1 flex-col">
          <BarraDoTopo />
          <AbasDoCelular />
          <main id="conteudo" className="min-w-0 flex-1 px-4 py-5 md:px-7 md:py-7">
            {noNavegador ? children : <Esqueleto />}
            {!noNavegador && <p className="sr-only">Carregando o painel</p>}
          </main>
        </div>
      </div>
    </ProvedorDoPainel>
  );
}
