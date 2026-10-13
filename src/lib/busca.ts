import { PALAVRAS_VAZIAS, SINONIMOS } from "@/data/busca";
import { paraBusca } from "@/lib/utils";

/**
 * A BUSCA DA VITRINE, que entende o jeito que o cliente escreve (13/10/2026).
 * Cada termo digitado precisa aparecer no produto de algum destes jeitos:
 *   1. palavra com sinônimo em `data/busca.ts` vale só pelo sinônimo: "ps5"
 *      acha "playstation", e "fone" não acha o "microfone" do controle;
 *   2. termo de até 3 letras, só no começo de uma palavra ("ps" não é o
 *      meio de "epson" nem de "gps");
 *   3. o resto, como pedaço de qualquer palavra ("note" acha "notebook"),
 *      também sem o plural ("roteadores");
 *   4. com um erro de digitação, nos termos de 5 letras ou mais
 *      ("notbook"; dois erros a partir de 9 letras).
 */

/** Texto no formato da busca. "Wi-Fi" vira "wifi", do jeito que se digita. */
export const normalizarBusca = (texto: string) => paraBusca(texto).replace(/\bwi fi\b/g, "wifi");

/** O índice de um produto: tudo o que a busca lê dele, normalizado. */
export const indiceDeBusca = (...partes: string[]) => normalizarBusca(partes.join(" "));

/** O que a pessoa digitou, em termos, sem as palavras vazias. */
export function termosDaBusca(texto: string): string[] {
  return normalizarBusca(texto)
    .split(" ")
    .filter((t) => t && !PALAVRAS_VAZIAS.has(t));
}

/** Formas do termo sem o plural: "roteadores" → "roteadore", "roteador". */
function semPlural(termo: string): string[] {
  if (termo.length < 4 || !termo.endsWith("s")) return [];
  const formas = [termo.slice(0, -1)];
  if (termo.endsWith("es")) formas.push(termo.slice(0, -2));
  return formas;
}

/** Distância de edição com troca de letras vizinhas, parando assim que passa do limite. */
function distancia(a: string, b: string, limite: number): number {
  if (Math.abs(a.length - b.length) > limite) return limite + 1;
  const linhas: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    linhas[i] = [i];
    let menor = i;
    for (let j = 1; j <= b.length; j++) {
      if (i === 0) {
        linhas[0][j] = j;
        continue;
      }
      const custo = a[i - 1] === b[j - 1] ? 0 : 1;
      let d = Math.min(linhas[i - 1][j] + 1, linhas[i][j - 1] + 1, linhas[i - 1][j - 1] + custo);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d = Math.min(d, linhas[i - 2][j - 2] + 1);
      linhas[i][j] = d;
      menor = Math.min(menor, d);
    }
    if (i > 0 && menor > limite) return limite + 1;
  }
  return linhas[a.length][b.length];
}

/** O termo aparece no índice (o índice já vem quebrado em palavras)? */
function achaTermo(termo: string, indice: string, palavras: string[]): boolean {
  const formas = [termo, ...semPlural(termo)];
  const sinonimos = formas.map((f) => SINONIMOS[f]).find(Boolean);
  if (sinonimos) return sinonimos.some((s) => palavras.some((p) => p.startsWith(s)));
  if (termo.length <= 3) return palavras.some((p) => p.startsWith(termo));
  if (formas.some((f) => indice.includes(f))) return true;
  if (termo.length < 5) return false;
  const limite = termo.length >= 9 ? 2 : 1;
  return palavras.some((p) => distancia(termo, p, limite) <= limite);
}

/** O produto atende a todos os termos da busca? Sem termo, atende. */
export function atendeABusca(indice: string, termos: string[]): boolean {
  if (termos.length === 0) return true;
  const palavras = indice.split(" ");
  return termos.every((t) => achaTermo(t, indice, palavras));
}
