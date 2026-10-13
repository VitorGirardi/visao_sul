"use client";

import { useState } from "react";
import { CartaoProduto } from "@/components/ui/cartao-produto";
import { FotoDoProduto } from "@/components/ui/foto-do-produto";
import { IconeMais, IconeMenos } from "@/components/ui/icones";
import { ESTOQUE_MINIMO } from "@/data/amostra-do-painel";
import { categoriaPorSlug, categorias } from "@/data/categorias";
import { produtoPorSlug, produtos } from "@/data/produtos";
import { cn, formatarPreco, paraBusca } from "@/lib/utils";
import { TD, TH } from "../comum";
import { usePainel } from "../estado";
import { plural } from "../formato";
import { Cartao, Chip, Miniatura, Recado, TituloDaPagina } from "../ui";

/**
 * OS PRODUTOS DA LOJA: os 26 do site, com preço, estoque e "no site"
 * editáveis na linha, e ao lado o cartão do jeito que aparece na vitrine,
 * mudando enquanto se digita. É o "você mexe aqui, o site muda" da proposta.
 * Na prévia nada sai do navegador: o site de verdade não muda.
 */
const filtroDaUrl = () => new URLSearchParams(window.location.search).get("filtro") === "baixo";

export function ListaDeProdutos() {
  const { estado, acoes, precoDe, estoqueBaixo } = usePainel();
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [soBaixo, setSoBaixo] = useState(filtroDaUrl);
  const [escolhido, setEscolhido] = useState(() => (filtroDaUrl() ? estoqueBaixo[0]?.slug : undefined) ?? "hp-victus-15");
  const [recado, setRecado] = useState<string | null>(null);

  const termo = paraBusca(busca);
  const lista = produtos.filter(
    (p) =>
      (categoria === "todas" || p.categoria === categoria) &&
      (!soBaixo || (estado.estoque[p.slug] ?? 0) <= ESTOQUE_MINIMO) &&
      (!termo || paraBusca(`${p.nome} ${p.marca} ${p.slug}`).includes(termo)),
  );
  const produto = produtoPorSlug(escolhido);
  const ocultos = produtos.filter((p) => estado.ocultos[p.slug]).length;

  const salvarPreco = (slug: string) => {
    const p = produtoPorSlug(slug);
    if (p) setRecado(`Preço do ${p.nomeCurto} atualizado para ${formatarPreco(precoDe(slug))}. Ao lado, o cartão do jeito que aparece no site.`);
  };

  return (
    <>
      <TituloDaPagina
        titulo="Produtos"
        linha={`${plural(produtos.length - ocultos, "no site", "no site")}${ocultos ? ` · ${plural(ocultos, "oculto", "ocultos")}` : ""} · ${plural(estoqueBaixo.length, "com estoque baixo", "com estoque baixo")}`}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <label className="flex h-8 min-w-[14rem] flex-1 items-center rounded-md border border-linha-forte bg-fundo-2 px-2.5 focus-within:border-destaque-texto sm:max-w-xs">
          <span className="sr-only">Buscar produto</span>
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Nome, marca ou código" className="w-full bg-transparent outline-none placeholder:text-texto-3" />
        </label>
        <label className="flex h-8 items-center gap-2 rounded-md border border-linha bg-fundo-2 px-2.5">
          <span className="text-texto-3">Categoria</span>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="bg-transparent font-medium outline-none">
            <option value="todas">Todas</option>
            {categorias.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          aria-pressed={soBaixo}
          onClick={() => setSoBaixo((v) => !v)}
          className={cn("inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium", soBaixo ? "border-destaque bg-destaque/15" : "border-linha bg-fundo-2 text-texto-2 hover:border-linha-forte")}
        >
          Estoque baixo <span className="tabular-nums text-texto-3">{estoqueBaixo.length}</span>
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 overflow-x-auto rounded-lg border border-linha bg-fundo-2">
          <table className="w-full border-collapse sm:min-w-[40rem]">
            <thead>
              <tr>
                <th className={TH}>Produto</th>
                <th className={cn(TH, "hidden lg:table-cell")}>Categoria</th>
                <th className={TH}>Preço</th>
                <th className={TH}>Estoque</th>
                <th className={cn(TH, "hidden sm:table-cell")}>Vitrine</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => {
                const estoque = estado.estoque[p.slug] ?? 0;
                const oculto = Boolean(estado.ocultos[p.slug]);
                return (
                  <tr key={p.slug} onClick={() => setEscolhido(p.slug)} className={cn("cursor-pointer hover:bg-fundo", p.slug === escolhido && "bg-fundo")}>
                    <td className={TD}>
                      <span className="flex items-center gap-2.5">
                        {/* no celular a foto sai: preço e estoque precisam caber na mesma linha */}
                        <span className="max-sm:hidden">
                          <Miniatura>
                            <FotoDoProduto produto={p} sizes="40px" semSombra alt="" />
                          </Miniatura>
                        </span>
                        <span className="min-w-0">
                          <button type="button" onClick={() => setEscolhido(p.slug)} className="block truncate text-left font-semibold hover:underline" aria-pressed={p.slug === escolhido}>
                            {p.nomeCurto}
                          </button>
                          <span className="block text-xs text-texto-3">{p.marca}</span>
                        </span>
                      </span>
                    </td>
                    <td className={cn(TD, "hidden text-texto-2 lg:table-cell")}>{categoriaPorSlug(p.categoria)?.nome}</td>
                    <td className={TD}>
                      <label className="flex h-8 w-[5.5rem] items-center gap-1 rounded-md border border-linha-forte bg-fundo-2 px-2 focus-within:border-destaque-texto sm:w-32">
                        <span className="text-texto-3">R$</span>
                        <span className="sr-only">Preço do {p.nomeCurto}</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={1}
                          value={precoDe(p.slug)}
                          onFocus={() => setEscolhido(p.slug)}
                          onChange={(e) => {
                            const valor = Number(e.target.value);
                            if (Number.isFinite(valor) && valor >= 0) acoes.mudarProduto(p.slug, { preco: valor });
                          }}
                          onBlur={() => salvarPreco(p.slug)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.currentTarget.blur();
                          }}
                          className="w-full bg-transparent tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </label>
                    </td>
                    <td className={TD}>
                      <span className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Tirar uma unidade do ${p.nomeCurto}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            acoes.mudarProduto(p.slug, { estoque: Math.max(0, estoque - 1) });
                          }}
                          className="grid size-7 place-items-center rounded-md border border-linha hover:bg-fundo-3"
                        >
                          <IconeMenos tamanho={14} />
                        </button>
                        <span className={cn("w-7 text-center font-semibold tabular-nums", estoque <= ESTOQUE_MINIMO && "text-aviso")}>{estoque}</span>
                        <button
                          type="button"
                          aria-label={`Pôr mais uma unidade do ${p.nomeCurto}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            acoes.mudarProduto(p.slug, { estoque: estoque + 1 });
                          }}
                          className="grid size-7 place-items-center rounded-md border border-linha hover:bg-fundo-3"
                        >
                          <IconeMais tamanho={14} />
                        </button>
                        {estoque === 0 ? (
                          <Chip tom="erro" className="ml-1 max-sm:hidden">
                            Esgotado
                          </Chip>
                        ) : (
                          estoque <= ESTOQUE_MINIMO && (
                            <Chip tom="aviso" className="ml-1 max-sm:hidden">
                              Baixo
                            </Chip>
                          )
                        )}
                      </span>
                    </td>
                    <td className={cn(TD, "hidden sm:table-cell")}>
                      <button
                        type="button"
                        aria-pressed={!oculto}
                        onClick={(e) => {
                          e.stopPropagation();
                          acoes.mudarProduto(p.slug, { oculto: !oculto });
                        }}
                        className="rounded-sm"
                      >
                        <Chip tom={oculto ? "apagado" : "ok"}>{oculto ? "Oculto" : "No site"}</Chip>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {lista.length === 0 && <p className="px-4 py-10 text-center text-texto-3">Nenhum produto com esse filtro.</p>}
        </div>

        {produto && (
          <div className="space-y-3 self-start xl:sticky xl:top-[66px]">
            {recado && <Recado>{recado}</Recado>}
            <Cartao titulo="Como aparece no site">
              {/* o cartão de verdade da vitrine; os links ficam desligados para não sair do painel */}
              <div className={cn("[&_a]:pointer-events-none [&_button]:pointer-events-none", estado.ocultos[produto.slug] && "opacity-40")}>
                <CartaoProduto produto={{ ...produto, preco: precoDe(produto.slug) }} />
              </div>
              <p className="mt-3 text-xs text-texto-3">
                {estado.ocultos[produto.slug]
                  ? "Oculto: o produto sai da vitrine e da busca do site."
                  : (estado.estoque[produto.slug] ?? 0) === 0
                    ? "Na fase 2, sem estoque, a vitrine mostra o produto como esgotado."
                    : "Mude o preço na tabela e veja o cartão mudar."}
              </p>
            </Cartao>
          </div>
        )}
      </div>
    </>
  );
}
