<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Visão Sul Informática

Protótipo do site da Visão Sul Informática ([@visaosulinformatica](https://www.instagram.com/visaosulinformatica/)),
loja de informática de Tapejara/RS do Marciano Prando Teixeira, que vende
online desde 2021 e abriu loja física em outubro de 2026. É a **proposta** que
o Vitor (Amage) vai apresentar: vitrine com pedido pelo WhatsApp, assistência
técnica, empresas e montador de PC, com 3D e animação de rolagem no nível do
protótipo que virou a Prime Collection. Pagamento online e painel são a fase 2.

## Mapa da codebase, fotografia de 09/10/2026

É ÍNDICE, não decisão: o porquê de cada regra está em `docs/decisoes/`. Se o
mapa deixar de bater com a árvore, corrija aqui, no lugar.

### Pilha

| camada | o quê |
| --- | --- |
| front | Next.js 16.3.8 (App Router, Turbopack, React Compiler), React 19.2, Tailwind v4 CSS-first (`@theme` no `globals.css`) |
| 3D e movimento | three 0.186 + @react-three/fiber 9 + drei 10 (só por `next/dynamic`), materiais matcap. Rolagem nativa e sem biblioteca de animação: o Lenis saiu em 09/10 e o GSAP em 12/10 (as cenas presas são `position: sticky`) |
| backend | ainda não existe. Entra Convex sobre Synapse com o painel (fase 2) |
| fontes | Sora (títulos), Manrope (texto), Geist Mono (rótulos e Raio-X), pelo `next/font/google` |
| hospedagem | Vercel (repositório `VitorGirardi/visao_sul`, público) |

### Raiz do repositório

- `AGENTS.md` (este), `PRINCIPIOS.md` (a essência da marca), `PENDENCIAS.md`
  (fila viva), `README.md` (rodar, portões, deploy). `CLAUDE.md` só importa os
  dois primeiros.
- `docs/decisoes/site-publico.md`: as decisões, com data e motivo.
  `docs/decisoes/desempenho.md`: as medições e o porquê de cada regra de
  desempenho.
- `referencias/` (FORA do git): o levantamento bruto. Instagram (legendas,
  posts), a foto da loja, a lâmina da logo, as fotos originais dos produtos
  com `fontes.json` (de onde veio cada uma) e `levantamento.md`.
- `scripts/preparar-imagens.mjs`: trata fotos de produto (tira o fundo
  branco, centraliza), recorta a foto da loja e os posts, e reescreve
  `src/data/fotos-de-produto.ts`. `scripts/marca/`: a vetorização da logo
  (`logo-final.mjs`, `letreiro-curvas.mjs`) e `gerar-icones.mjs` (favicon,
  apple-icon, imagem de compartilhamento).
- `.claude/launch.json`: `visao-sul` (`npm run dev`, porta 3010) e
  `visao-sul-producao` (`next start -p 3110`). A 3000 é do amagejumpy.

### Rotas (`src/app`)

| rota | arquivo | o que é |
| --- | --- | --- |
| `/` | `(site)/page.tsx` | abertura 3D, a loja, marcas, categorias, Raio-X, vitrine, diferenciais, assistência, PC, empresas, Instagram, contato |
| `/produtos` | `(site)/produtos/page.tsx` + `ui/catalogo.tsx` | vitrine com filtro na URL (`categoria`, `busca`, `ordem`) |
| `/produtos/[slug]` | `(site)/produtos/[slug]/page.tsx` | ficha, Raio-X por botão, teste grátis, estática (`generateStaticParams`) |
| `/assistencia` | `(site)/assistencia/page.tsx` | serviços, como funciona, chamado, perguntas |
| `/empresas` | `(site)/empresas/page.tsx` | locação de impressoras, redes, suporte, equipamentos, proposta |
| `/monte-seu-pc` | `(site)/monte-seu-pc/page.tsx` + `ui/montador-de-pc.tsx` | jogos → nível → cor → orçamento, com gabinete 3D |
| `/whatsapp` | `whatsapp/route.ts` | monta a mensagem (`lib/conversa.ts`) e responde 303 para o `wa.me`. **Toda conversa passa por aqui** |
| metadados | `icon.svg`, `apple-icon.png`, `opengraph-image.jpg`, `robots.ts`, `sitemap.ts`, `not-found.tsx` | |

### Pastas de apoio (`src/`)

- `components/layout/`: `cabecalho` (sem biblioteca de animação), `nav-principal`,
  `menu-movel` (Popover API), `alternar-tema`, `botao-pedido`,
  `gaveta-do-pedido` (`<dialog>`), `botao-whatsapp`, `marca` (olho inline,
  letreiro por `<use>` de `public/marca/letreiro.svg`), `rodape`.
- `components/sections/`: seções da página inicial. As de 3D vêm em trio:
  `abertura` (servidor) + `cena-do-olho` (carrega o 3D) + `controle-da-abertura`
  (lê a rolagem pelo percurso); idem `raio-x` + `cena-do-notebook` +
  `controle-do-raio-x`.
- `components/tres/`: as cenas 3D, sempre `export default` para o
  `next/dynamic`: `olho-3d` (a logo extrudada, em three puro, sem R3F),
  `notebook-3d` (o Raio-X), `gabinete-3d` (o montador), `matcap.ts` (as
  texturas de luz pintadas em canvas que todas usam no lugar de luz e
  ambiente) e `ritmo.tsx` (o limite de 60 quadros por segundo das cenas R3F).
- `components/ui/`: `cartao-produto` (com o Raio-X no hover), `foto-do-produto`,
  `preco` (sempre com o selo "ilustrativo"), `botao-adicionar`, `inclinacao`,
  `trilho-horizontal`, `catalogo`, `vitrine-do-produto`, `agendar-teste`,
  `abrir-chamado`, `pedir-proposta`, `montador-de-pc`, `gabinete-ilustrado`
  (o PC em CSS), `icones`.
- `data/`: todo texto e constante. `marca.ts` (os caminhos da logo), `site.ts`,
  `contato.ts`, `loja.ts`, `produtos.ts`, `categorias.ts`, `servicos.ts`,
  `empresas.ts`, `diferenciais.ts`, `pc-gamer.ts`, `raio-x.ts` e
  `fotos-de-produto.ts` (GERADO pelo script).
- `lib/`: `tema.ts` (+ `tema-script.ts`), `pedido.ts` (a sacola),
  `conversa.ts`, `abertura.ts` e `raio-x.ts` (o estado que o controle da
  rolagem escreve e o 3D lê), `rolagem-presa.ts` (o progresso de uma seção
  sticky), `sessenta-quadros.ts` (o relógio de no máximo 60 quadros por
  segundo), `voar-para-o-pedido.ts`, `utils.ts`.
- `fotos/`: imagens por import estático (produtos, loja, instagram).

### Padrões do frontend

- **Dois temas** pelo `data-tema` do `<html>` (`escuro` padrão, `claro`). Os
  componentes só usam as variáveis semânticas (`--fundo`, `--texto`,
  `--destaque`...). O script do `<head>` aplica o tema antes da pintura; o
  botão troca com View Transition em círculo. O 3D lê o tema por `useTema()`.
- **CSS em camadas**: classes próprias em `@layer components`, para os
  utilitários do Tailwind (`hidden`, `lg:...`) vencerem. Classe que precisa de
  variante (`max-sm:btn-pequeno`) é `@utility`.
- **3D** só por `next/dynamic` de componente, com a imagem/SVG no lugar até o
  primeiro quadro, e parando de desenhar fora da tela. Lógica de cada quadro
  em função comum do módulo (o lint do React Compiler barra mutação de valor
  de hook).
- **Rolagem presa** (abertura, Raio-X e vitrine): a seção é
  `position: sticky` dentro de um percurso mais alto (`.abertura-percurso`,
  `.raio-x-percurso`, o percurso do `trilho-horizontal`), e
  `lib/rolagem-presa.ts` lê quanto já foi rolado. O progresso, alisado e a
  no máximo 60 por segundo, vai para o 3D por objeto mutável e para o CSS
  por `--p`. Sem 3D ou com "menos movimento", o percurso perde a altura
  extra e nada fica preso.
- **Entrada na rolagem** em CSS (`.revelar`, `.revelar-escala`, com
  `animation-timeline: view()` sob `@supports`). Nada começa escondido fora do
  `@supports`.
- **Conversa**: link de atendimento é `<a href={linkDaConversa(...)}>` ou
  formulário GET para `/whatsapp`, nunca `next/link` e nunca `wa.me` direto.
- **Texto** do site em `src/data/`. Travessão é erro de lint em `src/`.
- **Comentário** explica o PORQUÊ, em português, com data quando é decisão.

## Regras que não podem voltar

- Preço é de EXEMPLO e sempre aparece com "ilustrativo" (`Preco`) ou com o
  `AVISO_DE_PRECO`. Não publicar como preço da loja.
- Endereço, horário, história e números da loja só entram quando o Marciano
  confirmar (`data/loja.ts` mostra "em breve"). Nada inventado no ar.
- Nenhum link aponta para `wa.me`: tudo passa por `/whatsapp`, que confere
  produto, serviço, nível e cor nas listas de `data/` (o nome nunca vem do
  navegador).
- O 3D nunca entra por import direto numa página: `next/dynamic` de
  componente, com fallback. `three` direto devolve ~150 KB a quem nem vê a cena.
- Nada de biblioteca de animação no cabeçalho.
- DESEMPENHO (medido na Intel UHD do Vitor, 09 a 12/10/2026; detalhes em
  `docs/decisoes/desempenho.md`):
  - 3D só com material matcap ou básico, sem luz, sem `<Environment>` e sem
    material físico;
  - sem tone mapping (`<Canvas flat>`);
  - shaders compilados com `compileAsync` antes do primeiro quadro;
  - `dpr` no máximo 1,5;
  - no máximo 60 quadros por segundo (`lib/sessenta-quadros.ts`).

  CSS e rolagem:
  - nada de biblioteca de rolagem ou de animação (Lenis e GSAP saíram);
  - nada de `backdrop-filter`, `mix-blend-mode` ou `filter: drop-shadow` em
    elemento grande ou repetido;
  - animação de rolagem só em `opacity`, `translate`, `scale`;
  - nada escrito no CSS a cada quadro se o valor não mudou.
- Seção presa é `position: sticky`, nunca `pin` de biblioteca. O `pin` do
  GSAP embrulhava a seção num `.pin-spacer`, refazia o layout da página na
  entrada e na saída e quebrava o React ao trocar de página ("removeChild").
- A foto do Marciano, da atleta patrocinada ou de cliente só entra com
  autorização. O post da atleta (uma criança) ficou de fora de propósito.
- O site está fora do Google (`robots` + `noindex`) enquanto for protótipo.
- `form-action` da CSP leva `wa.me` e `api.whatsapp.com`.
- `npm run build` nunca na pasta com o `next dev` no ar.

## Travas de versão

Abaixo do `latest` de propósito, as mesmas dos outros sites da Amage.

| pacote | travado em | por quê |
| --- | --- | --- |
| `typescript` | 5.x | `typescript-eslint` não suporta o TS 7 |
| `eslint` | 9.x | o ESLint 10 quebra o `eslint-plugin-react` |
| `next` | 16.3.x | a linha validada no prime-collection |

## Fluxo

`npm run dev` (porta 3010), portões (`npm run typecheck`, `npm run lint`,
`npm run build`) e, depois da proposta aprovada, trabalho por PR em branch
curta em português. O merge na `main` publica na Vercel.
