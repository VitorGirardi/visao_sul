import type { EtapaDoChamado, SituacaoDoPedido, SituacaoDoTeste } from "@/data/amostra-do-painel";

/** Os tons de estado do painel: a cor sempre vem com a palavra (e um quadradinho). */
export type Tom = "neutro" | "apagado" | "ok" | "aviso" | "erro" | "info";

export const situacoesDoPedido: Record<SituacaoDoPedido, { rotulo: string; tom: Tom }> = {
  novo: { rotulo: "Novo", tom: "aviso" },
  aguardando: { rotulo: "Aguardando pagamento", tom: "aviso" },
  pago: { rotulo: "Pago", tom: "ok" },
  pronto: { rotulo: "Pronto para retirar", tom: "info" },
  saiu: { rotulo: "Saiu para entrega", tom: "info" },
  entregue: { rotulo: "Entregue", tom: "ok" },
  cancelado: { rotulo: "Cancelado", tom: "apagado" },
};

export const etapasDoChamado: Record<EtapaDoChamado, { rotulo: string; tom: Tom }> = {
  recebido: { rotulo: "Recebido", tom: "neutro" },
  diagnostico: { rotulo: "Em diagnóstico", tom: "info" },
  aprovacao: { rotulo: "Aguardando aprovação", tom: "aviso" },
  conserto: { rotulo: "Em conserto", tom: "info" },
  peca: { rotulo: "Aguardando peça", tom: "aviso" },
  pronto: { rotulo: "Pronto para retirar", tom: "ok" },
  entregue: { rotulo: "Entregue", tom: "apagado" },
};

/** A ordem da bancada e o verbo que leva cada etapa à seguinte. */
export const proximaEtapa: Partial<Record<EtapaDoChamado, { etapa: EtapaDoChamado; verbo: string }>> = {
  recebido: { etapa: "diagnostico", verbo: "Começar o diagnóstico" },
  diagnostico: { etapa: "aprovacao", verbo: "Mandar orçamento para aprovar" },
  aprovacao: { etapa: "conserto", verbo: "Cliente aprovou: consertar" },
  conserto: { etapa: "pronto", verbo: "Marcar como pronto" },
  peca: { etapa: "conserto", verbo: "A peça chegou: consertar" },
  pronto: { etapa: "entregue", verbo: "Marcar como entregue" },
};

export const situacoesDoTeste: Record<SituacaoDoTeste, { rotulo: string; tom: Tom }> = {
  "a-confirmar": { rotulo: "A confirmar", tom: "aviso" },
  confirmado: { rotulo: "Confirmado", tom: "info" },
  veio: { rotulo: "Veio", tom: "ok" },
  "nao-veio": { rotulo: "Não veio", tom: "apagado" },
  "virou-venda": { rotulo: "Virou venda", tom: "ok" },
};

export const pagamentos = { pix: "Pix", cartao: "Cartão em até 10x", combinar: "A combinar" } as const;

const hora = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });
const diaEMes = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" });
const porExtenso = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" });

export const horaDe = (ms: number) => hora.format(ms);

/** "agora", "há 12 min", "14:10", "ontem, 18:20" ou "12/10". */
export function quandoFoi(ms: number, agora = Date.now()) {
  const minutos = Math.floor((agora - ms) / 60_000);
  if (minutos < 1) return "agora";
  if (minutos < 60) return `há ${minutos} min`;
  const dia = new Date(ms).toDateString();
  if (dia === new Date(agora).toDateString()) return hora.format(ms);
  const ontem = new Date(agora);
  ontem.setDate(ontem.getDate() - 1);
  if (dia === ontem.toDateString()) return `ontem, ${hora.format(ms)}`;
  return diaEMes.format(ms);
}

/** Dias a partir de hoje: "hoje", "amanhã", "em 3 dias", "atrasado 1 dia". */
export function prazo(dias: number) {
  if (dias === 0) return "hoje";
  if (dias === 1) return "amanhã";
  if (dias > 1) return `em ${dias} dias`;
  return `atrasado ${-dias} ${dias === -1 ? "dia" : "dias"}`;
}

export function haDias(dias: number) {
  if (dias === 0) return "hoje";
  if (dias === 1) return "ontem";
  return `há ${dias} dias`;
}

export function saudacao(agora = new Date()) {
  const h = agora.getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

export const dataPorExtenso = (agora = new Date()) => porExtenso.format(agora);

/** Os próximos seis dias de loja, sem domingo: o mesmo recorte do teste grátis do site. */
export function diasDaAgenda(agora = new Date()) {
  const dias: Date[] = [];
  for (let i = 1; dias.length < 6 && i < 10; i++) {
    const d = new Date(agora);
    d.setDate(agora.getDate() + i);
    if (d.getDay() !== 0) dias.push(d);
  }
  return dias;
}

const semanaCurta = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
export const rotuloDoDia = (d: Date) => `${semanaCurta.format(d).replace(".", "")} ${d.getDate()}`;

export const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;
