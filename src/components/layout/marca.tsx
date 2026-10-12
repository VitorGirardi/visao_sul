import { ANEL, CAIXAS, LAMINA } from "@/data/marca";
import { cn } from "@/lib/utils";

/**
 * A LOGO DA VISÃO SUL, em SVG com as cores do tema:
 *
 *   escuro  símbolo amarelo, "VisãoSul" branco, "INFORMÁTICA" amarela
 *           (é o letreiro aceso da parede da loja, foto de 09/10/2026)
 *   claro   símbolo amarelo, letreiro marinho (a lâmina oficial)
 *
 * Arranjos: "empilhada" é a oficial (o olho em cima do "ão"); "horizontal"
 * é a do cabeçalho, com o olho ao lado, porque empilhada numa barra de 64 px
 * o "INFORMÁTICA" ficaria com 4 px; "simbolo" é só o olho.
 *
 * O olho vai inline (são 250 caracteres e aparece antes de tudo, inclusive no
 * lugar do 3D). O LETREIRO vem de `public/marca/letreiro.svg` por `<use>`:
 * são 10 KB de caminho que, inline, iam quatro vezes em cada página (no HTML
 * e de novo nos dados do React, no cabeçalho e no rodapé). Agora o navegador
 * baixa uma vez e guarda. As cores continuam vindo do tema: variável CSS
 * atravessa o `<use>`. Trocar o desenho pede `?v=` novo (cache de um ano).
 */
type Arranjo = "empilhada" | "horizontal" | "simbolo";

export const LETREIRO_SVG = "/marca/letreiro.svg?v=1";

const caixa: Record<Arranjo, string> = {
  empilhada: CAIXAS.empilhada,
  horizontal: "-276 96 516 132",
  simbolo: CAIXAS.simbolo,
};

export function Marca({
  arranjo = "horizontal",
  className,
  titulo = "Visão Sul Informática",
}: {
  arranjo?: Arranjo;
  className?: string;
  titulo?: string;
}) {
  const simbolo = (
    <>
      <path d={LAMINA} style={{ fill: "var(--marca-simbolo)" }} />
      <path d={ANEL} fillRule="evenodd" style={{ fill: "var(--marca-simbolo)" }} />
    </>
  );
  return (
    <svg viewBox={caixa[arranjo]} className={cn("h-auto", className)} role="img" aria-label={titulo}>
      {arranjo === "horizontal" ? <g transform="translate(-272 103) scale(1.2)">{simbolo}</g> : simbolo}
      {arranjo !== "simbolo" && (
        <>
          <use href={`${LETREIRO_SVG}#nome`} />
          <use href={`${LETREIRO_SVG}#informatica`} />
        </>
      )}
    </svg>
  );
}
