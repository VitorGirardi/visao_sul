"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FotoDoProduto } from "@/components/ui/foto-do-produto";
import { IconeFechar, IconeLixeira, IconeMais, IconeMenos, IconeSacola, IconeWhatsApp } from "@/components/ui/icones";
import { CAMINHO_DA_CONVERSA } from "@/data/contato";
import { LOJA } from "@/data/loja";
import { PARCELAS, produtoPorSlug } from "@/data/produtos";
import { AVISO_DE_PRECO } from "@/data/site";
import { EVENTO_ABRIR_PEDIDO, mudarQuantidade, removerDoPedido, totalDeItens, totalDoPedido, usePedido } from "@/lib/pedido";
import { formatarPreco, parcela } from "@/lib/utils";

/**
 * A GAVETA "MEU PEDIDO". Um <dialog> modal que entra pela direita: foco
 * preso, Esc fecha e o resto da página fica inerte sem nenhuma biblioteca.
 *
 * O formulário é GET para `/whatsapp` com `qtd-<slug>`: a rota confere cada
 * produto na lista do site e monta a mensagem (o nome nunca vem daqui). Abre
 * em outra aba para o site continuar aberto no computador; no celular o
 * WhatsApp abre direto no aplicativo.
 */
export function GavetaDoPedido() {
  const dialogo = useRef<HTMLDialogElement>(null);
  const itens = usePedido();
  const [entrega, setEntrega] = useState<"retirar" | "entregar">("retirar");

  useEffect(() => {
    const abrir = () => dialogo.current?.showModal();
    window.addEventListener(EVENTO_ABRIR_PEDIDO, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_PEDIDO, abrir);
  }, []);

  const quantidade = totalDeItens(itens);
  const total = totalDoPedido(itens);
  const fechar = () => dialogo.current?.close();

  return (
    <dialog
      ref={dialogo}
      className="gaveta"
      aria-labelledby="titulo-do-pedido"
      onClick={(e) => {
        // toque no fundo escurecido fecha
        if (e.target === e.currentTarget) fechar();
      }}
    >
      <div className="flex h-full flex-col" data-lenis-prevent>
        <header className="flex items-center justify-between border-b border-linha px-6 py-5">
          <div>
            <p className="rotulo-mono">Visão Sul</p>
            <h2 id="titulo-do-pedido" className="font-display text-2xl font-bold tracking-tight">
              Meu pedido {quantidade > 0 && <span className="text-texto-3">({quantidade})</span>}
            </h2>
          </div>
          <button type="button" onClick={fechar} className="btn-icone" aria-label="Fechar o pedido">
            <IconeFechar />
          </button>
        </header>

        {itens.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="grid size-20 place-items-center rounded-full border border-linha text-destaque">
              <IconeSacola tamanho={34} />
            </span>
            <div>
              <p className="font-display text-xl font-semibold">Seu pedido está vazio</p>
              <p className="mt-2 text-texto-2">Escolha os produtos e mande tudo de uma vez para a loja pelo WhatsApp.</p>
            </div>
            <Link href="/produtos" onClick={fechar} className="btn btn-primario">
              Ver produtos
            </Link>
          </div>
        ) : (
          <form action={CAMINHO_DA_CONVERSA} method="get" target="_blank" className="flex min-h-0 flex-1 flex-col">
            <input type="hidden" name="assunto" value="pedido" />
            <ul className="min-h-0 flex-1 divide-y divide-linha overflow-y-auto px-6 overscroll-contain">
              {itens.map((item) => {
                const produto = produtoPorSlug(item.slug);
                if (!produto) return null;
                return (
                  <li key={item.slug} className="flex gap-4 py-4">
                    <input type="hidden" name={`qtd-${item.slug}`} value={item.qtd} />
                    <div className="w-20 shrink-0 rounded-2xl bg-fundo-2">
                      <FotoDoProduto produto={produto} sizes="80px" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="rotulo-mono">{produto.marca}</p>
                      <Link href={`/produtos/${produto.slug}`} onClick={fechar} className="font-semibold leading-snug hover:text-destaque-texto">
                        {produto.nomeCurto}
                      </Link>
                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <div className="flex items-center rounded-full border border-linha">
                          <button
                            type="button"
                            className="grid size-9 place-items-center rounded-full hover:bg-fundo-3"
                            onClick={() => mudarQuantidade(item.slug, item.qtd - 1)}
                            aria-label={`Tirar um ${produto.nomeCurto}`}
                          >
                            <IconeMenos tamanho={16} />
                          </button>
                          <span className="w-7 text-center font-mono text-sm" aria-live="polite">
                            {item.qtd}
                          </span>
                          <button
                            type="button"
                            className="grid size-9 place-items-center rounded-full hover:bg-fundo-3"
                            onClick={() => mudarQuantidade(item.slug, item.qtd + 1)}
                            aria-label={`Mais um ${produto.nomeCurto}`}
                          >
                            <IconeMais tamanho={16} />
                          </button>
                        </div>
                        <p className="font-display font-semibold">{formatarPreco(produto.preco * item.qtd)}</p>
                        <button
                          type="button"
                          onClick={() => removerDoPedido(item.slug)}
                          className="grid size-9 place-items-center rounded-full text-texto-3 hover:bg-fundo-3 hover:text-texto"
                          aria-label={`Remover ${produto.nomeCurto}`}
                        >
                          <IconeLixeira tamanho={17} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="space-y-4 border-t border-linha bg-fundo-2 px-6 pb-6 pt-5">
              <fieldset className="flex flex-wrap gap-2">
                <legend className="mb-2 text-sm font-semibold">Como quer receber?</legend>
                <label className="escolha">
                  <input type="radio" name="entrega" value="retirar" checked={entrega === "retirar"} onChange={() => setEntrega("retirar")} />
                  Retiro na loja
                </label>
                <label className="escolha">
                  <input type="radio" name="entrega" value="entregar" checked={entrega === "entregar"} onChange={() => setEntrega("entregar")} />
                  Receber em casa
                </label>
              </fieldset>
              <div className="grid gap-2 sm:grid-cols-2">
                <input name="nome" className="campo" placeholder="Seu nome" autoComplete="given-name" maxLength={80} />
                {entrega === "entregar" && (
                  <input name="cidade" className="campo" placeholder={`Cidade (ex.: ${LOJA.cidade})`} autoComplete="address-level2" maxLength={80} />
                )}
              </div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-texto-2">Total no site</p>
                  <p className="font-display text-3xl font-bold tracking-tight">{formatarPreco(total)}</p>
                  <p className="text-xs text-texto-3">
                    ou {PARCELAS}x de {formatarPreco(parcela(total, PARCELAS))}
                  </p>
                </div>
              </div>
              <button type="submit" className="btn btn-primario w-full">
                <IconeWhatsApp />
                Enviar pedido no WhatsApp
              </button>
              <p className="text-center text-xs text-texto-3">{AVISO_DE_PRECO}</p>
            </footer>
          </form>
        )}
      </div>
    </dialog>
  );
}
