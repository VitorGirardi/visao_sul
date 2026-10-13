"use client";

import { createContext, useContext, useEffect, useReducer, useSyncExternalStore, type ReactNode } from "react";
import {
  atividadeDeExemplo,
  chamadosDeExemplo,
  ESTOQUE_MINIMO,
  estoqueInicial,
  pedidoQueChega,
  pedidosDeExemplo,
  testesDeExemplo,
  testesDoMes,
  type Chamado,
  type EtapaDoChamado,
  type Pedido,
  type SituacaoDoPedido,
  type SituacaoDoTeste,
  type Teste,
} from "@/data/amostra-do-painel";
import { produtoPorSlug, produtos } from "@/data/produtos";
import { etapasDoChamado, situacoesDoPedido } from "./formato";

/**
 * A MEMÓRIA DA PRÉVIA DO PAINEL (13/10/2026). Tudo vive no navegador: a
 * página não fala com banco nenhum, e recarregar volta ao começo. Na fase 2
 * isto vira o Convex, alimentado pela rota `/whatsapp`.
 *
 * Dois momentos da demonstração moram aqui: o pedido que chega na hora
 * (`chegouPedido`) e o Pix que se confirma sozinho alguns segundos depois de
 * mandar o link (`enviarLink`), como vai ser com o pagamento online.
 */
const MINUTO = 60_000;
const PIX_CAI_EM = 4_000;

export type PedidoNoPainel = Omit<Pedido, "chegou"> & { chegou: number; pagarEm?: number; pagoEm?: number };
export type Evento = { quando: number; texto: string };

type Estado = {
  pedidos: PedidoNoPainel[];
  chamados: Chamado[];
  testes: Teste[];
  precos: Record<string, number>;
  estoque: Record<string, number>;
  ocultos: Record<string, boolean>;
  atividade: Evento[];
  sino: boolean;
  testesNoMes: { feitos: number; viraramVenda: number };
};

type Acao =
  | { tipo: "chegou-pedido"; quando: number }
  | { tipo: "enviar-link"; numero: string; quando: number }
  | { tipo: "pagou"; numero: string; quando: number }
  | { tipo: "situacao"; numero: string; situacao: SituacaoDoPedido; quando: number }
  | { tipo: "chamado"; numero: string; etapa: EtapaDoChamado; quando: number }
  | { tipo: "teste"; id: string; situacao: SituacaoDoTeste; quando: number }
  | { tipo: "produto"; slug: string; preco?: number; estoque?: number; oculto?: boolean }
  | { tipo: "apagar-sino" };

function comecar(): Estado {
  const agora = Date.now();
  return {
    pedidos: pedidosDeExemplo.map((p) => ({ ...p, chegou: agora - p.chegou * MINUTO })),
    chamados: chamadosDeExemplo,
    testes: testesDeExemplo,
    precos: {},
    estoque: Object.fromEntries(produtos.map((p) => [p.slug, estoqueInicial(p.slug)])),
    ocultos: {},
    atividade: atividadeDeExemplo.map((e) => ({ quando: agora - e.ha * MINUTO, texto: e.texto })),
    sino: false,
    testesNoMes: { ...testesDoMes },
  };
}

const anotar = (estado: Estado, quando: number, texto: string) => [{ quando, texto }, ...estado.atividade].slice(0, 30);

function reduzir(estado: Estado, acao: Acao): Estado {
  switch (acao.tipo) {
    case "chegou-pedido":
      if (estado.pedidos.some((p) => p.numero === pedidoQueChega.numero)) return estado;
      return {
        ...estado,
        pedidos: [{ ...pedidoQueChega, chegou: acao.quando }, ...estado.pedidos],
        atividade: anotar(estado, acao.quando, `Site recebeu o pedido ${pedidoQueChega.numero}`),
        sino: true,
      };
    case "enviar-link":
      return {
        ...estado,
        pedidos: estado.pedidos.map((p) => (p.numero === acao.numero ? { ...p, situacao: "aguardando", pagarEm: acao.quando + PIX_CAI_EM } : p)),
        atividade: anotar(estado, acao.quando, `Link de pagamento do pedido ${acao.numero} enviado`),
      };
    case "pagou": {
      const pedido = estado.pedidos.find((p) => p.numero === acao.numero);
      if (!pedido || pedido.situacao !== "aguardando") return estado;
      return {
        ...estado,
        pedidos: estado.pedidos.map((p) => (p.numero === acao.numero ? { ...p, situacao: "pago", pagarEm: undefined, pagoEm: acao.quando } : p)),
        atividade: anotar(estado, acao.quando, pedido.pagamento === "cartao" ? `Cartão do pedido ${acao.numero} aprovado sozinho` : `Pix do pedido ${acao.numero} confirmado sozinho`),
      };
    }
    case "situacao":
      return {
        ...estado,
        pedidos: estado.pedidos.map((p) => (p.numero === acao.numero ? { ...p, situacao: acao.situacao, pagarEm: undefined } : p)),
        atividade: anotar(estado, acao.quando, `Pedido ${acao.numero}: ${situacoesDoPedido[acao.situacao].rotulo.toLowerCase()}`),
      };
    case "chamado":
      return {
        ...estado,
        chamados: estado.chamados.map((c) => (c.numero === acao.numero ? { ...c, etapa: acao.etapa } : c)),
        atividade: anotar(estado, acao.quando, `Chamado ${acao.numero}: ${etapasDoChamado[acao.etapa].rotulo.toLowerCase()}`),
      };
    case "teste": {
      const teste = estado.testes.find((t) => t.id === acao.id);
      if (!teste) return estado;
      const nome = produtoPorSlug(teste.slug)?.nomeCurto ?? "produto";
      const veio = (s: SituacaoDoTeste) => s === "veio" || s === "virou-venda";
      return {
        ...estado,
        testes: estado.testes.map((t) => (t.id === acao.id ? { ...t, situacao: acao.situacao } : t)),
        testesNoMes: {
          feitos: estado.testesNoMes.feitos + (veio(acao.situacao) && !veio(teste.situacao) ? 1 : 0),
          viraramVenda: estado.testesNoMes.viraramVenda + (acao.situacao === "virou-venda" && teste.situacao !== "virou-venda" ? 1 : 0),
        },
        atividade: anotar(
          estado,
          acao.quando,
          acao.situacao === "virou-venda" ? `Teste do ${nome} virou venda` : `Teste do ${nome} com ${teste.cliente}: ${acao.situacao === "confirmado" ? "confirmado" : acao.situacao === "veio" ? "veio" : "não veio"}`,
        ),
      };
    }
    case "produto":
      return {
        ...estado,
        precos: acao.preco === undefined ? estado.precos : { ...estado.precos, [acao.slug]: acao.preco },
        estoque: acao.estoque === undefined ? estado.estoque : { ...estado.estoque, [acao.slug]: acao.estoque },
        ocultos: acao.oculto === undefined ? estado.ocultos : { ...estado.ocultos, [acao.slug]: acao.oculto },
      };
    case "apagar-sino":
      return estado.sino ? { ...estado, sino: false } : estado;
  }
}

