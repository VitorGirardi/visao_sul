# Visão Sul Informática · protótipo do site

Proposta de site para a Visão Sul Informática (Tapejara/RS): vitrine com
pedido pelo WhatsApp, Raio-X dos produtos, assistência técnica, soluções para
empresas e montador de PC gamer, com 3D e animação de rolagem.

- **Front**: Next.js 16 (App Router, React Compiler, Turbopack), Tailwind v4,
  three/R3F/drei, em `src/`. Rolagem nativa (sem Lenis nem GSAP).
- **Backend**: ainda não existe; entra Convex sobre Synapse com o painel.
- **Regras do projeto**: `AGENTS.md`, `PRINCIPIOS.md`, `PENDENCIAS.md` e
  `docs/decisoes/`.

## Rodar

```bash
npm ci
npm run dev          # http://localhost:3010
```

## Portões antes de subir

```bash
npm run typecheck
npm run lint
npm run build        # nunca na pasta em que o `next dev` está no ar
```

## Imagens

O material bruto fica em `referencias/` (fora do git). Para refazer as fotos
do site a partir dele:

```bash
npm run imagens                     # produtos (com o segundo ângulo), loja e posts
node scripts/marca/gerar-icones.mjs # favicon e imagem de compartilhamento
```

## Deploy

Toda mudança entra por PR: branch curta em português, portões limpos e merge
squash na `main`. A `main` publica na Vercel. Com domínio próprio, defina
`NEXT_PUBLIC_URL_DO_SITE`; sem ela, as URLs absolutas saem do domínio da
Vercel.
