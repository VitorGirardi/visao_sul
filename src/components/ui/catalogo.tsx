"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue } from "react";
import { CartaoProduto } from "@/components/ui/cartao-produto";
import { IconeFechar, IconeWhatsApp } from "@/components/ui/icones";
import { categorias } from "@/data/categorias";
import { linkDaConversa } from "@/data/contato";
import { produtos, type Produto } from "@/data/produtos";
import { paraSlug } from "@/lib/utils";

/**
 * A VITRINE COMPLETA, com filtro na URL (padrão do prime-collection: o
 * filtro mora na URL, dá para mandar o link filtrado pelo WhatsApp). São 26
 * produtos de exemplo: filtrar no navegador é instantâneo e não pede banco.
 * Quando o catálogo vier do painel, a busca muda de lugar e a tela não.
 */
const ordens = [
  { valor: "relevancia", rotulo: "Mais procurados" },
  { valor: "menor-preco", rotulo: "Menor preço" },
  { valor: "maior-preco", rotulo: "Maior preço" },
] as const;

const normalizar = (texto: string) => paraSlug(texto).replace(/-/g, " ");

function filtrar(lista: Produto[], categoria: string | null, busca: string, ordem: string) {
  const termos = normalizar(busca).split(" ").filter(Boolean);
  const achados = lista.filter((p) => {
    if (categoria && p.categoria !== categoria) return false;
    if (termos.length === 0) return true;
    const alvo = normalizar(`${p.nome} ${p.marca} ${p.destaques.join(" ")} ${p.categoria}`);
    return termos.every((t) => alvo.includes(t));
  });
  if (ordem === "menor-preco") return [...achados].sort((a, b) => a.preco - b.preco);
  if (ordem === "maior-preco") return [...achados].sort((a, b) => b.preco - a.preco);
  return achados;
}

export function Catalogo() {
  const parametros = useSearchParams();
  const roteador = useRouter();
  const caminho = usePathname();
  const categoria = parametros.get("categoria");
  const busca = parametros.get("busca") ?? "";
  const ordem = parametros.get("ordem") ?? "relevancia";
  const buscaAdiada = useDeferredValue(busca);
  const lista = filtrar(produtos, categorias.some((c) => c.slug === categoria) ? categoria : null, buscaAdiada, ordem);

  const mudar = (chave: string, valor: string | null) => {
    const novos = new URLSearchParams(parametros.toString());
    if (valor) novos.set(chave, valor);
    else novos.delete(chave);
    const texto = novos.toString();
    roteador.replace(texto ? `${caminho}?${texto}` : caminho, { scroll: false });
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
            placeholder="Buscar: iPhone, JBL, notebook gamer, RTX..."
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
            Todos <span className="font-mono text-xs text-texto-3">{produtos.length}</span>
          </button>
          {categorias.map((c) => {
            const quantos = produtos.filter((p) => p.categoria === c.slug).length;
            return (
              <button key={c.slug} type="button" onClick={() => mudar("categoria", c.slug)} className="escolha" aria-pressed={categoria === c.slug}>
                {c.nome} <span className="font-mono text-xs text-texto-3">{quantos}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between text-sm text-texto-2" aria-live="polite">
        <p>
          {lista.length} {lista.length === 1 ? "produto" : "produtos"}
          {busca && (
            <>
              {" "}
              para <strong className="text-texto">&ldquo;{busca}&rdquo;</strong>
            </>
          )}
        </p>
        {(busca || categoria) && (
          <button type="button" onClick={() => roteador.replace(caminho, { scroll: false })} className="flex items-center gap-1.5 font-semibold text-texto hover:text-destaque-texto">
            <IconeFechar tamanho={16} />
            Limpar filtros
          </button>
        )}
      </div>

      {lista.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {lista.map((produto, i) => (
            <CartaoProduto key={produto.slug} produto={produto} prioridade={i < 4} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-cartao border border-dashed border-linha-forte px-6 py-16 text-center">
          <p className="font-display text-2xl font-semibold">Não achamos &ldquo;{busca}&rdquo; na vitrine</p>
          <p className="max-w-md text-texto-2">A loja encomenda o que você precisa. Manda no WhatsApp que a gente procura para você.</p>
          <a href={linkDaConversa("contato")} target="_blank" rel="noopener" className="btn btn-primario">
            <IconeWhatsApp />
            Pedir para a loja
          </a>
        </div>
      )}
    </div>
  );
}