/**
 * O "AGORA" DA TELA, num relógio só, que anda a cada 15 s: ler `Date.now()`
 * no meio do render deixaria a tela diferente a cada renderização (o React
 * Compiler barra). Os textos "há 3 min" e "agora" saem dele.
 */
let agoraAtual = typeof window === "undefined" ? 0 : Date.now();
const ouvintes = new Set<() => void>();
let relogio: number | undefined;

function assinarRelogio(avisar: () => void) {
  ouvintes.add(avisar);
  if (relogio === undefined) {
    agoraAtual = Date.now();
    relogio = window.setInterval(() => {
      agoraAtual = Date.now();
      ouvintes.forEach((o) => o());
    }, 15_000);
  }
  return () => {
    ouvintes.delete(avisar);
    if (ouvintes.size === 0) {
      window.clearInterval(relogio);
      relogio = undefined;
    }
  };
}

export const useAgora = () => useSyncExternalStore(assinarRelogio, () => agoraAtual, () => 0);

function useMemoriaDoPainel() {
  const [estado, despachar] = useReducer(reduzir, undefined, comecar);

  // o Pix que "cai sozinho": cada link enviado vira pagamento PIX_CAI_EM depois
  useEffect(() => {
    const relogios = estado.pedidos
      .filter((p) => p.situacao === "aguardando" && p.pagarEm)
      .map((p) => window.setTimeout(() => despachar({ tipo: "pagou", numero: p.numero, quando: Date.now() }), Math.max(0, (p.pagarEm ?? 0) - Date.now())));
    return () => relogios.forEach((r) => window.clearTimeout(r));
  }, [estado.pedidos]);

  const acoes = {
    chegouPedido: () => despachar({ tipo: "chegou-pedido", quando: Date.now() }),
    enviarLink: (numero: string) => despachar({ tipo: "enviar-link", numero, quando: Date.now() }),
    mudarPedido: (numero: string, situacao: SituacaoDoPedido) => despachar({ tipo: "situacao", numero, situacao, quando: Date.now() }),
    mudarChamado: (numero: string, etapa: EtapaDoChamado) => despachar({ tipo: "chamado", numero, etapa, quando: Date.now() }),
    mudarTeste: (id: string, situacao: SituacaoDoTeste) => despachar({ tipo: "teste", id, situacao, quando: Date.now() }),
    mudarProduto: (slug: string, mudanca: { preco?: number; estoque?: number; oculto?: boolean }) => despachar({ tipo: "produto", slug, ...mudanca }),
    apagarSino: () => despachar({ tipo: "apagar-sino" }),
  };

  const precoDe = (slug: string) => estado.precos[slug] ?? produtoPorSlug(slug)?.preco ?? 0;
  const totalDe = (pedido: PedidoNoPainel) => pedido.itens.reduce((soma, i) => soma + precoDe(i.slug) * i.qtd, 0);
  const estoqueBaixo = produtos.filter((p) => (estado.estoque[p.slug] ?? 0) <= ESTOQUE_MINIMO);

  return { estado, acoes, precoDe, totalDe, estoqueBaixo };
}

const Contexto = createContext<ReturnType<typeof useMemoriaDoPainel> | null>(null);

export function ProvedorDoPainel({ children }: { children: ReactNode }) {
  const painel = useMemoriaDoPainel();
  return <Contexto.Provider value={painel}>{children}</Contexto.Provider>;
}

export function usePainel() {
  const painel = useContext(Contexto);
  if (!painel) throw new Error("usePainel fora do ProvedorDoPainel");
  return painel;
}
