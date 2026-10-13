"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { IconeFechar, IconeWhatsApp } from "@/components/ui/icones";
import { linkDaConversa } from "@/data/contato";
import { atendeABusca, termosDaBusca } from "@/lib/busca";

/**
 * A VITRINE COMPLETA, com filtro na URL (padrão do prime-collection: o
 * filtro mora na URL, dá para mandar o link filtrado pelo WhatsApp). São 26
 * produtos de exemplo: filtrar no navegador é instantâneo e não pede banco.
 * Quando o catálogo vier do painel, a busca muda de lugar e a tela não.
 *
 * Os cartões vêm prontos do servidor (`children`), cada um marcado com
 * `data-produto` (12/10/2026). Antes, o `useSearchParams` fazia o HTML
 * estático sair sem nenhum cartão: a vitrine só aparecia depois do JS (3 s
 * num celular em 4G). Agora o cliente só esconde e reordena, e lê a URL por
 * conta própria, sem tirar a página do estático.
 */
export type ItemDoCatalogo = {
  slug: string;
  categoria: string;
  /** nome, nome curto, marca, destaques e categoria, já em `indiceDeBusca` */
  busca: string;
  /** posição na ordem de menor preço (0 = o mais barato) */
  porPreco: number;
};

const ordens = [
  { valor: "relevancia", rotulo: "Mais procurados" },
  { valor: "menor-preco", rotulo: "Menor preço" },
  { valor: "maior-preco", rotulo: "Maior preço" },
] as const;

/* A URL como fonte do filtro. No servidor (e na hidratação) ela está vazia:
   o HTML traz a vitrine inteira e o filtro entra logo depois. */
const MUDOU_A_URL = "visao:filtro";
const assinarUrl = (aviso: () => void) => {
  window.addEventListener("popstate", aviso);
  window.addEventListener(MUDOU_A_URL, aviso);
  return () => {
    window.removeEventListener("popstate", aviso);
    window.removeEventListener(MUDOU_A_URL, aviso);
  };
};
const lerUrl = () => window.location.search;
const urlDoServidor = () => "";

function trocarUrl(parametros: URLSearchParams) {
  const texto = parametros.toString();
  // replaceState: o Next acompanha, e o voltar do navegador sai da vitrine, não desfaz filtro
  window.history.replaceState(window.history.state, "", texto ? `${window.location.pathname}?${texto}` : window.location.pathname);
  window.dispatchEvent(new Event(MUDOU_A_URL));
}

export function Catalogo({
  itens,
  categorias,
  children,
}: {
  itens: ItemDoCatalogo[];
  categorias: { slug: string; nome: string; quantos: number }[];
  children: ReactNode;
}) {
  const grade = useRef<HTMLDivElement>(null);
  const parametros = new URLSearchParams(useSyncExternalStore(assinarUrl, lerUrl, urlDoServidor));
  const pedida = parametros.get("categoria");
  const categoria = categorias.some((c) => c.slug === pedida) ? pedida : null;
  const busca = parametros.get("busca") ?? "";
  const ordem = parametros.get("ordem") ?? "relevancia";

  // sinônimos, plural e erro de digitação: ver lib/busca.ts
  const termos = termosDaBusca(busca);
  const achados = new Set(itens.filter((p) => (!categoria || p.categoria === categoria) && atendeABusca(p.busca, termos)).map((p) => p.slug));
  const chaveDosAchados = [...achados].join(",");

  // esconde e reordena os cartões do servidor (atributos que o React não controla)
  useEffect(() => {
    const visiveis = new Set(chaveDosAchados ? chaveDosAchados.split(",") : []);
    const posicao = new Map(itens.map((p) => [p.slug, p.porPreco]));
    const total = itens.length;
    for (const el of grade.current?.querySelectorAll<HTMLElement>("[data-produto]") ?? []) {
      const slug = el.dataset.produto ?? "";
      el.hidden = !visiveis.has(slug);
      const p = posicao.get(slug) ?? 0;
      el.style.order = ordem === "menor-preco" ? String(p) : ordem === "maior-preco" ? String(total - 1 - p) : "";
    }
  }, [chaveDosAchados, ordem, itens]);

  const mudar = (chave: string, valor: string | null) => {
    const novos = new URLSearchParams(parametros);
    if (valor) novos.set(chave, valor);
    else novos.delete(chave);
    trocarUrl(novos);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Buscar produto</span>
          <input
            type="search"
            value={busca}
            onChange={(e) => mudar("busca", e.target.value || null)}
            placeholder="Buscar: iPhone, JBL, RTX..."
            className="campo !min-h-[3.25rem] !rounded-full !pl-5"
          />
        </label>
        <label className="flex items-center gap-3 text-sm text-texto-2">
          Ordenar
          <select value={ordem} onChange={(e) => mudar("ordem", e.target.value === "relevancia" ? null : e.target.value)} className="campo !min-h-[3.25rem] !w-auto !rounded-full !pr-10">
            {ordens.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.rotulo}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="-mx-[clamp(1.25rem,4vw,3rem)] mt-5 overflow-x-auto px-[clamp(1.25rem,4vw,3rem)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2 xl:w-auto xl:flex-wrap">
          <button type="button" onClick={() => mudar("categoria", null)} className="escolha" aria-pressed={!categoria}>
            Todos <span className="font-mono text-xs text-texto-3">{itens.length}</span>
          </button>
          {categorias.map((c) => (
            <button key={c.slug} type="button" onClick={() => mudar("categoria", c.slug)} className="escolha" aria-pressed={categoria === c.slug}>
              {c.nome} <span className="font-mono text-xs text-texto-3">{c.quantos}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between text-sm text-texto-2" aria-live="polite">
        <p>
          {achados.size} {achados.size === 1 ? "produto" : "produtos"}
          {busca && (
            <>
              {" "}
              para <strong className="text-texto">&ldquo;{busca}&rdquo;</strong>
            </>
          )}
        </p>
        {(busca || categoria) && (
          <button type="button" onClick={() => trocarUrl(new URLSearchParams())} className="flex items-center gap-1.5 font-semibold text-texto hover:text-destaque-texto">
            <IconeFechar tamanho={16} />
            Limpar filtros
          </button>
        )}
      </div>

      <div ref={grade}>{children}</div>

      {achados.size === 0 && (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-cartao border border-dashed border-linha-forte px-6 py-16 text-center">
          <p className="font-display text-2xl font-semibold">Não achamos &ldquo;{busca}&rdquo; na vitrine</p>
          <p className="max-w-md text-texto-2">
            Nem tudo o que a loja vende está no site. Manda no WhatsApp: a mensagem já sai com o que você buscou, e a loja responde se tem ou se consegue trazer.
          </p>
          {/* a conversa leva o termo buscado (13/10/2026): a loja já recebe o pedido, sem a pessoa digitar de novo */}
          <a href={linkDaConversa("encomenda", { busca })} target="_blank" rel="noopener" className="btn btn-primario">
            <IconeWhatsApp />
            Perguntar no WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
