"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconeFechar, IconeLupa, IconeSeta, IconeWhatsApp } from "@/components/ui/icones";
import { linkDaConversa } from "@/data/contato";
import type { ItemDaBuscaRapida } from "@/data/indice-de-busca";
import { AVISO_DE_PRECO } from "@/data/site";
import { atendeABusca, termosDaBusca } from "@/lib/busca";
import { carregarIndiceDaBusca } from "@/lib/indice-da-busca";
import { formatarPreco } from "@/lib/utils";

/** O que mais aparece nos posts da loja: um toque e a busca já está feita. */
const SUGESTOES = ["Notebook", "iPhone", "PS5", "JBL", "Impressora", "Roteador"];
const MAXIMO = 6;

/**
 * O MIOLO DA BUSCA DO TOPO: o campo, as sugestões e os resultados. Carrega
 * só quando a pessoa chega perto da lupa (`busca-rapida.tsx`), com a busca
 * da vitrine (`lib/busca.ts`) e o índice de `/indice-de-busca`.
 *
 * Enter leva à vitrine filtrada: o formulário é um GET para `/produtos`, que
 * lê a busca da URL. Sem resultado, a conversa da encomenda já sai com o
 * termo.
 */
export default function CorpoDaBusca({ fechar }: { fechar: () => void }) {
  const [indice, setIndice] = useState<ItemDaBuscaRapida[] | null>(null);
  const [termo, setTermo] = useState("");

  useEffect(() => {
    let vivo = true;
    void carregarIndiceDaBusca().then((itens) => vivo && setIndice(itens));
    return () => {
      vivo = false;
    };
  }, []);

  const termos = termosDaBusca(termo);
  const achados = indice && termos.length > 0 ? indice.filter((p) => atendeABusca(p.busca, termos)) : [];
  const situacao = termos.length === 0 ? "" : !indice ? "Carregando os produtos" : achados.length === 0 ? "Nenhum produto encontrado" : `${achados.length} ${achados.length === 1 ? "produto" : "produtos"}`;

  return (
    <div className="busca-rapida-caixa">
      <form action="/produtos" method="get" role="search" className="flex items-center gap-2 border-b border-linha py-2.5 pl-4 pr-2.5">
        <IconeLupa className="shrink-0 text-texto-3" />
        <label htmlFor="busca-rapida-campo" className="sr-only">
          Buscar produto
        </label>
        <input
          id="busca-rapida-campo"
          name="busca"
          type="search"
          // na primeira abertura o miolo chega depois do diálogo: o foco vem daqui
          autoFocus
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          onKeyDown={(e) => {
            // Esc fecha a busca; o campo de busca, sozinho, só limparia o texto
            if (e.key === "Escape") {
              e.preventDefault();
              fechar();
            }
          }}
          placeholder="Buscar: iPhone, PS5, JBL..."
          autoComplete="off"
          enterKeyHint="search"
          className="min-w-0 flex-1 bg-transparent py-2 text-lg text-texto outline-none placeholder:text-texto-3"
        />
        <button type="button" onClick={fechar} className="btn-icone shrink-0 !border-transparent" aria-label="Fechar a busca">
          <IconeFechar />
        </button>
      </form>

      <p className="sr-only" aria-live="polite">
        {situacao}
      </p>

      <div className="max-h-[min(62dvh,32rem)] overflow-y-auto overscroll-contain p-3">
        {termos.length === 0 ? (
          <div className="p-1">
            <p className="rotulo-mono">Mais procurados</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SUGESTOES.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => setTermo(s)} className="escolha">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : !indice ? (
          <p className="px-1 py-6 text-center text-texto-3">Carregando os produtos...</p>
        ) : achados.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-2 py-6 text-center">
            <p className="font-display text-xl font-semibold">Não achamos &ldquo;{termo.trim()}&rdquo; na vitrine</p>
            <p className="max-w-sm text-sm text-texto-2">Nem tudo o que a loja vende está no site. A mensagem já sai com o que você buscou.</p>
            <a href={linkDaConversa("encomenda", { busca: termo.trim() })} target="_blank" rel="noopener" className="btn btn-primario btn-pequeno mt-1">
              <IconeWhatsApp tamanho={18} />
              Perguntar no WhatsApp
            </a>
          </div>
        ) : (
          <>
            <ul>
              {achados.slice(0, MAXIMO).map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/produtos/${p.slug}`}
                    prefetch={false}
                    onClick={fechar}
                    className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-fundo-2 focus-visible:bg-fundo-2"
                  >
                    <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-linha bg-fundo-2 p-1.5">
                      {p.foto && (
                        // eslint-disable-next-line @next/next/no-img-element -- otimizada: o srcset vem do getImageProps em /indice-de-busca
                        <img src={p.foto.src} srcSet={p.foto.srcSet} width={p.foto.width} height={p.foto.height} alt="" className="max-h-full w-auto object-contain" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display font-semibold">{p.nome}</span>
                      <span className="block truncate text-sm text-texto-3">{p.categoria}</span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums">{formatarPreco(p.preco)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {/* link comum: a vitrine lê a busca da URL quando a página abre */}
            <a
              href={`/produtos?busca=${encodeURIComponent(termo.trim())}`}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-linha px-4 py-3 text-sm font-semibold transition-colors hover:border-destaque"
            >
              {achados.length > MAXIMO ? `Ver os ${achados.length} produtos na vitrine` : "Ver na vitrine"}
              <IconeSeta tamanho={16} />
            </a>
            <p className="px-1 pt-3 text-xs text-texto-3">{AVISO_DE_PRECO}</p>
          </>
        )}
      </div>
    </div>
  );
}
