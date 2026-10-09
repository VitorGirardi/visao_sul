import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Nome vira endereço: "Som e casa" → "som-e-casa". */
export function paraSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const reais = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const reaisSemCentavos = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

/** 5999 → "R$ 5.999,00". O espaço do Intl é não separável: não quebra linha. */
export const formatarPreco = (valor: number) => reais.format(valor);

/** 5999 → "R$ 5.999", para os números grandes da vitrine. */
export const formatarPrecoCurto = (valor: number) => reaisSemCentavos.format(valor);

/** Valor da parcela sem juros, arredondado para cima no centavo. */
export const parcela = (valor: number, vezes: number) => Math.ceil((valor / vezes) * 100) / 100;
