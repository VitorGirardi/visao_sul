import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Worktrees de agentes: cópias inteiras deste repo, `.next` incluído.
    ".claude/worktrees/**",
    // Material bruto do levantamento (fora do git).
    "referencias/**",
  ]),
  /*
   * SEM TRAVESSÃO EM TEXTO QUE A PESSOA LÊ (regra dos sites da Amage, pedido
   * do Vitor em 15/09/2026: dá cara de texto gerado por IA). Pega string,
   * texto de JSX e template. Comentário fica de fora, porque ninguém o lê.
   */
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/—/]",
          message: "Sem travessão (—) em texto: use vírgula, ponto, dois-pontos, parênteses ou duas frases.",
        },
        {
          selector: "JSXText[value=/—/]",
          message: "Sem travessão (—) em texto: use vírgula, ponto, dois-pontos, parênteses ou duas frases.",
        },
        {
          selector: "TemplateElement[value.raw=/—/]",
          message: "Sem travessão (—) em texto: use vírgula, ponto, dois-pontos, parênteses ou duas frases.",
        },
      ],
    },
  },
]);

export default eslintConfig;
